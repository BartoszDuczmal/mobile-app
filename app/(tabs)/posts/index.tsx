import MiniPost from '@/components/MiniPost';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, useWindowDimensions, View } from 'react-native';

type Post = {
  id: number,
  title: string,
  desc: string,
  likes: number,
  author: string,
};

export default function Main() {
  const screenSize = useWindowDimensions()

  const router = useRouter()

  const [data, setData] = useState([])

  const [searchData, setSearchData] = useState('')

  useEffect(() => {
    axios.get('http://192.168.1.151:3001/posts')
    .then(
      res => {
        const mapData = res.data.map((post: any) => ({
          id: post.id,
          title: post.title,
          desc: post.description,
          likes: post.likes,
        }));
        setData(mapData)
    })
    .catch( err => console.log(err) )
  }, []);

  return (
    <>
    <View style={css.container}>
        <View style={css.header}>
          <TextInput placeholder='Szukaj...' placeholderTextColor='gray' style={css.inputSearch} onChangeText={text => setSearchData(text)}></TextInput>
        </View>
        <View style={[css.footer, { marginBottom: screenSize.height * 0.1 }]}>
          <TouchableHighlight onPress={() => router.push('/publish')} style={css.buttonFooter} underlayColor='darkgray'>
            <Text style={{color: 'gray', fontSize: 25}}>+</Text>
          </TouchableHighlight>
        </View>
        <View style={css.content}>
          <ScrollView style={css.withContent} contentContainerStyle={[{justifyContent: 'center'}, {alignItems: 'center'}]}>
            {
              data
              .filter((item: Post) => 
                (item.title.toLowerCase().includes(searchData.toLowerCase())) || (item.desc.toLowerCase().includes(searchData.toLowerCase()))
              )
              .map((v: Post) => (
                <MiniPost key={v.id} id={v.id} title={v.title} desc={v.desc} likes={v.likes} author={v.author}></MiniPost>
              ))
            }
          </ScrollView>
        </View>
    </View>
    </>
  );
}

const css = StyleSheet.create({
  container: {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'center',
  },
  header: {
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    height: 50,
    marginTop: 30,
  },
  footer: {
    display: 'flex',
    position: 'absolute',
    width: '100%',
    height: 50,
    alignSelf: 'flex-end',
    alignItems: 'flex-end'
  },
  inputSearch: {
    width: '70%',
    paddingLeft: 20,
    color: 'black',
    fontSize: 15,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  buttonFooter: {
    width: 50,
    height: 50,
    borderRadius: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '10%',
    borderColor: 'gray',
    color: 'gray',
    borderWidth: 2,
    zIndex: 3,
    backgroundColor: '#EEEEEE',
  },
  content: {
    paddingTop: 72,
    flex: 1,
    alignItems: 'center',
  },
  withContent: {
    display: 'flex',
    width: '100%',
  }
});
