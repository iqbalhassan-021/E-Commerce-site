import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Navigate , useNavigate } from 'react-router-dom';
import Navbar from '../components/navBar';
import Footer from '../components/footer';

const AboutPage = () => {
  const [siteName, setSiteName] = useState('');
  const [siteLogo, setSiteLogo] = useState('');
  const [about, setabout] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'storeDetails');
      try {
        const querySnapshot = await getDocs(dataCollection);
        if (!querySnapshot.empty) {
          const firstDocument = querySnapshot.docs[0];
          const siteInfo = firstDocument.data(); // Corrected typo here
          const siteName = siteInfo.siteName;
          const siteLogo = siteInfo.storeLogo;
          const aboutSite = siteInfo.about;

          setSiteName(siteName);
          setSiteLogo(siteLogo)
          setabout(aboutSite);

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
    <>
        <div className='sticky'>
            <Navbar/>
        </div>
    <div className="aboutus">
      <div className="cover">
        <div className="about-section">
          <div className="about-brand">
          {siteLogo? (
                  <Link to="/">
                  <img src={siteLogo} alt="Logo" className="logo" />
                  </Link>
                ) : 
                <Link to="/">
                  <h1>{siteName}</h1>
                </Link>
                }
            <br />
            <p>
              {about}
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default AboutPage;
