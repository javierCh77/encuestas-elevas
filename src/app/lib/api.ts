// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3010/api",
  //baseURL: 'http://31.97.23.62:3010/api',
});

export default api;
