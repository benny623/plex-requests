"use client";

import { useEffect, useState } from "react";
import { fetchCompletedRequests } from "@/lib/fetchRequests";
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
            // Add all rows from DB
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
                    // onChange={(e) =>
                    //   handleStatusChange(e, request.request_id)
                    // }
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Complete">Complete</option>
                  </select>
                </TableCell>
              </TableRow>
            ))
          ) : (
            // If no requests are found
            <TableRow>
              <TableCell colSpan={5}>No requests found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
