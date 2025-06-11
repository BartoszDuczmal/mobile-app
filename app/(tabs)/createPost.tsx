import axios from "axios";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";

const addPost = async (title: string, desc: string) => {
  try {
    const res = await axios.post('http://192.168.1.151:3001/posts', { title: title, desc: desc });
    alert('Pomyślnie opublikowano!')
  } catch (err) {
    alert('Nie udało się opublikować!\nError: ' + err)
  }
};

const createPost = () => {
    const [press, setPress] = useState(false)

    const screenSize = useWindowDimensions();

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')

    return (
        <View style={css.container}>
            <TextInput placeholder="Tytuł" onChangeText={setTitle} style={css.title}/>
            <TextInput placeholder="Opis" onChangeText={setDesc} style={[css.description, {height: (screenSize.height > screenSize.width) ? 225 : 85 }]} multiline={true} textAlignVertical="top"/>
            <Pressable onPress={() => addPost(title, desc)}>
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
    },
    description: {
        width: '70%',
        fontSize: 25,
    },
    button: {
        marginTop: 20,
        fontSize: 20,
    }
})

export default createPost;