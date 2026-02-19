import axios from 'axios';

const API_BASE = 'https://api.buywaterh2o.com/api/pay';


export const createPayAPI = (checkout) => axios.post(API_BASE, checkout);