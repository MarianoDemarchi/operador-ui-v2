// src/api/client/client.ts
import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 0 // 👈 sin límite
});

const client2 = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_2,
  timeout: 0 // 👈 sin límite
});
const client3 = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_PLANET,
  timeout: 0 // 👈 sin límite
});
const client4 = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_NONE,
  timeout: 0 // 👈 sin límite
});
export default {client,client2,client3,client4};
