"use client";

import { useEffect, useState } from "react";
import { fetchCompletedRequests } from "@/lib/fetchRequests";

// Define the Request type
interface Request {
  request_id: number;
  request_title: string;
  request_year: number;
  request_requestor: string;
  request_type: string;
  request_status: string;
}

export default function CompletedRequests() {
  const [requests, setRequests] = useState<Request[]>([]);

  const fetchData = async () => {
    try {
      const result = await fetchCompletedRequests();
      setRequests(result);
    } catch (err: unknown) {
    } finally {
    }
  };

  // Get requests json
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="h-96 overflow-x-auto">
      <table className="table table-pin-rows">
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
            // Add all rows from DB
            requests.map((request: any) => {
              if (request.request_status != "Complete") {
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
                        className="select select-bordered select-sm w-full max-w-xs"
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Complete">Complete</option>
                      </select>
                    </td>
                  </tr>
                );
              }
            })
          ) : (
            // If no requests are found
            <tr>
              <td>No requests found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
