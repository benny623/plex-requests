import { create } from "zustand";

const useStatusStore = create((set) => ({
  loading: false,
  hasFetched: false,
  error: null,
  table: "current",
  setLoading: (loading) => set({ loading }),
  setHasFetched: (fetched) => set({ hasFetched: fetched }),
  setError: (error) => set({ error }),
  setTable: (newVal) => set({ table: newVal }),
}));

export default useStatusStore;
