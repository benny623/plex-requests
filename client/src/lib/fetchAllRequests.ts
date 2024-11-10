export const fetchAllRequests = async () => {
  const response = await fetch("http://localhost:5000/api/requests");

  if (!response.ok) {
    throw new Error("Failed to fetch all requests");
  }

  return await response.json();
};
