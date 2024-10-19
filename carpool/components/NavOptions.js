import {Image,FlatList ,View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'tailwind-react-native-classnames'
import { Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
const data =[
    {
        id:"123",
        title:"Get a ride",
        image:"https://i.pinimg.com/736x/ab/1b/83/ab1b8353e32ecfb11ad3b9b492b55b16.jpg",
        screen: "PassengerScreen",
    },
    {
        id:"456",
        title:"offer a ride",
        image:"https://i.pinimg.com/736x/ab/1b/83/ab1b8353e32ecfb11ad3b9b492b55b16.jpg",
        screen: "OfferScreen",
    

    }
]

const NavOptions = () => {
    const navigation = useNavigation();
  return (
    <FlatList
        data={data}
        horizontal
        keyExtractor={(item)=>item.id}
        renderItem={({item})=>(
            <TouchableOpacity 
            onPress={()=>navigation.navigate(item.screen)}
            style={tw`p-2 pl-6 pb-8 pt-4 bg-gray-200 w-40 m-2`}>
                <View>
                    <Image
                        style={{width:120,height:120,resizeMode:"contain"}}
                        source={{uri: item.image}}
                    />
                    <Text style={tw`mt-2 text-lg font-semibold`}>{item.title}</Text>
                    <Icon
                    style={tw`p-2 bg-black rounded-full w-10 mt-4`}
                    name="arrowright"
                    color="white"
                    type="antdesign"
                    />
                </View>
            </TouchableOpacity>
        )}
        />
  )
}

export default NavOptions