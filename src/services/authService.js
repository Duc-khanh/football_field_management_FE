import axios from "axios";

export async function fetchCurrentUser() {
  const token = localStorage.getItem("token");
  const res = await axios.get("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}