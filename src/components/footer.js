import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { app } from '../firebase'; 
const Footer = () => {
    const db = getFirestore(app); // Initialize Firestore
    const handleSubscribe = async (e) => {
        const subscribers = {
            email : document.getElementById('sub').value
        }
        e.preventDefault();
        try {
          await addDoc(collection(db, 'subscribers'), subscribers);
          alert('Email added successfully!');
        } catch (error) {
          console.error('Error adding email:', error);
          alert('Error adding email. Please try again.');
        }
    };


    const [siteName, setSiteName] = useState('');
    const [instaID, setInstaID] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
  
    useEffect(() => {
      const fetchData = async () => {
        const db = getFirestore();
        const dataCollection = collection(db, 'storeDetails');
        try {
          const querySnapshot = await getDocs(dataCollection);
          if (!querySnapshot.empty) {
            const firstDocument = querySnapshot.docs[0];
            const siteInfo = firstDocument.data(); // Corrected typo here
            const siteName = siteInfo.storeName;
            const instaID = siteInfo.instaID;
            const phone = siteInfo.phone;
            const email = siteInfo.email;
            const address = siteInfo.address;
  
            setSiteName(siteName);
            setInstaID(instaID);
            setPhone(phone);
            setEmail(email);
            setAddress(address);
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
                <div className="footer">
                    <div className="cover">
                        <div className="footer-section">
                            <div className="qucik-links">
                                <h3>Quick Links</h3>
                                <br/>
                                <Link to="/About" className='no-decoration navLink'>
                                    <p>About</p>
                                </Link>
                                <br/>
                                <Link to="/Contact" className="no-decoration navLink">
                                    <p>
                                        Contact
                                    </p>
                                </Link>
                                <br/>
                                <Link to="/Products" className="no-decoration navLink">
                                    <p>
                                        Products
                                    </p>
                                </Link>
                                <br/>
                                <a  className="no-decoration navLink" href='https://hassansbio.netlify.app/'>
                                    <p>
                                        Get your Store
                                    </p>
                                </a>
                                <br/>
                                <Link to="/Login" className="no-decoration navLink">
                                    <p>
                                        Admin
                                    </p>
                                </Link>
                            </div>
                            <div className="contact-details">
                                <h3>Contact Details</h3>
                                <br/>
                                <p>
                                    <strong>Email: </strong> <a href={`mailto:${email}`} className="no-decoration">
                                        {email}
                                    </a>
                                </p>
                                <br/>
                                <p>
                                    <strong>Contact no: </strong> <a href={`tel:${phone}`} className="no-decoration">
                                        {phone}
                                    </a>
                                </p>
                                <br/>
                                <p>
                                    <strong>Address: </strong>
                                    {address}
                                </p>
                                <br/>
                                <p>
                                    <strong>Trading Hours</strong>
                                    <br/>
                                    Mon-Sat 10:00 am to 8pm <br/>
                            
                                    Sunday OFF

                                </p>
                            </div>
                        </div>
                        <div className="newsleter">
                            <div className="subsriber-section">
                                Subscribe now to receive exclusive special offers.
                                <p style={{opacity: '0%'}}>--</p>
                                <form  className="subscribe" onSubmit={handleSubscribe}>
                                    <input type="email" name="email" placeholder="Email " required   id="sub"/>
                                    <button type="submit" className="primary-button sub">Subscribe</button>
                                </form>
                            </div>
                            <div className="instalink">
                            {instaID? (
                                <a  href={instaID} className="no-decoration navLink" target='blank'>
                                <i className="fa-brands fa-instagram navLink"></i>
                                </a>                
                                    ) : (
                                    <a  href="#" className="no-decoration navLink" target='blank'>
                                    <i className="fa-brands fa-instagram navLink"></i>
                                    </a>
                                    )}
                                <a href="#" className="no-decoration" style={{ marginLeft: '10px' }}>
                                    <i className="fa-sharp fa-solid fa-arrow-up fa-bounce"></i>
                                </a>
                            </div>
                        </div>
                        <div className="copyright">
                            @Copyright 2024 all rights reserved. <a href={instaID} className="no-decoration">{siteName}</a>
                        </div>
                    </div>
                </div>
    </>
  );
};

export default Footer;
