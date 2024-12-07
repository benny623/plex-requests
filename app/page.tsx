"use client";

import { useState } from "react";

import { fetchCurrentRequests } from "@/lib/fetchRequests";
import { useFetchData } from "@/lib/hooks/useFetchData";

import CurrentRequests from "@/components/current-requests";
import SearchForm from "@/components/search-form";
import RequestForm from "@/components/request-form";
import Link from "next/link";

export default function Home() {
  const { requests, status, fetchData } = useFetchData(fetchCurrentRequests);
  const [searchState, setSearchState] = useState(true);

  return (
    <div className="h-screen">
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:pl-20 lg:text-left">
            <h1 className="text-5xl font-bold">
              Submit a request!<span className="m-2">🎬</span>
            </h1>
            <p className="pt-6">
              Submit a media request by searching or manually filling out the
              form!
            </p>
            {/* TODO: Style this next section a bit better */}
            <ul className="menu menu-horizontal bg-base-200 rounded-box">
              <li>
                <button
                  onClick={() => {
                    setSearchState(true);
                  }}
                >
                  Search
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSearchState(false);
                  }}
                >
                  Form
                </button>
              </li>
            </ul>
            <br />
            <Link href="/#requests-table" className="text-info font-bold">
              See current requests
            </Link>
          </div>
          {searchState ? (
            <SearchForm refetchRequests={fetchData} />
          ) : (
            <RequestForm refetchRequests={fetchData} />
          )}
        </div>
      </div>
      <CurrentRequests currentRequests={requests} loading={status} />
    </div>
  );
}
