import { API_URL } from "@/providers/config";
import { useModal } from '@/providers/ModalContext';
import { checkAuth } from "@/utils/checkAuth";
import { Feather, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
            const res = await axios.post(`${API_URL}/comments/remove`, { id: id }, { withCredentials: true })
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
            const res = await axios.post(`${API_URL}/comments/like`, { id: id }, { withCredentials: true })
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
        <View style={css.commentBox}>
            <Text style={{color: '#9a9a9a', fontSize: 12, marginLeft: 35, marginBottom: -5, marginTop: 5}}>{formattedDate}</Text>
            <View style={css.commentHeader}>
                <Feather name="corner-down-right" size={24} color="#5c5c5c" />
                <Text style={{color: '#5c5c5c'}}>{t('comments.whose', { user: author })}</Text>
            </View>
            <Text style={{color: '#5c5c5c', fontSize: 15, marginLeft: 35}}>{content}</Text>
            <View style={css.commentFooter}>
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

const css = StyleSheet.create({
    commentBox: {
        marginHorizontal: 10,
        marginBottom: 20,
    },
    commentHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        gap: 5,
    },
    commentFooter: {
        display: 'flex',
        flexDirection: 'row',
        gap: 3,
        justifyContent: 'flex-end',
        alignItems: 'center'
    }
})

export default MiniComment;