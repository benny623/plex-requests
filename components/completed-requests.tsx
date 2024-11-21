"use client";

import { useState, useEffect } from "react";
import { Request, completedProps } from "@/lib/types";
import Link from "next/link";

export default function RequestTable({ completedRequests }: completedProps) {
  const [requests, setRequests] = useState<Request[]>(completedRequests);

  // Put data into temporary State
  useEffect(() => {
    setRequests(completedRequests);
  }, [completedRequests]);

  // Get the status color
  function statusColor(status: string) {
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
  }

  return (
    <div className="min-h-screen flex justify-center items-center py-10 bg-base-100">
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
              <Link href={"/#requests-table"} className="text-info font-bold">
                Go Back
              </Link>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
