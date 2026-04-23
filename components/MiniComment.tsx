import { useModal } from '@/providers/ModalProvider';
import { api } from "@/services/api";
import { checkAuth } from "@/utils/checkAuth";
import { Feather, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from "react-native";

const MiniComment = ({id, content, date, author, likes, isLiked, refresh}: {id: number, content: string, date: string, author: string, likes: number, isLiked: boolean, refresh: () => void}) => {
    const { t, i18n } = useTranslation()

    const { openModal } = useModal()

    const [user, setUser] = useState<any>(null)

    const [isLike, setIsLike] = useState<boolean>(isLiked)
    const [useLikes, setUseLikes] = useState<number>(likes)

    const formattedDate = new Date(date).toLocaleDateString(i18n.language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

    const fetchDelete = async () => {
        const result = await openModal({ type: 'inquiry', title: i18n.t('comments.remove.inquiry') })
        if(!result) return
        try {
            const res = await api.post(`/comments/remove`, { id })
            openModal({ type: 'info', title: t('comments.remove.scs.title'), msg: t('comments.remove.scs.msg') })
            refresh()
        }
        catch(err: any) {
            const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
            openModal({ type: 'error', title: t('comments.remove.err.title'), msg: t(errMsg) })
        }
    }

    const handleLike = async () => {
        try {
            const res = await api.post(`/comments/like`, { id })
            if(res.data.type === 'remove') {
                setUseLikes((prev) => prev - 1)
                setIsLike(false)
            }
            else {
                setUseLikes((prev) => prev + 1)
                setIsLike(true)
            }
        }
        catch(err: any) {
            const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
            openModal({ type: 'error', title: t('comments.like.err.title'), msg: t(errMsg) })
        }
    }

    const fetchUser = async () => {
        const keyData = await checkAuth()
        setUser(keyData)
    }

    useEffect(() => {
        fetchUser()
        setIsLike(isLiked)
        setUseLikes(likes)
    }, [isLiked, likes])

    return (
        <View className='mx-2 mt-5 w-[80%] self-center'>
            <Text className='text-[gray] text-sm ml-[34px] mb-[-5px] mt-[5px]'>{formattedDate}</Text>
            <View className='flex-row items-center p-[5px] gap-[5px]'>
                <Feather name="corner-down-right" size={24} color="#5c5c5c" />
                <Text className='text-[gray]'>{t('comments.whose', { user: author })}</Text>
            </View>
            <Text className='dark:text-[#d2d2d2] text-black ml-[35px] text-[15px]'>{content}</Text>
            <View className='flex-row gap-1 justify-end items-center'>
                <TouchableOpacity style={{flexDirection: 'row', gap: 3}} onPress={() => handleLike()}>
                    <MaterialCommunityIcons name={isLike ? "heart" : "heart-outline"} size={20} color={isLike ? '#ec5353' : "#5c5c5c"}/>
                </TouchableOpacity>
                <Text style={{color: '#5c5c5c'}}>{useLikes}</Text>
                { (user?.user === author || user?.perm === 'admin')  &&
                <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center', marginLeft: 5}} onPress={() => fetchDelete()}>
                    <FontAwesome6 name='trash-can' size={16} color='#5c5c5c'/>
                </TouchableOpacity>
                }
            </View>
        </View>
    );
}

export default MiniComment;