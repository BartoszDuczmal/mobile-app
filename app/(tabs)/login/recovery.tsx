import { StyledText, StyledTextInput } from '@/components/StyledComponents';
import '@/locales/config';
import { useModal } from "@/providers/ModalProvider";
import { api } from "@/services/api";
import emailValid from "@/utils/validation/email";
import { MaterialIcons } from "@expo/vector-icons";
import { useHeaderHeight } from '@react-navigation/elements';
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, useWindowDimensions, View } from "react-native";

const handleRecovery = async (email: string, openModal: ({type, title, msg}: { type: string, title: string, msg: string }) => void, t: any) => {
    try {
        const res = await api.post(`/auth/recovery`, { email })
        openModal({ type: 'info', title: t('auth.recovery.scs.title'), msg: t('auth.recovery.scs.msg') })
    }
    catch(err: any) {
        const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
        openModal({ type: "error", title: t('common.err'), msg: t(errMsg) })
    }
}

const recovery = () => {
    const headerHeight = useHeaderHeight()
    const screenHeight = useWindowDimensions().height;

    const { t } = useTranslation()

    const { openModal, bottomBarHeight } = useModal()

    const [email, setEmail] = useState<string>('')

    const eValid = emailValid(email)

    return (
        <View className='w-full flex-1'>
            <ScrollView contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: bottomBarHeight }} contentContainerClassName='w-full items-center'>
                <View className='bg-white items-center rounded-[30px] w-[80%] p-10 dark:bg-[#171a1c] shadow-md' style={{ marginTop: (screenHeight / 10) }} >
                    <View style={{borderBottomColor: eValid ? 'gray' : email.length === 0 ? 'gray' : '#f2545b'}} className='flex-row items-center border-b-2 border-b-gray'>
                        <MaterialIcons name="alternate-email" size={40} color={eValid ? 'gray' : email.length === 0 ? 'gray' : '#f2545b'} />
                        <StyledTextInput placeholderTextColor="gray" placeholder={t('input.email')} className='text-black dark:text-white ml-1 w-[80%] text-3xl' onChangeText={setEmail}/>
                    </View>
                    { !eValid && email.length !== 0 && (
                        <StyledText className='text-[#f2545b] mt-2'>{t('input.error.emailFormat')}</StyledText>
                    )}
                    <View className='flex-row items-center my-3'>
                        <StyledText style={{ color: 'gray', textAlign: 'center' }}>{t('auth.recovery.infoMsg')}</StyledText>
                    </View>
                </View>
                <Pressable onPress={() => handleRecovery(email, openModal, t)} disabled={!eValid} className='shadow-md dark:bg-[#1e3773] bg-[#4974d7] w-[80%] p-5 mt-5 rounded-[50px] active:opacity-80'>
                    <StyledText className='text-2xl self-center text-white'>{t('input.button.recovery')}</StyledText>
                </Pressable>
            </ScrollView>
        </View>
    );

}

export default recovery;