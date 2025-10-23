import DeletePost from '@/components/modals/DeletePost';
import { checkAuth } from '@/utils/checkAuth';
import { FontAwesome6 } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";

type Post = {
    id: number,
    title: string,
    desc: string,
    author: string,
}

const fetchEdit = async (id: number, title: String, desc: String) => {
    try {
        const res = await axios.post(`http://192.168.1.151:3001/posts/${id}/edit`, { title: title, desc: desc }, { withCredentials: true });
        Alert.alert('Pomyślnie edytowano wpis!', undefined, [
            {
                text: 'OK',
            }
        ])
        router.back()
    }
    catch(err: any) {
        const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'Wystąpił nieznany błąd serwera.'
        Alert.alert('Przepraszamy, ale nie udało się edytować tego wpisu.', errMsg, [
            {
                text: 'OK',
            }
        ])
    }
}

const edit = () => {
    const { width } = useWindowDimensions();

    const params = useLocalSearchParams()
    const id = params.id
    const idNum = parseInt(id as string, 10)
    if (!idNum || isNaN(idNum)) return;

    const [data, setData] = useState<Post | null>(null);

    const [isOwner, setIsOwner] = useState<{user: string, perm: string} | null>(null)

    const [colorDelete, setColorDelete] = useState('gray')

    const [modal, setModal] = useState(0)

    const [title, setTitle] = useState<string>('')

    const [desc, setDesc] = useState<string>('')

    useEffect(() => {
        let blocker = true

        const fetchData = async () => {
            try {
                const res = await axios.get(`http://192.168.1.151:3001/posts/${id}`);
                if (res.data) {
                    setData({
                        id: res.data.id,
                        title: res.data.title,
                        desc: res.data.description,
                        author: res.data.author,
                    });
                } else {
                    console.warn('Brak danych dla danego ID');
                }
            } catch (error) {
                console.error('Błąd podczas pobierania wpisu:', error);
            }
        };
        fetchData()

        return () => {
            blocker = false;
        };
    }, [id]);

    useEffect(() => {
        if (!data) return

        const checkOwner = async () => {
            const auth = await checkAuth()
            if (auth?.user !== data.author && auth?.perm !== 'admin') {
                router.back()
            }
        }

        setTitle(data.title)
        setDesc(data.desc)

        checkOwner();
    }, [data]); 

    if (!data) {
        return (
            <Text>Ładowanie danych...</Text>
        )
    }

    return (
        <>
            <DeletePost refresh={modal} id={idNum}/>
            <View style={css.container}>
                <View style={css.title}>
                    <TextInput style={{ fontSize: 35 }} value={title} onChangeText={setTitle}></TextInput>
                </View>
                <TextInput style={{fontSize: 20}} value={desc} onChangeText={setDesc} numberOfLines={7} multiline={true}></TextInput>
                <View style={css.footerBox}>
                    <Pressable style={[css.actionBoxSave, { paddingHorizontal: (width - 200) / 5 }]} onPress={() => fetchEdit(idNum, title, desc)}>
                        <Text>Zapisz</Text>
                    </Pressable>
                    <Pressable style={[css.actionBoxCancel, { paddingHorizontal: (width - 200) / 5 }]} onPress={() => router.back()}>
                        <Text>Anuluj</Text>
                    </Pressable>
                    <Pressable onPress={() => setModal(prev => prev+1)}>
                        {({pressed}) => (
                            <FontAwesome6 name='trash-can' size={24} color={pressed ? 'silver' : 'gray'}/>
                        )}
                    </Pressable>
                </View>
            </View>
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
        justifyContent: 'space-around',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 5,
        gap: 7,
        alignItems: 'center'
    },
    actionBoxSave: {
        paddingVertical: 10,
        borderRadius: 17,
        backgroundColor: 'lightgreen',
    },
    actionBoxCancel: {
        paddingVertical: 10,
        borderRadius: 17,
        backgroundColor: '#e39695',
    }
})

export default edit;