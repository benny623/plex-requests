"use client";

import React, { useState, useEffect } from "react";

import AdminRow from "@/components/admin-row";

import { Request } from "@/lib/types";
import { useAdminHandlers } from "@/lib/hooks/useAdminHandlers";

const AdminTable = ({ requests }: { requests: Request[] }) => {
  const [allRequests, setAllRequests] = useState<Request[]>(requests);
  const {
    handleStatusChange,
    handleNoteChange,
    handleNoteBlur,
    handleDeletion,
  } = useAdminHandlers(allRequests, setAllRequests);

  // Put data into temporary State
  useEffect(() => {
    console.log("request table");
    setAllRequests(requests);
  }, [requests]);

  return (
    <table className="table w-full max-w-5xl border-collapse table-pin-rows">
      <thead>
        <tr>
          <th></th>
          <th>Title</th>
          <th>Release Year</th>
          <th>Type</th>
          <th>Status</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        {allRequests.map((request) => (
          <AdminRow
            key={request.request_id}
            request={request}
            onStatusChange={handleStatusChange}
            onNoteChange={handleNoteChange}
            onNoteBlur={handleNoteBlur}
            onDelete={handleDeletion}
          />
        ))}
      </tbody>
    </table>
  );
};

export default AdminTable;
