import Loading from '@/components/Loading';
import { StyledText, StyledTextInput } from '@/components/StyledComponents';
import '@/locales/config';
import { useModal } from '@/providers/ModalProvider';
import { api } from "@/services/api";
import { checkAuth } from '@/utils/checkAuth';
import { useHeaderHeight } from '@react-navigation/elements';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, useWindowDimensions, View } from "react-native";

type Post = {
    id: number,
    title: string,
    desc: string,
    author: string,
}

const fetchEdit = async (id: number, title: string, desc: string, openModal: ({type, title, msg}: { type: string, title: string, msg?: string }) => any, t: any) => {
    try {
        const res = await api.post(`/posts/${id}/edit`, { title, desc });
        openModal({ type: 'info', title: t('posts.edit.scs.title'), msg: t('posts.edit.scs.msg') })
        router.back()
    }
    catch(err: any) {
        const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
        openModal({ type: 'error', title: t('posts.edit.err.title'), msg: t(errMsg) })
    }
}

const edit = () => {
    const headerHeight = useHeaderHeight()
    const screenHeight = useWindowDimensions().height;

    const { t } = useTranslation()

    const { openModal, bottomBarHeight } = useModal()

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
                const res = await api.get(`/posts/${id}`);

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
            } catch (err) {
                console.error('Błąd podczas pobierania wpisu:', err);
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
        <ScrollView className='w-full flex-1'>
            <View style={{ paddingTop: headerHeight, paddingBottom: bottomBarHeight }} className='flex-1 w-[80%] self-center'>
                <View className='bg-white items-center rounded-[30px] w-full p-10 dark:bg-[#171a1c] shadow-md' style={{ marginTop: (screenHeight / 10) }}>
                    <View className='w-full pb-4 mb-2 border-b-2 border-[gray] items-center'>
                        <StyledTextInput placeholderTextColor="gray" className='text-black dark:text-[#d2d2d2] text-4xl' value={title} onChangeText={setTitle}/>
                    </View>
                    <StyledTextInput placeholderTextColor="gray" className='text-black dark:text-[#d2d2d2] text-xl' value={desc} onChangeText={setDesc} numberOfLines={7} multiline={true}/>
                </View>
                <View className='mt-5 justify-around flex-row w-full items-center gap-2 px-4'>
                    <Pressable style={{ paddingHorizontal: (width - 200) / 5 }} className='shadow-md dark:bg-[#2a7e2a] bg-[lightgreen] p-5 rounded-[30px] active:opacity-80' onPress={() => fetchEdit(idNum, title, desc, openModal, t)}>
                        <StyledText className='text-2xl self-center text-white'>{t('input.button.save')}</StyledText>
                    </Pressable>
                    <Pressable style={{ paddingHorizontal: (width - 200) / 5 }} onPress={() => router.back()} className='shadow-md dark:bg-[#b74b49] bg-[#e39695] p-5 rounded-[30px] active:opacity-80'>
                        <StyledText className='text-2xl self-center text-white'>{t('input.button.cancel')}</StyledText>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

export default edit;