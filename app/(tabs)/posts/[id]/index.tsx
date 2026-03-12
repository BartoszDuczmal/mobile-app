import Loading from '@/components/Loading';
import MiniComment from '@/components/MiniComment';
import { API_URL } from "@/providers/config";
import { useModal } from '@/providers/ModalContext';
import { checkAuth } from '@/utils/checkAuth';
import { deletePost } from '@/utils/deletePost';
import { isLikedBy } from '@/utils/isLikedBy';
import { handleLike } from '@/utils/like-post';
import { Feather, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Post = {
    id: number,
    title: string,
    desc: string,
    author: string,
    likes: number,
    date: string,
}
type Comment = {
    id: number,
    author_name: string,
    content: string,
    created_at: string
}

const handleAddComment = async (content: string, postId: number, openModal: ({type, title, msg}: { type: string, title: string, msg?: string }) => any, t: any) => {
    try {
        const res = await axios.post(`${API_URL}/comment/add`, { content: content, post: postId }, { withCredentials: true })
        openModal({ type: 'info', title: t('comments.add.scs.title'), msg: t('comments.add.scs.msg') })
    }
    catch(err: any) {
        const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
        openModal({ type: 'error', title: t('comments.add.err.title'), msg: t(errMsg) })
    }
}

const ViewPost = () => {
    const { t, i18n } = useTranslation()
    const params = useLocalSearchParams()
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    const idNum = parseInt(id as string, 10)
    if (isNaN(idNum)) return null;

    const [data, setData] = useState<Post | null>(null)

    const [comments, setComments] = useState<Comment[] | null>(null)

    const [likes, setLikes] = useState<number>(0)

    const [isLike, setIsLike] = useState(false)

    const [isOwner, setIsOwner] = useState<{user: string, perm: string} | null>(null)

    const [comment, setComment] = useState<string>('')

    const { openModal } = useModal()

    useEffect(() => {
        let active = true

        const fetchAll = async () => {
            try {
                const res = await axios.get(`${API_URL}/posts/${id}`)

                if (res.data) {
                    setData({
                        id: res.data.id,
                        title: res.data.title,
                        desc: res.data.description,
                        author: res.data.author,
                        likes: res.data.likes,
                        date: res.data.created_at,
                    });
                    setLikes(res.data.likes)


                } else {
                    console.warn('Brak danych dla danego ID');
                }

                const status = await isLikedBy(idNum)
                if(active) setIsLike(status)

                const auth = await checkAuth();
                if(active) setIsOwner({user: auth?.user, perm: auth?.perm});

            } catch (err) {
                console.error('Błąd podczas pobierania danych:', err);
            }
        };

        fetchAll()

        return () => { active = false }
    }, [id]);

    useEffect(() => {
        let active = true

        const fetchAll = async () => {
            try {
                const res = await axios.get(`${API_URL}/comments/fetch/${id}`)

                if (res.data) {
                    setComments(res.data);
                } else {
                    console.warn('Brak komentarzy dla wpisu.');
                }
            } catch (err) {
                console.error('Błąd podczas pobierania danych:', err);
            }
        };

        fetchAll()

        return () => { active = false }
    }, [id]);

    if (!data) {
        return <Loading/>
    }

    const formattedDate = new Date(data.date).toLocaleDateString(i18n.language, {
        timeZone: 'Europe/Warsaw',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <>
            <ScrollView style={css.container}>
                <Pressable onPress={() => router.push(`/(tabs)/profile/${data.author}`)}>
                    <Text style={{ color: 'gray', fontSize: 18, alignSelf: 'center', marginBottom: 15 }} numberOfLines={1}>
                        <Feather name="user" size={24} color='gray' />
                        &nbsp;
                        {data.author}
                    </Text>
                </Pressable>
                <View style={css.title}>
                    <Text style={{ fontSize: 35 }} numberOfLines={3}>{data.title}</Text>
                </View>
                <Text style={{fontSize: 20}}>{data.desc}</Text>
                <View style={css.footerBox}>
                    <View style={css.likeFooter}>
                        
                        <MaterialCommunityIcons name={isLike ? 'heart' : 'heart-outline'} style={{ zIndex: 10 }} size={28} color={isLike ? '#ec5353' : 'gray'} onPress={
                            async () => {
                                const res = await handleLike(data.id, openModal)
                                if(res) {
                                    setLikes(res.likes)
                                    setIsLike(prev => !prev)
                                }
                            }
                        }/>
                        <Text style={{ color: 'gray', fontSize: 18 }}>{likes}</Text>
                    </View>
                    <Text style={{ color: 'gray', fontSize: 18 }}>{formattedDate}</Text>
                </View>
                { 
                (isOwner?.user === data.author || isOwner?.perm === 'admin') &&
                <View style={css.editBox}>
                    <TouchableOpacity onPress={() => router.push(`/posts/${idNum}/edit`)}>
                        <FontAwesome6 name='edit' size={24} color='gray'/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deletePost(data.id, openModal, t)}>
                        <FontAwesome6 name='trash-can' size={24} color='gray'/>
                    </TouchableOpacity>
                </View> 
                }
                {/* Renderowanie komentarzy */}
                <View style={css.commentsHeader}>
                    <Text style={{fontSize: 15}}>Komentarze:</Text>
                </View>
                <View style={css.addBox}>
                    <View style={css.addInput}>
                        <TextInput placeholderTextColor="gray" placeholder="Dodaj komenatrz" autoCapitalize="none" value={comment} onChangeText={setComment} />
                    </View>
                    <TouchableOpacity style={{margin: 10, paddingHorizontal: 15, paddingVertical: 7, borderRadius: 25}} onPress={() => handleAddComment(comment, data.id, openModal, t)}>
                        <Text>Skomentuj</Text>
                    </TouchableOpacity>
                </View>
                {comments?.map((c: Comment, i: number) => {
                    return (<MiniComment key={i} id={c.id} date={c.created_at} author={c.author_name} content={c.content} />)
                })}
            </ScrollView>
        </>
    );
}

const css = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        padding: 30,
    },
    box: {
        display: 'flex',
        flex: 1,
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 30,
        padding: 20,
    },
    title: {
        width: '100%',
        paddingBottom: 15,
        marginBottom: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 2,
        alignItems: 'center',
    },
    footerBox: {
        marginTop: 25,
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 5,
        gap: 7,
    },
    likeFooter: {
        display: 'flex',
        flexDirection: 'row',
        gap: 7,
        alignItems: 'center'
    },
    editBox: {
        marginTop: 5,
        paddingHorizontal: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 20,
    },
    loadingBox: {
        display: 'flex',
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 80,
    },
    commentsRightHeader: {
        display: 'flex',
        gap: 5,
        flexDirection: 'row',
    },
    commentsHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 5
    },
    addInput: {
        margin: 5,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        flex: 1
    },
    addBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

    }
})

export default ViewPost;