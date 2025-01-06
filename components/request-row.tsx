import React from "react";
import { Request } from "@/lib/types";

type RequestRowProps = {
  request: Request;
};

const RequestRow: React.FC<RequestRowProps> = ({ request }) => {
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
    <tr className="text-slate-100">
      <td>
        <p
          className={`rounded-lg text-center border-2 p-2 ${statusColor(
            request.request_status
          )}`}
        >
          {request.request_status}
        </p>
      </td>
      <td>{request.request_title}</td>
      <td>{request.request_optional.year}</td>
      <td>{request.request_type}</td>
      <td>
        <p>{request.request_note}</p>
      </td>
    </tr>
  );
};

export default RequestRow;
