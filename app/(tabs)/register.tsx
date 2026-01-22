import { API_URL } from "@/config.js";
import { useModal } from "@/providers/ModalContext";
import emailValid from "@/utils/validation/email";
import nameValid from "@/utils/validation/name";
import passValid from "@/utils/validation/pass";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const fRegister = async (name: string, email: string, pass: string, openModal: ({type, title, msg}: { type: string, title: string, msg: string }) => void) => {
    try {
        const res = await axios.post(`${API_URL}/auth/register`, { name: name, email: email, pass: pass });
        openModal({ type: 'info', title: 'Pomyślnie udało się zarejestrować!', msg: 'Teraz możesz zalogować się na swoje konto.' })
    }
    catch(err: any) {
        const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'Wystąpił nieznany błąd serwera.'
        openModal({ type: "error", title: 'Nie udało się zarejestrować.', msg: errMsg, })
    }
}

const register = () => {
    const { openModal } = useModal()

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
        <View style={css.container}>
            <View style={[css.inputBox, {
                borderBottomColor: name.length === 0 ? 'gray' : nValid.valid ? 'gray': '#f2545b' 
            }]}>
                <MaterialIcons name="person-outline" size={40} color={name.length === 0 ? 'gray' : nValid.valid ? 'gray': '#f2545b'} />
                <TextInput placeholder="nazwa użytkownika" style={css.input} onChangeText={setName}/>
            </View>
            { !nValid.valid && name.length !== 0 && nValid.messages.map((msg, i) => (
                <Text style={css.errMsg} key={i}>{msg}</Text>
            ))}
            <View style={[css.inputBox, {
                marginTop: 20, 
                borderBottomColor: email.length === 0 ? 'gray' : eValid ? 'gray': '#f2545b' 
            }]}>
                <MaterialIcons name="alternate-email" size={40} color={email.length === 0 ? 'gray' : eValid ? 'gray': '#f2545b'} />
                <TextInput placeholder="email" style={css.input} onChangeText={setEmail} />
            </View>
            { !eValid && email.length !== 0 && (
                <Text style={css.errMsg}>Niepoprawny format emaila.</Text>
            )}
            <View style={[css.inputBox, {
                marginTop: 20, 
                borderBottomColor: pass.length === 0 ? 'gray' : pValid.valid ? 'gray': '#f2545b'
            }]}>
                <MaterialIcons name="lock-outline" size={40} color={pass.length === 0 ? 'gray' : pValid.valid ? 'gray': '#f2545b'} />
                <TextInput placeholder="hasło" style={css.input} onChangeText={setPass} secureTextEntry={hide} autoCapitalize="none" autoCorrect={false} />
            </View>
            <Pressable onPress={() => setHide(v => !v)} style={{width: '60%', alignItems: 'flex-end', paddingHorizontal: 10}}><Text style={{color: 'gray'}}>{ hide ? 'pokaż' : 'ukryj' }</Text></Pressable>
            { !pValid.valid && pass.length !== 0 && pValid.messages.map((msg, i) => (
                <Text key={i} style={css.errMsg}>{msg}</Text>))
            }
            <View style={[css.inputBox, {
                marginTop: 20, 
                borderBottomColor: repass.length === 0 ? 'gray' : repass === pass ? 'gray': '#f2545b'
            }]}>
                <MaterialIcons name="lock-outline" size={40} color={repass.length === 0 ? 'gray' : repass === pass ? 'gray': '#f2545b'} />
                <TextInput placeholder="powtórz hasło" style={css.input} onChangeText={setRepass} secureTextEntry={reHide} autoCapitalize="none" autoCorrect={false} />
            </View>
            <Pressable onPress={() => setReHide(v => !v)} style={{width: '60%', alignItems: 'flex-end', paddingHorizontal: 10}}><Text style={{color: 'gray'}}>{ reHide ? 'pokaż' : 'ukryj' }</Text></Pressable>
            { repass !== pass && repass.length !== 0 && (
                <Text style={css.errMsg}>Hasła muszą być takie same.</Text>
            )}
            <View style={css.helpBox}>
                <Pressable onPress={() => router.push('/login')}>
                    {({ pressed }) => (
                    <Text style={{ fontSize: 15, color: pressed ? 'blue' : 'gray' }}>Masz już konto?</Text>
                    )}
                </Pressable>
            </View>
            <Pressable onPress={() => fRegister(name, email, pass, openModal)} disabled={ !(pValid.valid && pass === repass && eValid && nValid.valid) }>
                {({ pressed }) => (
                <Text style={{ 
                    fontSize: 20, 
                    color: pressed ? 'blue' : 'black', 
                    opacity: !(pValid.valid && pass === repass && eValid && nValid.valid) ? 0.5 : 1
                }}>Zarejestruj</Text>
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
    errMsg: {
        color: '#f2545b', 
        marginTop: 10,
    }
})

export default register;