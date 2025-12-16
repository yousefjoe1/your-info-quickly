import React, { useState, useEffect } from 'react';
import ToggleSwitch from './ToggleSwitch';

interface ChromeTab {
    id?: number;
    url?: string;
    title?: string;
}

const Popup: React.FC = () => {
    const [currentDirection, setCurrentDirection] = useState<'ltr' | 'rtl'>('ltr');
    const [currentTab, setCurrentTab] = useState<ChromeTab | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [initError, setInitError] = useState<string>('');
    const [runtimeError, setRuntimeError] = useState<string>('');

    const initializePopup = (): void => {
        try {
            // Check if Chrome APIs are available
            // if (typeof chrome === 'undefined' || !chrome.tabs || !chrome.tabs.query) {
            //     setInitError('Chrome extension APIs not available. Make sure this is running as a Chrome extension.');
            //     setIsLoading(false);
            //     return;
            // }

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs: ChromeTab[]) => {
                if (chrome.runtime.lastError) {
                    setInitError(`Chrome API error: ${chrome.runtime.lastError.message}`);
                    setIsLoading(false);
                    return;
                }

                if (!tabs || tabs.length === 0) {
                    setInitError('No active tab found');
                    setIsLoading(false);
                    return;
                }

                const tab = tabs[0];
                setCurrentTab(tab);

                if (!tab.url) {
                    setInitError('No URL found for current tab');
                    setIsLoading(false);
                    return;
                }

                // Get stored direction for this website
                chrome.storage.local.get([new URL(tab.url).hostname], (result: { [key: string]: 'ltr' | 'rtl' }) => {
                    if (chrome.runtime.lastError) {
                        setInitError(`Storage error: ${chrome.runtime.lastError.message}`);
                        setIsLoading(false);
                        return;
                    }

                    const hostname = new URL(tab.url!).hostname;
                    const direction = result[hostname] || 'ltr';

                    setCurrentDirection(direction);
                    setIsLoading(false);
                });
            });
        } catch (error) {
            console.error('Error initializing popup:', error);
            setInitError(`Initialization error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        initializePopup();
    }, []);

    // const handleToggle = (newDirection: 'ltr' | 'rtl'): void => {
    //     if (!currentTab?.id || !currentTab.url) return;

    //     setCurrentDirection(newDirection);
    //     setRuntimeError(''); // Clear any previous errors

    //     const hostname = new URL(currentTab.url).hostname;

    //     chrome.storage.local.set({ [hostname]: newDirection }, () => {
    //         if (chrome.runtime.lastError) {
    //             console.error('Error saving to storage:', chrome.runtime.lastError);
    //             setRuntimeError(`Failed to save: ${chrome.runtime.lastError.message}`);
    //             return;
    //         }

    //         chrome.tabs.sendMessage(currentTab.id!, {
    //             action: 'setDirection',
    //             direction: newDirection
    //         }, () => {
    //             if (chrome.runtime.lastError) {
    //                 console.error('Error sending message:', chrome.runtime.lastError);
    //                 setRuntimeError(`Failed to apply direction: ${chrome.runtime.lastError.message}`);
    //             }
    //         });
    //     });
    // };
    const handleToggle = (newDirection: 'ltr' | 'rtl'): void => {
        if (!currentTab?.id || !currentTab.url) return;

        setCurrentDirection(newDirection);
        setRuntimeError('');

        const hostname = new URL(currentTab.url).hostname;

        chrome.storage.local.set({ [hostname]: newDirection }, () => {
            if (chrome.runtime.lastError) {
                setRuntimeError(`Failed to save: ${chrome.runtime.lastError.message}`);
                return;
            }

            // Use executeScript instead of sendMessage
            chrome.scripting.executeScript({
                target: { tabId: currentTab.id! },
                func: (direction) => {
                    document.documentElement.dir = direction;
                    document.body.dir = direction;
                },
                args: [newDirection]
            }).catch((error) => {
                setRuntimeError(`Failed to apply direction: ${error.message}`);
            });
        });
    };
    const handleReset = (): void => {
        if (!currentTab?.id || !currentTab.url) return;

        setCurrentDirection('ltr');
        setRuntimeError(''); // Clear any previous errors

        const hostname = new URL(currentTab.url).hostname;

        chrome.storage.local.remove([hostname], () => {
            if (chrome.runtime.lastError) {
                console.error('Error removing from storage:', chrome.runtime.lastError);
                setRuntimeError(`Failed to reset: ${chrome.runtime.lastError.message}`);
                return;
            }

            chrome.tabs.sendMessage(currentTab.id!, {
                action: 'setDirection',
                direction: 'ltr'
            }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error sending message:', chrome.runtime.lastError);
                    setRuntimeError(`Failed to apply reset: ${chrome.runtime.lastError.message}`);
                }
            });
        });
    };

    if (isLoading) {
        return (
            <div className="popup-container">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    if (initError) {
        return (
            <div className="popup-container">
                <div className="error-message">
                    <h3>Error</h3>
                    <p>{initError}</p>
                    <p style={{ fontSize: '12px', marginTop: '10px' }}>
                        Make sure you're testing this in a Chrome extension environment.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="popup-container">
            <h3>Text Direction</h3>

            {runtimeError && (
                <div className="error-message" style={{ marginBottom: '10px' }}>
                    <p style={{ color: 'red', fontSize: '12px' }}>{runtimeError}</p>
                </div>
            )}

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