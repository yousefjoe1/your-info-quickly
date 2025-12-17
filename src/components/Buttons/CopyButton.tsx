import { useState } from 'react';
import { BiCheck } from 'react-icons/bi';
import { MdContentCopy } from 'react-icons/md';

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            disabled={copied}
        >
            {copied ? (
                <>
                    <BiCheck size={18} />
                </>
            ) : (
                <>
                    <MdContentCopy size={18} />
                </>
            )}
        </button>
    );
};


export default CopyButton