// src/api/client/client.ts
import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
});

const client2 = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_2,
  timeout: 60000,
});
const client3 = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_PLANET,
  timeout: 60000,
});
export default {client,client2,client3};
