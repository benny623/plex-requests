"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import AdminTable from "@/components/admin-table";

import {
  adminFetchCurrentRequests,
  adminFetchAllCompleteRequests,
} from "@/lib/fetchRequests";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { checkAdmin } from "@/lib/helpers";

const AdminPage = () => {
  const {
    requests: currentRequests,
    setRequests: setCurrentRequests,
    status: currentStatus,
    fetchData: fetchCurrentData,
  } = useFetchData(() =>
    adminFetchCurrentRequests(window.localStorage.getItem("isAdmin") || "")
  );
  const {
    requests: completedRequests,
    setRequests: setCompletedRequests,
    status: completedStatus,
    fetchData: fetchCompletedData,
  } = useFetchData(() =>
    adminFetchAllCompleteRequests(window.localStorage.getItem("isAdmin") || "")
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [table, setTable] = useState(false);

  // Set isAdmin on page load
  useEffect(() => {
    const getData = async () => {
      const adminStatus = await checkAdmin(
        window.localStorage.getItem("isAdmin") || ""
      );
      setIsAdmin(adminStatus);

      if (adminStatus) {
        fetchCurrentData();
        fetchCompletedData();
      }
    };
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-base-200">
      {isAdmin &&
        (!table ? (
          <div className="text-center pt-4 pt-10">
            <button
              onClick={() => {
                setTable(!table);
              }}
              className="btn btn-soft btn-secondary"
            >
              Completed Requests
            </button>
          </div>
        ) : (
          <div className="text-center pt-4 pt-10">
            <button
              onClick={() => {
                setTable(!table);
              }}
              className="btn btn-soft btn-secondary"
            >
              Current Requests
            </button>
          </div>
        ))}
      <div className="flex justify-center items-center py-10">
        {!isAdmin ? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
            <h2 className="text-3xl font-bold text-center text-primary m-3">
              Page Not Found
            </h2>
            <p className="text-center">Could not find requested resource.</p>
            <Link href="/" className="btn btn-primary m-5">
              Return Home
            </Link>
          </div>
        ) : !table ? (
          <AdminTable
            requests={currentRequests}
            setRequests={setCurrentRequests}
            loading={currentStatus}
            table={table}
            setTable={setTable}
          />
        ) : (
          <AdminTable
            requests={completedRequests}
            setRequests={setCompletedRequests}
            loading={completedStatus}
            table={table}
            setTable={setTable}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPage;
