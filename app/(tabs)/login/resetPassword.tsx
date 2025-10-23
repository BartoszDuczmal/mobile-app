import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const fReset = async (token: string, pass: string) => {
    try {
        const res = await axios.post('http://192.168.1.151:3001/auth/resetPass', { token: token, pass: pass });
        Alert.alert('Pomyślnie zresetowano hasło.', 'Teraz możesz zalogować się na swoje konto.', [
            {
                text: 'OK',
            }
        ])
    }
    catch(err: any) {
        Alert.alert('Przepraszamy, ale nie udało się zresetować hasła.', 'Wystąpił wewnętrzny błąd serwera.', [
            {
                text: 'OK',
            }
        ])
    }
}

const resetPassword = () => {
    const [pass, setPass] = useState('')
    const { token } = useLocalSearchParams<{ token?: string }>()
    if(!token) return;

    return (
        <View style={css.container}>
            <View style={[css.inputBox, {marginTop: 20}]}>
                <MaterialIcons name="lock-outline" size={40} color={'gray'} />
                <TextInput placeholder="hasło" style={css.input} onChangeText={setPass} />
            </View>
            <View style={[css.inputBox, {marginTop: 20}]}>
                <MaterialIcons name="lock-outline" size={40} color={'gray'} />
                <TextInput placeholder="powtórz hasło" style={css.input} />
            </View>
            <Pressable onPress={() => fReset(token, pass)} style={css.button}>
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
})

export default resetPassword;