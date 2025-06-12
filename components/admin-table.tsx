"use client";

import React, { useState, useEffect } from "react";

import AdminRow from "@/components/admin-row";

import { Request, RequestTableProps } from "@/lib/types";
import { useAdminHandlers } from "@/lib/hooks/useAdminHandlers";

const AdminTable: React.FC<RequestTableProps> = ({
  requests,
  setRequests,
  loading,
}) => {
  const [modalData, setModalData] = useState<Request | null>(null);
  const [sortedData, setSortedData] = useState([]);
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

  const sortData = (array: any, toFront: string) => {
    const front = array.filter((item: any) => toFront.includes(item.request_status));
    const back = array.filter((item: any) => !toFront.includes(item.request_status));
    return front.concat(back);
  };

  useEffect(() => {
    setSortedData(sortData(requests, "In Progress"));
  }, [requests]);

  return (
    <>
      <table className="table w-full xl:w-3/4 border-collapse table-pin-rows pt-10">
        <thead>
          <tr>
            <th></th>
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
            sortedData.length > 0 ? (
              sortedData.map((request: Request) => (
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
            <h3 className="font-bold text-lg">Are you sure?</h3>
            <p className="my-4">
              Deleting Request:{" "}
              <span className="font-bold">{modalData.request_title}</span>
            </p>
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
