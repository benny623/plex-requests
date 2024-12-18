"use client";

import { fetchCurrentRequests } from "@/lib/fetchRequests";
import { useFetchData } from "@/lib/hooks/useFetchData";

import CurrentRequests from "@/components/current-requests";
import SearchForm from "@/components/search-form";
import Link from "next/link";

export default function Home() {
  const { requests, status, fetchData } = useFetchData(fetchCurrentRequests);

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
            <SearchForm refetchRequests={fetchData} />
          </div>
        </div>
      </div>
      <CurrentRequests currentRequests={requests} loading={status} />
    </div>
  );
}
