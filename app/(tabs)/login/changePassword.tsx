import '@/locales/config';
import { API_URL } from "@/providers/config";
import { useModal } from "@/providers/ModalContext";
import passValid from "@/utils/validation/pass";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const fReset = async (curr: string, pass: string, openModal: ({type, title, msg}: { type: string, title: string, msg: string }) => void, t: any) => {
    try {
        await axios.post(`${API_URL}/auth/resetPass`, { curr: curr, pass: pass }, { withCredentials: true });
        openModal({ type: 'info', title: t('auth.passReset.scs.title'), msg: t('auth.passReset.scs.msg') })
    }
    catch(err: any) {
        const errMsg = err.response?.data?.error || 'common.internalErr'
        openModal({ type: "error", title: t('auth.passReset.err.title'), msg: t(errMsg) })
    }
}

const changePassword = () => {
    const { t } = useTranslation()

    const { openModal } = useModal()

    const [curr, setCurr] = useState('')
    const [pass, setPass] = useState('')
    const [repass, setRepass] = useState('')

    const [hide, setHide] = useState(true)
    const [newHide, setNewHide] = useState(true)
    const [newReHide, setNewReHide] = useState(true)

    const pValid = passValid(pass)

    return (
        <View style={css.container}>
            <View style={[css.inputBox, {
                marginTop: 20, 
                borderBottomColor: 'gray'
            }]}>
                <MaterialIcons name="lock-open" size={40} color='gray'/>
                <TextInput placeholderTextColor="gray" placeholder={t('input.currPass')} style={css.input} onChangeText={setCurr} secureTextEntry={hide} autoCapitalize="none" autoCorrect={false} />
            </View>
            <Pressable onPress={() => setHide(v => !v)} style={{width: '60%', alignItems: 'flex-end', paddingHorizontal: 10}}><Text style={{color: 'gray'}}>{ hide ? t('input.option.show') : t('input.option.hide') }</Text></Pressable>
            <View style={[css.inputBox, {
                marginTop: 20, 
                borderBottomColor: pass.length === 0 ? 'gray' : pValid.valid ? 'gray': '#f2545b'
            }]}>
                <MaterialIcons name="lock-outline" size={40} color={pass.length === 0 ? 'gray' : pValid.valid ? 'gray': '#f2545b'} />
                <TextInput placeholderTextColor="gray" placeholder={t('input.pass')} style={css.input} onChangeText={setPass} secureTextEntry={newHide} autoCapitalize="none" autoCorrect={false} />
            </View>
            <Pressable onPress={() => setNewHide(v => !v)} style={{width: '60%', alignItems: 'flex-end', paddingHorizontal: 10}}><Text style={{color: 'gray'}}>{ newHide ? t('input.option.show') : t('input.option.hide') }</Text></Pressable>
            { !pValid.valid && pass.length !== 0 && pValid.messages.map((msg, i) => (
                <Text key={i} style={css.errMsg}>{msg}</Text>))
            }
            <View style={[css.inputBox, {
                marginTop: 20, 
                 borderBottomColor: repass.length === 0 ? 'gray' : repass === pass ? 'gray': '#f2545b'
            }]}>
                <MaterialIcons name="lock-outline" size={40} color={repass.length === 0 ? 'gray' : repass === pass ? 'gray': '#f2545b'} />
                <TextInput placeholderTextColor="gray" placeholder={t('input.rePass')} style={css.input} onChangeText={setRepass} secureTextEntry={newReHide} autoCapitalize="none" autoCorrect={false} />
            </View>
            <Pressable onPress={() => setNewReHide(v => !v)} style={{width: '60%', alignItems: 'flex-end', paddingHorizontal: 10}}><Text style={{color: 'gray'}}>{ newReHide ? t('input.option.show') : t('input.option.hide') }</Text></Pressable>
            { repass !== pass && repass.length !== 0 && (
                            <Text style={css.errMsg}>{t('input.error.samePass')}</Text>
            )}
            <Pressable onPress={() => fReset(curr, pass, openModal, t)} style={[css.button, {opacity: !(pValid.valid && pass === repass) ? 0.5 : 1}]} disabled={ !(pValid.valid && pass === repass) }>
                {({ pressed }) => (
                <Text style={{ fontSize: 20, color: pressed ? 'blue' : 'black' }}>{t('input.button.changePass')}</Text>
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
    button: {
        marginTop: 15,
    },
    errMsg: {
        color: '#f2545b', 
        marginTop: 10,
    },
})

export default changePassword;