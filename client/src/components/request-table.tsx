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
  //const [query, setQuery] = useState("");

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
                    onChange={(e) => {
                      // Handle select change logic here
                    }}
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
