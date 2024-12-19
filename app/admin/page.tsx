"use client";

import React, { useState, useEffect } from "react";
import { useAdminHandlers } from "@/lib/hooks/useAdminHandlers";
import RequestTable from "@/components/request-table-admin";
//import DeletionModal from "@/components/deletion-modal";

import { fetchAllRequests } from "@/lib/fetchRequests";
import { useFetchData } from "@/lib/hooks/useFetchData";

const AdminPage = () => {
  // const [requests, setRequests] = useState<Request[]>([]);
  // const [isAdmin, setIsAdmin] = useState(false);
  // const [loading, setLoading] = useState({ success: false, loading: true });
  const { requests, status } = useFetchData(fetchAllRequests);

  const {
    isAdmin,
    handleStatusChange,
    handleNoteChange,
    handleNoteBlur,
    handleDeletion,
  } = useAdminHandlers(requests);

  return (
    <div className="min-h-screen flex justify-center items-center py-10 bg-base-100">
      {/* <AdminPage allRequests={requests} loading={status} /> */}
      {!isAdmin ? (
        <h1 className="font-bold">Not an admin</h1>
      ) : status.loading ? (
        <span className="loading loading-dots loading-md"></span>
      ) : requests.length > 0 ? (
        <>
          <RequestTable
            requests={requests}
            onStatusChange={handleStatusChange}
            onNoteChange={handleNoteChange}
            onNoteBlur={handleNoteBlur}
            onDelete={handleDeletion}
          />
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
