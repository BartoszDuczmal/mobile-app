import Loading from '@/components/Loading';
import MiniPost from '@/components/MiniPost';
import '@/locales/config';
import { useAuth } from '@/providers/AuthProvider';
import { useModal } from '@/providers/ModalProvider';
import { api } from "@/services/api";
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, Text, TouchableOpacity, useColorScheme, View } from "react-native";

type Profile = {
    id: number,
    username: string,
    email: string,
    perms: string,
    date: string,
}

type Post = {
    id: number,
    title: string,
    description: string,
    likes: number,
    isLiked: number
};

const MyProfile = () => {
    const headerHeight = useHeaderHeight()
    const { t, i18n } = useTranslation()

    const [data, setData] = useState<null | Profile>(null)
    const [posts, setPosts] = useState<Post[]>([])

    const [refreshing, setRefreshing] = useState<boolean>(false)

    const { openModal, bottomBarHeight } = useModal()

    const { logout } = useAuth()

    const colorScheme = useColorScheme();
    const iconColor = colorScheme === "dark" ? "#d2d2d2" : "black";

    const handleLogout = async () => {
        const result = await openModal({ type: 'inquiry', title: t('myProfile.logout.inquiry') })
        if(!result) return
        await logout()
    }

    const fetchAll = async () => {
        try {
            const res = await api.post(`/profile/myShow`, {})
            if (res.data) {
                setData({
                    id: res.data.id,
                    username: res.data.username,
                    email: res.data.email,
                    perms: res.data.perms,
                    date: res.data.created_at,
                })
                const res2 = await api.post(`/posts`, { name: res.data.username })
                if(res2.data) {
                    setPosts(res2.data)
                }
            } else {
                return <Text>{t('myProfile.noUser')}</Text>
            }
        } catch (err: any) {
            const errMsg = typeof err.response.data?.error === 'string' ? err.response.data?.error : 'common.internalErr'
            return <Text>{errMsg}</Text>
        }
    };

    const onRefresh = async () => {
        setRefreshing(true)
        await fetchAll()
        setRefreshing(false)
    }

    useEffect(() => {
        fetchAll()
    }, [])

    if (!data) {
        return <Loading />
    }

    const formattedDate = new Date(data.date).toLocaleDateString(i18n.language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const ProfileTiles = () => {
        return (
            <View className='w-[80%] flex-1 self-center'>
                <View className='bg-white items-start rounded-[30px] w-full p-5 dark:bg-[#171a1c] shadow-md my-2'>
                    <View className='flex-row items-center gap-4 pl-1'>
                        <FontAwesome6 name="clipboard-user" size={24} color={iconColor} />
                        <View>
                            <Text className='font-bold dark:text-[#d2d2d2]'>{t('myProfile.usernameBox')}</Text>
                            <Text className='dark:text-[#d2d2d2]'>{data.username}</Text>
                        </View>
                    </View>
                </View>
                <View className='bg-white items-start rounded-[30px] w-full p-5 dark:bg-[#171a1c] shadow-md my-2'>
                    <View className='flex-row items-center gap-3'>
                        <MaterialIcons name="alternate-email" size={26} color={iconColor} />
                        <View>
                            <Text className='font-bold dark:text-[#d2d2d2]'>{t('myProfile.emailBox')}</Text>
                            <Text className='dark:text-[#d2d2d2]'>{data.email}</Text>
                        </View>
                    </View>
                </View>
                <View className='bg-white items-start rounded-[30px] w-full p-5 dark:bg-[#171a1c] shadow-md my-2'>
                    <View className='flex-row items-center gap-3'>
                        <FontAwesome6 name="clock" size={24} color={iconColor} />
                        <View>
                            <Text className='font-bold dark:text-[#d2d2d2]'>{t('myProfile.joinBox')}</Text>
                            <Text className='dark:text-[#d2d2d2]'>{formattedDate}</Text>
                        </View>
                    </View>
                </View>
                <View className='bg-white items-start rounded-[30px] w-full p-5 dark:bg-[#171a1c] shadow-md my-2'>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/login/changePassword')}>
                        <View className='flex-row items-center gap-3'>
                            <MaterialIcons name="password" size={26} color={iconColor} />
                            <View>
                                <Text className='font-bold dark:text-[#d2d2d2]'>{t('myProfile.changePassBox')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View className='bg-white items-start rounded-[30px] w-full p-5 dark:bg-[#171a1c] shadow-md my-2'>
                    <TouchableOpacity onPress={() => handleLogout()}>
                        <View className='flex-row items-center gap-3'>
                            <MaterialIcons name="logout" size={26} color="rgba(185, 0, 0, 1)" />
                            <View>
                                <Text style={{ fontWeight: 500, color: "rgba(185, 0, 0, 1)" }}>{t('myProfile.logoutBox')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View className='bg-white items-start rounded-[30px] w-full p-5 dark:bg-[#171a1c] shadow-md my-2'>
                    <View className='flex-row items-center gap-3'>
                        <FontAwesome6 name="folder-open" size={24} color={iconColor} />
                        <Text className='font-bold dark:text-[#d2d2d2]'>{t('myProfile.postsBox')}</Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
                <FlatList 
                contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: bottomBarHeight }}
                className='flex-1 w-full'
                refreshControl={ 
                    <RefreshControl 
                    refreshing={refreshing} 
                    onRefresh={onRefresh}
                    /> 
                }
                data={posts}
                keyExtractor={( item ) => item.id.toString()}
                ListHeaderComponent={
                    <ProfileTiles/>
                }
                renderItem={({ item }) => (
                    <View className='w-[70%] self-center'>
                        <MiniPost id={item.id} title={item.title} desc={item.description} likes={item.likes} isLiked={!!item.isLiked}/>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={{marginVertical: 20, alignSelf: 'center'}}>{t('common.nothingThere')}</Text>
                }
                removeClippedSubviews={true}
                keyboardShouldPersistTaps="handled"
                />
    );
}

export default MyProfile;
