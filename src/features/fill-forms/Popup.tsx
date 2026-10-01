import React, { useState, useEffect } from 'react';
import AddInfoForm from './components/Forms/AddInfoForm';
import InfoCard from './components/InfoCard/InfoCard';
import type { MyQuickInfo } from './types';
import { getData, saveData } from '../../lib/actionFunctions';
import Toast from '../../components/Toasts/Toast';
import { useToast } from './hooks/useToast';
import { useView } from '../../contexts/ViewContext';
import { FaPaperPlane } from 'react-icons/fa6';

const Popup: React.FC = () => {
    const { toast, showToast, hideToast } = useToast();

    const { viewMode } = useView();
    const [reload, setReload] = useState(false)

    const [myQuickInfo, setMyQuickInfo] = useState<MyQuickInfo[]>([]);

    const deleteData = async (id: number | string | undefined) => {
        const filterd = myQuickInfo.filter((info) => info.id != id)
        setMyQuickInfo(filterd);
        const res = await saveData(filterd)
        if (res) {
            showToast('Data deleted successfully', 'success');
            setReload(!reload)
        }
    };

    const getMyInfo = async () => {
        const res = await getData();
        setMyQuickInfo(res)
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getMyInfo()
    }, [reload]);

    const editInfo = async (newInfo: MyQuickInfo) => {
        const updatedInfo = [...myQuickInfo]
        const index = updatedInfo.findIndex((info) => info.id === newInfo.id)
        updatedInfo[index] = newInfo
        setMyQuickInfo(updatedInfo)
        const res = await saveData(updatedInfo)
        if (res) {
            showToast('Data updated successfully', 'success');
            setReload(!reload)
        }
    }

    const sendAutoFill = (tabId: number, data: MyQuickInfo[]) =>
        new Promise<{ status?: string; results?: Array<{ field: string; filled: boolean; score: number }> }>((resolve, reject) => {
            chrome.tabs.sendMessage(tabId, { action: 'autoFillForm', data }, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                resolve(response || {});
            });
        });

    const handleMagicFill = async (data: MyQuickInfo[]) => {
        if (data.length === 0) {
            showToast('Add some info first', 'error');
            return;
        }

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) {
            showToast('No active tab found', 'error');
            return;
        }

        let response: Awaited<ReturnType<typeof sendAutoFill>>;
        try {
            response = await sendAutoFill(tab.id, data);
        } catch {
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content.js'],
                });
                await new Promise((resolve) => setTimeout(resolve, 80));
                response = await sendAutoFill(tab.id, data);
            } catch {
                showToast('Cannot access this page', 'error');
                return;
            }
        }

        const results = response.results ?? [];
        const filled = results.filter((item) => item.filled).length;
        const skipped = (results.length || data.length) - filled;

        if (filled > 0 && skipped === 0) {
            showToast(`Filled ${filled} field${filled === 1 ? '' : 's'}`, 'success');
        } else if (filled > 0) {
            showToast(`${filled} filled · ${skipped} need a manual pick`, 'info');
        } else {
            showToast('No matching fields — use the icon on an input', 'error');
        }
    };
    return (
        <div className={`${viewMode === 'popup' ? 'max-w-[600px]' : ''} h-full overflow-y-auto rounded-xl p-3 border border-brand-border`}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}




            <AddInfoForm myQuickInfo={myQuickInfo} setMyQuickInfo={setMyQuickInfo} />
            <button
                type="button"
                onClick={() => handleMagicFill(myQuickInfo)}
                className="my-5 flex w-full items-center gap-3 rounded-full bg-[#39b54a] py-1.5 pl-1.5 pr-6 text-left shadow-[0_4px_14px_rgba(57,181,74,0.45)] transition-all hover:bg-[#32a340] hover:shadow-[0_6px_18px_rgba(57,181,74,0.5)] active:scale-[0.99]"
            >
                <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white"
                    aria-hidden
                >
                    <FaPaperPlane className="text-[#39b54a]" size={18} />
                </span>
                <span className="text-sm font-bold uppercase tracking-wide text-white">
                    Magic Auto-fill
                </span>
            </button>

            <div className={`${viewMode === 'popup' ? 'max-h-[300px]' : 'grid grid-cols-2 gap-2'} overflow-y-auto p-2 pb-4`}>

                {
                    myQuickInfo.map((item) => (
                        <InfoCard editInfo={editInfo} key={item.id} item={item} deleteData={deleteData} />
                    ))
                }
            </div>





        </div>
    );
};

export default Popup;