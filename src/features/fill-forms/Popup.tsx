import React, { useState, useEffect } from 'react';
import AddInfoForm from './components/Forms/AddInfoForm';
import InfoCard from './components/InfoCard/InfoCard';
import type { MyQuickInfo } from './types';
import { getData, saveData } from '../../lib/actionFunctions';
import Toast from '../../components/Toasts/Toast';
import { useToast } from './hooks/useToast';

const Popup: React.FC = () => {
    const { toast, showToast, hideToast } = useToast();


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

    const handleMagicFill = async (myQuickInfo: MyQuickInfo[]) => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab?.id) {
            chrome.tabs.sendMessage(tab.id, {
                action: "autoFillForm",
                data: myQuickInfo
            }, (response) => {
                console.log("🚀 ~ handleMagicFill ~ response:", response)
                if (response?.status === "success") {

                    showToast('Data filled successfully', 'success');
                } else {
                    showToast('Failed to fill data', 'error');
                }
            });
        }
    };

    return (
        <div className="max-w-[600px] h-full overflow-y-auto rounded-xl p-3 border border-brand-border">
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
                className="bg-purple-600 my-5 w-full justify-center hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg"
            >
                ✨ Magic Auto-fill
            </button>

            <div className='max-h-[300px] overflow-y-auto p-2 pb-4'>

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