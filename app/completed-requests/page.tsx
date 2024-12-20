"use client";

import { fetchCompleteRequests } from "@/lib/fetchRequests";
import { useFetchData } from "@/lib/hooks/useFetchData";

import CompletedRequests from "@/components/completed-requests";
import { useEffect } from "react";

export default function CompletedRequestsTable() {
  const { requests, status, fetchData } = useFetchData(fetchCompleteRequests);

  // Fetch inital data
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="h-screen">
      <CompletedRequests completedRequests={requests} loading={status} />
    </div>
  );
}
