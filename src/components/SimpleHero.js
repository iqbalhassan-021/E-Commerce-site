import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase"; // adjust path

export default function HeroSection() {
  const [store, setStore] = useState({
    storeName: "",
    storeSlogan: "",
    storeBanner: "",
  });

  const [heroHeight, setHeroHeight] = useState("100vh");

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const colRef = collection(firestore, "storeDetails");
        const snapshot = await getDocs(colRef);

        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setStore({
            storeName: data.storeName || "",
            storeSlogan: data.storeSlogan || "",
            storeBanner: data.storeBanner || "",
          });
        } else {
          console.log("storeDetails collection is empty");
        }
      } catch (error) {
        console.error("Error fetching storeDetails:", error);
      }
    };

    fetchStoreDetails();

    // Set hero height based on window width
    const updateHeight = () => {
      setHeroHeight(window.innerWidth <= 768 ? "80vh" : "100vh");
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const styles = {
    hero: {
      position: "relative",
      width: "100%",
      height: heroHeight,
      backgroundImage: `url(${store.storeBanner || "https://i.postimg.cc/HLHpy5yV/ov_01.jpg"})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      padding: "20px",
    },
    overlay: {
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.65), rgba(0,0,0,0.85))",
    },
    content: {
      position: "relative",
      textAlign: "center",
      color: "white",
      maxWidth: "900px",
      animation: "fadeUp 1s ease",
    },
    title: {
      fontSize: "clamp(2.5rem, 6vw, 6rem)",
      fontWeight: 800,
      letterSpacing: "-1px",
      marginBottom: "20px",
    },
    bio: {
      fontSize: "clamp(1rem, 2vw, 1.6rem)",
      opacity: 0.9,
      lineHeight: 1.6,
    },
  };

  return (
    <>
      <style>
        {`@keyframes fadeUp { from { opacity:0; transform:translateY(40px);} to {opacity:1; transform:translateY(0);} }`}
      </style>

      <section style={styles.hero}>
        <div style={styles.overlay} />
        <div style={styles.content}>
          <h1 style={styles.title}>{store.storeName || "Loading..."}</h1>
          <p style={styles.bio}>{store.storeSlogan || "Fetching store details..."}</p>
        </div>
      </section>
    </>
  );
}
