"use client";

import { useEffect, useState } from "react";
import { useFetchData } from "@/lib/hooks/useFetchData";
import {
  fetchCurrentRequests,
  fetchCompleteRequests,
} from "@/lib/fetchRequests";

import RequestTable from "@/components/request-table";
import SearchForm from "@/components/search-form";

export default function Home() {
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
    <div className="h-screen">
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:pl-20 lg:text-left">
            <h1 className="text-4xl font-bold">Submit a request! 🎬</h1>
            <p className="pt-6">
              Submit a media request by searching or manually filling out the
              form!
            </p>
            <button
              onClick={() => {
                document
                  .querySelector(".requests-table")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-info font-bold"
            >
              See current requests
            </button>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <SearchForm refetchRequests={fetchCurrentRequests} />
          </div>
        </div>
      </div>
      {!table ? (
        <RequestTable
          requests={currentRequests}
          loading={currentStatus}
          table={table}
          setTable={setTable}
        />
      ) : (
        <RequestTable
          requests={completedRequests}
          loading={completedStatus}
          table={table}
          setTable={setTable}
        />
      )}
    </div>
  );
}
