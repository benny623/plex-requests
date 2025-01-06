"use client";

import React, { useState } from "react";

import AdminRow from "@/components/admin-row";

import { Request, RequestTableProps } from "@/lib/types";
import { useAdminHandlers } from "@/lib/hooks/useAdminHandlers";

const AdminTable: React.FC<RequestTableProps> = ({
  requests,
  setRequests,
  loading,
}) => {
  const [modalData, setModalData] = useState<Request | null>(null);
  const {
    handleStatusChange,
    handleNoteChange,
    handleNoteBlur,
    handleDeletion,
  } = useAdminHandlers(requests, setRequests || (() => {}));

  const handleRequestDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    requestId: number
  ): Promise<void> => {
    e.preventDefault();
    const request = requests.find((r) => r.request_id === requestId);
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
      <table className="table max-w-5xl border-collapse table-pin-rows pt-10">
        <thead>
          <tr>
            <th></th>
            <th>Status</th>
            <th>Poster</th>
            <th>Title</th>
            <th>Additional Info</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {!loading.loading && loading.success ? (
            requests.length > 0 ? (
              requests.map((request: Request) => (
                <AdminRow
                  key={request.request_id}
                  request={request}
                  onStatusChange={handleStatusChange}
                  onNoteChange={handleNoteChange}
                  onNoteBlur={handleNoteBlur}
                  onRequestDelete={handleRequestDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No current requests
                </td>
              </tr>
            )
          ) : (
            <tr>
              <td colSpan={6} className="text-center">
                <span className="loading loading-dots loading-md"></span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {modalData && (
        <dialog open className="modal bg-base-300 bg-opacity-50">
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
              Are you sure?
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
