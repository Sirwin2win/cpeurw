import { Image } from 'expo-image';
import { useRouter } from "expo-router";
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../../features/products/productSlice';




const index = () => {
  const {items, status, error} = useSelector(state=> state.products)
  const searchItem = useSelector(state=>state.filter.searchItem)

  const dispatch = useDispatch()
  const {width, height} = useWindowDimensions()
  const router = useRouter();
  const isTablet = width >576
  useEffect(()=>{
    if(status==='idle'){
      dispatch(fetchProducts())
    }
  },[status,dispatch])
  if(status==='loading'){
    return <ActivityIndicator size="large" color='#1d4ed8' />
  }
  return (
   
    <FlatList
      data={items}
      numColumns={2}
      keyExtractor={(item) => item.id.toString()}
      columnWrapperStyle={{ justifyContent: "space-between" }}
       contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={()=>router.push(`/products/${item.id}`)} style={styles.card} >
        <View style={{flex:1, alignItems:'center'}}>
          <Image style={styles.image} source={{uri:`https://api.buywaterh2o.com/${item.image}`}}  />
          {/* <Image style={{height:isTablet?'90%':'80%',width:isTablet?'70%':'60%'}}  source={{uri:`https://api.buywaterh2o.com/${item.image}`}}  /> */}
          <Text style={{fontWeight:'bold', fontSize:15, marginTop:5}}>{item.title}</Text>
            <Text style={{marginTop:5, marginBottom:20}}>₦{item.price}</Text>
        </View>
        </TouchableOpacity>
        )}
    />
  );
}

export default index

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
  flex: 1,
  margin: 8,
  backgroundColor: "#fff",
  borderRadius: 10,
  padding: 10,
  elevation: 3,
},
image: {
  height: 200,
  width: "100%",
  resizeMode: "contain",
},
  text: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
});
