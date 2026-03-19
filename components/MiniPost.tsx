import { API_URL } from "@/providers/config";
import { useModal } from '@/providers/ModalContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Post = {
    id: number,
    title: string,
    desc: string,
    likes: number,
    isLiked: boolean
}

const ViewPost = (props: Post) => {
    const [likes, setLikes] = useState<number>(props.likes)
    const [isLike, setIsLike] = useState<boolean>(props.isLiked)

    const { openModal } = useModal()

    const { t, i18n } = useTranslation()

    const handleLike = async () => {
        try {
            const res = await axios.post(`${API_URL}/posts/${props.id}/like`, { }, { withCredentials: true });
            if(res.data.type === 'remove') {
                setLikes((prev) => prev - 1)
                setIsLike(false)
            }
            else {
                setLikes((prev) => prev + 1)
                setIsLike(true)
            }
        } catch(err: any) {
            const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
            openModal({ type: "error", title: i18n.t('common.likeErr'), msg: i18n.t(errMsg) })
        }
    }

    return (
        <Pressable style={css.box} onPress={() => { router.push(`/posts/${props.id}`) }}>
            <View style={css.contentBox}>
                <Text style={css.title} numberOfLines={1} ellipsizeMode="tail">{props.title}</Text>
                <Text numberOfLines={3} ellipsizeMode="tail">{props.desc}</Text>
            </View>
            <View style={css.footerBox}>
                <View style={css.footerLeft}>
                    <TouchableOpacity onPress={() => handleLike()}>
                        <MaterialCommunityIcons name={isLike ? 'heart' : 'heart-outline'} style={{ zIndex: 10 }} size={28} color={isLike ? '#ec5353' : 'gray'}/>
                    </TouchableOpacity>
                    <Text style={{ color: 'gray', fontSize: 18 }}>{likes}</Text>
                </View>
                <View style={css.footerRight}>
                    <MaterialCommunityIcons name='comment-outline' style={{ zIndex: 10 }} size={25} color='gray' />
                </View>
            </View>
        </Pressable>
    );
}

const css = StyleSheet.create({
    box: {
        width: '100%',
        height: 150,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
        marginTop: 25,
        display: 'flex',
        zIndex: 1,
    },
    title: {
        fontSize: 25,
    },
    contentBox: {
        flex: 2,
        padding: 15,
    },
    footerBox: {
        display: 'flex',
        flexDirection: 'row',
        borderColor: 'gray',
        borderTopWidth: 1,
        flex: 1,
        paddingHorizontal: 20,
        alignItems: 'center',
        gap: 7,
    },
    footerRight: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        gap: 7
    },
    footerLeft: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        gap: 5,
        alignItems: 'center'
    }
})

export default ViewPost;