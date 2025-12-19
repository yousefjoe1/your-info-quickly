import { useEffect, useRef, useState } from 'react'
import { useToast } from '../../hooks/useToast';
import type { MyQuickInfo } from '../../types';
import { saveData } from '../../lib/actionFunctions';
import Toast from '../Toasts/Toast';


const AddInfoForm = ({ myQuickInfo, setMyQuickInfo }: { myQuickInfo: MyQuickInfo[], setMyQuickInfo: React.Dispatch<React.SetStateAction<MyQuickInfo[]>> }) => {
    const { toast, showToast, hideToast } = useToast();

    const fieldRef = useRef<HTMLInputElement>(null)

    const [type, setType] = useState<string>('text');
    const [value, setValue] = useState<string>('');
    const [fieldName, setFieldName] = useState('')

    const handleValueChange = (e: string) => {
        setValue(e);
    };


    const handleAddField = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (value == '' || fieldName == '') {
            showToast('Please fill all fields', 'error');
            return;
        }
        const newInfo = [...myQuickInfo, { field: fieldName, title: value, type: type }];
        setMyQuickInfo(newInfo);
        setFieldName('');
        setValue('');
        setType('text');
        const res = await saveData(newInfo);
        if (res) {
            fieldRef.current?.focus()
            showToast('Data saved successfully', 'success');
        }
    };

    useEffect(() => {
        fieldRef.current?.focus()
    }, [])


    return (
        <form className='w-full p-2 bg-brand-bg rounded-2xl shadow-sm transition-colors duration-300' onSubmit={handleAddField}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}
            <div className="flex gap-1 flex-wrap">

                {/* Field Name */}
                <div className='flex flex-col gap-2 w-full'>
                    <label className="text-base font-bold text-brand-label capitalize tracking-wider">
                        Field Name
                    </label>
                    <input
                        ref={fieldRef}
                        placeholder='e.g. Full Name'
                        type="text"
                        value={fieldName}
                        onChange={(e) => setFieldName(e.target.value)}
                        className='bg-brand-input text-brand-text placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-xl border border-brand-border p-1 px-2 text-lg transition-all'
                    />
                </div>

                {/* Value Area */}
                <div className='w-full'>
                    <div className='flex flex-col gap-2 w-full'>
                        <label htmlFor="value" className="text-base font-bold text-brand-label capitalize tracking-wider">
                            Value
                        </label>
                        {type === 'textarea' ? (
                            <textarea
                                id="value"
                                onChange={(e) => handleValueChange(e.target.value)}
                                className='bg-brand-input text-brand-text focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-xl border border-brand-border p-1 px-2 text-lg min-h-[120px] transition-all'
                            ></textarea>
                        ) : (
                            <input
                                id="value"
                                type={type}
                                value={value}
                                onChange={(e) => handleValueChange(e.target.value)}
                                className='bg-brand-input text-brand-text focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-xl border border-brand-border p-1 px-2 text-lg transition-all'
                            />
                        )}
                    </div>
                </div>

                {/* Type & Action */}
                <div className='flex items-end flex-wrap gap-4 w-full'>
                    <div className='flex flex-col gap-2 grow'>
                        <label htmlFor="type" className="text-base font-bold text-brand-label capitalize tracking-wider">
                            Field Type
                        </label>
                        <select
                            id="type"
                            className='bg-brand-input text-brand-text focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-xl border border-brand-border p-3 text-lg cursor-pointer appearance-none transition-all'
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="number">Number</option>
                            <option value="textarea">Textarea</option>
                        </select>
                    </div>

                    <button type='submit' className='save-button h-[54px] px-8 text-lg'>
                        Save Info
                    </button>
                </div>
            </div>
        </form>
    )
}

export default AddInfoForm