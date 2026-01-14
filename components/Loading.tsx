import { AntDesign } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

const AnimatedAntDesign = Animated.createAnimatedComponent(AntDesign);

const Loading = () => {

    const spinValue = useRef(new Animated.Value(0)).current

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    })

    const spinAnim = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
        spinAnim.current = Animated.loop(
            Animated.timing(spinValue, {
                   toValue: 1,
                 duration: 800,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        )
        spinAnim.current.start()
    
        return () => spinAnim.current?.stop()
    }, [])

    return (
        <View style={css.loadingBox}>
            <AnimatedAntDesign name="loading" size={80} color="black" style={{ transform: [{ rotate: spin }] }}/>
        </View>
    );
}

const css = StyleSheet.create({
    loadingBox: {
        display: 'flex',
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 80,
    }
})

export default Loading;