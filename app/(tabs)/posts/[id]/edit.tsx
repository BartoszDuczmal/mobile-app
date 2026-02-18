import Loading from '@/components/Loading';
import '@/locales/config';
import { API_URL } from "@/providers/config";
import { useModal } from '@/providers/ModalContext';
import { checkAuth } from '@/utils/checkAuth';
import { deletePost } from '@/utils/deletePost';
import { FontAwesome6 } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";

type Post = {
    id: number,
    title: string,
    desc: string,
    author: string,
}

const fetchEdit = async (id: number, title: string, desc: string, openModal: ({type, title, msg}: { type: string, title: string, msg?: string }) => any, t: any) => {
    try {
        const res = await axios.post(`${API_URL}/posts/${id}/edit`, { title: title, desc: desc }, { withCredentials: true });
        openModal({ type: 'info', title: t('posts.edit.scs.title'), msg: t('posts.edit.scs.msg') })
        router.back()
    }
    catch(err: any) {
        const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
        openModal({ type: 'error', title: t('posts.edit.err.title'), msg: t(errMsg) })
    }
}

const edit = () => {
    const { t } = useTranslation()

    const { openModal } = useModal()

    const { width } = useWindowDimensions()

    const params = useLocalSearchParams()
    const id = params.id
    const idNum = parseInt(id as string, 10)
    if (!idNum || isNaN(idNum)) return;

    const [data, setData] = useState<Post | null>(null);

    const [isOwner, setIsOwner] = useState<{user: string, perm: string} | null>(null)

    const [title, setTitle] = useState<string>('')

    const [desc, setDesc] = useState<string>('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_URL}/posts/${id}`);

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
        return <Loading/>
    }

    return (
        <>
            <View style={css.container}>
                <View style={css.title}>
                    <TextInput placeholderTextColor="gray" style={{ fontSize: 35, color: 'black' }} value={title} onChangeText={setTitle}></TextInput>
                </View>
                <TextInput placeholderTextColor="gray" style={{fontSize: 20, color: 'black'}} value={desc} onChangeText={setDesc} numberOfLines={7} multiline={true}></TextInput>
                <View style={css.footerBox}>
                    <Pressable style={[css.actionBoxSave, { paddingHorizontal: (width - 200) / 5 }]} onPress={() => fetchEdit(idNum, title, desc, openModal, t)}>
                        <Text>{t('input.button.save')}</Text>
                    </Pressable>
                    <Pressable style={[css.actionBoxCancel, { paddingHorizontal: (width - 200) / 5 }]} onPress={() => router.back()}>
                        <Text>{t('input.button.cancel')}</Text>
                    </Pressable>
                    <Pressable onPress={() => deletePost(data.id, openModal, t)}>
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