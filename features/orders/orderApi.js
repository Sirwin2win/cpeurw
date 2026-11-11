// src/features/products/productAPI.js

import axios from "axios";

const API_BASE = "https://api2.buywaterh2o.com/api/orders";

export const fetchOrdersAPI = () => axios.get(API_BASE);
export const fetchOrderByIdAPI = (userId) => axios.get(`${API_BASE}/${userId}`);
export const fetchOrderByUserIdAPI = (token) =>
  axios.get(`${API_BASE}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export const fetchByOrderRefAPI = (orderRef, token) =>
  axios.post(
    `${API_BASE}/order-ref`,
    { orderRef },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
export const createOrderAPI = (checkout, token) =>
  axios.post(API_BASE, checkout, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export const createPayAPI = (transaction_id, token) =>
  axios.post(
    `${API_BASE}/payment/verify`,
    { transaction_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
// export const updateProductAPI = (id, product) => axios.put(`${API_BASE}/${id}`, product);
// export const deleteProductAPI = (id) => axios.delete(`${API_BASE}/${id}`);
