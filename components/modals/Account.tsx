import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const logout = async () => {
    try {
        const res = await axios.post('http://192.168.1.151:3001/auth/logout', {}, { withCredentials: true });
        router.replace('/(tabs)/posts')
    }
    catch(err) {
        alert('Nie udało się wylogować!\nError: ' + err)
    }
}

const Account = ({ refresh }) => {

    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (refresh > 0) {
            setVisible(true);
        }
    }, [refresh]);

    return (
        <Modal animationType="slide" visible={visible} transparent={true}>
            <View style={css.centeredView}>
                <View style={css.modalView}>
                    <Text style={{fontSize: 18}}>Czy chcesz się wylogować?</Text>
                    <View style={css.buttonsView}>
                        <TouchableOpacity onPress={async () => {
                            await logout()
                            setVisible(!visible)
                            }}><Text>Tak</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => setVisible(!visible)}><Text>Nie</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const css = StyleSheet.create({
    centeredView: {
       display: 'flex',
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center',
    },
    modalView: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonsView: {
        marginVertical: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30'
    },
})

export default Account;