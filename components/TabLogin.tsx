import { checkAuth } from "@/utils/checkAuth";
import { Feather } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Account from "./modals/Account";

const TabLogin = () => {
    const [user, setUser] = useState(null)

    const [modal, setModal] = useState(0)

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
    <Account refresh={modal}/>
    <View>
        <TouchableOpacity onPress={() => (user === null) ? router.push('/(tabs)/login') : setModal(prev => prev + 1)} style={{
            flexDirection: 'row', 
            alignItems: 'center',
            marginRight: 5,
        }}>
            <Text style={{ fontWeight: 'bold', marginRight: 15, flexWrap: 'nowrap', maxWidth: 70, }} numberOfLines={1}>{ (user === null) ? 'Zaloguj się' : user }</Text>
            <Feather name="user" size={24} color="#000" />
        </TouchableOpacity>
    </View>
    </>
    );
}

export default TabLogin;