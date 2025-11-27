import React, { useState, useEffect } from 'react';
import ToggleSwitch from './ToggleSwitch';
import '../styles/popup.css';
import type { StorageData, Tab } from '../types';

const Popup: React.FC = () => {
    const [currentDirection, setCurrentDirection] = useState<'ltr' | 'rtl'>('ltr');
    const [currentTab, setCurrentTab] = useState<Tab | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        initializePopup();
    }, []);

    const initializePopup = async (): Promise<void> => {
        try {
            // Get current active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            setCurrentTab(tab);

            if (!tab.url) {
                throw new Error('No URL found for current tab');
            }

            // Get stored direction for this website
            const hostname = new URL(tab.url).hostname;
            const result = await chrome.storage.local.get([hostname]) as StorageData;
            const direction = result[hostname] || 'ltr';

            setCurrentDirection(direction);
        } catch (error) {
            console.error('Error initializing popup:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = async (newDirection: 'ltr' | 'rtl'): Promise<void> => {
        if (!currentTab?.id || !currentTab.url) return;

        try {
            setCurrentDirection(newDirection);

            // Save to storage
            const hostname = new URL(currentTab.url).hostname;
            await chrome.storage.local.set({ [hostname]: newDirection });

            // Apply to current tab
            await chrome.tabs.sendMessage(currentTab.id, {
                action: 'setDirection',
                direction: newDirection
            });
        } catch (error) {
            console.error('Error toggling direction:', error);
        }
    };

    const handleReset = async (): Promise<void> => {
        if (!currentTab?.id || !currentTab.url) return;

        try {
            setCurrentDirection('ltr');

            // Remove from storage
            const hostname = new URL(currentTab.url).hostname;
            await chrome.storage.local.remove([hostname]);

            // Reset in current tab
            await chrome.tabs.sendMessage(currentTab.id, {
                action: 'setDirection',
                direction: 'ltr'
            });
        } catch (error) {
            console.error('Error resetting direction:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="popup-container">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="popup-container">
            <h3>Text Direction</h3>

            <div className="toggle-section">
                <span className="direction-label">LTR</span>
                <ToggleSwitch
                    isOn={currentDirection === 'rtl'}
                    onToggle={(isOn: boolean) => handleToggle(isOn ? 'rtl' : 'ltr')}
                />
                <span className="direction-label">RTL</span>
            </div>

            <div className="status">
                Current: <strong>{currentDirection.toUpperCase()}</strong>
            </div>

            <button
                className="reset-btn"
                onClick={handleReset}
                disabled={!currentTab}
            >
                Reset for this site
            </button>
        </div>
    );
};

export default Popup;