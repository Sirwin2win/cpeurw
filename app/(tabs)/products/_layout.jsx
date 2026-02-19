import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from "expo-router";
import { Text } from 'react-native';
import { useSelector } from 'react-redux';


export default function ProductStack() {
  const totalQuantity = useSelector(state=>state.cart.totalQuantity)
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Products" }} />
      <Stack.Screen name="[id]" options={{
         title: "Product Details",
         headerTintColor: "#1d4ed8",
         headerRight: () =>  <><Ionicons name="cart"  size={30} color="#1d4ed8" /><Text style={{
          color:'#f00',
          // marginRight:50,
          marginTop:35,
          fontSize:15,
          fontWeight:'bold'
         }}>{totalQuantity}</Text></>,
         gestureEnabled: true }} />
      {/* <Stack.Screen name="register" options={{ title: "Register" }} /> */}
    </Stack>
  );
}
