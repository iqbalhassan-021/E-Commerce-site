import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

  return (
    <div className="new-hero" id="hero">
      <video autoPlay muted loop>
        <source src="/assets/images/8738467-uhd_3840_2160_25fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="name-div">
        <h1 className="signature">
          {storeName ? (
            <span style={{color:'black'}}>{storeName}</span>
          ) : (
            <span>The site name will be here</span>
          )}
        </h1>
        <p>
          <strong>
            {storeSlogan ? (
              <span>{storeSlogan}</span>
            ) : (
              <span>The site slogan will be here</span>
            )}
          </strong>
        </p>
  
      </div>
    </div>
  );
};

export default HeroSlider;