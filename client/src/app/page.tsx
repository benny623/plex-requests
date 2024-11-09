import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import RequstForm from '../components/send-request';

export default async function Home() {
  // Get requests json
  const res = await fetch("http://localhost:5000/api/requests");
  const requests = await res.json();

  return (
    <div className="">
      <RequstForm />
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
    </div>
  );
}
