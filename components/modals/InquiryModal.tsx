import { StyledText } from '@/components/StyledComponents';
import i18n from '@/locales/config';
import { TouchableOpacity, View } from "react-native";
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const InquiryModal = ({ visible, title, msg, onResponse }: { visible: boolean, title: string, msg?: string, onResponse: (answer: boolean) => void }) => {
    const marginTop = useSafeAreaInsets().top;

    return (
        <Modal animationIn='slideInDown' animationOut='slideOutUp' isVisible={visible} hasBackdrop={false} coverScreen={false}>
            <View className='flex-1 items-center justify-start' style={{ paddingTop: marginTop }}>
                <View className='w-[80%] items-center justify-start p-5 bg-white dark:bg-[#2b2e30] rounded-[30px] shadow-lg'>
                    <StyledText className='text-xl text-center font-bold mb-1 dark:text-white'>{title}</StyledText>
                    { msg && <StyledText className='text-lg dark: text-white'>{msg}</StyledText> }
                    <View className='mt-3 flex-row justify-center items-center gap-12'>
                        <TouchableOpacity onPress={() => onResponse(true)}>
                            <StyledText className='font-extrabold dark:text-white'>{i18n.t('common.yes')}</StyledText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onResponse(false)}>
                            <StyledText className='font-extrabold dark:text-white'>{i18n.t('common.no')}</StyledText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default InquiryModal;