import React from "react";
import { Request, RequestTableProps } from "@/lib/types";
import RequestRow from "@/components/request-row";

const RequestTable: React.FC<RequestTableProps> = ({
  requests,
  loading,
  table,
  setTable,
}) => {
  return (
    <div className="requests-table min-h-screen flex justify-center items-center bg-base-200">
      <div className="card w-full sm:w-3/4 xl:w-2/3 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table w-full border-collapse table-pin-rows">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Title</th>
                  <th>Release Year</th>
                  <th>Type</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {!loading.loading && loading.success ? (
                  requests.length > 0 ? (
                    requests.map((request: Request) => (
                      <RequestRow key={request.request_id} request={request} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">
                        No current requests
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      <span className="loading loading-dots loading-md"></span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {!table ? (
            <div className="text-center text-xs font-bold text-base-content pt-4">
              Don&apos;t see your request? Check here:{" "}
              <button
                onClick={() => {
                  setTable(!table);
                }}
                className="text-info font-bold"
              >
                Completed Requests
              </button>
            </div>
          ) : (
            <div className="text-center text-xs pt-4">
              <button
                onClick={() => {
                  setTable(!table);
                }}
                className="text-info font-bold"
              >
                Go Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestTable;
