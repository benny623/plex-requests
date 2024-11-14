"use client"

import { useState, useEffect } from "react";
import { fetchCurrentRequests } from "../../lib/fetchRequests";
import RequestTable from "../../components/request-table";
import RequstForm from "../../components/request-form";

// Define the Request type
interface Request {
  request_id: number;
  request_title: string;
  request_year: number;
  request_requestor: string;
  request_type: string;
  request_status: string;
}

export default function Home() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [refetch, setRefetch] = useState(false);

  const fetchData = async () => {
    //setStatus({ loading: true, error: null });
    try {
      const result = await fetchCurrentRequests();
      setRequests(result);
    } catch (err: unknown) {
      //setStatus({ loading: false, error: (err as Error).message });
    } finally {
      //setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [refetch]);

  return (
    <div>
      <RequstForm refetch={refetch} />
      <RequestTable requestsData={requests} />
    </div>
  );
}
