import { useModal } from '@/providers/ModalContext';
import { isLikedBy } from '@/utils/isLikedBy';
import { handleLike } from '@/utils/like-post';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from "react-native";

type Post = {
    id: number,
    title: string,
    desc: string,
    likes: number,
}

const ViewPost = (props: Post) => {
    const [likes, setLikes] = useState(props.likes)

    const [isLike, setIsLike] = useState(false)

    useEffect(() => {
        const fetchIsLike = async () => {
            const status = await isLikedBy(props.id)
            setIsLike(status)
        }

        fetchIsLike()
    }, [props.id])

    const { openModal } = useModal()

    return (
        <Pressable style={css.box} onPress={() => { router.push(`/posts/${props.id}`) }}>
            <View style={css.contentBox}>
                <Text style={css.title} numberOfLines={1} ellipsizeMode="tail">{props.title}</Text>
                <Text numberOfLines={4} ellipsizeMode="tail">{props.desc}</Text>
            </View>
            <View style={css.footerBox}>
                <MaterialCommunityIcons name={isLike ? 'heart' : 'heart-outline'} style={{ zIndex: 10 }} size={28} color={isLike ? '#ec5353' : 'gray'} onPress={
                    async () => {
                        const res = await handleLike(props.id, openModal)
                        if(res) {
                            setLikes(res.likes)
                            setIsLike(!isLike)
                        }
                    }
                }/>
                <Text style={{ color: 'gray', fontSize: 18 }}>{likes}</Text>
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
        justifyContent: 'flex-end',
        gap: 7,
    },
})

export default ViewPost;