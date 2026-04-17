import API from "./api";

export const getDashboard = async () => {
  try {
    const res = await API.get("/dashboard");
    return res.data;
  } catch (err) {
    console.error("GET DASHBOARD ERROR:", err.response?.data || err.message);
    throw err;
  }
};
