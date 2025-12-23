import React, { useState, useEffect } from 'react';
import type { MyQuickInfo } from '../types';
import { useToast } from '../hooks/useToast';
import Toast from './Toasts/Toast';
import AddInfoForm from './Forms/AddInfoForm';
import { getData, saveData } from '../lib/actionFunctions';
import InfoCard from './InfoCard/InfoCard';

const Popup: React.FC = () => {
    const { toast, showToast, hideToast } = useToast();


    const [reload, setReload] = useState(false)

    const [myQuickInfo, setMyQuickInfo] = useState<MyQuickInfo[]>([]);

    const deleteData = async (index: number) => {
        const filterd = myQuickInfo.filter((_, idx) => idx != index)
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

    const editInfo = async (newInfo: MyQuickInfo, index: number) => {
        const updatedInfo = [...myQuickInfo]
        updatedInfo[index] = newInfo
        setMyQuickInfo(updatedInfo)
        const res = await saveData(updatedInfo)
        if (res) {
            showToast('Data updated successfully', 'success');
            setReload(!reload)
        }
    }

    const handleMagicFill = async (myQuickInfo: MyQuickInfo[]) => {
        // 1. جلب التاب المفتوحة حالياً
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab?.id) {
            // 2. إرسال البيانات (myQuickInfo) إلى الكونتنت سكريبت
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
        <div className="bg-brand-bg max-w-[600px] h-full overflow-y-auto rounded-xl p-3 border border-brand-border">
            <h3 className='text-center text-brand-text shadow-sm rounded-xl mb-4 font-semibold'>Have Your Info Quickly</h3>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}

            <AddInfoForm myQuickInfo={myQuickInfo} setMyQuickInfo={setMyQuickInfo} />

            <div className='max-h-[300px] overflow-y-auto p-2 pb-4'>

                {
                    myQuickInfo.map((item, index) => (
                        <InfoCard editInfo={editInfo} index={index} item={item} deleteData={deleteData} />
                    ))
                }
            </div>
            <button
                type="button" // مهم جداً لكي لا يعمل Submit للفورم
                onClick={() => handleMagicFill(myQuickInfo)}
                className="bg-purple-600 w-full justify-center hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg"
            >
                ✨ Magic Auto-fill
            </button>




        </div>
    );
};

export default Popup;