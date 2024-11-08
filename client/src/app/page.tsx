import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function Home() {
  const res = await fetch('http://localhost:5000/api/requests');
  const requests = await res.json();

  return (
    <div>
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Release Year</TableHead>
          <TableHead>Requestor</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((requests) => (
          <TableRow key={requests.title}>
            <TableCell>{requests.title}</TableCell>
            <TableCell>{requests.release_year}</TableCell>
            <TableCell>{requests.requestor}</TableCell>
            <TableCell>{requests.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}
