import { checkAuth } from "@/utils/checkAuth";
import { Feather, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MiniComment = ({id, content, date, author}: {id: number, content: string, date: string, author: string}) => {
    const { t, i18n } = useTranslation()

    const formattedDate = new Date(date).toLocaleDateString(i18n.language, {
        timeZone: 'Europe/Warsaw',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

    const user = checkAuth()

    return (
        <View style={css.commentBox}>
            <Text style={{color: '#9a9a9a', fontSize: 12, marginLeft: 35, marginBottom: -5, marginTop: 5}}>{formattedDate}</Text>
            <View style={css.commentHeader}>
                <Feather name="corner-down-right" size={24} color="#5c5c5c" />
                <Text style={{color: '#5c5c5c'}}>komentarz użytkownika {author}:</Text>
            </View>
            <Text style={{color: '#5c5c5c', fontSize: 15, marginLeft: 35}}>{content}</Text>
            <View style={css.commentFooter}>
                <TouchableOpacity style={{flexDirection: 'row', gap: 3}}>
                    <MaterialCommunityIcons name="heart-outline" size={20} color="#5c5c5c"/>
                </TouchableOpacity>
                <Text style={{color: '#5c5c5c'}}>67</Text>
                <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center', marginLeft: 5}} onPress={() => {}}>
                    <FontAwesome6 name='trash-can' size={16} color='#5c5c5c'/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const css = StyleSheet.create({
    commentBox: {
        marginHorizontal: 10,
        marginBottom: 20,
    },
    commentHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        gap: 5,
    },
    commentFooter: {
        display: 'flex',
        flexDirection: 'row',
        gap: 3,
        justifyContent: 'flex-end',
        alignItems: 'center'
    }
})

export default MiniComment;