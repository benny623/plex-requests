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
    <div className="h-screen">
      {/* <AdminPage allRequests={requests} loading={status} /> */}
      {!isAdmin ? (
        <h1 className="font-bold">Not an admin</h1>
      ) : status.loading ? (
        <span className="loading loading-dots loading-md"></span>
      ) : (
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
      )}
    </div>
  );
};

export default AdminPage;

// const { requests, status } = useFetchData(fetchAllRequests);

// const [admin, setAdmin] = useState(false);
// const [allRequests, setAllRequests] = useState<Request[]>(requests);

// // Put data into temporary State
// useEffect(() => {
//   // Check if admin key is correct
//   if (
//     window.localStorage.getItem("isAdmin") !==
//     process.env.NEXT_PUBLIC_ADMIN_KEY
//   ) {
//     return;
//   }
//   setAllRequests(requests);
//   setAdmin(true);
// }, [requests]);

// const handleStatusChange = async (
//   e: React.ChangeEvent<HTMLSelectElement>,
//   requestId: number
// ) => {
//   const newStatus = e.target.value;

//   // Update status locally for immediate feedback
//   const updatedRequestList = requests.map((request: Request) =>
//     request.request_id === requestId
//       ? { ...request, request_status: newStatus }
//       : request
//   );
//   setAllRequests(updatedRequestList);

//   try {
//     // Send update to server
//     const response = await fetch(`/api/update-status/${requestId}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         status: newStatus,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to update status");
//     }

//     const updatedRequest = await response.json();
//     console.log("Status updated", updatedRequest);

//     // Send notification for updated status
//     try {
//       const response = await fetch("/api/update-notification", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           id: requestId,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to send notification");
//       }

//       const notification = await response.json();

//       console.log("Notification sent", notification);
//     } catch (err) {
//       console.error("Error sending notification", err);
//     }
//   } catch (err) {
//     console.error("Error updating status:", err);

//     // Revert the status if the update failed
//     const revertedRequestList = requests.map((request: Request) =>
//       request.request_id === requestId
//         ? { ...request, request_status: request.request_status }
//         : request
//     );
//     setAllRequests(revertedRequestList);
//   }
// };

// const handleNoteChange = async (
//   e: React.ChangeEvent<HTMLTextAreaElement>,
//   requestId: number
// ) => {
//   const newNote = e.target.value;

//   // Update status locally for immediate feedback
//   const updatedRequestList = requests.map((request: Request) =>
//     request.request_id === requestId
//       ? { ...request, request_note: newNote }
//       : request
//   );
//   setAllRequests(updatedRequestList);
// };

// const handleNoteBlur = async (
//   e: React.ChangeEvent<HTMLTextAreaElement>,
//   requestId: number
// ) => {
//   const newNote = e.target.value;

//   try {
//     // Send update to server
//     const response = await fetch(`/api/update-note/${requestId}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         note: newNote || "",
//       }),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to update note");
//     }

//     const updatedRequest = await response.json();
//     console.log("Note updated", updatedRequest);
//   } catch (err) {
//     console.error("Error updating note:", err);

//     // Revert the status if the update failed
//     const revertedRequestList = requests.map((request: Request) =>
//       request.request_id === requestId
//         ? { ...request, request_status: request.request_status }
//         : request
//     );
//     setAllRequests(revertedRequestList);
//   }
// };

// const handleDeletion = async (
//   e: React.MouseEvent<HTMLButtonElement>,
//   requestId: number
// ) => {
//   e.preventDefault();
//   try {
//     // Send deletion to server
//     const response = await fetch(`/api/delete-request/${requestId}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to delete note");
//     }

//     const deletedRequest = await response.json();
//     console.log("Request deleted", deletedRequest);

//     // Update local state by removing the deleted request
//     setAllRequests((prevRequests) =>
//       prevRequests.filter((request) => request.request_id !== requestId)
//     );

//     (document.getElementById("deletion_modal") as HTMLDialogElement).close();
//   } catch (err) {
//     console.error("Error deleting note:", err);
//   }
// };

// const deletionModal = (id: any) => {
//   (document.getElementById(`${id}_modal`) as HTMLDialogElement).showModal();
// };

// function statusColor(status: string) {
//   switch (status) {
//     case "New":
//       return "select-secondary";
//     case "In Progress":
//       return "select-primary";
//     case "Pending":
//       return "select-warning";
//     case "Complete":
//       return "select-success";
//     default:
//       return "";
//   }
// }

// LOADING LOGIC BOTTOM
// ) : (
//   <tr>
//     <td colSpan={6} className="text-center">
//       No current requests
//     </td>
//   </tr>
// )
// ) : (
// <tr>
//   <td colSpan={6} style={{ textAlign: "center" }}>
//     <span className="loading loading-dots loading-md"></span>
//   </td>
// </tr>
// )}
