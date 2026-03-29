import { checkAuth } from "@/utils/checkAuth";
import { Feather, Octicons } from "@expo/vector-icons";
import { getHeaderTitle } from "@react-navigation/elements";
import { MotiView } from "moti";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, { Easing, LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuModal from "./modals/MenuModal";

const SearchBar = ({ options, route, navigation }: any) => {
    const insets = useSafeAreaInsets();

    const title = getHeaderTitle(options, route.name);

    const [searchData, setSearchData] = useState('')

    const { t } = useTranslation()

    const [user, setUser] = useState(null)

    const [modal, setModal] = useState<boolean>(false)

    const [expandSearch, setExpandSearch] = useState<boolean>(false)

    const handleClose = () => {
        setModal(false)
    }

    const handleSearch = (text: string) => {
        setSearchData(text)
        navigation.setParams({ search: text })
    }

    useEffect(
        useCallback(() => {
            let isActive = true

            async function verify() {
                const res = await checkAuth()
                console.log('Sprawdzenie usera:', res.user);

                if(isActive) {
                    if(res.loggedIn) {
                        setUser(res.user)
                    }
                    else {
                        setUser(null)
                    }
                }

            }
            verify()

            return () => {
                isActive = false
            }

        }, [])
    )

    return (
        <>
            <MenuModal isVisible={modal} user={user} close={handleClose}/>
            <View className='w-full items-center' style={{ paddingTop: insets.top }}>
                <View className='w-full flex flex-row items-center px-6 py-6 justify-end relative'>
                    <MotiView style={{ position: "absolute", left: 24 }} animate={{ opacity: expandSearch ? 0 : 1 }}>
                        <Text className="text-xl font-medium">{title}</Text>
                    </MotiView>
                    <View className="flex-row gap-4">
                        <Animated.View className={`justify-start rounded-full bg-white overflow-hidden ${expandSearch ? 'flex-1' : ''}`} layout={LinearTransition.duration(400).easing(Easing.out(Easing.quad))}>
                            <Pressable className='flex-row items-center active:opacity-50' onPress={() => setExpandSearch(prev => !prev)}>
                                <Octicons name="search" size={24} color="black" className="m-3"/>
                                { expandSearch &&
                                <TextInput className="h-12 bg-transparent flex-1" placeholder="Szukaj..." value={searchData} onChangeText={handleSearch}/>
                                }
                            </Pressable>
                        </Animated.View>
                        <Pressable onPress={() => setModal(true)} className="items-center flex-row rounded-full p-3 bg-white active:opacity-50">
                            <Feather name="user" size={24} color="#000" />
                        </Pressable>
                    </View>
                </View>
            </View>
        </>
    );
}

export default SearchBar;