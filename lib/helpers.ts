const baseUrl =
  typeof window !== "undefined" ? window.location.origin : process.env.BASE_URL;

export const statusColor = (status: string) => {
  switch (status) {
    case "New":
      return "badge-secondary";
    case "In Progress":
      return "badge-primary";
    case "Pending":
      return "badge-warning";
    case "Complete":
      return "badge-success";
    default:
      return "";
  }
};

export const formateDate = (isoDate: string) => {
  const date = new Date(isoDate);

  // Extract components
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const amPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  // Return formatted string for "Time on Date"
  return `${month}/${day}/${year} at ${formattedHours}:${minutes} ${amPm}`;
};

export const checkAdmin = async (token: string) => {
  try {
    const res = await fetch(`${baseUrl}/api/check-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    return data.isAdmin || false;
  } catch (err) {
    console.error("Error validating admin:", err);
    return false;
  }
};
