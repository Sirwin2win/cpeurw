import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loadToken } from "../../../features/auth/authSlice";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  loadCart,
  removeFromCart,
} from "../../../features/cart/cartSlice";
import { createOrder } from "../../../features/orders/orderSlice";

const CartPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();

  const { items, totalQuantity, totalAmount } = useSelector(
    (state) => state.cart,
  );
  const { status, user } = useSelector((state) => state.auth);
  const { orderRef } = useSelector((state) => state.orders);

  const isTablet = width > 576;

  // Always bootstrap user token
  useEffect(() => {
    dispatch(loadToken());
  }, [dispatch]);

  // Redirect if not logged in
  useEffect(() => {
    if (status !== "loading" && !user) {
      router.replace("/profile/login?from=/cart");
    }
  }, [status, user, router]);
  // While loading auth OR user not present, render nothing

  // Redirect to payment page after order creation
  useEffect(() => {
    if (orderRef) {
      router.push({
        pathname: "/cart/pay",
        params: { orderRef, totalAmount },
      });
    }
  }, [orderRef, totalAmount, router]);

  // Load cart after auth status is ready
  useEffect(() => {
    if (status === "idle") {
      dispatch(loadCart());
    }
  }, [status, dispatch]);

  // Handle placing an order
  const handleSubmit = () => {
    if (!user?.id) {
      router.replace("/profile/login");
      return;
    }

    const checkout = {
      totalAmount,
      userId: user.id,
      items: items.map((item) => ({
        product_id: item.id,
        product_name: item.title,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    dispatch(createOrder(checkout));
  };

  return (
    <ScrollView>
      {items.map((item) => (
        <View style={styles.container} key={item.id}>
          <Image
            style={{ height: undefined, width: isTablet ? "45%" : "30%" }}
            source={{ uri: `https://api.buywaterh2o.com/${item.image}` }}
          />
          <View>
            <Text
              style={{
                fontWeight: "900",
                fontSize: isTablet ? 20 : 15,
                marginBottom: isTablet ? 20 : 5,
              }}
            >
              {item.title}
            </Text>
            <Text>₦{item.price}</Text>
            <View style={styles.plusMinusCon}>
              <Pressable onPress={() => dispatch(increaseQuantity(item.id))}>
                <Text
                  style={{
                    fontSize: 20,
                    width: 50,
                    textAlign: "center",
                    marginTop: isTablet ? "15%" : "5%",
                    padding: isTablet ? "10%" : "5%",
                  }}
                >
                  +
                </Text>
              </Pressable>
              <Text
                style={{
                  marginTop: isTablet ? "20%" : "5%",
                  padding: isTablet ? "10%" : "5%",
                  fontSize: 20,
                }}
              >
                {item.quantity}
              </Text>
              <Pressable onPress={() => dispatch(decreaseQuantity(item.id))}>
                <Text
                  style={{
                    fontSize: 20,
                    width: 50,
                    textAlign: "center",
                    marginTop: isTablet ? "20%" : "10%",
                    padding: isTablet ? "10%" : "5%",
                  }}
                >
                  -
                </Text>
              </Pressable>
            </View>
            <Pressable onPress={() => dispatch(removeFromCart(item.id))}>
              <Text style={{ color: "red" }}>Remove Item</Text>
            </Pressable>
          </View>
        </View>
      ))}

      <View
        style={{
          flex: 2,
          flexDirection: "row",
          justifyContent: "space-around",
          margin: "10%",
        }}
      >
        <Pressable
          onPress={() => dispatch(clearCart())}
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonPressed : styles.buttonNormal,
          ]}
        >
          <Text style={styles.buttonText}>Clear Cart</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={handleSubmit}
        style={{ backgroundColor: "#1d4ed8", borderRadius: 10, margin: 10 }}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontSize: 25,
            fontWeight: "bold",
            padding: 10,
          }}
        >
          Place Order (₦{totalAmount})
        </Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 15,
    padding: 15,
  },
  plusMinusCon: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonNormal: {
    backgroundColor: "#f00",
  },
  buttonPressed: {
    backgroundColor: "#f00",
    opacity: 0.8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CartPage;
