import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addPay } from "../../../features/pay/paySlice";


export default function Pay() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { orderRef, totalAmount } = useLocalSearchParams();
  const user = useSelector((state) => state.auth.user);
  const { paymentUrl } = useSelector((state) => state.pay);

  const handleSubmit = () => {
    const checkout = {
      orderRef,
      amount: Number(totalAmount),
      email: user.email,
    };

    dispatch(addPay(checkout));
  };

  useEffect(() => {
    if (paymentUrl) {
      WebBrowser.openBrowserAsync(paymentUrl);
    }
  }, [paymentUrl]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Your Orders
      </Text>

      <Pressable
        onPress={handleSubmit}
        style={{
          backgroundColor: "#2563eb",
          padding: 14,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Pay (₦{totalAmount})
        </Text>
      </Pressable>
    </View>
  );
}
