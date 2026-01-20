import { useState } from "react";
import type { ToastType } from "../components/Toasts/Toast";
interface ToastState {
    message: string;
    type: ToastType;
}

export function useToast() {
    const [toast, setToast] = useState<ToastState | null>(null);

    const showToast = (
        message: string,
        type: ToastType = "success"
    ) => {
        setToast({ message, type });
    };

    const hideToast = () => setToast(null);

    return {
        toast,
        showToast,
        hideToast,
    };
}
