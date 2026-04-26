import { StyledText, StyledTextInput } from '@/components/StyledComponents';
import '@/locales/config';
import { useModal } from "@/providers/ModalProvider";
import { api } from "@/services/api";
import passValid from "@/utils/validation/pass";
import { MaterialIcons } from "@expo/vector-icons";
import { useHeaderHeight } from '@react-navigation/elements';
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, useWindowDimensions, View } from "react-native";

const changePassword = () => {
    const headerHeight = useHeaderHeight()
    const { t } = useTranslation()

    const screenHeight = useWindowDimensions().height;

    const { openModal, bottomBarHeight } = useModal()

    const [curr, setCurr] = useState('')
    const [pass, setPass] = useState('')
    const [repass, setRepass] = useState('')

    const [hide, setHide] = useState(true)
    const [newHide, setNewHide] = useState(true)
    const [newReHide, setNewReHide] = useState(true)

    const pValid = passValid(pass)

    const fReset = async (curr: string, pass: string) => {
        try {
            await api.post(`/auth/resetPass`, { curr, pass });
            openModal({ type: 'info', title: t('auth.passReset.scs.title'), msg: t('auth.passReset.scs.msg') })
        }
        catch(err: any) {
            const errMsg = err.response?.data?.error || 'common.internalErr'
            openModal({ type: "error", title: t('auth.passReset.err.title'), msg: t(errMsg) })
        }
    }

    return (
        <View className='flex-1 w-full'>
            <ScrollView contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: bottomBarHeight }} contentContainerClassName='w-full items-center'>
                <View className='bg-white items-center rounded-[30px] w-[80%] p-10 dark:bg-[#171a1c] shadow-md' style={{ marginTop: (screenHeight / 10) }}>
                    <View className='flex-row items-center border-b-2 border-b-[gray]'>
                        <MaterialIcons name="lock-open" size={40} color='gray'/>
                        <StyledTextInput placeholderTextColor="gray" placeholder={t('input.currPass')} className='text-black dark:text-white ml-1 w-[80%] text-3xl' onChangeText={setCurr} secureTextEntry={hide} autoCapitalize="none" autoCorrect={false} multiline={false} numberOfLines={1}/>
                    </View>
                    <Pressable onPress={() => setHide(v => !v)} className='items-end px-3 w-full'><StyledText style={{color: 'gray'}}>{ hide ? t('input.option.show') : t('input.option.hide') }</StyledText></Pressable>
                    <View className='flex-row items-center border-b-2 border-b-[gray]'>
                        <MaterialIcons name="lock-outline" size={40} color={pass.length === 0 ? 'gray' : pValid.valid ? 'gray': '#f2545b'} />
                        <StyledTextInput placeholderTextColor="gray" placeholder={t('input.newPass')} className='text-black dark:text-white ml-1 w-[80%] text-3xl' onChangeText={setPass} secureTextEntry={newHide} autoCapitalize="none" autoCorrect={false} multiline={false} numberOfLines={1}/>
                    </View>
                    <Pressable onPress={() => setNewHide(v => !v)} className='items-end px-3 w-full'><StyledText style={{color: 'gray'}}>{ newHide ? t('input.option.show') : t('input.option.hide') }</StyledText></Pressable>
                    { !pValid.valid && pass.length !== 0 && pValid.messages.map((msg, i) => (
                        <StyledText key={i} className='text-[#f2545b] mt-2'>{msg}</StyledText>))
                    }
                    <View className='flex-row items-center border-b-2 border-b-[gray]'>
                        <MaterialIcons name="lock-outline" size={40} color={repass.length === 0 ? 'gray' : repass === pass ? 'gray': '#f2545b'} />
                        <StyledTextInput placeholderTextColor="gray" placeholder={t('input.rePass')} className='text-black dark:text-white ml-1 w-[80%] text-3xl' onChangeText={setRepass} secureTextEntry={newReHide} autoCapitalize="none" autoCorrect={false} multiline={false} numberOfLines={1}/>
                    </View>
                    <Pressable onPress={() => setNewReHide(v => !v)} className='items-end px-3 w-full'><StyledText style={{color: 'gray'}}>{ newReHide ? t('input.option.show') : t('input.option.hide') }</StyledText></Pressable>
                    { repass !== pass && repass.length !== 0 && (
                                    <StyledText className='text-[#f2545b] mt-2'>{t('input.error.samePass')}</StyledText>
                    )}
                </View>
                <Pressable onPress={() => fReset(curr, pass)} className='shadow-md dark:bg-[#1e3773] bg-[#4974d7] w-[80%] p-5 mt-5 rounded-[50px] active:opacity-80' disabled={ !(pValid.valid && pass === repass) }>
                    <StyledText className='text-2xl self-center text-white' >{t('input.button.changePass')}</StyledText>
                </Pressable>
            </ScrollView>
        </View>
    );
}

export default changePassword;