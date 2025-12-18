import MiniPost from '@/components/MiniPost';
import LogoutModal from '@/components/modals/Account';
import { API_URL } from '@/config.js';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import axios from "axios";
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
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

const MyProfile = () => {
    const [data, setData] = useState<null | Profile>(null)
    const [post, setPost] = useState([])
    const [refresh, setRefresh] = useState(0)

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await axios.post(`${API_URL}:3001/profile/myShow`, { }, { withCredentials: true })
                if (res.data) {
                    setData({
                        id: res.data.id,
                        username: res.data.username,
                        email: res.data.email,
                        perms: res.data.perms,
                        date: res.data.created_at,
                    })
                    const res2 = await axios.post(`${API_URL}:3001/posts`, { name: res.data.username })
                    setPost(
                        res2.data.map((p: any) => ({
                            id: p.id,
                            title: p.title,
                            desc: p.description,
                            likes: p.likes,
                        }))
                    )
                } else {
                    return <Text>Podany użytkownik nie istnieje.</Text>
                }

            } catch (err: any) {
                const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'Wystąpił nieznany błąd serwera.'
                return <Text>{errMsg}</Text>
            }
        };

        fetchAll()
    }, [])

    if (!data) {
        return <Text>Ładowanie danych...</Text>
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
        <>
        <LogoutModal refresh={refresh}/>
        <View style={css.container}>
            <Text style={{fontSize: 20, fontWeight: 600, margin: 15, marginTop: 30}}>Panel zarządzania kontem</Text>
            <ScrollView contentContainerStyle={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, paddingBottom: 30}}>
            <View style={css.infoBox}>
                <View style={css.userBox}>
                    <FontAwesome6 name="clipboard-user" size={24}/>
                    <View>
                        <Text style={{fontWeight: 500}}>Nazwa użytkownika:</Text>
                        <Text>{data.username}</Text>
                    </View>
                </View>
            </View>
            <View style={css.infoBox}>
                <View style={css.dateBox}>
                    <MaterialIcons name="alternate-email" size={26}/>
                    <View>
                        <Text style={{fontWeight: 500}}>Adres email:</Text>
                        <Text>{data.email}</Text>
                    </View>
                </View>
            </View>
            <View style={css.infoBox}>
                <View style={css.dateBox}>
                    <FontAwesome6 name="clock" size={24}/>
                    <View>
                        <Text style={{fontWeight: 500}}>Data dołączenia:</Text>
                        <Text>{formattedDate}</Text>
                    </View>
                </View>
            </View>
            <View style={css.infoBox}>
                <TouchableOpacity onPress={() => router.push('/(tabs)/login/changePassword')}>
                    <View style={css.dateBox}>
                        <MaterialIcons name="password" size={26} color="black" />
                        <View>
                            <Text style={{fontWeight: 500}}>Kliknij, aby zmienić hasło</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={css.infoBox}>
                <TouchableOpacity onPress={() => setRefresh((prev) => prev + 1)}>
                    <View style={css.dateBox}>
                        <MaterialIcons name="logout" size={26} color="rgba(185, 0, 0, 1)" />
                        <View>
                            <Text style={{fontWeight: 500, color: "rgba(185, 0, 0, 1)"}}>Kliknij, aby się wylogować</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={css.postsBox}>
                <View style={css.postsTitle}>
                    <FontAwesome6 name="folder-open" size={24}/>
                    <Text style={{fontWeight: 500}}>Twoje wpisy:</Text>
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
