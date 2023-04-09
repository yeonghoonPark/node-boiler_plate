import axios from "axios";
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "./types";

export async function loginUser(dataToSubmit) {
  // const req = axios
  //   .post("/api/users/login", dataToSubmit)
  //   .then((res) => res.data);

  const req = await axios.post("/api/users/login", dataToSubmit);
  const data = await req.data;
  console.log(data);
  return {
    type: LOGIN_USER,
    payload: data,
  };
}

export function registerUser(dataToSubmit) {
  const req = axios
    .post("/api/users/register", dataToSubmit)
    .then((res) => res.data);
  return {
    type: REGISTER_USER,
    payload: req,
  };
}

export function auth() {
  const req = axios.get("/api/users/auth").then((res) => res.data);
  return {
    type: AUTH_USER,
    payload: req,
  };
}
