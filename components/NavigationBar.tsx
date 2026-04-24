import { StyledText } from '@/components/StyledComponents';
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { getHeaderTitle } from "@react-navigation/elements";
import { useState } from "react";
import { Pressable, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuModal from "./modals/MenuModal";

const NavigationBar = ({ options, route, navigation }: any) => {
    const colorScheme = useColorScheme();
    const iconColor = colorScheme === "dark" ? "white" : "black";

    const insets = useSafeAreaInsets();

    const title = getHeaderTitle(options, route.name);

    const [modal, setModal] = useState<boolean>(false)

    const handleClose = () => {
        setModal(false)
    }

    return (
        <>
            <MenuModal isVisible={modal} close={handleClose}/>
            <View className='w-full items-center' style={{ paddingTop: insets.top }}>
                <View className='w-full flex flex-row items-center justify-between px-6 py-6'>
                    <Pressable className="rounded-full p-3 bg-white dark:bg-[#0f1215] active:opacity-50" onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color={iconColor}/>
                    </Pressable>
                    <StyledText className="text-xl font-bold dark:text-white">{title}</StyledText>
                    <Pressable onPress={() => setModal(true)} className="items-center flex-row rounded-full p-3 bg-white dark:bg-[#0f1215] active:opacity-50">
                        <FontAwesome6 name="gear" size={24} color={iconColor} />
                    </Pressable>
                </View>
            </View>
        </>
    );
}

export default NavigationBar;