import { API_URL } from "@/providers/config";
import { useModal } from "@/providers/ModalContext";
import axios from "axios";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";

const addPost = async (title: string, desc: string, openModal: ({type, title, msg}: {type: string, title: string, msg: string }) => void) => {
  try {
    const res = await axios.post(`${API_URL}/posts/create`, { title: title, desc: desc }, { withCredentials: true });
    openModal({ type: 'info', title: 'Pomyślnie opublikowano wpis.', msg: '' })
  }
  catch(err: any) {
    const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'Wystąpił nieznany błąd serwera.'
    openModal({ type: "error", title: 'Nie udało się opublikować wpisu.', msg: errMsg })
  }
}

const createPost = () => {
    const { openModal } = useModal()

    const screenSize = useWindowDimensions();

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')

    return (
        <View style={css.container}>
            <TextInput placeholder="Tytuł" onChangeText={setTitle} style={css.title}/>
            <TextInput placeholder="Opis" onChangeText={setDesc} style={css.description} multiline={true} numberOfLines={7} textAlignVertical="top" />
            <Pressable onPress={() => addPost(title, desc, openModal)}>
                {({ pressed }) => (
                <Text style={[ css.button, { color: pressed ? 'blue' : 'gray' } ]}>Opublikuj</Text>
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
    title: {
        width: '70%',
        fontSize: 35,
        borderBottomColor: 'gray',
        borderBottomWidth: 2,
        justifyContent: 'flex-start',
    },
    description: {
        width: '70%',
        fontSize: 25,
        justifyContent: 'flex-start',
    },
    button: {
        marginTop: 20,
        fontSize: 20,
    }
})

export default createPost;