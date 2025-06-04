import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';


export default function Main() {
  return (
    <View style={css.container}>
        <View style={css.header}>
          <TextInput placeholder='Szukaj...' placeholderTextColor='white' style={css.inputSearch}></TextInput>
        </View>
        <View style={css.footer}>
          <Pressable onPress={() => alert('Nacisnieto!')}>
            <View style={css.buttonFooter}>
              <Text style={{color: 'white', fontSize: 25}}>+</Text>
            </View>
          </Pressable>
        </View>
    </View>
  );
}

const css = StyleSheet.create({
  container: {
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
      width: '100%'
  },
  header: {
    marginTop: 15,
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    height: 50,
  },
  footer: {
    display: 'flex',
    position: 'absolute',
    width: '100%',
    height: 50,
    alignSelf: 'flex-end',
    marginBottom: 15,
    alignItems: 'flex-end'
  },
  inputSearch: {
    width: '70%',
    backgroundColor: 'grey',
    borderRadius: 20,
    paddingLeft: 20,
    color: 'white',
    boxShadow: '0px 0px 25px 0px rgba(66, 68, 90, 1)',
  },
  buttonFooter: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: 'gray',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 30,
    boxShadow: '0px 0px 20px 0px rgba(66, 68, 90, 1)',
  }
});
