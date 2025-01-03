export default function NewEmail(props) {
  const { title, year, type, email, image } = props;

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
      color: "#1d232a",
      textDecoration: "none",
      borderRadius: "8px",
      fontWeight: "bold",
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
            {year && ( // TODO: change this condition to "optional" and fill in optional data accordingly
              <p style={styles.paragraph}>
                <strong>Year:</strong> {year}
              </p>
            )}
            <p style={styles.paragraph}>
              <strong>Type:</strong> {type}
            </p>
            <p style={styles.paragraph}>
              <strong>Requested by:</strong> {email}
            </p>
            <a
              href="https://plex-requests-plum.vercel.app/admin"
              style={styles.button}
            >
              Admin Page
            </a>
          </td>
        </tr>
      </table>

      {/* <div style={styles.card}>
        <div style={styles.imageContainer}>
          {image ? (
            <img src={image} alt={`${title} poster`} style={styles.image} />
          ) : (
            <span>No Image</span>
          )}
        </div>

        <div style={styles.content}>
          <h1 style={styles.title}>{title}</h1>
          <p style={styles.paragraph}>
            <strong>Year:</strong> {year}
          </p>
          <p style={styles.paragraph}>
            <strong>Type:</strong> {type}
          </p>
          <p style={styles.paragraph}>
            <strong>Requested by:</strong> {email}
          </p>
          <a
            href="https://plex-requests-plum.vercel.app/admin"
            style={styles.button}
          >
            Admin Page
          </a>
        </div>
      </div> */}
    </div>
  );
}
