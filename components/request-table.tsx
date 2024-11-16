"use client";

import { useState } from "react";
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

type RequestTableProps = {
  requests: Request[]; // Ensure requestsData is an array
};

// Define the state type for `stat`
// interface Status {
//   loading: boolean;
//   error: string | null;
// }

export default function RequestTable({ requests }: RequestTableProps) {
  const [updatedRequests, setUpdatedRequests] = useState(requests);
  // const [status, setStatus] = useState<Status>({
  //   loading: true,
  //   error: null,
  // });

  const handleStatusChange = async (e: any, requestId: number) => {
    const newStatus = e.target.value;

    // Update the status locally for immediate feedback
    const updatedRequestList = updatedRequests.map((request: any) =>
      request.request_id === requestId
        ? { ...request, request_status: newStatus }
        : request
    );
    setUpdatedRequests(updatedRequestList);

    // Send update to server
    try {
      const response = await fetch(`/api/update/${requestId}`, {
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
          {requests.length > 0 ? (
            // Get all current requests
            requests.map((request: any) => {
              return (
                <tr key={request.request_title}>
                  <td>{request.request_title}</td>
                  <td>{request.request_year}</td>
                  <td>{request.request_requestor}</td>
                  <td>{request.request_type}</td>
                  <td>
                    <select
                      id="status"
                      name="status"
                      value={request.request_status}
                      onChange={(e) =>
                        handleStatusChange(e, request.request_id)
                      }
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
              );
            })
          ) : (
            // If no requests are found
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
              Don't see your request? Check here:{" "}
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
