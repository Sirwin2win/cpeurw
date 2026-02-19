import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../features/cart/cartSlice";
import { fetchSingle } from "../../../features/products/productSlice";



const ProductDetails = () => {
     const { id } = useLocalSearchParams();
     const dispatch = useDispatch()
     const {width,height} = useWindowDimensions()
     const {currentProduct} = useSelector(state=>state.products)
    //  const product = currentProduct[id];

    const isTablet = width >576
     useEffect(()=>{
      if(id){
        dispatch(fetchSingle(id))
      }
     },[dispatch,id])
     if(!currentProduct){
      return <Text>Product not found</Text>
     }
    return (
        <View >
          <Image style={{height:'70%',width:'100%'}}  source={{uri:`https://api.buywaterh2o.com/${currentProduct.image}`}} />
      <Text style={{textAlign:'center',fontWeight:900, fontSize:isTablet?20:15}}>{currentProduct.title}</Text>
      <Text style={{textAlign:'center',marginBottom:10,marginTop:10,marginLeft:20, marginRight:20}}>{currentProduct.description}</Text>
      <Text style={{fontSize:isTablet?35:20,textAlign:'center'}}>₦{currentProduct.price}</Text>
    <TouchableOpacity
           onPress={()=> dispatch(addToCart(currentProduct))}
          >
            <Text style={{
              backgroundColor:'#1d4ed8',
               color:'#fff',
                textAlign:'center',
                padding:10,
                marginTop:10,
                fontWeight:'900'}}>Add To Cart</Text>
          </TouchableOpacity>
    </View>
    );
}





export default ProductDetails