import React from "react";
import { Request } from "@/lib/types";
import AdminRow from "@/components/admin-row";

type RequestTableProps = {
  requests: Request[];
  onStatusChange: (id: number, status: string) => void;
  onNoteChange: (id: number, note: string) => void;
  onDelete: (id: number, title: string) => void;
};

const RequestTable: React.FC<RequestTableProps> = ({
  requests,
  onStatusChange,
  onNoteChange,
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
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
};

export default RequestTable;
