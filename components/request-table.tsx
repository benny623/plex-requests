import React, { useState, useEffect } from "react";
import AdminRow from "@/components/admin-row";

import {
  fetchCurrentRequests,
  fetchCompleteRequests,
} from "@/lib/fetchRequests";
import { Request } from "@/lib/types";
import { useFetchData } from "@/lib/hooks/useFetchData";

type RequestTableProps = {
  requests: Request[];
};

const RequestTable: React.FC<RequestTableProps> = ({
  requests,
}) => {
  const {
    requests: currentRequests,
    status: currentStatus,
    fetchData: fetchCurrentData,
  } = useFetchData(fetchCurrentRequests);
  const {
    requests: completedRequests,
    status: completedStatus,
    fetchData: fetchCompletedData,
  } = useFetchData(fetchCompleteRequests);

  const [table, setTable] = useState(false);

  // Fetch inital data
  useEffect(() => {
    fetchCurrentData();
    fetchCompletedData();
  }, []);

  return (
    <div className="requests-table min-h-screen flex justify-center items-center bg-base-200">
        <div className="card w-full sm:w-3/4 xl:w-2/3 bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="overflow-x-auto">
    <table className="table w-full max-w-5xl border-collapse table-pin-rows">
      <thead>
        <tr>
          <th></th>
          <th>Title</th>
          <th>Release Year</th>
          <th>Type</th>
          <th>Status</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => (
          <RequestRow
            key={request.request_id}
            request={request}
            table={table}
            setTable={setTable}
          />
        ))}
      </tbody>
    </table></div></div></div></div>
  );
};

export default RequestTable;
