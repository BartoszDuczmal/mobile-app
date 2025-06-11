import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { useState } from 'react';
import { StyleSheet, Text, View } from "react-native";

const ViewPost = (props: any) => {
    const [likes, setLikes] = useState(props.likes)

    // Dodac automatyczne wczytywanie czy post jest polubiony
    const [isLike, setIsLike] = useState(false)

    const handleLike = async (id: number) => {
        try {
            const res = await axios.post(`http://192.168.1.151:3001/posts/${id}/likes`, { id: id });
            setLikes((prev: number) => prev + 1)
            return true
        } catch (err) {
            alert('Nie udało się polubić!\nError: ' + err)
            return false
        }
    }

    return (
        <View style={css.box}>
            <View style={css.contentBox}>
                <Text style={css.title} numberOfLines={1} ellipsizeMode="tail">{props.title}</Text>
                <Text numberOfLines={4} ellipsizeMode="tail">{props.desc}</Text>
            </View>
            <View style={css.footerBox}>
                <AntDesign name={isLike ? 'heart' : 'hearto'} size={24} color={isLike ? '#ec5353' : 'gray'} onPress={
                    async () => {
                        if(!isLike) {
                            const res = await handleLike(props.id)
                            if(res) {
                                setIsLike(true)
                            }
                        }
                    }
                }/>
                <Text style={{ color: 'gray', fontSize: 18 }}>{likes}</Text>
            </View>
        </View>
    );
}

const css = StyleSheet.create({
    box: {
        width: '65%',
        height: 150,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
        marginTop: 25,
        display: 'flex',
    },
    title: {
        fontSize: 25,
    },
    contentBox: {
        flex: 2,
        padding: 15,
    },
    footerBox: {
        display: 'flex',
        flexDirection: 'row',
        borderColor: 'gray',
        borderTopWidth: 1,
        flex: 1,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 7,
    },
})

export default ViewPost;