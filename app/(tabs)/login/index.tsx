import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const fLogin = async (email: string, pass: string) => {
    try {
        const res = await axios.post('http://192.168.1.151:3001/auth/login', { email: email, pass: pass });
        alert('Pomyślnie się zalogowano!')
    }
    catch(err) {
        alert('Nie udało się zalogować!\nError: ' + err)
    }
}

const index = () => {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')

    return (
        <View style={css.container}>
            <View style={css.inputBox}>
                <MaterialIcons name="alternate-email" size={40} color={'gray'} />
                <TextInput placeholder="email" style={css.input} onChangeText={setEmail}/>
            </View>
            <View style={[css.inputBox, {marginTop: 20}]}>
                <MaterialIcons name="lock-open" size={40} color={'gray'} />
                <TextInput placeholder="hasło" style={css.input} onChangeText={setPass}/>
            </View>
            <View style={css.helpBox}>
                <Pressable onPress={() => router.push('/register')}>
                    {({ pressed }) => (
                    <Text style={{ fontSize: 15, color: pressed ? 'blue' : 'gray' }}>Nie masz konta?</Text>
                    )}
                </Pressable>
                <Text style={{ fontSize: 20, marginHorizontal: 5, color: 'gray' }}>/</Text>
                <Pressable onPress={() => router.push('/login/recovery')}>
                    {({ pressed }) => (
                    <Text style={{ fontSize: 15, color: pressed ? 'blue' : 'gray' }}>Zapomniałeś hasła?</Text>
                    )}
                </Pressable>
            </View>
            <Pressable onPress={() => fLogin(email, pass)}>
                {({ pressed }) => (
                <Text style={{ fontSize: 20, color: pressed ? 'blue' : 'black' }}>Zaloguj</Text>
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
})

export default index;