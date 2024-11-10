import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

export default async function RequestTable() {
  const [requests, setRequests] = useState([]);
  const [stat, setStat] = useState({
    loading: true,
    error: null,
  });
  const [query, setQuery] = useState("");

  // Get requests json
  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      setStat({ ...stat, loading: true });
      try {
        const res = await fetch("http://localhost:5000/api/requests");
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await res.json();
        setRequests(result); // Send data to State
      } catch (err: any) {
        setStat({ loading: false, error: err.message }); // Set errors if necessary
      } finally {
        setStat({ ...stat, loading: false }); // Fetch complete
      }
    };

    fetchData();
  }, [query]);

  //const res = await fetch("http://localhost:5000/api/requests");
  //const requests = await res.json();

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
          {requests.map((requests: any) => (
            <TableRow key={requests.request_title}>
              <TableCell>{requests.request_title}</TableCell>
              <TableCell>{requests.request_year}</TableCell>
              <TableCell>{requests.request_requestor}</TableCell>
              <TableCell>{requests.request_type}</TableCell>
              <TableCell>{requests.request_status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
