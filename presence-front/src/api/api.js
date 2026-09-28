import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.40.137:3000/"
});

export default api;