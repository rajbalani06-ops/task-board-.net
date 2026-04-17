import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5100/api",
});

export default API;