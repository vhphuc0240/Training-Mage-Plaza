import axios from "axios";

const client = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function api(
  url,
  method = "GET",
  data = {},
  params = {},
  options = {},
) {
  return client
    .request({
      ...options,
      data,
      headers: {
        accept: "application/json",
        ...(options.headers || {}),
      },
      method,
      params,
      url: url,
    })
    .then((res) => res.data);
}
