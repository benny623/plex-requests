"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import AdminTable from "@/components/admin-table";

import { fetchAllRequests } from "@/lib/fetchRequests";
import { useFetchData } from "@/lib/hooks/useFetchData";

const AdminPage = () => {
  const { requests, status, fetchData } = useFetchData(fetchAllRequests);
  const [isAdmin, setIsAdmin] = useState(false);

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
          fetchData();
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
      <div className=" flex justify-center items-center py-10 ">
        {!isAdmin ? (
          <h1 className="font-bold">Not an admin</h1>
        ) : status.loading ? (
          <span className="loading loading-dots loading-md"></span>
        ) : requests.length > 0 ? (
          <AdminTable requests={requests} />
        ) : (
          <h1 className="font-bold">No current requests</h1>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
