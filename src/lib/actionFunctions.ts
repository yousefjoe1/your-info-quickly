import type { MyQuickInfo } from "../types";

export const saveData = (newData: unknown[]): Promise<boolean> => {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(
            { action: 'saveData', data: newData },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    resolve(false); // نرجع false لو فيه خطأ
                    return;
                }

                if (response?.success) {
                    console.log('Data saved successfully');
                    resolve(true); // نرجع true لو نجح
                } else {
                    resolve(false); // نرجع false لو فشل
                }
            }
        );
    });
};

export const getData = async (): Promise<MyQuickInfo[]> => {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(
            { action: 'getData' },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    resolve([]);
                    return;
                }
                // تأكد من نوع البيانات الراجع
                resolve(response?.data || []);
            }
        );
    });
};