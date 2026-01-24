import { API_URL } from "@/providers/config";
import { useModal } from "@/providers/ModalContext";
import passValid from "@/utils/validation/pass";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const fReset = async (token: string, pass: string, openModal: ({type, title, msg}: { type: string, title: string, msg: string }) => void) => {
    try {
        await axios.post(`${API_URL}/auth/resetPass`, { token: token, pass: pass });
        openModal({ type: 'info', title: 'Pomyślnie zresetowano hasło.', msg: 'Teraz możesz zalogować się na swoje konto.' })
        router.push('/(tabs)/profile/')
    }
    catch(err: any) {
        openModal({ type: "error", title: 'Nie udało się zresetować hasła.', msg: 'Wystąpił wewnętrzny błąd serwera.'})
    }
}

const resetPassword = () => {
    const { openModal } = useModal()

    const [pass, setPass] = useState('')

    const [repass, setRepass] = useState('')

    const { token } = useLocalSearchParams<{ token?: string }>()

    if(!token) return;

    const pValid = passValid(pass)

    return (
        <View style={css.container}>
            <View style={[css.inputBox, {
                marginTop: 20, 
                borderBottomColor: pass.length === 0 ? 'gray' : pValid.valid ? 'gray': '#f2545b'
            }]}>
                <MaterialIcons name="lock-outline" size={40} color={pass.length === 0 ? 'gray' : pValid.valid ? 'gray': '#f2545b'} />
                <TextInput placeholderTextColor="gray" placeholder="hasło" style={css.input} onChangeText={setPass} secureTextEntry={true} autoCapitalize="none" autoCorrect={false} />
            </View>
            { !pValid.valid && pass.length !== 0 && pValid.messages.map((msg, i) => (
                <Text key={i} style={css.errMsg}>{msg}</Text>))
            }
            <View style={[css.inputBox, {
                marginTop: 20, 
                 borderBottomColor: repass.length === 0 ? 'gray' : repass === pass ? 'gray': '#f2545b'
            }]}>
                <MaterialIcons name="lock-outline" size={40} color={repass.length === 0 ? 'gray' : repass === pass ? 'gray': '#f2545b'} />
                <TextInput placeholderTextColor="gray" placeholder="powtórz hasło" style={css.input} onChangeText={setRepass} secureTextEntry={true} autoCapitalize="none" autoCorrect={false} />
            </View>
            { repass !== pass && repass.length !== 0 && (
                            <Text style={css.errMsg}>Hasła muszą być takie same.</Text>
            )}
            <Pressable onPress={() => fReset(token, pass, openModal)} style={[css.button, {opacity: !(pValid.valid && pass === repass) ? 0.5 : 1}]} disabled={ !(pValid.valid && pass === repass) }>
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