import { API_URL } from "@/config.js";
import { useModal } from "@/providers/ModalContext";
import passValid from "@/utils/validation/pass";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const fReset = async (curr: string, pass: string, openModal: ({type, title, msg}: { type: string, title: string, msg: string }) => void) => {
    try {
        await axios.post(`${API_URL}/auth/resetPass`, { curr: curr, pass: pass }, { withCredentials: true });
        openModal({ type: 'info', title: 'Pomyślnie zmienono hasło.', msg: 'Hasło zostało pomyślnie zmienione.' })
    }
    catch(err: any) {
        const msg = err.response?.data?.error || 'Wystąpił wewnętrzny błąd serwera.'
        openModal({ type: "error", title: 'Nie udało się zmienić hasła.', msg })
    }
}

const changePassword = () => {
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
                <TextInput placeholder="aktualne hasło" style={css.input} onChangeText={setCurr} secureTextEntry={hide} autoCapitalize="none" autoCorrect={false} />
            </View>
            <Pressable onPress={() => setHide(v => !v)} style={{width: '60%', alignItems: 'flex-end', paddingHorizontal: 10}}><Text style={{color: 'gray'}}>{ hide ? 'pokaż' : 'ukryj' }</Text></Pressable>
            <View style={[css.inputBox, {
                marginTop: 20, 
                borderBottomColor: pass.length === 0 ? 'gray' : pValid.valid ? 'gray': '#f2545b'
            }]}>
                <MaterialIcons name="lock-outline" size={40} color={pass.length === 0 ? 'gray' : pValid.valid ? 'gray': '#f2545b'} />
                <TextInput placeholder="nowe hasło" style={css.input} onChangeText={setPass} secureTextEntry={newHide} autoCapitalize="none" autoCorrect={false} />
            </View>
            <Pressable onPress={() => setNewHide(v => !v)} style={{width: '60%', alignItems: 'flex-end', paddingHorizontal: 10}}><Text style={{color: 'gray'}}>{ newHide ? 'pokaż' : 'ukryj' }</Text></Pressable>
            { !pValid.valid && pass.length !== 0 && pValid.messages.map((msg, i) => (
                <Text key={i} style={css.errMsg}>{msg}</Text>))
            }
            <View style={[css.inputBox, {
                marginTop: 20, 
                 borderBottomColor: repass.length === 0 ? 'gray' : repass === pass ? 'gray': '#f2545b'
            }]}>
                <MaterialIcons name="lock-outline" size={40} color={repass.length === 0 ? 'gray' : repass === pass ? 'gray': '#f2545b'} />
                <TextInput placeholder="powtórz hasło" style={css.input} onChangeText={setRepass} secureTextEntry={newReHide} autoCapitalize="none" autoCorrect={false} />
            </View>
            <Pressable onPress={() => setNewReHide(v => !v)} style={{width: '60%', alignItems: 'flex-end', paddingHorizontal: 10}}><Text style={{color: 'gray'}}>{ newReHide ? 'pokaż' : 'ukryj' }</Text></Pressable>
            { repass !== pass && repass.length !== 0 && (
                            <Text style={css.errMsg}>Hasła muszą być takie same.</Text>
            )}
            <Pressable onPress={() => fReset(curr, pass, openModal)} style={[css.button, {opacity: !(pValid.valid && pass === repass) ? 0.5 : 1}]} disabled={ !(pValid.valid && pass === repass) }>
                {({ pressed }) => (
                <Text style={{ fontSize: 20, color: pressed ? 'blue' : 'black' }}>Zmień hasło</Text>
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