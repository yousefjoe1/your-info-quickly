import React, { useState, useEffect } from 'react';
import type { MyQuickInfo } from '../types';
import CopyButton from './Buttons/CopyButton';
import { BiTrash } from 'react-icons/bi';
import { useToast } from '../hooks/useToast';
import Toast from './Toasts/Toast';
import AddInfoForm from './Forms/AddInfoForm';
import { getData, saveData } from '../lib/actionFunctions';

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


    return (
        <div className="bg-brand-bg max-w-[600px] overflow-y-hidden rounded-xl p-3 border border-brand-border">
            <h3 className='text-center text-brand-text shadow-sm rounded-xl mb-4 font-semibold'>Have Your Info Quickly</h3>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}

            <AddInfoForm myQuickInfo={myQuickInfo} setMyQuickInfo={setMyQuickInfo} />

            <div className='max-h-[300px] overflow-y-auto p-2'>

                {
                    myQuickInfo.map((item, index) => (
                        <div key={index} className='mt-2'>
                            <label className='capitalize text-brand-label font-medium'>{item.field}</label>
                            <div className="flex items-center gap-2 bg-brand-input rounded-xl p-2 justify-between flex-wrap border border-brand-border">
                                <h2 className='whitespace-break-spaces text-brand-text'>
                                    {item.title}
                                </h2>

                                <div className='flex items-center gap-1'>
                                    <CopyButton textToCopy={item.title} />
                                    <button
                                        onClick={() => deleteData(index)}
                                        className='bg-red-500 hover:bg-red-600 rounded-xl border-2 border-red-500 p-1 transition-colors'
                                    >
                                        <BiTrash size={14} className='text-white' />
                                    </button>

                                </div>

                            </div>
                        </div>
                    ))
                }
            </div>


        </div>
    );
};

export default Popup;