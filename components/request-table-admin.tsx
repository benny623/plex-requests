import React from "react";
import AdminRow from "@/components/admin-row";

import { RequestTableProps } from "@/lib/types";

const RequestTable: React.FC<RequestTableProps> = ({
  requests,
  onStatusChange,
  onNoteChange,
  onNoteBlur,
  onDelete,
}) => {
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
        {requests.map((request) => (
          <AdminRow
            key={request.request_id}
            request={request}
            onStatusChange={onStatusChange}
            onNoteChange={onNoteChange}
            onNoteBlur={onNoteBlur}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
};

export default RequestTable;
