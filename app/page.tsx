"use client";

import { useEffect } from "react";
import { fetchCurrentRequests } from "@/lib/fetchRequests";
import { useFormHandlers } from "@/lib/hooks/useFormHandlers";

import CurrentRequests from "@/components/current-requests";
import RequestForm from "@/components/request-form";
import Link from "next/link";

export default function Home() {
  const { requests, fetchData } = useFormHandlers(fetchCurrentRequests);

  // Initial GET request
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="h-screen">
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:pl-20 lg:text-left">
            <h1 className="text-5xl font-bold">
              Submit a request!<span className="m-2">🎬</span>
            </h1>
            <p className="py-6">
              Submit a media request by filling out the form!
            </p>
            <Link href="/#requests-table" className="text-info font-bold">
              See current requests
            </Link>
          </div>
          <RequestForm />
        </div>
      </div>
      <CurrentRequests currentRequests={requests} />
    </div>
  );
}
