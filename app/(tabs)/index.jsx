import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

export default function Index() {
  // const { items, status } = useSelector((state) => state.products);
  // const dispatch = useDispatch();

 const items = [
  {
    id: "1",
    name: "Sachet Water",
    description: "CPEURW Sachet Water is premium-quality purified drinking water conveniently packaged in 500ml heat-sealed sachets, designed to provide safe, hygienic, and refreshing hydration for everyone.",
    // price: "250",
    image: require("../../assets/images/S1.jpg"),
  },
  {
    id: "2",
    name: "Dispenser Water",
    description: "CPEURW Dispenser Water is premium-quality drinking water packaged in refillable 18.9L (or 19L) polycarbonate bottles, designed for use with water dispensers in homes, offices, schools, and commercial spaces. ",
    // price: "1500",
    image: require("../../assets/images/D1.jpg"),
  },
  {
    id: "3",
    name: "Bottled Water",
    description: "CPEURW Bottled Water is premium-grade, crystal-clear drinking water, expertly purified and bottled to deliver safe, refreshing, and great-tasting hydration for every lifestyle.",
    // price: "200",
    image: require("../../assets/images/B2.jpg"),
  },
];


  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);




  /* ⏱ Auto slide (safe) */
  useEffect(() => {
    if (!items.length) return;

    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % items.length;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex, items.length]);

  /* 🧩 Render product card */
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={item.image}
        style={styles.image}
        contentFit="contain"
      />

      <View style={styles.content}>
        <Text style={styles.brandTitle}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>

      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.safeArea}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      {/* 🖼 Banner */}
      <Image
        source={require("../../assets/images/DD.jpg")}
        style={styles.banner}
      />
      <Text style={styles.brandTitle}>CPEURW Dispenser</Text>

      {/* 🎞 Slider */}
      <Animated.FlatList
        ref={flatListRef}
        data={items}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        nestedScrollEnabled
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(index);
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />

      {/* 🎨 Animated Dots */}
      <View style={styles.dotsContainer}>
        {items.map((_, i) => {
          const inputRange = [
            (i - 1) * width,
            i * width,
            (i + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 22, 8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={i}
              style={[styles.dot, { width: dotWidth, opacity }]}
            />
          );
        })}
      </View>

      {/* 🧾 Info Section */}
      <View style={styles.bottomRow}>
        <View style={styles.textBox}>
          <Text style={styles.brandTitle}>CPEURW</Text>
          <Text style={styles.text}>
            Your Trusted Partner in Pure Hydration.
          </Text>
          <Text style={styles.text}>
            Clean, affordable & certified drinking water.
          </Text>
        </View>

        <Image
          source={require("../../assets/images/W.jpg")}
          style={styles.sideImage}
        />
      </View>
    </ScrollView>
  );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  banner: {
    width: "100%",
    height: isTablet ? 350 : 240,
  },

  centerText: {
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "600",
  },

  card: {
    width,
    padding: 20,
  },

  image: {
    width: "100%",
    height: 230,
    borderRadius: 18,
  },

  content: {
    marginTop: 15,
  },

  productTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
    textAlign:'center'
  },

  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  button: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },

  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000",
    marginHorizontal: 5,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 16,
  },

  textBox: {
    width: "45%",
  },

  brandTitle: {
    textAlign: "center",
    fontSize: isTablet ? 18 : 16,
    fontWeight: "900",
    color: "#1d4ed8",
  },

  text: {
    textAlign: "center",
    // color: "#1d4ed8",
    marginTop: 6,
    fontSize: isTablet ? 15 : 13,
  },

  sideImage: {
    width: "50%",
    height: isTablet ? 220 : 160,
    resizeMode: "contain",
  },
});
