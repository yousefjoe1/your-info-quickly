import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type ViewMode = 'popup' | 'full-page';

interface ViewContextType {
    viewMode: ViewMode;
    openFullPage: () => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider = ({ children }: { children: ReactNode }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('popup');

    useEffect(() => {
        // تحديد النوع بناءً على عرض النافذة
        const checkMode = () => {
            setViewMode(window.innerWidth > 600 ? 'full-page' : 'popup');
        };

        checkMode();
        window.addEventListener('resize', checkMode);
        return () => window.removeEventListener('resize', checkMode);
    }, []);

    const openFullPage = () => {
        if (window.chrome?.tabs) {
            chrome.tabs.create({ url: 'index.html' });
        }
    };

    return (
        <ViewContext.Provider value={{ viewMode, openFullPage }}>
            {children}
        </ViewContext.Provider>
    );
};

// Hook بسيط عشان تستخدمه في أي Component
// eslint-disable-next-line react-refresh/only-export-components
export const useView = () => {
    const context = useContext(ViewContext);
    if (!context) throw new Error('useView must be used within ViewProvider');
    return context;
};