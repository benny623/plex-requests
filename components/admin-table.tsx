"use client";

import React, { useState, useEffect } from "react";

import AdminRow from "@/components/admin-row";

import { Request } from "@/lib/types";
import { useAdminHandlers } from "@/lib/hooks/useAdminHandlers";

const AdminTable: React.FC<{ requests: Request[] }> = ({ requests }) => {
  const [allRequests, setAllRequests] = useState<Request[]>(requests);
  const [modalData, setModalData] = useState<Request | null>(null);
  const {
    handleStatusChange,
    handleNoteChange,
    handleNoteBlur,
    handleDeletion,
  } = useAdminHandlers(allRequests, setAllRequests);

  // Put data into temporary State
  useEffect(() => {
    console.log("request table");
    setAllRequests(requests);
  }, [requests]);

  const handleRequestDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    requestId: number
  ): Promise<void> => {
    e.preventDefault();
    const request = allRequests.find((r) => r.request_id === requestId);
    setModalData(request || null);
  };

  const handleModalCancel = () => {
    setModalData(null); // Close modal
  };

  const handleModalConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (modalData) {
      handleDeletion(e, modalData.request_id); // Call delete handler with request ID
    }
    setModalData(null); // Close modal
  };

  return (
    <>
      <table className="table w-full max-w-5xl border-collapse table-pin-rows">
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Release Year</th>
            <th>Type</th>
            <th>Status</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {allRequests.map((request) => (
            <AdminRow
              key={request.request_id}
              request={request}
              onStatusChange={handleStatusChange}
              onNoteChange={handleNoteChange}
              onNoteBlur={handleNoteBlur}
              onRequestDelete={handleRequestDelete}
            />
          ))}
        </tbody>
      </table>
      {modalData && (
        <dialog open className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={handleModalCancel}
              >
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">
              Are you sure you want to delete this?
            </h3>
            <p className="my-4">Request: {modalData.request_title}</p>
            <div className="modal-action gap-4">
              <button className="btn btn-neutral" onClick={handleModalCancel}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={handleModalConfirm}>
                Delete
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={handleModalCancel}>close</button>
          </form>
        </dialog>
      )}
    </>
  );
};

export default AdminTable;
