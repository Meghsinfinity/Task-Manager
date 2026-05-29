import axios from "axios";

const API = axios.create({
  baseURL: "https://task-manager-api-p9rp.onrender.com/"
});

export default API;