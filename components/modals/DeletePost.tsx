import { API_URL } from "@/config.js";
import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const remove = async (id: number) => {
    try {
        const res = await axios.delete(`${API_URL}:3001/posts/${id}/remove`, { withCredentials: true });
        router.replace('/(tabs)/posts')
        alert('Pomyślnie usunięto!')
    } catch(err: any) {
        alert('Nie udało się usunąć!')
    }
}

const DeletePost = ({ refresh, id }: { refresh: number, id: number }) => {
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
                            <Text style={{fontSize: 18, textAlign: 'center'}}>Czy napewno chcesz usunąć ten post?</Text>
                            <View style={css.buttonsView}>
                                <TouchableOpacity onPress={async () => {
                                    await remove(id)
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

export default DeletePost;