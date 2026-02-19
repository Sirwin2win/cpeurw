import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { create } from "../../../features/auth/authSlice";



const register = () => {
   const router = useRouter();
   const {width, height} = useWindowDimensions()
     const dispatch = useDispatch();
    const {loading,error, status} = useSelector(state => state.auth);

       const [email, setEmail] = useState('');
       const [name, setName] = useState('');
       const [address, setAddress] = useState('');
       const [phone, setPhone] = useState('');
       const [password, setPassword] = useState('');
        const [showPassword, setShowPassword] = useState(false);
     
        const onRegister = () => {
        //  console.log(name,address,phone,email, password)
         dispatch(create({ name,address,phone,email, password }));
       };

       useEffect(()=>{
        if(status==='success'){
          router.push('/profile/login')
        }
       },[status])

     const isTablet = width >576
  return (
    <KeyboardAvoidingView style={{ flex: 1, padding:20 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
   <ScrollView
 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
   >
      <Text style={{ fontSize: 26, marginBottom: 20 }}>Register</Text>

      <TextInput
        placeholder="Full Name"
        style={{ borderWidth: 1,
      padding: '5%',
          marginBottom: '10%',
          borderRadius:20,
          borderColor:'#1d4ed8',
          backgroundColor:'#fff',
          }}
         value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="email@example.com"
        style={{ borderWidth: 1,
         padding: '5%',
          marginBottom: '10%',
          borderRadius:20,
          borderColor:'#1d4ed8',
          backgroundColor:'#fff',
          }}
         value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Address please..."
        style={{ borderWidth: 1,
          padding: '5%',
          marginBottom: '10%',
          borderRadius:20,
          borderColor:'#1d4ed8',
          backgroundColor:'#fff',
          }}
         value={address}
        onChangeText={setAddress}
      />
      <TextInput
        placeholder="Phone"
        style={{ borderWidth: 1,
          padding: '5%',
          marginBottom: '10%',
          borderRadius:20,
          borderColor:'#1d4ed8',
          backgroundColor:'#fff',
          }}
         value={phone}
        onChangeText={setPhone}
      />

      <View style={{ position: "relative",width: "100%",}}>

      <TextInput
        placeholder="enter password"
        secureTextEntry={!showPassword}
        style={{backgroundColor:'#fff',
           padding: '5%',
          marginBottom: '10%',
          borderRadius:20,
          borderColor:'#1d4ed8',
          borderWidth: 1,
          }}
         value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={{position: "absolute",
    right: 20,
    top: "30%",
    transform: [{ translateY: -11 }],}}
        onPress={() => setShowPassword(!showPassword)}
      >
        <Ionicons
          name={showPassword ? "eye-off" : "eye"}
          size={22}
          color="#777"
        />
      </TouchableOpacity>
      </View>

      {error && <Text style={{ color: 'red' }}>{error}</Text>}

<TouchableOpacity style={{
        borderRadius:20,
         backgroundColor:'#1d4ed8',
         height:40
         }} onPress={onRegister} disabled={loading}>
        <Text style={{textAlign:'center',color:"#fff",
          fontWeight:'bold',
           fontSize:isTablet?30:22,
           }}>{loading ? 'Registering...' : 'Register'}</Text>
      </TouchableOpacity>
      {/* <Button title={loading ? 'Loading...' : 'Login'}  /> */}
<Link style={{ marginTop: 20, textAlign: 'center', color: 'blue' }} href={'/profile/login'}>
        Already have an account? </Link>
    </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default register

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 20 },
  input: { height: 50, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
});