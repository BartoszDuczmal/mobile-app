import Loading from '@/components/Loading';
import MiniPost from '@/components/MiniPost';
import { API_URL } from '@/config.js';
import { useModal } from '@/providers/ModalContext';
import { checkAuth } from '@/utils/checkAuth';
import { FontAwesome6 } from '@expo/vector-icons';
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Profile = {
    id: number,
    username: string,
    perms: string,
    date: string,
}

type Post = {
  id: number,
  title: string,
  desc: string,
  likes: number,
};

const blockUser = async (id: number, openModal: ({type, title, msg}: { type: string, title: string, msg: string }) => Promise<boolean|void>) => {
    const result = await openModal({ type: 'inquiry', title: 'Czy napewno chcesz zablokować tego użytkownika?', msg: '' })
    if(!result) return
    try {
        await axios.post(`${API_URL}/admin/block`, { id: id }, { withCredentials: true })
        openModal({ type: "info", title: 'Pomyślnie zablokowano użytkownika.', msg: 'Od teraz użytkownik nie będzie mógł wchodzić w żadne interakcje.' })
    }
    catch(err: any) {
        const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'Wystąpił nieznany błąd serwera.'
        openModal({ type: "error", title: 'Nie udało się zablokować użytkownika.', msg: errMsg })
    }
}

const Profile = () => {
    const { openModal } = useModal()

    const [data, setData] = useState<null | Profile>(null)
    const [post, setPost] = useState([])
const [logged, setLogged] = useState<{ loggedIn: boolean, user?: string, perm?: string}>({ loggedIn: false })

    const params = useLocalSearchParams()
    const name = params.name

    const unblockUser = async (id: number, openModal: ({type, title, msg}: { type: string, title: string, msg: string }) => Promise<boolean|void>) => {
        const result = await openModal({ type: 'inquiry', title: 'Czy napewno chcesz odblokować tego użytkownika?', msg: '' })
        if(!result) return
        try {
            await axios.post(`${API_URL}/admin/unblock`, { id: id }, { withCredentials: true })
            openModal({ type: "info", title: 'Pomyślnie odblokowano użytkownika.', msg: 'Od teraz użytkownik będzie mógł ponownie wchodzić w interakcje.' })
        }
        catch(err: any) {
            const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'Wystąpił nieznany błąd serwera.'
            openModal({ type: "error", title: 'Nie udało się odblokować użytkownika.', msg: errMsg })
        }
    } 

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
                const res2 = await axios.post(`${API_URL}/posts`, { name: name })
                setPost( res2.data.map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    desc: p.description,
                    likes: p.likes,
                })))

                setLogged(await checkAuth())
            }
        } catch (err: any) {
            const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'Wystąpił nieznany błąd serwera.'
            return <Text>{errMsg}</Text>
        }
    }

    useEffect(() => {
        const load = async () => await fetchAll()
        load()
    }, [name])

    if (!data) {
        return <Loading/>
    }

    const formattedDate = new Date(data.date).toLocaleDateString('pl-PL', {
        timeZone: 'Europe/Warsaw',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });


    return (
        <View style={css.container}>
            <Text style={{fontSize: 20, fontWeight: 600}} numberOfLines={1} ellipsizeMode="tail">
                {data.username} 
                { data.perms === 'admin' && ' ( Administrator )'}
                { data.perms === 'blocked' && ' ( Zablokowany )'}
            </Text>
            <View style={css.infoBox}>
                <View style={css.infoInBox}>
                    <FontAwesome6 name="clock" size={24}/>
                    <View>
                        <Text style={{fontWeight: 500}}>Data dołączenia:</Text>
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
                        data.perms === 'blocked' ? await unblockUser(data.id, openModal) : await blockUser(data.id, openModal)
                        await fetchAll()
                    }}>
                    <View style={css.infoInBox}>
                            <FontAwesome6 name={data.perms === 'blocked' ? 'reply' : 'ban'} size={24} color="#d00000" />
                            <Text style={{fontWeight: 500, color: '#d00000'}}>{data.perms === 'blocked' ? 'Odblokuj użytkownika' : 'Zablokuj użytkownika'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            }
            <View style={css.postsBox}>
                <View style={css.infoInBox}>
                    <FontAwesome6 name="folder-open" size={24}/>
                    <Text style={{fontWeight: 500}}>Wpisy użytkownika:</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={[{justifyContent: 'center'}, {alignItems: 'center'}]}>
                <View style={css.listBox}>
                {
                post.map((v: Post) => (
                    <MiniPost key={v.id} id={v.id} title={v.title} desc={v.desc} likes={v.likes}></MiniPost>
                ))
                }
                </View>
            </ScrollView>
        </View>
    );
}

const css = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        padding: 30,
        alignItems: 'center',
    },
    infoInBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
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

export default Profile;
