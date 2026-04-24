import Loading from '@/components/Loading';
import MiniComment from '@/components/MiniComment';
import { StyledText, StyledTextInput } from '@/components/StyledComponents';
import { useModal } from '@/providers/ModalProvider';
import { api } from "@/services/api";
import { checkAuth } from '@/utils/checkAuth';
import { deletePost } from '@/utils/deletePost';
import { Feather, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";

type Post = {
    id: number,
    title: string,
    description: string,
    author: string,
    likes: number,
    created_at: string,
    isLiked: number,
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
    const headerHeight = useHeaderHeight()
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

    const { openModal, bottomBarHeight } = useModal()

    const handleAddComment = async (content: string, postId: number) => {
        try {
            const res = await api.post(`/comments/add`, { content, post: postId })
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
            const res = await api.get(`/comments/fetch/${id}`)

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
            const res = await api.get(`/posts/${id}`)

            if (res.data) {
                setData(res.data)
                setLikes(res.data.likes)
                setIsLike(!!res.data.isLiked)
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
            const res = await api.post(`/posts/${id}/like`, { });
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

    return (
        <FlatList 
        className='flex-1 w-full'
        contentContainerStyle={{
            paddingBottom: bottomBarHeight,
            paddingTop: headerHeight
        }}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
        keyExtractor={( item ) => item.id.toString()}
        data={comments}
        ListHeaderComponent={ 
            <View className='w-[80%] flex-1 items-center self-center'>
                <View className='bg-white items-center rounded-[30px] w-full p-10 dark:bg-[#171a1c] shadow-md'>
                    <Pressable onPress={() => router.push(`/(tabs)/profile/${data.author}`)}>
                        <StyledText className='text-[gray] text-xl self-center mb-4' numberOfLines={1}>
                            <Feather name="user" size={24} color='gray' />
                            &nbsp;
                            {data.author}
                        </StyledText>
                    </Pressable>
                    <View className='w-full pb-4 mb-2 border-b-2 border-[gray] items-center'>
                        <StyledText numberOfLines={3} className='text-black dark:text-[#d2d2d2] text-4xl'>{data.title}</StyledText>
                    </View>
                    <StyledText className='text-black dark:text-[#d2d2d2] text-xl'>{data.description}</StyledText>
                    <View className='align-center w-full flex-row m-6 justify-between'>
                        <View className='flex-row gap-2 items-center'>
                            <TouchableOpacity onPress={() => handleLike()}>
                                <MaterialCommunityIcons name={isLike ? 'heart' : 'heart-outline'} style={{ zIndex: 10 }} size={30} color={isLike ? '#ec5353' : 'gray'}/>
                            </TouchableOpacity>
                            <StyledText className='text-[gray] text-xl'>{likes}</StyledText>
                        </View>
                        <View className='flex-row gap-5 items-center'>
                        { 
                        (isOwner?.user === data.author || isOwner?.perm === 'admin') &&
                        <>
                            <TouchableOpacity onPress={() => router.push(`/posts/${idNum}/edit`)}>
                                <FontAwesome6 name='edit' size={24} color='gray'/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deletePost(data.id, openModal, t)}>
                                <FontAwesome6 name='trash-can' size={24} color='gray'/>
                            </TouchableOpacity>
                        </>
                        }
                        </View> 
                    </View>
                    <StyledText style={{ color: 'gray', fontSize: 18 }}>{formattedDate}</StyledText>
                </View>
                <View className='bg-white items-center rounded-[30px] w-full dark:bg-[#171a1c] shadow-md mt-5 flex-row justify-beetween p-3'>
                    <View className='dark:bg-black rounded-full flex-1 px-4 bg-[#f5f6f7]'> 
                        <StyledTextInput placeholderTextColor="gray" placeholder={t('input.addComment')} autoCapitalize="none" value={comment} onChangeText={setComment} className='text-black dark:text-white'/>
                    </View>
                    <TouchableOpacity className='m-3 px-4' onPress={() => handleAddComment(comment, data.id)}>
                        <StyledText className='text-black dark:text-white'>{t('input.button.comment')}</StyledText>
                    </TouchableOpacity>
                </View>
            </View>
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
        ListEmptyComponent={
            <StyledText style={{marginVertical: 20, alignSelf: 'center'}}>{t('common.nothingThere')}</StyledText>
        }
        removeClippedSubviews={true}
        keyboardShouldPersistTaps='handled'
        />
    );
}

const css = StyleSheet.create({
    addBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    }
})

export default ViewPost;