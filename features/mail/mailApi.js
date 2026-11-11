// src/features/products/productAPI.js

import axios from 'axios';

const API_BASE = "https://api2.buywaterh2o.com";

export const createMailAPI = (mail) =>
  axios.post(API_BASE, mail);

export const resetMailAPI = (email) =>
  axios.post(`${API_BASE}/api/reset/forgot-password`, {
    email: email,
  });


export const updateMailAPI = (mail) =>
  axios.put(`${API_BASE}/api/reset/reset-password`, {
    token: mail.token,
    newPassword: mail.newPassword,
  });

