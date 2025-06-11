import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, Text, View } from "react-native";

const ViewPost = () => {
    return (
        <View style={css.container}>
            <View style={css.title}>
                <Text style={{ fontSize: 35 }} numberOfLines={3}>Lorem ipsum dolor...</Text>
            </View>
            <Text style={{fontSize: 20}}>Lorem ipsum dolor...</Text>
            <View style={css.footerBox}>
                <AntDesign name='hearto' style={{ zIndex: 10 }} size={24} color='gray'/>
                <Text style={{ color: 'gray', fontSize: 18 }}>100</Text>
            </View>
        </View>
    );
}

const css = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        padding: 30,
    },
    box: {
        display: 'flex',
        flex: 1,
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 30,
        padding: 20,
    },
    title: {
        width: '100%',
        paddingBottom: 15,
        marginBottom: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 2,
        alignItems: 'center',
    },
    footerBox: {
        justifyContent: 'flex-end',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 5,
        gap: 7,
    },
})

export default ViewPost;