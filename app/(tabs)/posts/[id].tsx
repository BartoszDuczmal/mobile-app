import { isLikedBy } from '@/utils/isLikedBy';
import { handleLike } from '@/utils/like-post';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from "react-native";

type Post = {
    id: number,
    title: string,
    desc: string,
    author: string,
    likes: number,
    date: string,
}

const ViewPost = () => {
    const params = useLocalSearchParams()
    const id = params.id

    const [data, setData] = useState<Post | null>(null);

    const [likes, setLikes] = useState<number>(0)

    const [isLike, setIsLike] = useState(false)

    useEffect(() => {
        let blocker = true
        const idNum = parseInt(id as string, 10)
        if (!idNum || isNaN(idNum)) return;

        const fetchData = async () => {
            try {
                const res = await axios.get(`http://192.168.1.151:3001/posts/${id}`);
                if (res.data) {
                    setData({
                        id: res.data.id,
                        title: res.data.title,
                        desc: res.data.description,
                        author: res.data.author,
                        likes: res.data.likes,
                        date: res.data.created_at,
                    });
                    setLikes(res.data.likes)
                } else {
                    console.warn('Brak danych dla danego ID');
                }
            } catch (error) {
                console.error('Błąd podczas pobierania posta:', error);
            }
        };
        const fetchIsLike = async () => {
            const status = await isLikedBy(idNum)
            setIsLike(status)
        }
        
        fetchData();
        fetchIsLike()

        return () => {
            blocker = false;
        };
    }, [id]);

    if (!data) {
        return (
            <Text>Ładowanie danych...</Text>
        )
    }

    const formattedDate = new Date(data.date).toLocaleDateString('pl-PL', {
        timeZone: 'Europe/Warsaw',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <View style={css.container}>
            <Text style={{ color: 'gray', fontSize: 18, alignSelf: 'center', marginBottom: 15 }} numberOfLines={1}>{data.author}</Text>
            <View style={css.title}>
                <Text style={{ fontSize: 35 }} numberOfLines={3}>{data.title}</Text>
            </View>
            <Text style={{fontSize: 20}}>{data.desc}</Text>
            <View style={css.footerBox}>
                <View style={css.likeFooter}>
                    <AntDesign name={isLike ? 'heart' : 'hearto'} style={{ zIndex: 10 }} size={24} color={isLike ? '#ec5353' : 'gray'} onPress={
                        async () => {
                            const res = await handleLike(data.id)
                            if(res) {
                                setLikes(res.likes)
                                setIsLike(!isLike)
                            }
                        }
                    }/>
                    <Text style={{ color: 'gray', fontSize: 18 }}>{likes}</Text>
                </View>
                <Text style={{ color: 'gray', fontSize: 18 }}>{formattedDate}</Text>
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
        marginTop: 25,
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 5,
        gap: 7,
    },
    likeFooter: {
        display: 'flex',
        flexDirection: 'row',
        gap: 7,
    },
})

export default ViewPost;