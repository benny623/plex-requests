"use client";

import React, { useState } from "react";
import Image from "next/image";

import AdminRow from "@/components/admin-row";

import { Request, RequestTableProps } from "@/lib/types";
import { useAdminHandlers } from "@/lib/hooks/useAdminHandlers";

const AdminTable: React.FC<RequestTableProps> = ({
  requests,
  setRequests,
  loading,
  refresh,
  setRefresh
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
      <table className="table w-full xl:w-3/4 border-collapse table-pin-rows pt-10">
        <thead>
          <tr>
            <th>
              <button
              className="btn btn-ghost"
                onClick={() => {
                  setRefresh(!refresh);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                </svg>
              </button>
            </th>
            <th>Status</th>
            <th>Poster</th>
            <th>Title</th>
            <th>Additional Info</th>
            <th>Requestor Email</th>
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
                <td colSpan={7} className="text-center">
                  No current requests
                </td>
              </tr>
            )
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                <span className="loading loading-dots loading-md"></span>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Deletion Modal */}
      {modalData && (
        <dialog open className="modal bg-base-300/50">
          <div className="modal-box">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={handleModalCancel}
              >
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg mb-3">Are you sure?</h3>
            <div className="grid grid-flow-col grid-rows-3 gap-4">
              {modalData.request_optional.image && (
                <Image
                  src={`${modalData.request_optional.image}`}
                  alt={`${modalData.request_title} poster`}
                  width={150}
                  height={150}
                  draggable="false"
                  className="row-span-3 rounded-lg"
                />
              )}
              <p className="col-span-2">
                <span className="font-bold">Title: </span>
                {modalData.request_title}
              </p>
              <p className="col-span-2">
                <span className="font-bold">Requestor: </span>
                {modalData.request_requestor}
              </p>
              {modalData.request_note && (
                <p className="col-span-2">
                  <span className="font-bold">Note: </span>
                  {modalData.request_note}
                </p>
              )}
            </div>

            <div className="modal-action gap-4">
              <button className="btn btn-soft" onClick={handleModalCancel}>
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
