"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import AdminTable from "@/components/admin-table";

import {
  //fetchAllRequests,
  fetchCurrentRequests,
  fetchCompleteRequests,
} from "@/lib/fetchRequests";
import { useFetchData } from "@/lib/hooks/useFetchData";

const AdminPage = () => {
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
  //const { requests, status, fetchData } = useFetchData(fetchAllRequests);
  const [isAdmin, setIsAdmin] = useState(false);
  const [table, setTable] = useState(false);

  // Set isAdmin on page load
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/check-admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: window.localStorage.getItem("isAdmin"),
          }),
        });
        const data = await res.json();

        if (data.isAdmin) {
          setIsAdmin(true);
          fetchCurrentData();
          fetchCompletedData();
        }
      } catch (err) {
        console.error("Error validating admin:", err);
      }
    };
    checkAdmin();
  }, []);

  return (
    <div className="min-h-screen bg-base-100">
      <div className="flex justify-start pl-10 pt-10">
        <Link href={"/"} className="btn btn-primary">
          Home
        </Link>
      </div>
      {!table ? (
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
      )}
      <div className="flex justify-center items-center py-10">
        {!isAdmin ? (
          <h1 className="font-bold">Not an admin</h1>
        ) : !table ? (
          <AdminTable
            requests={currentRequests}
            loading={currentStatus}
            table={table}
            setTable={setTable}
          />
        ) : (
          <AdminTable
            requests={completedRequests}
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
