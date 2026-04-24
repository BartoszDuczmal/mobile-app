import { StyledText, StyledTextInput } from '@/components/StyledComponents';
import '@/locales/config';
import { useModal } from "@/providers/ModalProvider";
import { api } from "@/services/api";
import { useHeaderHeight } from '@react-navigation/elements';
import { router } from 'expo-router';
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, useWindowDimensions, View } from "react-native";

const addPost = async (title: string, desc: string, openModal: ({type, title, msg}: {type: string, title: string, msg: string }) => void, t: any) => {
  try {
    const res = await api.post(`/posts/create`, { title, desc });
    openModal({ type: 'info', title: t('posts.publish.scs.title'), msg: '' })
    router.push('/posts')
  }
  catch(err: any) {
    const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
    openModal({ type: "error", title: t('posts.publish.err.title'), msg: t(errMsg) })
  }
}

const createPost = () => {
    const headerHeight = useHeaderHeight()
    const { t } = useTranslation()

    const { openModal, bottomBarHeight } = useModal()

    const screenHeight = useWindowDimensions().height;

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')

    return (
        <View className='w-full flex-1'>
            <ScrollView contentContainerClassName='w-full items-center' contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: bottomBarHeight }}>
                <View className='items-center bg-white dark:bg-[#171a1c] w-[80%] p-10 rounded-[30px] shadow-md' style={{ marginTop: (screenHeight / 10) }}>
                    <View className='border-b-[gray] border-b-2 align-center w-full'>
                        <StyledTextInput placeholder={t('input.postTitle')} placeholderTextColor="gray" onChangeText={setTitle} className='w-full text-5xl justify-start text-black dark:text-white'/>
                    </View>
                    <StyledTextInput placeholder={t('input.postDesc')} placeholderTextColor="gray" onChangeText={setDesc} className='w-full text-3xl justify-start text-black dark:text-white' multiline={true} numberOfLines={7} textAlignVertical="top" />
                </View>
                <Pressable onPress={() => addPost(title, desc, openModal, t)} className='shadow-md dark:bg-[#1e3773] bg-[#4974d7] w-[80%] p-5 mt-5 rounded-[50px] active:opacity-80'>
                    <StyledText className='text-2xl self-center text-white'>{t('input.button.publish')}</StyledText>
                </Pressable>
            </ScrollView>
        </View>
    );
}

export default createPost;