import React, { useState, useEffect } from "react";

const OurDeliverAbles = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: isMobile ? "column" : "row",
      padding: "20px",
      minHeight: "800px",
      width: "100%",
      margin: "auto",
    },
    imageContainer: {
      width: isMobile ? "100%" : "50%",
      height: "800px",
      backgroundImage: "url('/assets/images/aboutus.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor: "black",
    },
    storyContainer: {
      width: isMobile ? "100%" : "50%",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      minHeight:isMobile ? "auto" : "800px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    heading: {
      fontSize: "20px",
      fontWeight: "bold",
      marginTop: "15px",
    },
    list: {
      fontSize: "16px",
      lineHeight: "1.6",
      listStyle: "none",
      paddingLeft: "20px",
      position: "relative",
      zIndex: "1",
    },
  };

  return (
    <div className="cover">
      <div style={styles.container}>
        <div style={styles.imageContainer}></div>
        <div style={styles.storyContainer}>
          <h2 style={styles.title}>Our Deliverables</h2>

          <h2 style={styles.heading}>Product Quality</h2>
          <ul>
            <li style={styles.list}>✔ Premium Fabric – Soft, breathable, and durable materials.</li>
            <li style={styles.list}>✔ High-Thread Count – Long-lasting, smooth feel.</li>
            <li style={styles.list}>✔ Comfort & Fit – True-to-size, well-stitched designs.</li>
            <li style={styles.list}>✔ Eco-Friendly Materials – Sustainable options.</li>
          </ul>

          <h2 style={styles.heading}>Print Quality</h2>
          <ul>
            <li style={styles.list}>✔ Vibrant Colors – Sharp and fade-resistant.</li>
            <li style={styles.list}>✔ No Cracking or Peeling – Prints last multiple washes.</li>
          </ul>

          <h2 style={styles.heading}>Packaging & Branding</h2>
          <ul>
            <li style={styles.list}>✔ Premium Packaging – Eco-friendly and stylish.</li>
            <li style={styles.list}>✔ Brand Labels & Tags – Enhance identity.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OurDeliverAbles;
