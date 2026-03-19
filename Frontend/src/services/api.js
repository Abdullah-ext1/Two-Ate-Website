import axios from "axios";

const API = axios.create({
  baseURL: "/api/v1",
});

export const fetchProducts = async () => {
  const { data } = await API.get("/product");
  return data.data.products;
};
