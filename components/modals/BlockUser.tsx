import { API_URL } from "@/config.js";
import axios from "axios";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const blockUser = async (id: number, openModal: ({type, title, msg}: { type: string, title: string, msg: string }) => void) => {
        try {
            await axios.post(`${API_URL}:3001/admin/block`, { id: id }, { withCredentials: true })
            openModal({ type: "info", title: 'Pomyślnie zablokowano użytkownika.', msg: 'Od teraz użytkownik nie będzie mógł wchodzić w żadne interakcje.' })
        }
        catch(err: any) {
            const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'Wystąpił nieznany błąd serwera.'
            openModal({ type: "error", title: 'Nie udało się zablokować użytkownika.', msg: errMsg })
        }
    }

const BlockUser = ({ refresh } : { refresh: number }) => {

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
                    <Text style={{fontSize: 18, textAlign: 'center'}}>Czy napewno chcesz zablokować tego użytkownika?</Text>
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
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        borderColor: 'black',
        borderWidth: 1,
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
        gap: 80,
    },
})

export default Account;