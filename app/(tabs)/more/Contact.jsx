import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addMail } from "../../../features/mail/mailSlice";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { from } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const { status, error, mails } = useSelector((state) => state.mails);

  const openWhatsApp = () => {
    const phoneNumber = "+2348061418368";
    const message = "Hello, I need help";

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() => {
      alert("WhatsApp is not installed");
    });
  };

  // const isLoading = status === 'loading';
  const isTablet = width > 576;
  const handleSubmit = () => {
    if (!name || !email || !message) return;
    dispatch(addMail({ name, email, message }));
    setName("");
    setEmail("");
    setMessage("");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#9CA3AF"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#9CA3AF"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Message"
        placeholderTextColor="#9CA3AF"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      {status === "succeeded" && (
        <Text style={{ color: "green" }}>Mail Sent</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ marginTop: 50 }} onPress={openWhatsApp}>
        <Text>
          <Image
            source={require("../../../assets/images/wha.jpg")}
            style={{ height: 80, width: 80 }}
          />
        </Text>
        {/* <Text><Ionicons name="chatbubble-outline" size={24} color="green" /></Text> */}
      </TouchableOpacity>
      {/* <Text style={{textAlign:'center'}}>Send us an email for any request</Text> */}
    </View>
  );
};

export default Contact;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#4f46e5",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
