"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the Request type
interface Request {
  request_id: number;
  request_title: string;
  request_year: number;
  request_requestor: string;
  request_type: string;
  request_status: string;
}

// Define the state type for `stat`
interface Stat {
  loading: boolean;
  error: string | null;
}

export default function RequestTable() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [stat, setStat] = useState<Stat>({
    loading: true,
    error: null,
  });
  const [updatedRequests, setUpdatedRequests] = useState(requests);

  // Get requests json
  useEffect(() => {
    const fetchData = async () => {
      setStat({ loading: true, error: null });
      try {
        const res = await fetch("http://localhost:5000/api/requests");
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await res.json();
        setRequests(result); // Send data to State
      } catch (err: unknown) {
        setStat({ loading: false, error: (err as Error).message }); // Ensure correct type
      } finally {
        setStat((prev) => ({ ...prev, loading: false })); // Fetch complete
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (e: any, requestId: number) => {
    const newStatus = e.target.value;
    
    // Update the status locally for immediate feedback
    const updatedRequestList = updatedRequests.map((request) =>
      request.request_id === requestId ? { ...request, request_status: newStatus } : request
    );
    setUpdatedRequests(updatedRequestList);

    // Send update to server
    try {
      const response = await fetch(`http://localhost:5000/api/update/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      const updatedRequest = await response.json();
      console.log("Status updated", updatedRequest);
    } catch (error) {
      console.error("Error updating status:", error);

      const revertedRequestList = updatedRequests.map((request) =>
        request.request_id === requestId ? { ...request, request_status: request.request_status } : request
      );
      setUpdatedRequests(revertedRequestList)
    }
  }

  return (
    <div className="m-20 text-foreground">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Release Year</TableHead>
            <TableHead>Requestor</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <TableRow key={request.request_title}>
                <TableCell>{request.request_title}</TableCell>
                <TableCell>{request.request_year}</TableCell>
                <TableCell>{request.request_requestor}</TableCell>
                <TableCell>{request.request_type}</TableCell>
                <TableCell>
                  <select
                    id="status"
                    name="status"
                    value={request.request_status}
                    onChange={(e) => handleStatusChange(e, request.request_id)}
                  >
                    <option value="new">New</option>
                    <option value="in progress">In Progress</option>
                    <option value="complete">Complete</option>
                  </select>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No requests found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
