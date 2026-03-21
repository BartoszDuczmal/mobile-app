import Loading from '@/components/Loading';
import MiniPost from '@/components/MiniPost';
import '@/locales/config';
import { API_URL } from '@/providers/config';
import { useModal } from '@/providers/ModalContext';
import { checkAuth } from '@/utils/checkAuth';
import { FontAwesome6 } from '@expo/vector-icons';
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
        await axios.post(`${API_URL}/admin/block`, { id: id }, { withCredentials: true })
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
        await axios.post(`${API_URL}/admin/unblock`, { id: id }, { withCredentials: true })
        openModal({ type: "info", title: t('profile.unblock.scs.title'), msg: t('proifle.unblock.scs.msg') })
    }
    catch(err: any) {
        const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
        openModal({ type: "error", title: t('profile.unblock.err.title'), msg: t(errMsg) })
    }
}

const Profile = () => {
    const { t, i18n } = useTranslation()

    const { openModal } = useModal()

    const [data, setData] = useState<null | Profile>(null)
    const [posts, setPosts] = useState<Post[]>([])
    const [logged, setLogged] = useState<{ loggedIn: boolean, user?: string, perm?: string}>({ loggedIn: false })

    const [refreshing, setRefreshing] = useState<boolean>(false)

    const params = useLocalSearchParams()
    const name = params.name

    const fetchAll = async () => {
        try {
            const res = await axios.post(`${API_URL}/profile/show`, { name: name })
            if (res.data) {
                setData({
                    id: res.data.id,
                    username: res.data.username,
                    perms: res.data.perms,
                    date: res.data.created_at,
                })

                const res2 = await axios.post(`${API_URL}/posts`, { name: name }, { withCredentials: true })
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
        <>
            <View style={css.infoBox}>
                <View style={css.dateBox}>
                    <FontAwesome6 name="clock" size={24}/>
                    <View>
                        <Text style={{fontWeight: 500}}>{t('profile.joinBox')}</Text>
                        <Text>{formattedDate}</Text>
                    </View>
                </View>
            </View>
            {
            logged.perm === 'admin' &&
            <View style={[css.infoBox, {display: 'flex'}]}>
                <TouchableOpacity onPress={
                    async (e) => { 
                        e.stopPropagation?.();
                        data.perms === 'blocked' ? await unblockUser(data.id, openModal, t) : await blockUser(data.id, openModal, t)
                        await fetchAll()
                    }}>
                        <View style={css.dateBox}>
                            <FontAwesome6 name={data.perms === 'blocked' ? 'reply' : 'ban'} size={24} color="#d00000" />
                            <Text style={{fontWeight: 500, color: '#d00000'}}>{data.perms === 'blocked' ? t('profile.unblockBox') : t('profile.blockBox')}</Text>
                        </View>
                </TouchableOpacity>
            </View>
            }
            <View style={css.infoBox}>
                <View style={css.postsBox}>
                    <FontAwesome6 name="folder-open" size={24}/>
                    <Text style={{fontWeight: 500}}>{t('profile.postsBox')}</Text>
                </View>
            </View>
        </>
    )

    return (
        <View style={css.container}>
            <Text style={{ fontSize: 20, fontWeight: 600, margin: 15, marginTop: 30, alignSelf: 'center' }} numberOfLines={1} ellipsizeMode="tail">
                {data.username} 
                { data.perms === 'admin' && ` ( ${t('profile.perms.admin')} ) `}
                { data.perms === 'blocked' && ` ( ${t('profile.perms.blocked')} ) `}
            </Text>
            <FlatList 
            contentContainerStyle={{ 
                justifyContent: 'center',
            }}
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
                <View style={css.listBox}>
                    <MiniPost key={item.id} id={item.id} title={item.title} desc={item.description} likes={item.likes} isLiked={!!item.isLiked}/>
                </View>
            )}
            ListEmptyComponent={
                <Text style={{marginVertical: 20, alignSelf: 'center'}}>{t('common.nothingThere')}</Text>
            }
            removeClippedSubviews={true}
            keyboardShouldPersistTaps="handled"
            />
        </View>
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
