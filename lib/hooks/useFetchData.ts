import { useState } from "react";

import { Request } from "@/lib/types";

export const useFetchData = (fetchRequests: () => Promise<any>) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: false,
  });

  const fetchData = async () => {
    setStatus({ loading: true, error: "", success: false });
    try {
      const result = await fetchRequests();
      setRequests(result);
    } catch (err) {
      console.error("Error:", err);
      setStatus({
        loading: false,
        error: (err as Error).message,
        success: false,
      });
    } finally {
      setStatus((prev) => ({ ...prev, loading: false, success: true }));
    }
  };

  return { requests, status, fetchData };
};
