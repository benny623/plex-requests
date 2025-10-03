import { create } from "zustand";
import { checkAdmin } from "@/lib/helpers";

const useAdminStore = create((set) => ({
  isAdmin: false,
  adminLoading: false,
  adminError: null,
  fetchAdminStatus: async (token) => {
    set({ adminLoading: true });
    try {
      const data = await checkAdmin(token);
      set({ isAdmin: data, adminLoading: false });
    } catch (err) {
      console.error("Error validating admin:", err);
      set({ adminError: err.message, adminLoading: false });
    }
  },
}));

export default useAdminStore;
