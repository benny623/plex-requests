import RequestTable from "@/components/request-table";
import RequstForm from "@/components/request-form";

export default function Home() {
  return (
    <div className="bg-slate-600">
      <RequstForm />
      <RequestTable />
    </div>
  );
}
