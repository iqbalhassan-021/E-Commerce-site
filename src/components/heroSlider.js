import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const HeroSlider = () => {
  const [storeName, setstoreName] = useState('');
  const [storeSlogan, setstoreSlogan] = useState('');
  const [storeBanner, setstoreBanner] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'storeDetails');
      try {
        const querySnapshot = await getDocs(dataCollection);
        if (!querySnapshot.empty) {
          const firstDocument = querySnapshot.docs[0];
          const siteInfo = firstDocument.data(); // Corrected typo here
          const storeName = siteInfo.storeName;
          const storeSlogan = siteInfo.storeSlogan;
          const storeBanner = siteInfo.storeBanner;

          setstoreName(storeName);
          setstoreSlogan(storeSlogan)
          setstoreBanner(storeBanner);

        } else {
          console.log('No documents found!');
        }
      } catch (error) {
        console.error("Error retrieving site data: ", error);
      }
    };
    fetchData();
  }, []);





  return (
    <div className="hero-slider" id="hero">
       <div className="hero-slider-container slide1" style={{ backgroundImage: `url(${storeBanner})` }}>
        <h1 className="signature">
          {storeName ? ( <span>{storeName}</span> ) : (<span>The site name will be here</span>) }

        </h1>
        <p>
          <strong>
          {storeSlogan ? ( <span>{storeSlogan}</span> ) : (<span>The site Slogan will be here</span>) }
          </strong>
        </p>
      </div>
    </div>
  );
};

export default HeroSlider;
