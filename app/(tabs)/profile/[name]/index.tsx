import Loading from '@/components/Loading';
import MiniPost from '@/components/MiniPost';
import '@/locales/config';
import { useModal } from '@/providers/ModalProvider';
import { api } from "@/services/api";
import { checkAuth } from '@/utils/checkAuth';
import { FontAwesome6 } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

type Profile = {
    id: number,
    username: string,
    perms: string,
    date: string,
}

type Post = {
    id: number,
    title: string,
    description: string,
    likes: number,
    isLiked: number
};

const blockUser = async (id: number, openModal: ({type, title, msg}: { type: string, title: string, msg: string }) => Promise<boolean|void>, t: any) => {
    const result = await openModal({ type: 'inquiry', title: t('profile.block.inquiry'), msg: '' })
    if(!result) return
    try {
        await api.post(`/admin/block`, { id })
        openModal({ type: "info", title: t('profile.block.scs.title'), msg: t('proifle.block.scs.msg') })
    }
    catch(err: any) {
        const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
        openModal({ type: "error", title: t('profile.block.err.title'), msg: t(errMsg) })
    }
}

const unblockUser = async (id: number, openModal: ({type, title, msg}: { type: string, title: string, msg: string }) => Promise<boolean|void>, t: any) => {
    const result = await openModal({ type: 'inquiry', title: t('profile.unblock.inquiry'), msg: '' })
    if(!result) return
    try {
        await api.post(`/admin/unblock`, { id })
        openModal({ type: "info", title: t('profile.unblock.scs.title'), msg: t('proifle.unblock.scs.msg') })
    }
    catch(err: any) {
        const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
        openModal({ type: "error", title: t('profile.unblock.err.title'), msg: t(errMsg) })
    }
}

const Profile = () => {
    const headerHeight = useHeaderHeight()
    const { t, i18n } = useTranslation()

    const { openModal, bottomBarHeight } = useModal()

    const colorScheme = useColorScheme();
    const iconColor = colorScheme === "dark" ? "#d2d2d2" : "black";

    const [data, setData] = useState<null | Profile>(null)
    const [posts, setPosts] = useState<Post[]>([])
    const [logged, setLogged] = useState<{ loggedIn: boolean, user?: string, perm?: string}>({ loggedIn: false })

    const [refreshing, setRefreshing] = useState<boolean>(false)

    const params = useLocalSearchParams()
    const name = params.name

    const fetchAll = async () => {
        try {
            const res = await api.post(`/profile/show`, { name })
            if (res.data) {
                setData({
                    id: res.data.id,
                    username: res.data.username,
                    perms: res.data.perms,
                    date: res.data.created_at,
                })

                const res2 = await api.post(`/posts`, { name })
                if(res2.data) {
                    setPosts(res2.data)
                }

                setLogged(await checkAuth())
            }
        } catch (err: any) {
            const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'Wystąpił nieznany błąd serwera.'
            return <Text>{errMsg}</Text>
        }
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await fetchAll()
        setRefreshing(false)
    }

    useEffect(() => {
        fetchAll()
    }, [name])

    if (!data) {
        return <Loading/>
    }

    const formattedDate = new Date(data.date).toLocaleDateString(i18n.language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const ProfileTiles = () => (
        <View className='w-[80%] flex-1 self-center'>
            <Text style={{ fontSize: 20, fontWeight: 600, marginBottom: 15, alignSelf: 'center' }} className='self-center mb-4 font-bold text-2xl dark:text-white' numberOfLines={1} ellipsizeMode="tail">
                {data.username} 
                { data.perms === 'admin' && ` ( ${t('profile.perms.admin')} ) `}
                { data.perms === 'blocked' && ` ( ${t('profile.perms.blocked')} ) `}
            </Text>
            <View className='bg-white items-start rounded-[30px] w-full p-5 dark:bg-[#171a1c] shadow-md my-2'>
                <View style={css.dateBox}>
                    <FontAwesome6 name="clock" size={24} color={iconColor}/>
                    <View>
                        <Text className='font-bold dark:text-[#d2d2d2]'>{t('profile.joinBox')}</Text>
                        <Text className='dark:text-[#d2d2d2]'>{formattedDate}</Text>
                    </View>
                </View>
            </View>
            {
            logged.perm === 'admin' &&
            <View className='bg-white items-start rounded-[30px] w-full p-5 dark:bg-[#171a1c] shadow-md my-2'>
                <TouchableOpacity onPress={
                    async (e) => { 
                        e.stopPropagation?.();
                        data.perms === 'blocked' ? await unblockUser(data.id, openModal, t) : await blockUser(data.id, openModal, t)
                        await fetchAll()
                    }}>
                        <View style={css.dateBox}>
                            <FontAwesome6 name={data.perms === 'blocked' ? 'reply' : 'ban'} size={24} color="#d00000" />
                            <Text className='font-bold text-[#d00000]'>{data.perms === 'blocked' ? t('profile.unblockBox') : t('profile.blockBox')}</Text>
                        </View>
                </TouchableOpacity>
            </View>
            }
            <View className='bg-white items-start rounded-[30px] w-full p-5 dark:bg-[#171a1c] shadow-md my-2'>
                <View style={css.postsBox}>
                    <FontAwesome6 name="folder-open" size={24} color={iconColor}/>
                    <Text className='font-bold dark:text-[#d2d2d2]'>{t('profile.postsBox')}</Text>
                </View>
            </View>
        </View>
    )

    return (
            <FlatList
            contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: bottomBarHeight }}
            refreshControl={ 
                <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                /> 
            }
            keyExtractor={(item) => item.id.toString()}
            data={posts}
            ListHeaderComponent={
                <ProfileTiles/>
            }
            renderItem={({ item }) => (
                <View className='w-[70%] self-center'>
                    <MiniPost key={item.id} id={item.id} title={item.title} desc={item.description} likes={item.likes} isLiked={!!item.isLiked}/>
                </View>
            )}
            ListEmptyComponent={
                <Text className='mx-5 self-center'>{t('common.nothingThere')}</Text>
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
    },
    infoBox: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
        marginTop: 15,
        padding: 15,
        width: '80%',
        display: 'flex',
        gap: 15,
        margin: 'auto'
    },
    postsBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    postsTitle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    listBox: {
        display: 'flex',
        width: '70%',
        margin: 'auto'
    },
    dateBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
})

export default Profile;
