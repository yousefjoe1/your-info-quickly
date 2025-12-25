import type { Tags } from '../../types'

const TagsComponent = ({ tag, handleRemoveTag }: { tag: Tags, handleRemoveTag?: (id: number | string | undefined) => void }) => {
    return (
        <div className='flex items-center gap-3 p-1 shadow-sm border-brand-border border rounded-xl px-2'>
            <span className='text-brand-text'>{tag.tagName}</span>

            {
                handleRemoveTag &&

                <button type='button' onClick={() => handleRemoveTag?.(tag.id)} className='text-error rounded-full px-2 border border-error'>
                    x
                </button>
            }
        </div>
    )
}

export default TagsComponent