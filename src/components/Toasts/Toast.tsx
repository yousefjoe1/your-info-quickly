import { useEffect } from "react";
import { CgClose } from "react-icons/cg";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
}

const toastStyles: Record<ToastType, string> = {
    success: "bg-emerald-600",
    error: "bg-red-600",
    info: "bg-blue-600",
};

export default function Toast({
    message,
    type = "success",
    duration = 2000,
    onClose,
}: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={` flex gap-3
        fixed bottom-3 left-1/2 -translate-x-1/2
        px-4 py-2 rounded-xl text-white text-sm font-medium
        shadow-lg
        transition-all duration-200
        animate-in fade-in slide-in-from-bottom-2
        ${toastStyles[type]}
      `}
        >
            {message}
            <button className="bg-gray-300 rounded-xl p-1" onClick={onClose}>
                <CgClose />
            </button>
        </div>
    );
}
