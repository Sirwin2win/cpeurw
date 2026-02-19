import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { resetMail } from "../../../features/mail/mailSlice";

const SendMail = () => {
  const [email, setEmail] = useState("");
  const { status, error } = useSelector((state) => state.mails);
  const isLoading = status === "loading";
  const { width } = useWindowDimensions();
  const isTablet = width > 576;
  const dispatch = useDispatch();

  const onLogin = () => {
    if (!email) return;
    dispatch(resetMail({ email }));
  };
  return (
    <View style={{ marginTop: 10, padding: 20 }}>
      <TextInput
        placeholder="email@example.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {status === "succeeded" && (
        <Text style={{ color: "green", textAlign: "center" }}>
          Reset link sent
        </Text>
      )}

      <TouchableOpacity
        style={[styles.button, isLoading && { opacity: 0.6 }]}
        onPress={onLogin}
        disabled={isLoading}
      >
        <Text style={[styles.buttonText, { fontSize: isTablet ? 30 : 22 }]}>
          {isLoading ? "Sending mail..." : "Send Reset Link"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SendMail;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: "5%",
    marginBottom: "10%",
    borderRadius: 20,
    borderColor: "#1d4ed8",
    backgroundColor: "#fff",
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
