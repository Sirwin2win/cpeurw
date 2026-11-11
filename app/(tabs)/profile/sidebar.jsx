
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { loadToken } from "../../../features/auth/authSlice";
import { fetchOrderByUserId } from "../../../features/orders/orderSlice";

const IMAGE_BASE_URL = "https://api2.buywaterh2o.com";

const formatDate = (dateString) => {
  if (!dateString) return "Not available";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "Not available";

  const day = date.getDate();

  const suffix =
    day % 10 === 1 && day !== 11 ? "st" :
    day % 10 === 2 && day !== 12 ? "nd" :
    day % 10 === 3 && day !== 13 ? "rd" : "th";

  const month = date.toLocaleString("en-GB", {
    month: "short",
  });

  const year = date.getFullYear();

  return `${day}${suffix}, ${month} ${year}`;
};

const formatMoney = (amount, currency = "NGN") => {
  const symbol = currency === "NGN" ? "₦" : `${currency} `;

  return (
    symbol +
    Number(amount || 0).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};

const getImageUrl = (image) => {
  if (!image) return null;

  if (image.startsWith("http")) return image;

  return `${IMAGE_BASE_URL}/${image.replace(/^\/+/, "")}`;
};

// ==========================================
// PRODUCT IMAGE
// ==========================================
const ProductImage = ({ image }) => {
  const [failed, setFailed] = useState(false);

  const imageUrl = getImageUrl(image);

  if (!imageUrl || failed) {
    return (
      <View style={styles.imagePlaceholder}>
        <Text style={styles.placeholderIcon}>📦</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: imageUrl }}
      style={styles.productImage}
      resizeMode="cover"
      onError={() => setFailed(true)}
    />
  );
};

// ==========================================
// STATUS BADGE
// ==========================================
const StatusBadge = ({ label, type }) => {
  const isPayment = type === "payment";

  const value = String(label || "Unknown").toLowerCase();

  let backgroundColor = isPayment ? "#ecfdf5" : "#eff6ff";
  let color = isPayment ? "#047857" : "#1d4ed8";

  if (
    value === "failed" ||
    value === "cancelled" ||
    value === "canceled"
  ) {
    backgroundColor = "#fef2f2";
    color = "#dc2626";
  }

  if (
    value === "pending" ||
    value === "processing"
  ) {
    backgroundColor = "#fff7ed";
    color = "#c2410c";
  }

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.badgeText, { color }]}>
        {isPayment ? "Payment: " : "Order: "}
        {label || "Unknown"}
      </Text>
    </View>
  );
};

// ==========================================
// ORDER ITEM
// ==========================================
const OrderProduct = ({ item, currency }) => {
  return (
    <View style={styles.productCard}>
      <View style={styles.productTop}>
        <ProductImage image={item.product_image} />

        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>
            {item.product_title || "Product"}
          </Text>

          <Text style={styles.productMeta}>
            Product ID: {item.product_id || "N/A"}
          </Text>

          <Text style={styles.productPrice}>
            Qty: {item.quantity} ×{" "}
            {formatMoney(item.unit_price, currency)}
          </Text>

          {item.created_at && (
            <Text style={styles.itemDate}>
              Item added: {formatDate(item.created_at)}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.subtotalContainer}>
        <Text style={styles.subtotalLabel}>
          Item Subtotal
        </Text>

        <Text style={styles.subtotalAmount}>
          {formatMoney(item.subtotal, currency)}
        </Text>
      </View>
    </View>
  );
};

// ==========================================
// ORDER CARD
// ==========================================
const OrderCard = ({ item }) => {
  const products = Array.isArray(item.items) ? item.items : [];

  return (
    <View style={styles.orderCard}>

      {/* ORDER HEADER */}

      <View style={styles.orderHeader}>
        <Text style={styles.referenceLabel}>
          ORDER REFERENCE
        </Text>

        <Text style={styles.reference}>
          {item.order_ref || "N/A"}
        </Text>

        <Text style={styles.orderDate}>
          Placed on {formatDate(item.created_at)}
        </Text>

        <View style={styles.badgeContainer}>
          <StatusBadge
            label={item.payment_status}
            type="payment"
          />

          <StatusBadge
            label={item.order_status}
            type="order"
          />
        </View>
      </View>

      {/* PRODUCTS */}

      <View style={styles.orderBody}>
        <Text style={styles.sectionTitle}>
          PRODUCTS ORDERED ({products.length})
        </Text>

        {products.length > 0 ? (
          products.map((product, index) => (
            <OrderProduct
              key={product.id || index}
              item={product}
              currency={item.currency}
            />
          ))
        ) : (
          <View style={styles.noProducts}>
            <Text style={styles.noProductsText}>
              No product details available for this order.
            </Text>
          </View>
        )}

        {/* PAYMENT DETAILS */}

        <View style={styles.paymentDetails}>
          <Text style={styles.paymentDate}>
            Paid on:{" "}
            {item.paid_at
              ? formatDate(item.paid_at)
              : "Not available"}
          </Text>
        </View>
      </View>
    </View>
  );
};

// ==========================================
// MAIN ORDERS SCREEN
// ==========================================
const Orders = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, initialized } = useSelector(
    (state) => state.auth
  );

  const {
    order,
    orderStatus,
    error,
  } = useSelector((state) => state.orders);

  const orders = useMemo(
    () => Array.isArray(order) ? order : [],
    [order]
  );

  // ==========================================
  // LOAD AUTHENTICATION
  // ==========================================
  useEffect(() => {
    if (!initialized) {
      dispatch(loadToken());
    }
  }, [dispatch, initialized]);

  // ==========================================
  // CHECK USER AND FETCH ORDERS
  // ==========================================
  useEffect(() => {
    if (!initialized) return;

    if (!user) {
      router.replace("/profile/login");
      return;
    }

    if (orderStatus === "idle") {
      dispatch(fetchOrderByUserId());
    }
  }, [initialized, user, orderStatus, dispatch, router]);

  // ==========================================
  // LOADING
  // ==========================================
  if (!initialized || orderStatus === "loading") {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />

        <Text style={styles.loadingText}>
          Loading your orders...
        </Text>
      </View>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (orderStatus === "failed") {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Unable to load orders
        </Text>

        <Text style={styles.errorText}>
          {typeof error === "string"
            ? error
            : error?.message || "Something went wrong."}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(fetchOrderByUserId())}
        >
          <Text style={styles.retryText}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================
  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item, index) =>
          String(item.id || item.order_ref || index)
        }
        renderItem={({ item }) => (
          <OrderCard item={item} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}

        ListHeaderComponent={
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>
              My Orders
            </Text>

            <Text style={styles.pageSubtitle}>
              Track your purchases and view order details.
            </Text>
          </View>
        }

        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛍️</Text>

            <Text style={styles.emptyTitle}>
              No orders yet
            </Text>

            <Text style={styles.emptyText}>
              Your purchases will appear here once you place an order.
            </Text>

            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.shopButtonText}>
                Start Shopping
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default Orders;

// ==========================================
// STYLES
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },

  pageHeader: {
    marginBottom: 24,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },

  pageSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
  },

  orderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 22,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },

  orderHeader: {
    padding: 18,
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },

  referenceLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#6b7280",
  },

  reference: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    marginTop: 7,
  },

  orderDate: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 7,
  },

  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },

  badge: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  orderBody: {
    padding: 16,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.7,
    color: "#374151",
    marginBottom: 14,
  },

  productCard: {
    padding: 12,
    borderRadius: 13,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#f3f4f6",
    marginBottom: 12,
  },

  productTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  productImage: {
    width: 75,
    height: 75,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  imagePlaceholder: {
    width: 75,
    height: 75,
    borderRadius: 12,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderIcon: {
    fontSize: 28,
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
  },

  productTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  productMeta: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 5,
  },

  productPrice: {
    fontSize: 12,
    color: "#4b5563",
    marginTop: 5,
  },

  itemDate: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 7,
  },

  subtotalContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginTop: 13,
    paddingTop: 12,
    alignItems: "flex-end",
  },

  subtotalLabel: {
    fontSize: 11,
    color: "#6b7280",
  },

  subtotalAmount: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginTop: 4,
  },

  noProducts: {
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 15,
  },

  noProductsText: {
    color: "#6b7280",
    fontSize: 12,
  },

  paymentDetails: {
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    marginTop: 8,
    paddingTop: 14,
  },

  paymentDate: {
    fontSize: 11,
    color: "#6b7280",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 25,
  },

  loadingText: {
    marginTop: 12,
    color: "#6b7280",
    fontSize: 13,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#dc2626",
  },

  errorText: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 10,
  },

  retryButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },

  retryText: {
    color: "#fff",
    fontWeight: "700",
  },

  emptyContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#d1d5db",
    borderRadius: 18,
    paddingHorizontal: 25,
    paddingVertical: 45,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1f2937",
  },

  emptyText: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 9,
  },

  shopButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },

  shopButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
});
