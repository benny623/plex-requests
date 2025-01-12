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
