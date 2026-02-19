import { checkAuth } from "@/utils/checkAuth";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from "react-native";
import MenuModal from "./modals/MenuModal";

const TabLogin = () => {
    const handleClose = () => {
        setModal(false)
    }

    const { t } = useTranslation()

    const [user, setUser] = useState(null)

    const [modal, setModal] = useState<boolean>(false)

    useFocusEffect(
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
    <View>
        <TouchableOpacity onPress={() => setModal(true)} style={{
            flexDirection: 'row', 
            alignItems: 'center',
            marginRight: 5,
        }}>
            <Text style={{ fontWeight: 'bold', marginRight: 15, flexWrap: 'nowrap', maxWidth: 70, }} numberOfLines={1}>{ (user === null) ? t('common.login') : user }</Text>
            <Feather name="user" size={24} color="#000" />
        </TouchableOpacity>
    </View>
    </>
    );
}

export default TabLogin;