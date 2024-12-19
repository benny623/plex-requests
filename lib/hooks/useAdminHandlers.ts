import { useState, useEffect } from "react";
import { Request } from "@/lib/types";

export function useAdminHandlers(allRequests: Request[]) {
  const [requests, setRequests] = useState<Request[]>(allRequests);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (
      window.localStorage.getItem("isAdmin") ===
      process.env.NEXT_PUBLIC_ADMIN_KEY
    ) {
      setIsAdmin(true);
      setRequests(allRequests);
    }
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

  return {
    requests,
    isAdmin,
    handleStatusChange,
    handleNoteChange,
    handleNoteBlur,
    handleDeletion,
  };
}
