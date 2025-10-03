import { Request } from "@/lib/types";
import useRequestsStore from "@/stores/requestsStore";
import useStatusStore from "@/stores/statusStore";

export function useAdminHandlers(
  requests: Request[],
  setRequests: (data: Request[]) => void
) {
  const { currentRequests, completedRequests } = useRequestsStore();
  const { table } = useStatusStore();

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    requestId: number
  ) => {
    const newStatus = e.target.value;

    try {
      // Send update to server
      const response = await fetch(`/api/update-status/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("isAdmin")}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Send notification
      sendNotification(requestId);

      // Update state locally for immediate feedback
      const temp = (
        table === "current" ? currentRequests : completedRequests
      ).map((request: any) =>
        request.request_id === requestId
          ? { ...request, request_status: newStatus }
          : request
      );

      setRequests(temp);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleNoteChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    requestId: number
  ) => {
    const newNote = e.target.value;

    const temp = (
      table === "current" ? currentRequests : completedRequests
    ).map((request: any) =>
      request.request_id === requestId
        ? { ...request, request_note: newNote }
        : request
    );

    setRequests(temp);
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
          Authorization: `Bearer ${window.localStorage.getItem("isAdmin")}`,
        },
        body: JSON.stringify({
          note: newNote || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }
    } catch (err) {
      console.error("Error updating note:", err);
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
          Authorization: `Bearer ${window.localStorage.getItem("isAdmin")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete request");
      }

      // Update local state by removing the deleted request
      const temp = (
        table === "current" ? currentRequests : completedRequests
      ).filter((request: any) => request.request_id !== requestId);

      setRequests(temp);
    } catch (err) {
      console.error("Error deleting request:", err);
    }
  };

  const sendNotification = async (requestId: number) => {
    // Send notification for updated status
    try {
      const response = await fetch("/api/update-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("isAdmin")}`,
        },
        body: JSON.stringify({
          id: requestId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send notification");
      }
    } catch (err) {
      console.error("Error sending notification", err);
    }
  };

  return {
    requests,
    handleStatusChange,
    handleNoteChange,
    handleNoteBlur,
    handleDeletion,
  };
}
