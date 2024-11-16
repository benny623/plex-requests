"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Define the Request type
interface Request {
  request_id: number;
  request_title: string;
  request_year: number;
  request_requestor: string;
  request_type: string;
  request_status: string;
}

// Set props to Array
type RequestTableProps = {
  requests: Request[];
};

export default function RequestTable({ requests }: RequestTableProps) {
  const [updatedRequests, setUpdatedRequests] = useState<Request[]>(requests);

  // Put data into temporary State
  useEffect(() => {
    setUpdatedRequests(requests);
  }, [requests]);

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    requestId: number
  ) => {
    const newStatus = e.target.value;

    // Update status locally for immediate feedback
    const updatedRequestList = updatedRequests.map((request: Request) =>
      request.request_id === requestId
        ? { ...request, request_status: newStatus }
        : request
    );
    setUpdatedRequests(updatedRequestList);

    // Send update to server
    try {
      const response = await fetch(`/api/update-request/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedRequest = await response.json();
      console.log("Status updated", updatedRequest);
    } catch (error) {
      console.error("Error updating status:", error);

      // Revert the status if the update failed
      const revertedRequestList = updatedRequests.map((request: Request) =>
        request.request_id === requestId
          ? { ...request, request_status: request.request_status }
          : request
      );
      setUpdatedRequests(revertedRequestList);
    }
  };

  function statusColor(status: string) {
    switch (status) {
      case "New":
        return "select-secondary";
      case "In Progress":
        return "select-primary";
      case "Complete":
        return "select-success";
      default:
        return "";
    }
  }

  return (
    <div
      id="requests-table"
      className="min-h-screen flex justify-center items-center py-10"
    >
      <table className="table w-full max-w-4xl border-collapse table-pin-rows">
        <thead>
          <tr>
            <th>Title</th>
            <th>Release Year</th>
            <th>Requestor</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {updatedRequests.length > 0 ? (
            updatedRequests.map((request: Request) => (
              <tr key={request.request_id}>
                <td>{request.request_title}</td>
                <td>{request.request_year}</td>
                <td>{request.request_requestor}</td>
                <td>{request.request_type}</td>
                <td>
                  <select
                    id="status"
                    name="status"
                    value={request.request_status}
                    onChange={(e) => handleStatusChange(e, request.request_id)}
                    className={`select w-full max-w-xs select-sm ${statusColor(
                      request.request_status
                    )}`}
                  >
                    <option className="bg-secondary" value="New">
                      New
                    </option>
                    <option className="bg-primary" value="In Progress">
                      In Progress
                    </option>
                    <option className="bg-success" value="Complete">
                      Complete
                    </option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                No requests found
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5} style={{ textAlign: "center" }}>
              Don&apos;t see your request? Check here:{" "}
              <Link
                href={"/completed-requests"}
                className="text-info font-bold"
              >
                Completed Requests
              </Link>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
