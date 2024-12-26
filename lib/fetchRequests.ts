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

export const fetchSingleRequest = async (id: string, token: string) => {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.BASE_URL;

  // const checkAdmin = async (token: string) => {
  //   try {
  //     const res = await fetch(`${baseUrl}/api/check-admin`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ token }),
  //     });
  //     const data = await res.json();

  //     return data.isAdmin;
  //   } catch (err) {
  //     console.error("Error validating admin:", err);
  //     return false;
  //   }
  // };

  // const isAdmin = await checkAdmin(token);
  // console.log(isAdmin)

  // if (!isAdmin) {
  //   throw new Error(
  //     "Unauthorized: You do not have permission to view this request."
  //   );
  // }

  console.log(token)

  const response = await fetch(`${baseUrl}/api/single-request/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch request");
  }

  return await response.json();
};
