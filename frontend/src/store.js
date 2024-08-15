import { create } from "zustand";

const token = localStorage.getItem("token");

export default create((set) => ({
  user: null,
  token: token ? token : null,
  login: (user, token) => set(() => ({ user, token })),
  logout: () => set(() => ({ user: null, token: null })),
}));
