import React from "react";
import { Request, Status } from "@/lib/types";

type RequestRowProps = {
  request: Request;
  loading: Status;
  table: Boolean;
  setTable: React.Dispatch<React.SetStateAction<boolean>>;
};

const RequestRow: React.FC<RequestRowProps> = ({
  request,
  loading,
  table,
  setTable,
}) => {
  const statusColor = (status: string) => {
    switch (status) {
      case "New":
        return "select-secondary";
      case "In Progress":
        return "select-primary";
      case "Pending":
        return "select-warning";
      case "Complete":
        return "select-success";
      default:
        return "";
    }
  };

  return (
    <tr>
      <td>{request.request_title}</td>
      <td>{request.request_year}</td>
      <td>{request.request_type}</td>
      <td>
        <p
          className={`rounded-lg text-center border-2 p-2 ${statusColor(
            request.request_status
          )}`}
        >
          {request.request_status}
        </p>
      </td>
      <td>
        <p>{request.request_note}</p>
      </td>
    </tr>
  );
};

export default RequestRow;
