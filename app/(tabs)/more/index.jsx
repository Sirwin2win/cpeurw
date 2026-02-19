import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const data = [
  {
    id: 1,
    name: "Vertical Pump",
    image: require("../../../assets/accessories/verticalPump.jpeg"),
  },
  {
    id: 2,
    name: "Water Dispenser",
    image: require("../../../assets/accessories/waterDispenser.jpg"),
  },
  {
    id: 3,
    name: "Fiber Glass",
    image: require("../../../assets/accessories/treatmentModule.jpg"),
  },
  {
    id: 4,
    name: "Treatment Module",
    image: require("../../../assets/accessories/treatmentModule2.jpeg"),
  },
  {
    id: 5,
    name: "Solar Battery",
    image: require("../../../assets/accessories/solarBatteries.png"),
  },
  {
    id: 6,
    name: "Reverse Osmosis",
    image: require("../../../assets/accessories/reverseOsmoses.jpeg"),
  },
  {
    id: 7,
    name: "Ozone Generator",
    image: require("../../../assets/accessories/ozonGenerator.jpg"),
  },
  {
    id: 8,
    name: "Nylon Machine",
    image: require("../../../assets/accessories/nylonPrintingMachine.jpg"),
  },
  {
    id: 9,
    name: "Filter Cartridge",
    image: require("../../../assets/accessories/filterCatridge.png"),
  },
  {
    id: 10,
    name: "Bottle Blower",
    image: require("../../../assets/accessories/bottleBlowingMachine.jpeg"),
  },
  {
    id: 11,
    name: "Air Compressor",
    image: require("../../../assets/accessories/airConpressor.jpg"),
  },
];

const Index = () => {
  const router = useRouter();
  return (
    <View style={{ marginVertical: 50 }}>
      <View style={{ padding: 20, backgroundColor: "#fff" }}>
        <Link href="/more/Contact" asChild>
          <Pressable>
            <Text style={{ color: "#1d40d8", fontSize: 16 }}>Contact Us</Text>
          </Pressable>
        </Link>

        <Link href="/profile/sidebar" asChild>
          <Pressable>
            <Text
              style={{
                flex: 1,
                marginTop: -20,
                color: "#1d40d8",
                fontSize: 16,
                alignSelf: "flex-end",
              }}
            >
              Dashboard
            </Text>
          </Pressable>
        </Link>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.text}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  text: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
});
