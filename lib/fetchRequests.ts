export const fetchAllRequests = async () => {
  const response = await fetch("/api/all-requests");

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

export const fetchCompleteRequests = async () => {
  const response = await fetch("/api/completed-requests");

  if (!response.ok) {
    throw new Error("Failed to fetch all requests");
  }

  return await response.json();
};

export const fetchAllCompleteRequests = async () => {
  const response = await fetch("/api/all-completed-requests");

  if (!response.ok) {
    throw new Error("Failed to fetch all requests");
  }

  return await response.json();
};

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
