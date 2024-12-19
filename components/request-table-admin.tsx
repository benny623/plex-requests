import React from "react";
import { Request } from "@/lib/types";
import AdminRow from "@/components/admin-row";

type RequestTableProps = {
  requests: Request[];
    onStatusChange: (
      e: React.ChangeEvent<HTMLSelectElement>,
      requestId: number
    ) => Promise<void>;
    onNoteChange: (
      e: React.ChangeEvent<HTMLTextAreaElement>,
      requestId: number
    ) => Promise<void>;
    onNoteBlur: (
      e: React.ChangeEvent<HTMLTextAreaElement>,
      requestId: number
    ) => Promise<void>;
    onDelete: (
      e: React.MouseEvent<HTMLButtonElement>,
      requestId: number
    ) => Promise<void>;
};

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
