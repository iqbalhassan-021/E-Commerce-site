import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const HeroSlider = () => {
  const [storeName, setStoreName] = useState('');
  const [storeSlogan, setStoreSlogan] = useState('');
  const [storeBanner, setStoreBanner] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'storeDetails');
      try {
        const querySnapshot = await getDocs(dataCollection);
        if (!querySnapshot.empty) {
          const firstDocument = querySnapshot.docs[0];
          const siteInfo = firstDocument.data();
          const storeName = siteInfo.storeName;
          const storeSlogan = siteInfo.storeSlogan;
          const storeBanner = siteInfo.storeBanner;

          setStoreName(storeName);
          setStoreSlogan(storeSlogan);
          setStoreBanner(storeBanner);
        } else {
          console.log('No documents found!');
        }
      } catch (error) {
        console.error("Error retrieving site data: ", error);
      }
    };
    fetchData();
  }, []);
  const styles = {
    hero: {
      width: "100%",
      height: "800px",
      backgroundImage: "url('/assets/images/banner1.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      color: "#fff",
      position: "relative",
    },

  };
  return (
    <div style={styles.hero}>
    <div style={styles.overlay}></div>
    <div style={styles.content}>
      <h1 className='signature'>{storeName}</h1>
      <p>{storeSlogan}</p>
      <br></br>
      <Link to="/products" className="primary-button no-decoration">Shop Now</Link>
    </div>
  </div>
  );
};

export default HeroSlider;