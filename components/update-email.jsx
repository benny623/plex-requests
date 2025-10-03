export default function UpdateEmail(props) {
  const { title, status, note, image } = props;

  function statusColor(status) {
    switch (status) {
      case "New":
        return "#4ea0ff";
      case "In Progress":
        return "#fdc700";
      case "Pending":
        return "#ff6700";
      case "Complete":
        return "#009764";
      default:
        return "";
    }
  }

  // Inline styles
  const styles = {
    container: {
      width: "100%",
      backgroundColor: "#191e24",
      padding: "40px 0",
      margin: 0,
      fontFamily: "Arial, sans-serif",
      color: "#ededed",
    },
    table: {
      width: "600px",
      margin: "0 auto",
      backgroundColor: "#1d232a",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      height: "auto",
    },
    imageCell: {
      width: "200px",
      height: "300px",
      borderRadius: "8px",
      textAlign: "center",
      color: "#333",
      verticalAlign: "middle",
      overflow: "hidden",
      boxSizing: "border-box",
      backgroundColor: image ? "transparent" : "#e0e0e0",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center center",
      borderRadius: "8px",
    },
    contentCell: {
      padding: "30px",
      textAlign: "left",
      verticalAlign: "middle",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "15px",
    },
    paragraph: {
      fontSize: "16px",
      marginBottom: "15px",
    },
    button: {
      display: "inline-block",
      padding: "12px 24px",
      backgroundColor: "rgba(42, 123, 155, 1)",
      color: "#1d232a",
      textDecoration: "none",
      borderRadius: "32px",
      fontWeight: "bold",
    },
    badge: {
      display: "inline-block",
      padding: "8px 15px",
      backgroundColor: statusColor(status),
      color: "#1d232a",
      fontSize: "14px",
      fontWeight: "bold",
      borderRadius: "50px",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <tr>
          {image && (
            <td style={styles.imageCell}>
              <img
                src={`${image}`}
                alt={`${title} poster`}
                style={styles.image}
              />
            </td>
          )}
          <td style={styles.contentCell}>
            <h1 style={styles.title}>{title}</h1>
            <p style={styles.paragraph}>
              <strong>Status:</strong>{" "}
              <span style={styles.badge}>{status}</span>
            </p>
            {note && (
              <p style={styles.paragraph}>
                <strong>Note:</strong> {note}
              </p>
            )}
            <a href="https://dwsrequests.site/" style={styles.button}>
              Plex Requests Page
            </a>
          </td>
        </tr>
      </table>
    </div>
  );
}
