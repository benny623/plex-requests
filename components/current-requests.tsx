"use client";

import { useState, useEffect } from "react";
import { Request, currentProps } from '@/lib/types';
import Link from "next/link";

export default function CurrentRequests({ currentRequests }: currentProps) {
  const [requests, setRequests] = useState<Request[]>(currentRequests);

  // Put data into temporary State
  useEffect(() => {
    setRequests(currentRequests);
  }, [currentRequests]);

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    requestId: number
  ) => {
    const newStatus = e.target.value;

    // Update status locally for immediate feedback
    const updatedRequestList = requests.map((request: Request) =>
      request.request_id === requestId
        ? { ...request, request_status: newStatus }
        : request
    );
    setRequests(updatedRequestList);

    try {
      // Send update to server
      const response = await fetch(`/api/update-request/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedRequest = await response.json();
      console.log("Status updated", updatedRequest);

      // Send notification for updated status
      try {
        const response = await fetch("/api/update-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            id: requestId,
            title: requests.find((r) => r.request_id === requestId)
              ?.request_title,
            // email: requests.find((r) => r.request_id === requestId)
            //   ?.request_requestor, // TODO: need to change this line to request_email after user auth is set up
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send notification");
        }

        const notification = await response.json();

        console.log("Notification sent", notification);
      } catch (err) {
        console.error("Error sending notification", err);
      }
    } catch (err) {
      console.error("Error updating status:", err);

      // Revert the status if the update failed
      const revertedRequestList = requests.map((request: Request) =>
        request.request_id === requestId
          ? { ...request, request_status: request.request_status }
          : request
      );
      setRequests(revertedRequestList);
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
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request: Request) => (
              <tr key={request.request_id}>
                <td>{request.request_title}</td>
                <td>{request.request_year}</td>
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
                No current requests
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
