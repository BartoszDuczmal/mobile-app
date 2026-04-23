import '@/locales/config';
import { useAuth } from '@/providers/AuthProvider';
import { useModal } from "@/providers/ModalProvider";
import { MaterialIcons } from "@expo/vector-icons";
import { useHeaderHeight } from '@react-navigation/elements';
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from "react-native";

const index = () => {
    const headerHeight = useHeaderHeight()
    const screenHeight = useWindowDimensions().height;
    
    const { t } = useTranslation()

    const { openModal, bottomBarHeight } = useModal()

    const { login: fLogin } = useAuth()

    const [login, setLogin] = useState('')
    const [pass, setPass] = useState('')
    const [hide, setHide] = useState(true)

    const handleLogin = async (login: string, pass: string, openModal: ({type, title, msg}: { type: string, title: string, msg: string }) => void, t: any) => {
        try {
            await fLogin(login, pass)
            openModal({ type: 'info', title: t('auth.login.scs.title'), msg: '' })
            router.push('/posts')
        }
        catch(err: any) {
            const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
            openModal({ type: "error", title: t('auth.login.err.title'), msg: t(errMsg) })
        }
    }

    return (
        <View className='flex-1 w-full'>
            <ScrollView contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: bottomBarHeight }} contentContainerClassName='w-full items-center'>
                <View className='bg-white items-center rounded-[30px] w-[80%] p-10 dark:bg-[#171a1c] shadow-md' style={{ marginTop: (screenHeight / 10) }} >
                    <View className='flex-row items-center border-b-2 border-b-[gray]'>
                        <MaterialIcons name="alternate-email" size={40} color={'gray'} />
                        <TextInput placeholderTextColor="gray" placeholder={t('input.login')} onChangeText={setLogin} className='text-black dark:text-white ml-1 w-[80%] text-3xl'/>
                    </View>
                    <View className='flex-row items-center border-b-2 border-b-[gray] mt-5'>
                        <MaterialIcons name="lock-open" size={40} color={'gray'} />
                        <TextInput placeholderTextColor="gray" placeholder={t('input.pass')} onChangeText={setPass} secureTextEntry={hide} autoCapitalize="none" autoCorrect={false} className='text-black dark:text-white ml-1 w-[80%] text-3xl'/>
                    </View>
                    <Pressable onPress={() => setHide(v => !v)} className='items-end px-3 w-full'><Text style={{color: 'gray'}}>{ hide ? t('input.option.show') : t('input.option.hide') }</Text></Pressable>
                    <View className='flex-column items-center mt-2 gap-1'>
                        <Pressable onPress={() => router.push('/register')} className='group'>
                            <Text className='text-base text-[gray] dark:group-active:text-[lightgray] group-active:text-black'>{t('auth.login.noAccount')}</Text>
                        </Pressable>
                        <Pressable onPress={() => router.push('/login/recovery')} className='group'>
                            <Text className='text-base text-[gray] dark:group-active:text-[lightgray] group-active:text-black'>{t('auth.login.forgetPass')}</Text>
                        </Pressable>
                    </View>
                </View>
                <Pressable onPress={() => handleLogin(login, pass, openModal, t)} disabled={login.length === 0 || pass.length === 0} className='shadow-md dark:bg-[#1e3773] bg-[#4974d7] w-[80%] p-5 mt-5 rounded-[50px] active:opacity-80'>
                    <Text className='text-2xl self-center text-white'>{t('input.button.login')}</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

export default index;