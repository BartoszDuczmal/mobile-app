import { API_URL } from "@/providers/config";
import { useModal } from "@/providers/ModalContext";
import emailValid from "@/utils/validation/email";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const handleRecovery = async (email: string, openModal: ({type, title, msg}: { type: string, title: string, msg: string }) => void) => {
    try {
        const res = await axios.post(`${API_URL}/auth/recovery`, { email: email })
        openModal({ type: 'info', title: 'Wysłano link odzyskujący.', msg: 'Jeśli podany email istnieje w naszej bazie danych to został na niego wysłany link odzyskujący.\n\nLink jest aktywny przez 15 minut.' })
    }
    catch(err: any) {
        const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'Wystąpił nieznany błąd serwera.'
        openModal({ type: "error", title: 'Nie udało się zarejestrować.', msg: errMsg })
    }
}

const recovery = () => {

    const { openModal } = useModal()

    const [email, setEmail] = useState<string>('')

    const eValid = emailValid(email)

    return (
        <View style={css.container}>
            <View style={[css.inputBox, {borderBottomColor: eValid ? 'gray' : email.length === 0 ? 'gray' : '#f2545b'}]}>
                <MaterialIcons name="alternate-email" size={40} color={eValid ? 'gray' : email.length === 0 ? 'gray' : '#f2545b'} />
                <TextInput placeholderTextColor="gray" placeholder="email" style={css.input} onChangeText={setEmail}/>
            </View>
            { !eValid && email.length !== 0 && (
                <Text style={css.errMsg}>Niepoprawny format emaila.</Text>
            )}
            <View style={css.helpBox}>
                <Text style={{ color: 'gray', textAlign: 'center' }}>Po kliknięciu przycisku poniżej wyślemy na podany email link odzyskujący</Text>
            </View>
            <Pressable onPress={() => handleRecovery(email, openModal)} disabled={!eValid}>
                {({ pressed }) => (
                <Text style={{ 
                    fontSize: 20, 
                    color: pressed ? 'blue' : 'black' , 
                    opacity: !eValid ? 0.5 : 1
                }}>Wyślij</Text>
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
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
        width: '60%',
    },
    errMsg: {
        color: '#f2545b', 
        marginTop: 10,
    },
})

export default recovery;