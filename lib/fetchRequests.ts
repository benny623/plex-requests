import useStatusStore from "@/stores/statusStore";

const hasFetched = useStatusStore.getState().hasFetched;
const setLoading = useStatusStore.getState().setLoading;
const setError = useStatusStore.getState().setError;
const setHasFetched = useStatusStore.getState().setHasFetched;

export const fetchSingleRequest = async (id: string, token: string) => {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.BASE_URL;

  const response = await fetch(`${baseUrl}/api/single-request/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch request");
  }

  return await response.json();
};

export const fetchCurrentRequests = async (token: string) => {
  if (hasFetched) {
    setHasFetched(false);
  }

  setLoading(true);

  const response = await fetch("/api/current-requests", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    setLoading(false);
    setError(response.statusText);
    throw new Error("Failed to fetch current requests");
  }

  setLoading(false);
  setHasFetched(true);

  return await response.json();
};

export const fetchCompletedRequests = async (token: string) => {
  if (hasFetched) {
    setHasFetched(false);
  }

  setLoading(true);

  const response = await fetch("/api/completed-requests", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    setLoading(false);
    setError(response.statusText);
    throw new Error("Failed to fetch completed requests");
  }

  setLoading(false);
  setHasFetched(true);

  return await response.json();
};

export const fetchAllCompletedRequests = async (token: string) => {
  if (hasFetched) {
    setHasFetched(false);
  }

  setLoading(true);

  const response = await fetch("/api/all-completed-requests", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    setLoading(false);
    setError(response.statusText);
    throw new Error("Failed to fetch all requests");
  }

  setLoading(false);
  setHasFetched(true);

  return await response.json();
};
