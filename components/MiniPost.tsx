import { useModal } from '@/providers/ModalProvider';
import { api } from "@/services/api";
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, TouchableOpacity, useColorScheme, View } from "react-native";

type Post = {
    id: number,
    title: string,
    desc: string,
    likes: number,
    isLiked: boolean
}

const ViewPost = (props: Post) => {
    const colorScheme = useColorScheme();
    const iconColor = colorScheme === "dark" ? "white" : "black";

    const [likes, setLikes] = useState<number>(props.likes)
    const [isLike, setIsLike] = useState<boolean>(props.isLiked)

    const { openModal } = useModal()

    const { t, i18n } = useTranslation()

    const handleLike = async () => {
        try {
            const res = await api.post(`/posts/${props.id}/like`, { });
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
        <Pressable className="w-full h-44 bg-white rounded-3xl mt-8 flex z-1 dark:bg-[#171a1c] shadow-md" onPress={() => { router.push(`/posts/${props.id}`) }}>
            <View className="h-max p-6 flex-1">
                <Text className="text-3xl dark:text-[#d2d2d2]" numberOfLines={1} ellipsizeMode="tail">{props.title}</Text>
                <Text numberOfLines={3} ellipsizeMode="tail" className="text-md dark:text-[#d2d2d2]">{props.desc}</Text>
            </View>
            <View className="flex-row px-7 items-center gap-7 h-12">
                <View className="flex-row flex-1 w-full justify-start gap-2 items-center">
                    <TouchableOpacity onPress={() => handleLike()}>
                        <MaterialCommunityIcons name={isLike ? 'heart' : 'heart-outline'} style={{ zIndex: 10 }} size={28} color={isLike ? '#ec5353' : 'gray'}/>
                    </TouchableOpacity>
                    <Text style={{ color: 'gray', fontSize: 18 }}>{likes}</Text>
                </View>
                <View className="flex-row flex-1 w-full justify-end gap-2">
                    <FontAwesome6 name="comments" size={24} color="gray" />
                </View>
            </View>
        </Pressable>
    );
}

export default ViewPost;