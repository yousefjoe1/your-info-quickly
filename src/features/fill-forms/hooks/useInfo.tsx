import { useEffect, useState } from 'react'
import { getData, saveData } from '../lib/actionFunctions';
import type { MyQuickInfo } from '../types';
import { useToast } from './useToast';

const useInfo = () => {
    const [myQuickInfo, setMyQuickInfo] = useState<MyQuickInfo[]>([]);
    const [reload, setReload] = useState(false)
    const { showToast } = useToast();


    const deleteData = async (index: number) => {
        const filterd = myQuickInfo.filter((_, idx) => idx != index)
        setMyQuickInfo(filterd);
        const res = await saveData(filterd)
        if (res) {
            showToast('Data deleted successfully', 'success');
            setReload(!reload)
        }
    };

    const getMyInfo = async () => {
        const res = await getData();
        setMyQuickInfo(res)
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getMyInfo()
    }, [reload]);

    const handleAddInfo = async (data: MyQuickInfo[]) => {
        const newInfo = [...myQuickInfo, ...data]
        setMyQuickInfo(newInfo)
        const res = await saveData(newInfo)
        if (res) {
            showToast('Data saved successfully', 'success');
            setReload(!reload)
        }
    }

    const editInfo = async (newInfo: MyQuickInfo, index: number) => {
        const updatedInfo = [...myQuickInfo]
        updatedInfo[index] = newInfo
        setMyQuickInfo(updatedInfo)
        const res = await saveData(updatedInfo)
        if (res) {
            showToast('Data updated successfully', 'success');
            setReload(!reload)
        }
    }
    return { myQuickInfo, deleteData, editInfo, handleAddInfo, reload }
}

export default useInfo