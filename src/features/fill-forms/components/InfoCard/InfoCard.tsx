import { useState } from 'react'
import CopyButton from '../Buttons/CopyButton'
import type { MyQuickInfo, Tags } from '../../types'
import { BiEdit, BiTrash } from 'react-icons/bi'
import TagsComponent from '../Tags/Tags'
import { CgClose } from 'react-icons/cg'
import { FaHand } from 'react-icons/fa6'

const InfoCard = ({ item, deleteData, editInfo }: { item: MyQuickInfo, deleteData: (id: number | string | undefined) => void, editInfo: (updatedInfo: MyQuickInfo) => void }) => {
    const [editFieldName, setEditFieldName] = useState(item.field)

    const [openTags, setOpenTags] = useState(false)

    const [newTitle, setNewTitle] = useState(item.title)

    const [infoTags, setInfoTags] = useState<Tags[]>(item.tags || [])

    const [newTag, setNewTag] = useState('')

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)


    const handleCancel = () => {
    };

    const handleDelete = () => {
        deleteData(item?.id)
    };

    const saveChanges = async () => {
        const updatedInfo = { ...item, title: newTitle, tags: infoTags, field: editFieldName }
        editInfo(updatedInfo)
    }

    const handleAddTag = () => {
        if (newTag.trim() !== '') {
            const tags = infoTags?.length ? infoTags : []
            setInfoTags([...tags, { tagName: newTag.trim(), id: Date.now() + Math.random() }]);
            setNewTag('');
        }
    };


    const handleRemoveTags = (id: number | string | undefined) => {
        const updatedTags = infoTags.filter((tag) => tag.id !== id);
        setInfoTags(updatedTags);
    };

    return (
        <>
            <div className='mt-2'>

                <label className='capitalize text-brand-label font-medium'>{item.field}</label>

                <div className=" bg-brand-input rounded-xl p-2 border border-brand-border">
                    <div className='flex items-center justify-between flex-wrap gap-2'>
                        {
                            item.type == 'url' ?
                                <a href={item.title} target="_blank" rel="noopener noreferrer" className='text-brand-text'>
                                    {newTitle}
                                </a> :
                                <h3 className='text-brand-text'>
                                    {newTitle}
                                </h3>
                        }


                        <div className='flex items-center gap-2 shadow-sm  p-1 rounded-xl'>
                            <CopyButton textToCopy={item.title} />

                            <button
                                onClick={() => setIsEditOpen(true)}
                                className='bg-brand-input rounded-xl border p-1 transition-colors hover:border-blue-400 text-brand-text'
                            >
                                <BiEdit size={14} />
                            </button>

                            <button
                                onClick={() => setIsDeleteOpen(true)}
                                className='bg-red-500 hover:bg-red-600 rounded-xl border-2 border-red-500 p-1 transition-colors'
                            >
                                <BiTrash size={14} className='text-white' />
                            </button>

                        </div>

                    </div>

                    <button className='text-brand-text flex items-center gap-2' onClick={() => setOpenTags(!openTags)}>Tags: {openTags ? <CgClose /> : <FaHand />} </button>

                    {openTags && <div className='flex flex-wrap gap-2'>
                        {item.tags?.map((tag) => <TagsComponent key={tag.id} tag={tag} />)}
                    </div>}


                </div>
            </div>

            {
                isEditOpen &&

                <div
                    // ref={editRefDialog}
                    className='bg-brand-bg w-[90%] flex-col gap-3 text-brand-text rounded-xl p-6 border border-brand-border backdrop:bg-black/30 backdrop:blur-sm absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'
                >
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" className='input-style' value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />

                    </div>

                    <div className='flex flex-col gap-1'>
                        <label htmlFor="field">Field</label>
                        <input type="text" id="field" className='input-style' value={editFieldName} onChange={(e) => setEditFieldName(e.target.value)} />
                    </div>


                    {/* tags */}
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="tag">Tag</label>
                        <input type="text"
                            id="tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                            className='input-style'
                        />
                        <div className="flex flex-wrap items-center gap-2">

                            {infoTags.length > 0 ?
                                infoTags?.map((tag) =>
                                    <TagsComponent key={tag.id} tag={tag} handleRemoveTag={handleRemoveTags} />
                                )
                                :
                                <p>No tags added</p>
                            }
                        </div>
                    </div>



                    <div className='flex gap-3 justify-end'>
                        <button
                            onClick={() => setIsEditOpen(false)}
                            className='px-4 py-2 bg-brand-input border border-brand-border text-brand-text rounded-lg hover:bg-opacity-80 transition-colors'
                        >
                            Cancel
                        </button>
                        <button onClick={() => saveChanges()} className='px-4 py-2 bg-brand-input border border-brand-border text-brand-text rounded-lg hover:bg-opacity-80 transition-colors'>
                            Save Changes
                        </button>
                    </div>
                </div>
            }



            {
                isDeleteOpen &&
                <div
                    // onClick={handleCancel}
                    // ref={dialogRef}
                    className='bg-brand-bg text-brand-text rounded-xl p-6 border border-brand-border backdrop:bg-black/30 backdrop:blur-sm absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'
                >
                    <h3 className='text-lg font-semibold mb-3'>Confirm Delete</h3>
                    <p className='text-brand-label mb-6'>Are you sure you want to delete this item?</p>

                    <div className='flex gap-3 justify-end'>
                        <button
                            onClick={handleCancel}
                            className='px-4 py-2 bg-brand-input border border-brand-border text-brand-text rounded-lg hover:bg-opacity-80 transition-colors'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
                        >
                            Delete
                        </button>
                    </div>
                </div>

            }




        </>
    )
}

export default InfoCard