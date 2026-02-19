import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity } from "react-native";


const MenuModal = ({ isVisible, user, close }: { isVisible: boolean, user: null | string, close: () => void }) => {
    const { t, i18n } = useTranslation()
    
    const handleClose = () => {
        close()
    }

    return (
        <Modal visible={isVisible} transparent={true}>
            <Pressable onPress={() => handleClose()} style={css.closeArea}>
                <Pressable style={css.menu}>
                    <TouchableOpacity style={css.lang} onPress={() => (i18n.language == 'en') ? i18n.changeLanguage('pl') : i18n.changeLanguage('en')}>
                        <Text>{t('common.changeLang')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={css.login} onPress={
                        () => {
                        handleClose();
                        if(user === null) { 
                            router.push('/(tabs)/login') 
                        } 
                        else { 
                            router.push('/(tabs)/profile')
                        }
                        }}>
                        <Text>{ (user === null) ? t('common.login') : t('myProfile.header') }</Text>
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
        elevation: 3,
        margin: 15,
        marginTop: 70,
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