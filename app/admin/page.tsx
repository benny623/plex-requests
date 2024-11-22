"use client";

import { fetchAllRequests } from "@/lib/fetchRequests";
import { useFetchData } from "@/lib/hooks/useFetchData";

import AdminPage from "@/components/admin-page";

export default function CompletedRequestsTable() {
  const { requests, status } = useFetchData(fetchAllRequests);
  return (
    <div className="h-screen">
      <AdminPage allRequests={requests} loading={status} />
    </div>
  );
}
