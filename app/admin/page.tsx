"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import AdminTable from "@/components/admin-table";

import useAdminStore from "@/stores/adminStore";
import useStatusStore from "@/stores/statusStore";
import useRequestsStore from "@/stores/requestsStore";

const AdminPage = () => {
  const [refresh, setRefresh] = useState(false);
  const { isAdmin, fetchAdminStatus } = useAdminStore();
  const { table, setTable } = useStatusStore();
  const {
    currentRequests,
    completedRequests,
    setCurrentRequests,
    setCompletedRequests,
    fetchCurrentRequests,
    fetchAllCompletedRequests,
  } = useRequestsStore();

  // Get admin and fetch initial data
  useEffect(() => {
    const getAdminAndRequests = async () => {
      await fetchAdminStatus(window.localStorage.getItem("isAdmin") || "");

      if (isAdmin) {
        if (table === "current" && !currentRequests.length) {
          fetchCurrentRequests(window.localStorage.getItem("isAdmin") || "");
        }

        if (table === "completed" && !completedRequests.length) {
          fetchAllCompletedRequests(
            window.localStorage.getItem("isAdmin") || ""
          );
        }
      }
    };

    getAdminAndRequests();
  }, [
    isAdmin,
    table,
    fetchAdminStatus,
    fetchCurrentRequests,
    fetchAllCompletedRequests,
    currentRequests.length,
    completedRequests.length,
  ]);

  // Refresh button clicked
  useEffect(() => {
    const getData = async () => {
      if (isAdmin) {
        fetchCurrentRequests(window.localStorage.getItem("isAdmin") || "");
        fetchAllCompletedRequests(window.localStorage.getItem("isAdmin") || "");
      }
    };
    getData();
  }, [refresh]);

  return (
    <div className="min-h-screen bg-base-200">
      {isAdmin && (
        <div className="flex justify-center items-center gap-8 text-center pt-10">
          <Link href={"/"} className="btn btn-soft btn-primary">
            Home
          </Link>
          {table === "current" ? (
            <button
              onClick={() => {
                setTable("completed");
              }}
              className="btn btn-soft btn-secondary"
            >
              Completed Requests
            </button>
          ) : (
            <button
              onClick={() => {
                setTable("current");
              }}
              className="btn btn-soft btn-secondary"
            >
              Current Requests
            </button>
          )}
        </div>
      )}

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
        ) : table === "current" ? (
          <AdminTable
            requests={currentRequests}
            setRequests={setCurrentRequests}
            refresh={refresh}
            setRefresh={setRefresh}
            table={table}
            setTable={setTable}
          />
        ) : (
          <AdminTable
            requests={completedRequests}
            setRequests={setCompletedRequests}
            refresh={refresh}
            setRefresh={setRefresh}
            table={table}
            setTable={setTable}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPage;
