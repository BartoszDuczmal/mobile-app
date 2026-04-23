import MiniPost from '@/components/MiniPost';
import '@/locales/config';
import { useModal } from '@/providers/ModalProvider';
import { api } from "@/services/api";
import { useHeaderHeight } from '@react-navigation/elements';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Keyboard, Platform, RefreshControl, Text, useColorScheme, useWindowDimensions, View } from 'react-native';

type Post = {
  id: number,
  title: string,
  description: string,
  likes: number,
  isLiked: number
};

export default function Main() {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "white" : "black";

  const headerHeight = useHeaderHeight()
  const { bottomBarHeight } = useModal()

  const { t } = useTranslation()
  
  const screenSize = useWindowDimensions()

  const router = useRouter()

  const [data, setData] = useState<Post[]>([])

  const { search } = useLocalSearchParams<{ search?: string }>()

  const [refreshing, setRefreshing] = useState<boolean>(false)

  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const fetchPosts = async () => {
    try {
      const res = await api.post(`/posts`, {})
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
    <>
    <View className='flex flex-row flex-1 justify-center w-full'>
        <View className='flex-1 items-center'>
          <FlatList 
          className='w-full px-[15%]'
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
          ListHeaderComponent={<View style={{ height: headerHeight }}/>}
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
          <Text className='mx-5 self-center dark:text-white text-black'>{t('common.nothingThere')}</Text>
          }
          removeClippedSubviews={true}
          ListFooterComponent={<View style={{ height: bottomBarHeight }}/>}
          keyboardShouldPersistTaps="handled"
          />
        </View>
    </View>
    </>
  );
}
