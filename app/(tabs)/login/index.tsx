import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const index = () => {
    return (
        <View style={css.container}>
            <View style={css.inputBox}>
                <MaterialIcons name="alternate-email" size={40} color={'gray'} />
                <TextInput placeholder="email" style={css.input} />
            </View>
            <View style={[css.inputBox, {marginTop: 20}]}>
                <MaterialIcons name="lock-open" size={40} color={'gray'} />
                <TextInput placeholder="hasło" style={css.input} />
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
            <Pressable>
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