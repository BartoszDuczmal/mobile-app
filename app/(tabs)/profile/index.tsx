import Loading from '@/components/Loading';
import MiniPost from '@/components/MiniPost';
import '@/locales/config';
import { API_URL } from '@/providers/config';
import { useModal } from '@/providers/ModalContext';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import axios from "axios";
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    desc: string,
    likes: number,
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
    const { t, i18n } = useTranslation()

    const [data, setData] = useState<null | Profile>(null)
    const [post, setPost] = useState([])

    const { openModal } = useModal()

    useEffect(() => {
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
                    const res2 = await axios.post(`${API_URL}/posts`, { name: res.data.username })
                    setPost(
                        res2.data.map((p: any) => ({
                            id: p.id,
                            title: p.title,
                            desc: p.description,
                            likes: p.likes,
                        }))
                    )
                } else {
                    return <Text>{t('myProfile.noUser')}</Text>
                }

            } catch (err: any) {
                const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
                return <Text>{errMsg}</Text>
            }
        };

        fetchAll()
    }, [])

    if (!data) {
        return <Loading />
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
            <View style={css.container}>
                <Text style={{ fontSize: 20, fontWeight: 600, margin: 15, marginTop: 30 }}>{t('myProfile.titlePanel')}</Text>
                <ScrollView indicatorStyle="black" contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, paddingBottom: 30 }}>
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
                    <View style={css.postsBox}>
                        <View style={css.postsTitle}>
                            <FontAwesome6 name="folder-open" size={24} />
                            <Text style={{ fontWeight: 500 }}>{t('myProfile.postsBox')}</Text>
                        </View>
                    </View>
                    <View style={css.listBox}>
                        {
                            post.map((v: Post) => (
                                <MiniPost key={v.id} id={v.id} title={v.title} desc={v.desc} likes={v.likes}></MiniPost>
                            ))
                        }
                    </View>
                </ScrollView>
            </View>
        </>
    );
}

const css = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
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
        marginHorizontal: 15,
        marginTop: 15,
        padding: 15,
        width: '100%',
        display: 'flex',
        gap: 15,
    },
    postsBox: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
        marginHorizontal: 15,
        marginTop: 15,
        padding: 15,
        width: '100%',
        display: 'flex',
        gap: 15,
    },
    postsTitle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    listBox: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 30,
    }
})

export default MyProfile;
