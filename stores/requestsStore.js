import { create } from "zustand";
import {
  fetchCurrentRequests,
  fetchCompletedRequests,
  fetchAllCompletedRequests,
} from "@/lib/fetchRequests";

const useRequestsStore = create((set) => ({
  currentRequests: [],
  completedRequests: [],
  setCurrentRequests: (data) => {
    set({ currentRequests: data });
  },
  setCompletedRequests: (data) => {
    set({ completedRequests: data });
  },
  fetchCurrentRequests: async (token) => {
    const data = await fetchCurrentRequests(token || "");
    set({ currentRequests: data });
  },
  fetchCompletedRequests: async (token) => {
    const data = await fetchCompletedRequests(token || "");
    set({ completedRequests: data });
  },
  fetchAllCompletedRequests: async (token) => {
    const data = await fetchAllCompletedRequests(token || "");
    set({ completedRequests: data });
  },
}));

export default useRequestsStore;
