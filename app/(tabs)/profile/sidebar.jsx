import { useRouter } from "expo-router";
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loadToken } from '../../../features/auth/authSlice';
import { fetchOrder } from '../../../features/orders/orderSlice';


const sidebar = () => {
  
  const {status,error,token,user} = useSelector(state => state.auth);
  const {order, orders} = useSelector(state=>state.orders)
  const dispatch = useDispatch()
  const router = useRouter();

  useEffect(() => {
  dispatch(loadToken());
}, []);

  useEffect(() => {
  if (status!=='loading' && !user) {
    router.replace("profile/login");
  }
  if(user){

    dispatch(fetchOrder(user.id))
  }
  
  
}, [dispatch,user, status]);

  
  // useEffect(()=>{
  //   if(user.id){
      
  //   }
  // },[dispatch,user.id])
  return (
    <View>
        <Text>Orders</Text>
        {order.map(v=>(
          <View key={v.id}>
            <Text>{v.product_name}</Text>
            <Text>{v.quantity}</Text>
            <Text>{v.price}</Text>
            <Text>{v.updated_at}</Text>
          </View>
        ))}
    </View>
  )
}

export default sidebar

const styles = StyleSheet.create({})