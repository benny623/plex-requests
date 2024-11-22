"use client";

import { fetchCompleteRequests } from "@/lib/fetchRequests";
import { useFetchData } from "@/lib/hooks/useFetchData";

import CompletedRequests from "@/components/completed-requests";

export default function CompletedRequestsTable() {
  const { requests, status } = useFetchData(
    fetchCompleteRequests
  );
  return (
    <div className="h-screen">
      <CompletedRequests completedRequests={requests} loading={status} />
    </div>
  );
}
