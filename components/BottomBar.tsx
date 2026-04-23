import { useAuth } from "@/providers/AuthProvider";
import { useModal } from "@/providers/ModalProvider";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, useColorScheme, useWindowDimensions, View } from "react-native";

const BottomBar = () => {
    const colorScheme = useColorScheme();
    const iconColor = colorScheme === "dark" ? "white" : "black";

    const windowHeight = useWindowDimensions().height

    const { user } = useAuth()

    const { setBottomBarHeight } = useModal();
    const offset = windowHeight / 80;

    return (
        <View 
        className='absolute left-0 right-0 p-6 z-50 items-center' 
        onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setBottomBarHeight(height + offset);
        }} 
        pointerEvents="box-none" 
        style={{ bottom: (windowHeight / 40) 
        }}>
            <View className='m-auto rounded-full dark:bg-[#0f1215] bg-white flex-row px-5 py-3 gap-5 justify-between items-center shadow-md'>
                <Pressable className='rounded-full py-3 px-6' onPress={() => user ? router.push('/publish') : router.push('/login')}>
                    <FontAwesome6 name="plus" size={30} color={iconColor} />
                </Pressable>
                <Pressable className='rounded-full py-3 px-6' onPress={() => router.push('/posts')}>
                    <FontAwesome6 name="compass" size={30} color={iconColor} />
                </Pressable>
                <Pressable className='rounded-full py-3 px-6' onPress={() => user ? router.push('/profile') : router.push('/login')}>
                    <FontAwesome6 name="user" size={26} color={iconColor} />
                </Pressable>
            </View>
        </View>
    );
}

export default BottomBar;