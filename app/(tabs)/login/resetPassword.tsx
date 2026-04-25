import Loading from "@/components/Loading";
import { StyledText, StyledTextInput } from '@/components/StyledComponents';
import '@/locales/config';
import { useModal } from "@/providers/ModalProvider";
import { api } from "@/services/api";
import passValid from "@/utils/validation/pass";
import { MaterialIcons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";

const fReset = async (token: string, pass: string, openModal: ({type, title, msg}: { type: string, title: string, msg: string }) => void, t: any) => {
    try {
        await api.post(`/auth/resetPass`, { token, pass });
        openModal({ type: 'info', title: t('auth.resetPass.scs.title'), msg: t('auth.resetPass.scs.msg') })
        router.push('/(tabs)/posts/')
    }
    catch(err: any) {
        openModal({ type: "error", title: t('auth.resetPass.err.title'), msg: t('common.internalErr')})
    }
}

const resetPassword = () => {
    const headerHeight = useHeaderHeight()
    const screenHeight = useWindowDimensions().height;

    const { t } = useTranslation()

    const { openModal, bottomBarHeight } = useModal()

    const [pass, setPass] = useState('')

    const [repass, setRepass] = useState('')

    const { token } = useLocalSearchParams<{ token?: string }>()

    if(!token) return <Loading/>

    const pValid = passValid(pass)

    return (
        <View className='flex-1 w-full'>
            <ScrollView contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: bottomBarHeight }} contentContainerClassName='w-full items-center'>
                <View className='bg-white items-center rounded-[30px] w-[80%] p-10 dark:bg-[#171a1c] shadow-md' style={{ marginTop: (screenHeight / 10) }}>
                    <View className='flex-row items-center border-b-2 border-b-[gray]'>
                        <MaterialIcons name="lock-outline" size={40} color={pass.length === 0 ? 'gray' : pValid.valid ? 'gray': '#f2545b'} />
                        <StyledTextInput placeholderTextColor="gray" placeholder={t('input.newPass')} className='text-black dark:text-white ml-1 w-[80%] text-3xl' onChangeText={setPass} secureTextEntry={true} autoCapitalize="none" autoCorrect={false} multiline={false} numberOfLines={1}/>
                    </View>
                    { !pValid.valid && pass.length !== 0 && pValid.messages.map((msg, i) => (
                        <StyledText key={i} className='text-[#f2545b] mt-2'>{msg}</StyledText>))
                    }
                    <View className='flex-row items-center border-b-2 border-b-[gray]'>
                        <MaterialIcons name="lock-outline" size={40} color={repass.length === 0 ? 'gray' : repass === pass ? 'gray': '#f2545b'} />
                        <StyledTextInput placeholderTextColor="gray" placeholder={t('input.rePass')} className='text-black dark:text-white ml-1 w-[80%] text-3xl' onChangeText={setRepass} secureTextEntry={true} autoCapitalize="none" autoCorrect={false} multiline={false} numberOfLines={1}/>
                    </View>
                    { repass !== pass && repass.length !== 0 && (
                        <StyledText className='text-[#f2545b] mt-2'>{t('input.error.samePass')}</StyledText>
                    )}
                </View>
                <Pressable onPress={() => fReset(token, pass, openModal, t)} className='shadow-md dark:bg-[#1e3773] bg-[#4974d7] w-[80%] p-5 mt-5 rounded-[50px] active:opacity-80' disabled={ !(pValid.valid && pass === repass) }>
                    <StyledText className='text-2xl self-center text-white'>{t('input.button.changePass')}</StyledText>
                </Pressable>
            </ScrollView>
        </View>
    );
}

const css = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    inputBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '60%',
        borderBottomWidth: 2,
        borderBottomColor: 'gray',
    },
    input: {
        fontSize: 30, 
        width: '80%', 
        marginLeft: 5,
        color: 'black',
    },
    helpBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    button: {
        marginTop: 15,
    },
    errMsg: {
        color: '#f2545b', 
        marginTop: 10,
    },
})

export default resetPassword;