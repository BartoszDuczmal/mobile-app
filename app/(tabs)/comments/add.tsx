import { useModal } from "@/providers/ModalContext";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";

const add = () => {
    const { t } = useTranslation()

    const { openModal } = useModal()

    const screenSize = useWindowDimensions();

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')

    return (
        <View style={css.container}>
            <TextInput placeholder="Zawartość" placeholderTextColor="gray" onChangeText={setDesc} style={css.description} multiline={true} numberOfLines={7} textAlignVertical="top" />
            <Pressable>
                {({ pressed }) => (
                <Text style={[ css.button, { color: pressed ? 'blue' : 'gray' } ]}>Anuluj</Text>
                )}
            </Pressable>
            <Pressable>
                {({ pressed }) => (
                <Text style={[ css.button, { color: pressed ? 'blue' : 'gray' } ]}>Dodaj komentarz</Text>
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
        color: 'black',
    },
    description: {
        width: '70%',
        fontSize: 25,
        justifyContent: 'flex-start',
        color: 'black',
    },
    button: {
        marginTop: 20,
        fontSize: 20,
    }
})

export default add;