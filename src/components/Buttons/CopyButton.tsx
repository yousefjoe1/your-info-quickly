import { useState } from 'react';
import { BiCheck } from 'react-icons/bi';
import { MdContentCopy } from 'react-icons/md';
import { useToast } from '../../hooks/useToast';
import Toast from '../Toasts/Toast';

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const { showToast, toast, hideToast } = useToast();

    const [copied, setCopied] = useState<boolean>(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            showToast('Copied to clipboard', 'success');
        } catch (err) {
            console.error('Failed to copy:', err);
            showToast('Failed to copy', 'error');
        }
    };

    return (
        <>
            <button
                onClick={handleCopy}
                className="flex rounded-lg p-1 bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-green-400"
                disabled={copied}
            >
                {copied ? (
                    <>
                        <BiCheck size={14} />
                    </>
                ) : (
                    <>
                        <MdContentCopy size={14} />
                    </>
                )}
            </button>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}
        </>
    );
};


export default CopyButton