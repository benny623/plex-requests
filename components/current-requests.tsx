"use client";

import { useState, useEffect } from "react";
import { Request, currentProps } from "@/lib/types";
import Link from "next/link";

export default function CurrentRequests({ currentRequests }: currentProps) {
  const [requests, setRequests] = useState<Request[]>(currentRequests);

  // Put data into temporary State
  useEffect(() => {
    setRequests(currentRequests);
  }, [currentRequests]);

  // Get the status color
  function statusColor(status: string) {
    switch (status) {
      case "New":
        return "border-secondary";
      case "In Progress":
        return "border-primary";
      case "Pending":
        return "border-warning";
      case "Complete":
        return "border-success";
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
            <th>Note</th>
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
                  <p
                    className={`rounded-lg text-center border-4 p-2 ${statusColor(
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
