import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const API = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

// Referrals
export const referralsApi = {
  list: () => api.get("/referrals").then((r) => r.data),
  get: (code) => api.get(`/referrals/${code}`).then((r) => r.data),
  create: (payload) => api.post("/referrals", payload).then((r) => r.data),
  update: (code, payload) => api.patch(`/referrals/${code}`, payload).then((r) => r.data),
  remove: (code) => api.delete(`/referrals/${code}`).then((r) => r.data),
  events: (code) => api.get(`/referrals/${code}/events`).then((r) => r.data),
  track: (code, payload) => api.post(`/referrals/${code}/events`, payload).then((r) => r.data),
};

// Coupons
export const couponsApi = {
  list: () => api.get("/coupons").then((r) => r.data),
  get: (code) => api.get(`/coupons/${code}`).then((r) => r.data),
  create: (payload) => api.post("/coupons", payload).then((r) => r.data),
  update: (code, payload) => api.patch(`/coupons/${code}`, payload).then((r) => r.data),
  remove: (code) => api.delete(`/coupons/${code}`).then((r) => r.data),
  validate: (code) => api.post(`/coupons/${code}/validate`).then((r) => r.data),
  redeem: (code, payload) => api.post(`/coupons/${code}/redeem`, payload).then((r) => r.data),
  redemptions: (code) => api.get(`/coupons/${code}/redemptions`).then((r) => r.data),
};

export const adminApi = {
  stats: () => api.get("/admin/stats").then((r) => r.data),
};

export default api;
