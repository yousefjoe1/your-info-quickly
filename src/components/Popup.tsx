import React, { useState, useEffect } from 'react';
import type { MyQuickInfo } from '../types';
import CopyButton from './Buttons/CopyButton';
;

const Popup: React.FC = () => {

    const [myQuickInfo, setMyQuickInfo] = useState<MyQuickInfo[]>([]);

    // const [runtimeError, setRuntimeError] = useState<string>('');

    // const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
    }, []);

    // const handleToggle = (newDirection: 'ltr' | 'rtl'): void => {
    //     if (!currentTab?.id || !currentTab.url) return;

    //     setCurrentDirection(newDirection);
    //     setRuntimeError(''); // Clear any previous errors

    //     const hostname = new URL(currentTab.url).hostname;

    //     chrome.storage.local.set({ [hostname]: newDirection }, () => {
    //         if (chrome.runtime.lastError) {
    //             console.error('Error saving to storage:', chrome.runtime.lastError);
    //             setRuntimeError(`Failed to save: ${chrome.runtime.lastError.message}`);
    //             return;
    //         }

    //         chrome.tabs.sendMessage(currentTab.id!, {
    //             action: 'setDirection',
    //             direction: newDirection
    //         }, () => {
    //             if (chrome.runtime.lastError) {
    //                 console.error('Error sending message:', chrome.runtime.lastError);
    //                 setRuntimeError(`Failed to apply direction: ${chrome.runtime.lastError.message}`);
    //             }
    //         });
    //     });
    // };
    // if (isLoading) {
    //     return (
    //         <div className="">
    //             <div className="loading">Loading...</div>
    //         </div>
    //     );
    // }

    // if (initError) {
    //     return (
    //         <div className="popup-container">
    //             <div className="error-message">
    //                 <h3>Error</h3>
    //                 <p>{initError}</p>
    //                 <p style={{ fontSize: '12px', marginTop: '10px' }}>
    //                     Make sure you're testing this in a Chrome extension environment.
    //                 </p>
    //             </div>
    //         </div>
    //     );
    // }

    const [type, setType] = useState<string>('text');
    const [value, setValue] = useState<string>('');
    const [fieldName, setFieldName] = useState('')
    const handleValueChange = (e: string) => {
        setValue(e);
    };


    const handleAddField = () => {
        setMyQuickInfo([...myQuickInfo, { field: fieldName, title: value, type: type }]);
        setFieldName('');
        setValue('');
        setType('text');
    };


    return (
        <div className="bg-gray-200 max-w-[600px] max-h-[400px] overflow-y-auto rounded-xl p-3">
            <h3 className='text-center shadow-sm rounded-xl mb-4'>Have Your Info Quickley</h3>

            {/* {runtimeError && (
                <div className="error-message" style={{ marginBottom: '10px' }}>
                    <p style={{ color: 'red', fontSize: '12px' }}>{runtimeError}</p>
                </div>
            )} */}

            <div >
                <label>Field Name</label>
                <div className="flex items-start gap-3">
                    {
                        type == 'textarea' ?
                            <textarea className='bg-gray-400 focus:outline-blue-50 rounded-xl border-2 border-gray-400 p-2'></textarea> :
                            <>
                                <input type="text" value={fieldName} onChange={(e) => setFieldName(e.target.value)} className='bg-gray-400 focus:outline-blue-50 rounded-xl border-2 border-gray-400 p-2' />
                                <input className='bg-gray-400 focus:outline-blue-50 rounded-xl border-2 border-gray-400 p-2'
                                    type={type} onChange={(e) => handleValueChange(e.target.value)} value={value} />
                            </>
                    }
                    <select className='bg-gray-400 text-white focus:outline-blue-50 rounded-xl border-2 border-gray-400 p-2' onChange={(e) => setType(e.target.value)}>
                        <option value="text">text</option>
                        {/* <option value="password">password</option> */}
                        <option value="email">email</option>
                        <option value="number">number</option>
                        <option value="textarea">textarea</option>
                    </select>
                    <button onClick={handleAddField} className='bg-green-400 rounded-xl border-2 border-green-400 p-2'>Save</button>
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

                            <CopyButton textToCopy={item.title} />
                        </div>
                    </div>
                ))
            }


        </div>
    );
};

export default Popup;