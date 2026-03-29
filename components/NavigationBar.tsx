import { checkAuth } from "@/utils/checkAuth";
import { Feather, Ionicons } from "@expo/vector-icons";
import { getHeaderTitle } from "@react-navigation/elements";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuModal from "./modals/MenuModal";

const NavigationBar = ({ options, route, navigation }: any) => {
    const insets = useSafeAreaInsets();

    const title = getHeaderTitle(options, route.name);

    const { t } = useTranslation()

    const [user, setUser] = useState(null)

    const [modal, setModal] = useState<boolean>(false)

    const handleClose = () => {
        setModal(false)
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
                { !options.hideLogin ? 
                <View className='w-full flex flex-row items-center justify-between px-6 py-6'>
                    <Pressable className="rounded-full p-3 bg-white active:opacity-50" onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="black"/>
                    </Pressable>
                    <Text className="text-xl font-medium">{title}</Text>
                    <Pressable onPress={() => setModal(true)} className="items-center flex-row rounded-full px-5 py-3 bg-white active:opacity-50">
                        <Text style={{ fontWeight: 'bold', marginRight: 15, flexWrap: 'nowrap', maxWidth: 70, }} numberOfLines={1}>{ (user === null) ? t('common.login') : user }</Text>
                        <Feather name="user" size={24} color="#000" />
                    </Pressable>
                </View>
                :
                <View className='w-full flex flex-row items-center justify-start px-6 py-6 gap-10'>
                    <Pressable className="rounded-full p-3 bg-white active:opacity-50" onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="black"/>
                    </Pressable>
                    <Text className="text-xl font-medium">{title}</Text>
                </View>
                }
            </View>
        </>
    );
}

export default NavigationBar;