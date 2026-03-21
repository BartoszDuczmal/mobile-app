import Loading from '@/components/Loading';
import MiniComment from '@/components/MiniComment';
import { API_URL } from "@/providers/config";
import { useModal } from '@/providers/ModalContext';
import { checkAuth } from '@/utils/checkAuth';
import { deletePost } from '@/utils/deletePost';
import { Feather, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Post = {
    id: number,
    title: string,
    description: string,
    author: string,
    likes: number,
    created_at: string,
}
type Comment = {
    id: number,
    author_name: string,
    content: string,
    created_at: string,
    likes: number,
    isLiked: number,
}

const ViewPost = () => {
    const { t, i18n } = useTranslation()
    const params = useLocalSearchParams()
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    const idNum = parseInt(id as string, 10)
    if (isNaN(idNum)) return null;

    // Dla danych posta
    const [data, setData] = useState<Post | null>(null)

    // Dla komentarzy posta
    const [comments, setComments] = useState<Comment[] | null>(null)

    // Dla polubień posta
    const [likes, setLikes] = useState<number>(0)
    const [isLike, setIsLike] = useState<boolean>(false)

    const [isOwner, setIsOwner] = useState<{user: string, perm: string} | null>(null)

    // Dla inputa do komentowania
    const [comment, setComment] = useState<string>('')

    // Dla pull-to-refresh
    const [refreshing, setRefreshing] = useState<boolean>(false)

    const { openModal } = useModal()

    const handleAddComment = async (content: string, postId: number) => {
        try {
            const res = await axios.post(`${API_URL}/comments/add`, { content: content, post: postId }, { withCredentials: true })
            openModal({ type: 'info', title: t('comments.add.scs.title'), msg: t('comments.add.scs.msg') })
            setComment('')
            await fetchComments()
        }
        catch(err: any) {
            const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
            openModal({ type: 'error', title: t('comments.add.err.title'), msg: t(errMsg) })
        }
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await fetchComments()
        setRefreshing(false)
    }

    const fetchComments = async () => {
        try {
            const res = await axios.get(`${API_URL}/comments/fetch/${id}`, { withCredentials: true })

            if (res.data) {
                setComments(res.data);
            } else {
                console.warn('Brak komentarzy dla wpisu.');
            }

        } catch (err) {
            console.error('Błąd podczas pobierania danych:', err);
        }
    };

    const fetchPost = async () => {
        try {
            const res = await axios.get(`${API_URL}/posts/${id}`)

            if (res.data) {
                setData(res.data)
                setLikes(res.data.likes)
                setIsLike(res.data.isLiked)
            } else {
                console.warn('Brak danych dla danego ID');
            }

            const auth = await checkAuth();
            setIsOwner({user: auth?.user, perm: auth?.perm});

        } catch (err) {
            console.error('Błąd podczas pobierania danych:', err);
        }
    };

    const handleLike = async () => {
        try {
            const res = await axios.post(`${API_URL}/posts/${id}/like`, { }, { withCredentials: true });
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

    useEffect(() => {
        let active = true

        fetchPost()
        fetchComments()

        return () => { active = false }
    }, [id]);

    if (!data) {
        return <Loading/>
    }

    const formattedDate = new Date(data.created_at ).toLocaleDateString(i18n.language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const PostComponent = () => {
        return (
            <>
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
                <Text style={{fontSize: 20}}>{data.description}</Text>
                <View style={css.footerBox}>
                    <View style={css.likeFooter}>
                        <TouchableOpacity onPress={() => handleLike()}>
                            <MaterialCommunityIcons name={isLike ? 'heart' : 'heart-outline'} style={{ zIndex: 10 }} size={28} color={isLike ? '#ec5353' : 'gray'}/>
                        </TouchableOpacity>
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
                
                <View style={css.commentsHeader}>
                    <Text style={{fontSize: 15}}>{t('comments.info')}</Text>
                </View>
                <View style={css.addBox}>
                    <View style={css.addInput}>
                        <TextInput placeholderTextColor="gray" placeholder={t('input.addComment')} autoCapitalize="none" value={comment} onChangeText={setComment} />
                    </View>
                    <TouchableOpacity style={{margin: 10, paddingHorizontal: 15, paddingVertical: 7, borderRadius: 25}} onPress={() => handleAddComment(comment, data.id)}>
                        <Text>{t('input.button.comment')}</Text>
                    </TouchableOpacity>
                </View>
            </>
        )
    }

    return (
        <FlatList 
        style={css.container} 
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
        keyExtractor={( item ) => item.id.toString()}
        data={comments}
        ListHeaderComponent={ 
            <PostComponent/> 
        }
        renderItem={({ item }) => ( 
            <MiniComment 
            id={item.id} 
            date={item.created_at} 
            author={item.author_name} 
            content={item.content} 
            likes={item.likes} 
            isLiked={!!item.isLiked} 
            refresh={onRefresh} 
            /> 
        )}
        ListFooterComponent={ 
            <View style={{width: '100%', padding: 30}}/> 
        }
        ListEmptyComponent={
            <Text style={{marginVertical: 20, alignSelf: 'center'}}>{t('common.nothingThere')}</Text>
        }
        removeClippedSubviews={true}
        keyboardShouldPersistTaps="handled"
        />
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
        marginBottom: 15,
    }
})

export default ViewPost;