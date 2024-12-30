export default function UpdateEmail(props) {
  const { title, status, note, image } = props;

  function statusColor(status) {
    switch (status) {
      case "New":
        return "#ff52d9";
      case "In Progress":
        return "#7480ff";
      case "Pending":
        return "#ffbe00";
      case "Complete":
        return "#00a96e";
      default:
        return "";
    } // The colors here are subject to change depending on if the theme changes
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
      backgroundColor: "#00cdb7",
      color: "white",
      textDecoration: "none",
      borderRadius: "8px",
      fontWeight: "bold",
    },
    badge: {
      display: "inline-block",
      padding: "8px 15px",
      backgroundColor: statusColor(status),
      color: "white",
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
                src={`https://image.tmdb.org/t/p/w500${image}`}
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
            <a
              href="https://plex-requests-plum.vercel.app/"
              style={styles.button}
            >
              Plex Requests Page
            </a>
          </td>
        </tr>
      </table>
    </div>
  );
}
