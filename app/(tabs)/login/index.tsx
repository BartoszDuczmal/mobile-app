import '@/locales/config';
import { API_URL } from "@/providers/config";
import { useModal } from "@/providers/ModalContext";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const fLogin = async (login: string, pass: string, openModal: ({type, title, msg}: { type: string, title: string, msg: string }) => void, t: any) => {
    try {
        const res = await axios.post(`${API_URL}/auth/login`, { login: login, pass: pass });
        openModal({ type: 'info', title: t('auth.login.scs.title'), msg: '' })
        router.push('/posts')
    }
    catch(err: any) {
        const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
        openModal({ type: "error", title: t('auth.login.err.title'), msg: t(errMsg) })
    }
}

const index = () => {
    const { t } = useTranslation()

    const { openModal } = useModal()

    const [login, setLogin] = useState('')
    const [pass, setPass] = useState('')
    const [hide, setHide] = useState(true)

    return (
        <View style={css.container}>
            <View style={css.inputBox}>
                <MaterialIcons name="alternate-email" size={40} color={'gray'} />
                <TextInput placeholderTextColor="gray" placeholder={t('input.login')} style={css.input} onChangeText={setLogin}/>
            </View>
            <View style={[css.inputBox, {marginTop: 20}]}>
                <MaterialIcons name="lock-open" size={40} color={'gray'} />
                <TextInput placeholderTextColor="gray" placeholder={t('input.pass')} style={css.input} onChangeText={setPass} secureTextEntry={hide} autoCapitalize="none" autoCorrect={false} />
            </View>
            <Pressable onPress={() => setHide(v => !v)} style={{width: '60%', alignItems: 'flex-end', paddingHorizontal: 10}}><Text style={{color: 'gray'}}>{ hide ? t('input.option.show') : t('input.option.hide') }</Text></Pressable>
            <View style={css.helpBox}>
                <Pressable onPress={() => router.push('/register')}>
                    {({ pressed }) => (
                    <Text style={{ fontSize: 15, color: pressed ? 'blue' : 'gray' }}>{t('auth.login.noAccount')}</Text>
                    )}
                </Pressable>
                <Text style={{ fontSize: 20, marginHorizontal: 5, color: 'gray' }}>/</Text>
                <Pressable onPress={() => router.push('/login/recovery')}>
                    {({ pressed }) => (
                    <Text style={{ fontSize: 15, color: pressed ? 'blue' : 'gray' }}>{t('auth.login.forgetPass')}</Text>
                    )}
                </Pressable>
            </View>
            <Pressable onPress={() => fLogin(login, pass, openModal, t)} disabled={login.length === 0 || pass.length === 0}>
                {({ pressed }) => (
                <Text style={{ 
                    fontSize: 20, 
                    color: pressed ? 'blue' : 'black' , 
                    opacity: (login.length === 0 || pass.length === 0) ? 0.5 : 1
                }}>{t('input.button.login')}</Text>
                )}
            </Pressable>
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
    errMsg: {
        color: '#f2545b', 
        marginTop: 10,
    },
})

export default index;