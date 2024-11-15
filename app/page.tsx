import RequestTable from "@/components/request-table";
import RequstForm from "@/components/request-form";

export default function Home() {
  return (
    <div className="h-screen">
      <RequstForm />
      <RequestTable />
    </div>
  );
}
