import Loading from '@/components/Loading';
import MiniPost from '@/components/MiniPost';
import '@/locales/config';
import { API_URL } from '@/providers/config';
import { useModal } from '@/providers/ModalContext';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import axios from "axios";
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Profile = {
    id: number,
    username: string,
    email: string,
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

const logout = async (openModal: ({type, title, msg}: { type: string, title: string, msg?: string }) => Promise<boolean|void>, t: any) => {
    const result = await openModal({ type: 'inquiry', title: t('myProfile.logout.inquiry') })
    if(!result) return
    try {
        const res = await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
        router.replace('/(tabs)/posts')
    }
    catch(err: any) {
        const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
        openModal({ type: 'error', title: t('myProfile.logout.err.title'), msg: t('myProfile.logout.err.msg') })
    }
}

const MyProfile = () => {
    const headerHeight = useHeaderHeight()
    const { t, i18n } = useTranslation()

    const [data, setData] = useState<null | Profile>(null)
    const [posts, setPosts] = useState<Post[]>([])

    const [refreshing, setRefreshing] = useState<boolean>(false)

    const { openModal } = useModal()

    const fetchAll = async () => {
        try {
            const res = await axios.post(`${API_URL}/profile/myShow`, {}, { withCredentials: true })
            if (res.data) {
                setData({
                    id: res.data.id,
                    username: res.data.username,
                    email: res.data.email,
                    perms: res.data.perms,
                    date: res.data.created_at,
                })
                const res2 = await axios.post(`${API_URL}/posts`, { name: res.data.username }, { withCredentials: true })
                if(res2.data) {
                    setPosts(res2.data)
                }
            } else {
                return <Text>{t('myProfile.noUser')}</Text>
            }
        } catch (err: any) {
            const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
            return <Text>{errMsg}</Text>
        }
    };

    const onRefresh = async () => {
        setRefreshing(true)
        await fetchAll()
        setRefreshing(false)
    }

    useEffect(() => {
        fetchAll()
    }, [])

    if (!data) {
        return <Loading />
    }

    const formattedDate = new Date(data.date).toLocaleDateString(i18n.language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const ProfileTiles = () => {
        return (
            <View>
                <View style={css.infoBox}>
                    <View style={css.userBox}>
                        <FontAwesome6 name="clipboard-user" size={24} />
                        <View>
                            <Text style={{ fontWeight: 500 }}>{t('myProfile.usernameBox')}</Text>
                            <Text>{data.username}</Text>
                        </View>
                    </View>
                </View>
                <View style={css.infoBox}>
                    <View style={css.dateBox}>
                        <MaterialIcons name="alternate-email" size={26} />
                        <View>
                            <Text style={{ fontWeight: 500 }}>{t('myProfile.emailBox')}</Text>
                            <Text>{data.email}</Text>
                        </View>
                    </View>
                </View>
                <View style={css.infoBox}>
                    <View style={css.dateBox}>
                        <FontAwesome6 name="clock" size={24} />
                        <View>
                            <Text style={{ fontWeight: 500 }}>{t('myProfile.joinBox')}</Text>
                            <Text>{formattedDate}</Text>
                        </View>
                    </View>
                </View>
                <View style={css.infoBox}>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/login/changePassword')}>
                        <View style={css.dateBox}>
                            <MaterialIcons name="password" size={26} color="black" />
                            <View>
                                <Text style={{ fontWeight: 500 }}>{t('myProfile.changePassBox')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={css.infoBox}>
                    <TouchableOpacity onPress={() => logout(openModal, t)}>
                        <View style={css.dateBox}>
                            <MaterialIcons name="logout" size={26} color="rgba(185, 0, 0, 1)" />
                            <View>
                                <Text style={{ fontWeight: 500, color: "rgba(185, 0, 0, 1)" }}>{t('myProfile.logoutBox')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={css.infoBox}>
                    <View style={css.postsBox}>
                        <View style={css.postsTitle}>
                            <FontAwesome6 name="folder-open" size={24} />
                            <Text style={{ fontWeight: 500 }}>{t('myProfile.postsBox')}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return (
            <View>
                <FlatList 
                contentContainerStyle={[ css.container, { paddingTop: headerHeight } ]}
                refreshControl={ 
                    <RefreshControl 
                    refreshing={refreshing} 
                    onRefresh={onRefresh}
                    /> 
                }
                data={posts}
                keyExtractor={( item ) => item.id.toString()}
                ListHeaderComponent={
                    <ProfileTiles/>
                }
                renderItem={({ item }) => (
                    <View style={css.listBox}>
                        <MiniPost id={item.id} title={item.title} desc={item.description} likes={item.likes} isLiked={!!item.isLiked}/>
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
        justifyContent: 'center',
        paddingBottom: 30,
    },
    dateBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    userBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginLeft: 5,
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
    }
})

export default MyProfile;
