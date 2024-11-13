export const fetchAllRequests = async () => {
  const response = await fetch("/api/requests");

  if (!response.ok) {
    throw new Error("Failed to fetch all requests");
  }

  return await response.json();
};

export const fetchCurrentRequests = async () => {
  const response = await fetch("/api/current-requests");

  if (!response.ok) {
    throw new Error("Failed to fetch all requests");
  }

  return await response.json();
};

export const fetchCompletedRequests = async () => {
  const response = await fetch("/api/completed-requests");

  if (!response.ok) {
    throw new Error("Failed to fetch all requests");
  }

  return await response.json();
};
