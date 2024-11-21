"use client";

import { useEffect } from "react";
import { fetchAllRequests } from "@/lib/fetchRequests";
import { useFormHandlers } from "@/lib/hooks/useFormHandlers";

import AdminPage from "@/components/admin-page";

export default function CompletedRequestsTable() {
  const { requests, fetchData, status } = useFormHandlers(fetchAllRequests);

  // Initial GET request
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="h-screen">
      <AdminPage allRequests={requests} loading={status} />
    </div>
  );
}
