import MiniPost from '@/components/MiniPost';
import '@/locales/config';
import { API_URL } from "@/providers/config";
import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Keyboard, Platform, Pressable, RefreshControl, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, LinearTransition } from "react-native-reanimated";

type Post = {
  id: number,
  title: string,
  description: string,
  likes: number,
  isLiked: number
};

export default function Main() {
  const headerHeight = useHeaderHeight()

  const { t } = useTranslation()
  
  const screenSize = useWindowDimensions()

  const router = useRouter()

  const [data, setData] = useState<Post[]>([])

  const { search } = useLocalSearchParams<{ search?: string }>()

  const [refreshing, setRefreshing] = useState<boolean>(false)

  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const fetchPosts = async () => {
    try {
      const res = await axios.post(`${API_URL}/posts`, {}, { withCredentials: true })
      if(res.data) {
        setData(res.data)
      }
    } catch(err) {
      console.error('Błąd podczas pobierania danych.')
    }
  }

  useEffect(() => {
    fetchPosts()

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardOffset(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardOffset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const onRefresh = async () => {
        setRefreshing(true)
        await fetchPosts()
        setRefreshing(false)
  }

  const filteredData = useMemo(() => {
    const lower = search?.toLowerCase() || ''
    return data.filter((item) => 
      item.title.toLowerCase().includes(lower) || 
      item.description.toLowerCase().includes(lower)
    );
  }, [data, search]);

  return (
    <View className='flex flex-row flex-1 justify-center w-full bg-[#f5f6f7]'>
        <View className='absolute w-full self-end items-end flex-1'>
          <Animated.View style={{ marginBottom: keyboardOffset !== 0 ? keyboardOffset + 25 : (screenSize.height * 0.1) }} className='rounded-full mr-[10%] z-10 p-3' layout={LinearTransition.duration(200).easing(Easing.out(Easing.quad))}>
            <Pressable onPress={() => router.push('/publish')} className='bg-white rounded-full p-3 shadow-sm active:opacity-80'>
              <Ionicons name="add-outline" size={32} color="black" />
            </Pressable>
          </Animated.View>
        </View>
        <View style={css.content}>
          <FlatList 
          style={css.withContent} 
          contentContainerStyle={{
              justifyContent: 'center', 
              paddingBottom: 30,
              width: '100%'
            }} 
          refreshControl={ 
            <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            /> 
          }
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={<View style={{ height: headerHeight }}></View>}
          renderItem={({ item }) => (
            <MiniPost 
            id={item.id} 
            title={item.title} 
            desc={item.description} 
            likes={item.likes} 
            isLiked={!!item.isLiked}
            />
          )}
          ListEmptyComponent={
          <Text style={{marginVertical: 20, alignSelf: 'center'}}>{t('common.nothingThere')}</Text>
          }
          removeClippedSubviews={true}
          keyboardShouldPersistTaps="handled"
          />
        </View>
    </View>
  );
}

const css = StyleSheet.create({
  container: {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'center',
      width: '100%',
  },
  header: {
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
  content: {
    flex: 1,
    alignItems: 'center',
  },
  withContent: {
    display: 'flex',
    width: '100%',
    paddingHorizontal: '15%',
  },
});
