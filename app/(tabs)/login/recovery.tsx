import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const handleRecovery = async (email: string) => {
    try {
        const res = await axios.post('http://192.168.1.151:3001/auth/recovery', { email: email })
        Alert.alert('Wysłano link odzyskujący.', 'Jeśli podany email istnieje w naszej bazie danych to został na niego wysłany link odzyskujący.\n\nLink jest aktywny przez 15 minut.', [
            {
                text: 'OK',
            }
        ])
        // Tylko do testów - przy buildzie dodać przekierowanie z myapp://
        router.push({
            pathname: '/login/resetPassword',
            params: { token: res.data.token }
        });
    }
    catch(err: any) {
        const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'Wystąpił nieznany błąd serwera.'
        Alert.alert('Przepraszamy, ale wystąpił błąd.', errMsg, [
            {
                text: 'OK',
            }
        ])
    }
}

const recovery = () => {
    const [email, setEmail] = useState<string>('')

    return (
        <View style={css.container}>
            <View style={css.inputBox}>
                <MaterialIcons name="alternate-email" size={40} color={'gray'} />
                <TextInput placeholder="email" style={css.input} onChangeText={setEmail}/>
            </View>
            <View style={css.helpBox}>
                <Text style={{ color: 'gray', textAlign: 'center' }}>Po kliknięciu przycisku poniżej wyślemy na podany email link odzyskujący</Text>
            </View>
            <Pressable onPress={() => handleRecovery(email)}>
                {({ pressed }) => (
                <Text style={{ fontSize: 20, color: pressed ? 'blue' : 'black' }}>Wyślij</Text>
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
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
        width: '60%',
    },
})

export default recovery;