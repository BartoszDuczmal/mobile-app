import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { getHeaderTitle } from "@react-navigation/elements";
import { MotiView } from "moti";
import { useState } from "react";
import { Pressable, Text, TextInput, useColorScheme, View } from "react-native";
import Animated, { Easing, LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuModal from "./modals/MenuModal";

const SearchBar = ({ options, route, navigation }: any) => {
    const colorScheme = useColorScheme();
    const iconColor = colorScheme === "dark" ? "white" : "black";

    const insets = useSafeAreaInsets();

    const title = getHeaderTitle(options, route.name);

    const [searchData, setSearchData] = useState('')

    const [modal, setModal] = useState<boolean>(false)

    const [expandSearch, setExpandSearch] = useState<boolean>(false)

    const handleClose = () => {
        setModal(false)
    }

    const handleSearch = (text: string) => {
        setSearchData(text)
        navigation.setParams({ search: text })
    }

    return (
        <>
            <MenuModal isVisible={modal} close={handleClose}/>
            <View className='w-full items-center' style={{ paddingTop: insets.top }}>
                <View className='w-full flex flex-row items-center px-6 py-6 justify-end relative'>
                    <MotiView style={{ position: "absolute", left: 24 }} animate={{ opacity: expandSearch ? 0 : 1 }}>
                        <Text className="text-xl font-medium dark:text-white">{title}</Text>
                    </MotiView>
                    <View className="flex-row gap-4">
                        <Animated.View className={`justify-start rounded-full bg-white dark:bg-[#0f1215] overflow-hidden ${expandSearch ? 'flex-1' : ''}`} layout={LinearTransition.duration(400).easing(Easing.out(Easing.quad))}>
                            <Pressable className='flex-row items-center active:opacity-50' onPress={() => setExpandSearch(prev => !prev)}>
                                <FontAwesome name="search" size={24} color={iconColor} className="m-3"/>
                                { expandSearch &&
                                <TextInput className="h-12 bg-transparent flex-1 dark:text-white" placeholder="Szukaj..." value={searchData} onChangeText={handleSearch} placeholderTextColor={iconColor}/>
                                }
                            </Pressable>
                        </Animated.View>
                        <Pressable onPress={() => setModal(true)} className="items-center flex-row rounded-full p-3 bg-white dark:bg-[#0f1215] active:opacity-50">
                            <FontAwesome6 name="gear" size={24} color={iconColor} />
                        </Pressable>
                    </View>
                </View>
            </View>
        </>
    );
}

export default SearchBar;