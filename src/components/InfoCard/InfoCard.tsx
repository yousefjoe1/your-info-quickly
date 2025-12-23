import { useRef, useState } from 'react'
import CopyButton from '../Buttons/CopyButton'
import type { MyQuickInfo } from '../../types'
import { BiEdit, BiTrash } from 'react-icons/bi'

const InfoCard = ({ item, deleteData, index, editInfo }: { item: MyQuickInfo, deleteData: (index: number) => void, index: number, editInfo: (updatedInfo: MyQuickInfo, index: number) => void }) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const inputValueRef = useRef<HTMLInputElement>(null);
    const [editMode, setEditMode] = useState(false);

    const [editFieldOpen, setEditFieldOpen] = useState(false)
    const [editField, setEditField] = useState(item.field)


    const [newTitle, setNewTitle] = useState(item.title)

    const handleCancel = () => {
        dialogRef.current?.close();
    };

    const handleDelete = () => {
        deleteData(index)
        dialogRef.current?.close();
    };


    const openEdit = () => {
        setEditMode(true)
        setTimeout(() => {
            inputValueRef.current?.focus()
        }, 100);
    }

    const saveChanges = async () => {
        const updatedInfo = { ...item, title: newTitle }
        editInfo(updatedInfo, index)
        setEditMode(false)
    }

    return (
        <>
            <div key={index} className='mt-2'>
                <div className="flex gap-2">

                    {
                        editFieldOpen ?
                            <>
                                <input ref={inputValueRef} value={editField} onChange={(e) => setEditField(e.target.value)} className='text-brand-text focus:border-white focus:outline-none shadow-sm shadow-white border-gray-500 shadow-gray-20 p-2 rounded-xl' />

                                <button className='px-4 py-2 bg-brand-input border border-brand-border text-brand-text rounded-lg hover:bg-brand-border transition-colors' onClick={() => setEditFieldOpen(false)}>Save</button>
                            </>
                            :
                            <>
                                <label className='capitalize text-brand-label font-medium'>{item.field}</label>
                                {/* <button
                                    onClick={() => setEditFieldOpen(true)}
                                    className='bg-brand-input rounded-xl transition-colors hover:border-blue-400 text-brand-text'
                                >
                                    <BiEdit size={15} />
                                </button> */}
                            </>
                    }
                </div>
                <div className="flex items-center gap-2 bg-brand-input rounded-xl p-2 justify-between flex-wrap border border-brand-border">
                    {
                        editMode ?
                            <input ref={inputValueRef} disabled={!editMode} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className='text-brand-text focus:border-white focus:outline-none disabled:shadow-none shadow-sm shadow-white border-gray-500 shadow-gray-20 p-1 rounded-xl' />
                            :
                            <>
                                {
                                    item.type == 'url' ?
                                        <a href={item.title} target="_blank" rel="noopener noreferrer" className='text-brand-text'>
                                            {newTitle}
                                        </a> :
                                        <h3 className='text-brand-text'>
                                            {newTitle}
                                        </h3>
                                }
                            </>
                    }
                    {
                        editMode ?
                            <button onClick={() => saveChanges()} className='bg-brand-input rounded-xl border-2 p-1 transition-colors text-brand-text'>
                                Save Changes
                            </button> :

                            <div className='flex items-center gap-2 shadow-sm  p-1 rounded-xl'>
                                <CopyButton textToCopy={item.title} />

                                <button
                                    onClick={() => openEdit()}
                                    className='bg-brand-input rounded-xl border p-1 transition-colors hover:border-blue-400 text-brand-text'
                                >
                                    <BiEdit size={14} />
                                </button>

                                <button
                                    onClick={() => dialogRef.current?.showModal()}
                                    className='bg-red-500 hover:bg-red-600 rounded-xl border-2 border-red-500 p-1 transition-colors'
                                >
                                    <BiTrash size={14} className='text-white' />
                                </button>

                            </div>
                    }

                </div>
            </div>


            <dialog
                onClick={handleCancel}
                ref={dialogRef}
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
            </dialog>


        </>
    )
}

export default InfoCard