"use client";

import React, { useState, useEffect } from "react";
import AdminTable from "@/components/admin-table";

import { fetchAllRequests } from "@/lib/fetchRequests";
import { useFetchData } from "@/lib/hooks/useFetchData";

const AdminPage = () => {
  const { requests, status, fetchData } = useFetchData(fetchAllRequests);
  const [isAdmin, setIsAdmin] = useState(false);

  // Set isAdmin on page load
  useEffect(() => {
    if (
      window.localStorage.getItem("isAdmin") ===
      process.env.NEXT_PUBLIC_ADMIN_KEY
    ) {
      setIsAdmin(true);
      // This allows data to ONLY be fetched if isAdmin is true
      fetchData();
    }
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center py-10 bg-base-100">
      {!isAdmin ? (
        <h1 className="font-bold">Not an admin</h1>
      ) : status.loading ? (
        <span className="loading loading-dots loading-md"></span>
      ) : requests.length > 0 ? (
        <>
          <AdminTable requests={requests} />
          {/* <DeletionModal
            isOpen={modalData.isOpen}
            title={modalData.requestTitle || ""}
            onClose={() =>
              setModalData({
                isOpen: false,
                requestId: null,
                requestTitle: null,
              })
            }
            onConfirm={confirmDelete}
          /> */}
        </>
      ) : (
        <h1 className="font-bold">No current requests</h1>
      )}
    </div>
  );
};

export default AdminPage;
