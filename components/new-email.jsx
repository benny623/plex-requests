export function NewEmail(props) {
  const { title, year, type, email, image } = props;

  // Inline styles
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f0f0f0",
      margin: 0,
      padding: 0,
    },
    card: {
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "row",
      width: "100%",
      height: "100%",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
    },
    imageContainer: {
      width: "150px",
      height: "200px",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#e0e0e0",
      borderRadius: "8px",
    },
    image: {
      width: "100%",
      height: "auto",
      borderRadius: "8px",
    },
    content: {
      marginLeft: "20px",
      flex: 1,
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    paragraph: {
      fontSize: "16px",
      color: "#333",
      marginBottom: "10px",
    },
    button: {
      display: "inline-block",
      padding: "10px 20px",
      backgroundColor: "#6366F1",
      color: "white",
      textDecoration: "none",
      borderRadius: "8px",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
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
      </div>
    </div>
  );
}
