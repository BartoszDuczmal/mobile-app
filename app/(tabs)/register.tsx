import '@/locales/config';
import { useModal } from "@/providers/ModalProvider";
import { api } from "@/services/api";
import emailValid from "@/utils/validation/email";
import nameValid from "@/utils/validation/name";
import passValid from "@/utils/validation/pass";
import { MaterialIcons } from "@expo/vector-icons";
import { useHeaderHeight } from '@react-navigation/elements';
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from "react-native";

const fRegister = async (name: string, email: string, pass: string, openModal: ({type, title, msg}: { type: string, title: string, msg: string }) => void, t: any) => {
    try {
        const res = await api.post(`/auth/register`, { name, email, pass });
        openModal({ type: 'info', title: t('auth.register.scs.title'), msg: t('auth.register.scs.msg') })
        router.push('/posts')
    }
    catch(err: any) {
        const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
        openModal({ type: "error", title: t('auth.register.err.title'), msg: t(errMsg), })
    }
}

const register = () => {
    const headerHeight = useHeaderHeight()
    const screenHeight = useWindowDimensions().height;

    const { t } = useTranslation()

    const { openModal, bottomBarHeight } = useModal()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [repass, setRepass] = useState('')

    const [hide, setHide] = useState(true)
    const [reHide, setReHide] = useState(true)

    const pValid = passValid(pass)

    const eValid = emailValid(email)

    const nValid = nameValid(name)


    return (
        <View className='flex-1 w-full'>
            <ScrollView contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: bottomBarHeight }} contentContainerClassName='w-full items-center'>
                <View className='bg-white items-center rounded-[30px] w-[80%] p-10 dark:bg-[#171a1c] shadow-md'>
                    <View style={{ borderBottomColor: name.length === 0 ? 'gray' : nValid.valid ? 'gray': '#f2545b' }} className='flex-row items-center border-b-2 border-b-[gray]'>
                        <MaterialIcons name="person-outline" size={40} color={name.length === 0 ? 'gray' : nValid.valid ? 'gray': '#f2545b'} />
                        <TextInput placeholderTextColor="gray" placeholder={t('input.username')} className='text-black dark:text-white ml-1 w-[80%] text-3xl' onChangeText={setName}/>
                    </View>
                    { !nValid.valid && name.length !== 0 && nValid.messages.map((msg, i) => (
                        <Text className='text-[#f2545b] mt-2' key={i}>{msg}</Text>
                    ))}
                    <View style={{ borderBottomColor: email.length === 0 ? 'gray' : eValid ? 'gray': '#f2545b' }} className='flex-row items-center border-b-2 border-b-[gray] mt-5'>
                        <MaterialIcons name="alternate-email" size={40} color={email.length === 0 ? 'gray' : eValid ? 'gray': '#f2545b'} />
                        <TextInput placeholderTextColor="gray" placeholder={t('input.email')} className='text-black dark:text-white ml-1 w-[80%] text-3xl' onChangeText={setEmail} />
                    </View>
                    { !eValid && email.length !== 0 && (
                        <Text className='text-[#f2545b] mt-2'>{t('input.error.emailFormat')}</Text>
                    )}
                    <View style={{ borderBottomColor: pass.length === 0 ? 'gray' : pValid.valid ? 'gray': '#f2545b' }} className='flex-row items-center border-b-2 border-b-[gray] mt-5'>
                        <MaterialIcons name="lock-outline" size={40} color={pass.length === 0 ? 'gray' : pValid.valid ? 'gray': '#f2545b'} />
                        <TextInput placeholderTextColor="gray" placeholder={t('input.pass')} className='text-black dark:text-white ml-1 w-[80%] text-3xl' onChangeText={setPass} secureTextEntry={hide} autoCapitalize="none" autoCorrect={false} />
                    </View>
                    <Pressable onPress={() => setHide(v => !v)} className='items-end px-3 w-full'><Text style={{color: 'gray'}}>{ hide ? t('input.option.show') : t('input.option.hide') }</Text></Pressable>
                    { !pValid.valid && pass.length !== 0 && pValid.messages.map((msg, i) => (
                        <Text key={i} className='text-[#f2545b] mt-2'>{msg}</Text>))
                    }
                    <View style={{ borderBottomColor: repass.length === 0 ? 'gray' : repass === pass ? 'gray': '#f2545b' }}  className='flex-row items-center border-b-2 border-b-[gray] mt-5'>
                        <MaterialIcons name="lock-outline" size={40} color={repass.length === 0 ? 'gray' : repass === pass ? 'gray': '#f2545b'} />
                        <TextInput placeholderTextColor="gray" placeholder={t('input.rePass')} className='text-black dark:text-white ml-1 w-[80%] text-3xl' onChangeText={setRepass} secureTextEntry={reHide} autoCapitalize="none" autoCorrect={false} multiline={false} numberOfLines={1}/>
                    </View>
                    <Pressable onPress={() => setReHide(v => !v)} className='items-end px-3 w-full'><Text style={{color: 'gray'}}>{ reHide ? t('input.option.show') : t('input.option.hide') }</Text></Pressable>
                    { repass !== pass && repass.length !== 0 && (
                        <Text className='text-[#f2545b] mt-2'>{t('input.error.samePass')}</Text>
                    )}
                    <View className='flex-column items-center mt-2 gap-1'>
                        <Pressable onPress={() => router.push('/login')} className='group'>
                            <Text className='text-base text-[gray] dark:group-active:text-[lightgray] group-active:text-black'>{t('auth.register.haveAccount')}</Text>
                        </Pressable>
                    </View>
                </View>
                <Pressable onPress={() => fRegister(name, email, pass, openModal, t)} disabled={ !(pValid.valid && pass === repass && eValid && nValid.valid) } className='shadow-md dark:bg-[#1e3773] bg-[#4974d7] w-[80%] p-5 mt-5 rounded-[50px] active:opacity-80'>
                    <Text className='text-2xl self-center text-white'>{t('input.button.register')}</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

export default register;