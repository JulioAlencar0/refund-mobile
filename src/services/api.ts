import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.50.138:3000", // teu IP local
});

export default api;
