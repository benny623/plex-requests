"use client";

import { useEffect } from "react";
import { fetchCompleteRequests } from "@/lib/fetchRequests";
import { useFormHandlers } from "@/lib/hooks/useFormHandlers";
import CompletedRequests from "@/components/completed-requests";


export default function CompletedRequestsTable() {
  const {
    requests,
    fetchData
  } = useFormHandlers(fetchCompleteRequests);

  // Initial GET request
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="h-screen">
      <CompletedRequests completedRequests={requests} />
    </div>
  );
}
