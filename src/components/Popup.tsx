import React, { useState, useEffect } from 'react';
import type { MyQuickInfo } from '../types';
import CopyButton from './Buttons/CopyButton';
import { BiTrash } from 'react-icons/bi';
;
import { useToast } from '../hooks/useToast';
import Toast from './Toasts/Toast';

const Popup: React.FC = () => {
    const { toast, showToast, hideToast } = useToast();

    const [type, setType] = useState<string>('text');
    const [value, setValue] = useState<string>('');
    const [fieldName, setFieldName] = useState('')

    const [myQuickInfo, setMyQuickInfo] = useState<MyQuickInfo[]>([]);
    const [reload, setReload] = useState(false);

    const saveData = (newData: unknown[]) => {
        if (!chrome?.storage) return;


        chrome.runtime.sendMessage(
            { action: 'saveData', data: newData },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    localStorage.setItem('info', JSON.stringify(newData));
                    return;
                }

                if (response?.success) {
                    console.log('Data saved successfully');
                    showToast('Data saved successfully', 'success');
                }
            }
        );
    };

    const getData = () => {
        if (!chrome?.storage) return;
        chrome.runtime.sendMessage(
            { action: 'getData' },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    setMyQuickInfo([]);
                    return;
                }

                if (response?.success) {
                    setMyQuickInfo(response.data || []);
                } else {
                    setMyQuickInfo([]);
                }
            }
        );
    };

    // delete info
    const deleteData = (index: number) => {
        const newInfo = [...myQuickInfo];
        newInfo.splice(index, 1);
        setMyQuickInfo(newInfo);
        saveData(newInfo);
        setTimeout(() => {
            setReload(!reload);
        }, 1000);
    };

    useEffect(() => {
        getData();
    }, [reload]);


    const handleValueChange = (e: string) => {
        setValue(e);
    };


    const handleAddField = () => {

        if (value == '' || fieldName == '') {
            showToast('Please fill all fields', 'error');
            return;
        }
        const newInfo = [...myQuickInfo, { field: fieldName, title: value, type: type }];
        setMyQuickInfo(newInfo);
        setFieldName('');
        setValue('');
        setType('text');
        saveData(newInfo);
        setTimeout(() => {
            setReload(!reload);
        }, 1000);
    };


    return (
        <div className="bg-gray-200 w-[600px] max-h-[400px] overflow-y-auto rounded-xl p-3">
            <h3 className='text-center shadow-sm rounded-xl mb-4'>Have Your Info Quickly</h3>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}

            <div className='w-full'>

                <div className="flex gap-2">
                    <div className='flex flex-col gap-1 w-full'>

                        <label>Field Name</label>

                        <input placeholder='My Name' type="text" value={fieldName} onChange={(e) => setFieldName(e.target.value)} className='bg-gray-400 focus:outline-blue-50 rounded-xl border-2 border-gray-400 p-2' />
                    </div>

                    <div className='flex items-end gap-2'>

                        <div className='flex flex-col gap-1'>

                            <label htmlFor="type">Type</label>
                            <select id="type" className='bg-gray-400 text-white focus:outline-blue-50 rounded-xl border-2 border-gray-400 p-2' onChange={(e) => setType(e.target.value)}>
                                <option value="text">text</option>
                                {/* <option value="password">password</option> */}
                                <option value="email">email</option>
                                <option value="number">number</option>
                                <option value="textarea">textarea</option>
                            </select>
                        </div>
                        <button onClick={handleAddField} className='save-button'>Save</button>
                    </div>
                </div>
                <div className="flex justify-between gap-1 w-full mt-1">

                    <div className='w-full'>
                        {
                            type == 'textarea' ?
                                <div className='flex flex-col gap-1 w-full'>
                                    <label htmlFor="value">Value</label>
                                    <textarea id="value" onChange={(e) => handleValueChange(e.target.value)} className='bg-gray-400 focus:outline-blue-50 rounded-xl border-2 border-gray-400 p-2'></textarea>
                                </div>
                                :

                                <div className="flex flex-col gap-1">
                                    <label htmlFor="value">Value</label>
                                    <input id="value" className='bg-gray-400 focus:outline-blue-50 rounded-xl border-2 border-gray-400 p-2'
                                        type={type} onChange={(e) => handleValueChange(e.target.value)} value={value} />
                                </div>
                        }

                    </div>

                </div>
            </div>
            {
                myQuickInfo.map((item, index) => (
                    <div key={index} className='mt-2'>
                        <label className='capitalize'>{item.field}</label>
                        <div className="flex items-center bg-gray-100 rounded-xl p-2 justify-between">
                            <h2>
                                {item.title}
                            </h2>

                            <div className='flex items-center gap-1'>
                                <CopyButton textToCopy={item.title} />
                                <button onClick={() => deleteData(index)} className='bg-red-400 rounded-xl border-2 border-red-400 p-1'>
                                    <BiTrash size={14} className='text-white' />
                                </button>

                            </div>

                        </div>
                    </div>
                ))
            }


        </div>
    );
};

export default Popup;