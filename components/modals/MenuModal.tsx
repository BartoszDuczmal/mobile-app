import { useAppTheme } from "@/hooks/useAppTheme";
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from "nativewind";
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity } from "react-native";


const MenuModal = ({ isVisible, close }: { isVisible: boolean, close: () => void }) => {
    const { colorScheme, setColorScheme } = useColorScheme();

    const { t, i18n } = useTranslation()

    const { theme, toggleTheme } = useAppTheme()

    const iconColor = colorScheme === "dark" ? "white" : "black";
    
    const handleClose = () => {
        close()
    }

    return (
        <Modal visible={isVisible} transparent={true} animationType='fade'>
            <Pressable onPress={() => handleClose()} style={css.closeArea}>
                <Pressable className='self-end bg-white rounded-3xl m-4 mt-24 shadow-sm dark:bg-[#0f1215] items-start'>
                    <TouchableOpacity className='pt-5 pb-3 px-8 w-full flex-row items-center gap-4' onPress={() => (i18n.language == 'en') ? i18n.changeLanguage('pl') : i18n.changeLanguage('en')}>
                        <MaterialIcons name="translate" size={20} color='gray' />
                        <Text className='dark:text-white'>{t('common.changeLang')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className='pt-3 pb-5 px-8 text-center w-full flex-row items-center gap-4' onPress={ () => toggleTheme() }>
                        <Feather name={colorScheme === 'dark' ? 'moon': 'sun'} size={20} color='gray' />
                        <Text className='dark:text-white'>{t('common.changeTheme')} {theme}</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const css = StyleSheet.create({
    closeArea: {
        width: '100%',
        flex: 1,
    },
    menu: {
        alignSelf: 'flex-end',
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
             width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 1,
        margin: 15,
        marginTop: 75,
        alignItems: 'center',
    },
    lang: {
        paddingHorizontal: 30,
        paddingTop: 20,
        paddingBottom: 10,
        textAlign: 'center',
    },
    login: {
        paddingHorizontal: 30,
        paddingTop: 10,
        paddingBottom: 20,
        textAlign: 'center',
    },
})

export default MenuModal;