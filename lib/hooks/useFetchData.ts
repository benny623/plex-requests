import { useState, useEffect } from "react";

export const useFetchData = (fetchRequests: () => Promise<any>) => {
  const [requests, setRequests] = useState<any[]>([]);
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

  useEffect(() => {
    fetchData();
  }, []);

  return { requests, status, fetchData };
};
