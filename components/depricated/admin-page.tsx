"use client";

import { useState, useEffect } from "react";
import { Request, adminProps } from "@/lib/types";

export default function AdminPage({ allRequests, loading }: adminProps) {
  const [admin, setAdmin] = useState(false);
  const [requests, setRequests] = useState<Request[]>(allRequests);

  // Put data into temporary State
  useEffect(() => {
    // Check if admin key is correct
    if (
      window.localStorage.getItem("isAdmin") !==
      process.env.NEXT_PUBLIC_ADMIN_KEY
    ) {
      return;
    }
    setRequests(allRequests);
    setAdmin(true);
  }, [allRequests]);

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    requestId: number
  ) => {
    const newStatus = e.target.value;

    // Update status locally for immediate feedback
    const updatedRequestList = requests.map((request: Request) =>
      request.request_id === requestId
        ? { ...request, request_status: newStatus }
        : request
    );
    setRequests(updatedRequestList);

    try {
      // Send update to server
      const response = await fetch(`/api/update-status/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedRequest = await response.json();
      console.log("Status updated", updatedRequest);

      // Send notification for updated status
      try {
        const response = await fetch("/api/update-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: requestId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send notification");
        }

        const notification = await response.json();

        console.log("Notification sent", notification);
      } catch (err) {
        console.error("Error sending notification", err);
      }
    } catch (err) {
      console.error("Error updating status:", err);

      // Revert the status if the update failed
      const revertedRequestList = requests.map((request: Request) =>
        request.request_id === requestId
          ? { ...request, request_status: request.request_status }
          : request
      );
      setRequests(revertedRequestList);
    }
  };

  const handleNoteChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    requestId: number
  ) => {
    const newNote = e.target.value;

    // Update status locally for immediate feedback
    const updatedRequestList = requests.map((request: Request) =>
      request.request_id === requestId
        ? { ...request, request_note: newNote }
        : request
    );
    setRequests(updatedRequestList);
  };

  const handleNoteBlur = async (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    requestId: number
  ) => {
    const newNote = e.target.value;

    try {
      // Send update to server
      const response = await fetch(`/api/update-note/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note: newNote || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      const updatedRequest = await response.json();
      console.log("Note updated", updatedRequest);
    } catch (err) {
      console.error("Error updating note:", err);

      // Revert the status if the update failed
      const revertedRequestList = requests.map((request: Request) =>
        request.request_id === requestId
          ? { ...request, request_status: request.request_status }
          : request
      );
      setRequests(revertedRequestList);
    }
  };

  const handleDeletion = async (
    e: React.MouseEvent<HTMLButtonElement>,
    requestId: number
  ) => {
    e.preventDefault();
    try {
      // Send deletion to server
      const response = await fetch(`/api/delete-request/${requestId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      const deletedRequest = await response.json();
      console.log("Request deleted", deletedRequest);

      // Update local state by removing the deleted request
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.request_id !== requestId)
      );
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  function statusColor(status: string) {
    switch (status) {
      case "New":
        return "select-secondary";
      case "In Progress":
        return "select-primary";
      case "Pending":
        return "select-warning";
      case "Complete":
        return "select-success";
      default:
        return "";
    }
  }

  return (
    <>
      {!admin ? (
        <div className="min-h-screen flex justify-center items-center py-10 bg-base-100">
          <h1 className="font-bold">Not an admin</h1>
        </div>
      ) : (
        <div className="min-h-screen flex justify-center items-center py-10 bg-base-100">
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
              {!loading.loading && loading.success ? (
                requests.length > 0 ? (
                  requests.map((request: Request) => (
                    <tr key={request.request_id}>
                      <td>
                        <button
                          className="transition ease-in-out hover:scale-110 hover:text-red-500 duration-200"
                          onClick={(e) => handleDeletion(e, request.request_id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </button>
                      </td>
                      <td>{request.request_title}</td>
                      <td>{request.request_year}</td>
                      <td>{request.request_type}</td>
                      <td>
                        <select
                          id="status"
                          name="status"
                          value={request.request_status}
                          onChange={(e) =>
                            handleStatusChange(e, request.request_id)
                          }
                          className={`select w-full max-w-xs select-sm ${statusColor(
                            request.request_status
                          )}`}
                        >
                          <option className="bg-secondary" value="New">
                            New
                          </option>
                          <option className="bg-primary" value="In Progress">
                            In Progress
                          </option>
                          <option className="bg-warning" value="Pending">
                            Pending
                          </option>
                          <option className="bg-success" value="Complete">
                            Complete
                          </option>
                        </select>
                      </td>
                      <td>
                        <textarea
                          id="note"
                          name="note"
                          value={request.request_note}
                          onBlur={(e) => handleNoteBlur(e, request.request_id)}
                          onChange={(e) =>
                            handleNoteChange(e, request.request_id)
                          }
                          className="textarea textarea-bordered w-full"
                        />
                      </td>
                    </tr>
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
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    <span className="loading loading-dots loading-md"></span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}