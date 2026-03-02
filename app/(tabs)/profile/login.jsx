import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../features/auth/authSlice";
// import index from '../cart/index.jsx';

const Login = () => {
  const router = useRouter();
  const { from } = useLocalSearchParams();
  const { width } = useWindowDimensions();

  const dispatch = useDispatch();
  const { status, error, user } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isLoading = status === "loading";
  const isTablet = width > 576;
  const redirected = useRef(false);

  useEffect(() => {
    if (!redirected.current && status === "succeeded" && user) {
      redirected.current = true;
      router.replace(from ?? "/cart");
    }
  }, [status, user, from]);

  const onLogin = () => {
    if (!email || !password) return;
    dispatch(login({ email, password }));
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 26, marginBottom: 20 }}>Login</Text>

      <TextInput
        placeholder="email@example.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      {/* Forgot Passord */}
      <Text
        onPress={() => router.push("/profile/SendMail")}
        style={styles.link}
      >
        forgot password?
      </Text>
      {/* Password  */}
      <View style={{ position: "relative", width: "100%" }}>
        <TextInput
          placeholder="enter password"
          secureTextEntry={!showPassword}
          style={{
            backgroundColor: "#fff",
            padding: "5%",
            marginBottom: "10%",
            borderRadius: 20,
            borderColor: "#1d4ed8",
            borderWidth: 1,
            placeholderTextColor: "#9CA3AF",
          }}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 20,
            top: "30%",
            transform: [{ translateY: -11 }],
          }}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color="#777"
          />
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, isLoading && { opacity: 0.6 }]}
        onPress={onLogin}
        disabled={isLoading}
      >
        <Text style={[styles.buttonText, { fontSize: isTablet ? 30 : 22 }]}>
          {isLoading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <Text
        onPress={() => router.push("/profile/register")}
        style={styles.link}
      >
        Create an account?
      </Text>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: "5%",
    marginBottom: "10%",
    borderRadius: 20,
    borderColor: "#1d4ed8",
    backgroundColor: "#fff",
    placeholderTextColor: "#9CA3AF",
  },
  button: {
    borderRadius: 20,
    backgroundColor: "#1d4ed8",
    height: 44,
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "blue",
  },
});
