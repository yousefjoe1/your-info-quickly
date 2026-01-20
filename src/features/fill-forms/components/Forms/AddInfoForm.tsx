import { useEffect, useRef, useState } from 'react'
import TagsComponent from '../Tags/Tags';
import type { MyQuickInfo, Tags } from '../../types';
import { saveData } from '../../../../lib/actionFunctions';
import Toast from '../../../../components/Toasts/Toast';
import { useToast } from '../../hooks/useToast';


const AddInfoForm = ({ myQuickInfo, setMyQuickInfo }: { myQuickInfo: MyQuickInfo[], setMyQuickInfo: React.Dispatch<React.SetStateAction<MyQuickInfo[]>> }) => {
    const { toast, showToast, hideToast } = useToast();

    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

    const fieldRef = useRef<HTMLInputElement>(null)

    const [type, setType] = useState<string>('text');
    const [value, setValue] = useState<string>('');
    const [fieldName, setFieldName] = useState('')
    const [tags, setTags] = useState<Tags[]>([])

    const [tagName, setTagName] = useState('')

    const handleValueChange = (e: string) => {
        setValue(e);
    };


    const handleAddField = async () => {
        if (value == '' || fieldName == '') {
            showToast('Please fill all fields', 'error');
            return;
        }
        const newInfo = [...myQuickInfo, { field: fieldName, title: value, type: type, tags: tags, id: Date.now() + Math.random() }];
        setMyQuickInfo(newInfo);
        setFieldName('');
        setValue('');
        setType('text');
        const res = await saveData(newInfo);
        if (res) {
            fieldRef.current?.focus()
            showToast('Data saved successfully', 'success');
            setTags([]);
        }
    };

    useEffect(() => {
        fieldRef.current?.focus()
    }, [])

    // handleAddTag
    const handleAddTag = () => {
        if (tagName.trim() !== '') {
            const tagsArray = tags?.length ? tags : []
            setTags([...tagsArray, { tagName: tagName.trim(), id: Date.now() + Math.random() }]);
            setTagName('');
        }
    };


    const handleRemoveTag = (id: number | string | undefined) => {
        const newTags = tags.filter((tag) => tag.id !== id);
        setTags(newTags);
    };


    return (
        <>

            <button className='save-button p-1 mx-auto mb-5' onClick={() => setIsFormOpen(!isFormOpen)}>
                {isFormOpen ? 'Close Form' : 'Open Form'}
            </button>

            {
                isFormOpen &&

                <>
                    <form className='w-full bg-brand-bg mb-5 rounded-2xl shadow-sm transition-colors duration-300' onSubmit={handleAddField}>
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
                                    className='input-style'
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
                                            className='input-style'
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
                                        className='input-style'
                                        onChange={(e) => setType(e.target.value)}
                                    >
                                        <option value="text">Text</option>
                                        <option value="url">Url/Link</option>
                                        <option value="email">Email</option>
                                        <option value="number">Number</option>
                                        <option value="textarea">Textarea</option>
                                    </select>
                                </div>


                            </div>


                        </div>
                    </form>

                    <div className='flex flex-col gap-1 mt-2'>
                        <label className='text-base font-bold text-brand-label capitalize' htmlFor="tags">Add Tags</label>
                        <input
                            value={tagName}
                            id='tags'
                            className='input-style'
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                            type="text"
                            onChange={(e) => setTagName(e.target.value)} />

                        <div className='flex items-center gap-3 p-2'>
                            {tags.map((tag) => (
                                <TagsComponent tag={tag} handleRemoveTag={handleRemoveTag} />
                            ))}
                        </div>
                    </div>

                    <button onClick={handleAddField} className='save-button h-[30px] px-3 text-sm'>
                        Save Info
                    </button>


                </>
            }
        </>
    )
}

export default AddInfoForm