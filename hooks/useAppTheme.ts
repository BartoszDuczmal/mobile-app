import { useModal } from "@/providers/ModalProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const useAppTheme = () => {
    const { openModal } = useModal()

    const { colorScheme, setColorScheme } = useColorScheme();

    const { t } = useTranslation()

    const THEME_KEY = 'app-theme'

    const [theme, setTheme] = useState<string>('system')

    const loadTheme = async () => {
        const storage = await AsyncStorage.getItem(THEME_KEY)
        const iniStorage = storage || 'system'
        setTheme(iniStorage)
        setColorScheme(iniStorage as 'light' | 'dark' | 'system')
    }

    useEffect(() => {
        loadTheme()
    }, [])

    const toggleTheme = async () => {
        try {
            let nextTheme: 'light' | 'dark' | 'system';

            switch(theme) {
                case 'light':
                    await AsyncStorage.removeItem(THEME_KEY)
                    setColorScheme('system')
                    nextTheme = 'system'
                    break
                case 'dark':
                    await AsyncStorage.setItem(THEME_KEY, 'light')
                    setColorScheme('light')
                    nextTheme = 'light'
                    break
                default:
                    await AsyncStorage.setItem(THEME_KEY, 'dark')
                    setColorScheme('dark')
                    nextTheme = 'dark'
            }
            setTheme(nextTheme)
        }
        catch(err) {
            openModal({ type: 'error', title: t('common.themeErr')})
        }
    }

    return { theme, toggleTheme } 
}