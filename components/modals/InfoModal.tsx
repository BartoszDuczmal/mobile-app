import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const InfoModal = ({ visible, title, msg, onClose }: { visible: boolean, title: string, msg?: string, onClose: () => void } ) => {

    return (
        <Modal animationType="slide" visible={visible} transparent={true}>
                <View style={css.centeredView}>
                    <View style={css.modalView}>
                        <Text style={css.title}>{title}</Text>
                        { msg && <Text style={css.msg}>{msg}</Text> }
                        <View style={css.buttonsView}>
                        <TouchableOpacity onPress={onClose}><Text style={{fontWeight: 700}}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const css = StyleSheet.create({
    centeredView: {
       display: 'flex',
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center',
    },
    modalView: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fafeffff',
        borderRadius: 30,
        shadowColor: '#79c3fcff',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonsView: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18, 
        textAlign: 'center', 
        fontWeight: 700,

        marginBottom: 5,
    },
    msg: {
        fontSize: 15, 
        textAlign: 'center',
    },
})

export default InfoModal;