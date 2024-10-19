import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native'
import React from 'react'
import tw from 'tailwind-react-native-classnames'
import NavOptions from '../components/NavOptions'
const HomeScreen = () => {
  return (
    <SafeAreaView style={tw`bg-white h-full`}>
        <View style={tw`p-5`}>
        <Image style={{
            width:100,
            height:100,
            resizeMode:"contain",
        }}
        source={{
            uri:"https://www.kindpng.com/picc/m/80-806993_carpool-png-transparent-png.png",

        }}
        />
        <NavOptions/>
        </View>
    </SafeAreaView>
  )
}

export default HomeScreen