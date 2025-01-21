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
    <div className="min-h-screen bg-base-100">
      <div className="flex justify-start pl-10 pt-10">
        <Link href={"/"} className="btn btn-primary">
          Home
        </Link>
      </div>
      {isAdmin &&
        (!table ? (
          <div className="text-center text-xs font-bold text-base-content pt-4">
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
              Current Requests
            </button>
          </div>
        ))}
      <div className="flex justify-center items-center py-10">
        {!isAdmin ? (
          <h1 className="font-bold">Not an admin</h1>
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
