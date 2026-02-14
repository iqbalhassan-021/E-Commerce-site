import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { app } from '../firebase';

const Footer = () => {
  const db = getFirestore(app);

  const [siteInfo, setSiteInfo] = useState({
    storeName: '',
    instaID: '',
    phone: '',
    email: '',
    address: ''
  });

  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'storeDetails'));
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setSiteInfo({
            storeName: data.storeName || '',
            instaID: data.instaID || '',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            storeLogo: data.storeLogo || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch site info:', error);
      }
    };

    fetchSiteInfo();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!emailInput) return;

    try {
      await addDoc(collection(db, 'subscribers'), { email: emailInput });
      alert('Subscribed successfully!');
      setEmailInput('');
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to subscribe.');
    }
  };

  return (
    <footer className="footer-container">
      <div className="body-cover">
        {/* Top Section */}
        <div className="footer-top">
          <div className="grid-4x">
            {/* Logo */}
            <div className="footer-card footer-logo-card">
              <Link to="/" className="no-decoration">
                <img src={siteInfo.storeLogo} alt="Logo" className="footer-logo" />
              </Link>
            </div>

            {/* Pages */}
            <div className="footer-card">
              <p className="footer-title">Pages</p>
              <Link to="/" className="no-decoration"><p className="footer-text">Home</p></Link>
              <Link to="/About" className="no-decoration"><p className="footer-text">About</p></Link>
              <Link to="/Contact" className="no-decoration"><p className="footer-text">Contact</p></Link>
              <Link to="/Products" className="no-decoration"><p className="footer-text">Shop</p></Link>
              <Link to="/ForHer" className="no-decoration"><p className="footer-text">For Her</p></Link>
              <Link to="/Sale" className="no-decoration"><p className="footer-text">Sale</p></Link>
              <Link to="/Cart" className="no-decoration"><p className="footer-text">Cart</p></Link>
            </div>

            {/* Help */}
            <div className="footer-card">
              <p className="footer-title">Help</p>
              <a href="/FAQ" className="no-decoration"><p className="footer-text">FAQ</p></a>
              <a href="/ShippingPolicy" className="no-decoration"><p className="footer-text">Shipping</p></a>
              <a href="/ReturnPolicy" className="no-decoration"><p className="footer-text">Returns</p></a>
              <a href="/PaymentInfo" className="no-decoration"><p className="footer-text">Payment</p></a>
            </div>

            {/* Contact */}
            <div className="footer-card">
              <p className="footer-title">Contact</p>
              <p className="footer-text">{siteInfo.address}</p>
              <p className="footer-text">Email: <a href={`mailto:${siteInfo.email}`} className="no-decoration">{siteInfo.email}</a></p>
              <p className="footer-text">Phone: <a href={`tel:${siteInfo.phone}`} className="no-decoration">{siteInfo.phone}</a></p>
            </div>
          </div>
        </div>

        {/* Newsletter + Social Icons */}
        <div className="footer-bottom">
          <div className="sub-section">
            <form onSubmit={handleSubscribe} className="sub-form">
              <input
                type="email"
                className="sub-input"
                placeholder="Email..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
              <button type="submit" className="primary-button sub-button">
                <i className="fa fas fa-check"></i>
              </button>
            </form>
          </div>

          <div className="social-icons">
            <a href={siteInfo.facebook || 'https://www.facebook.com/profile.php?id=61578300291320'} className="no-decoration"><div className="social-icon"><i className="fa-brands fa-facebook-f"></i></div></a>
            <a href={siteInfo.instaID || '#'} className="no-decoration"><div className="social-icon"><i className="fa-brands fa-instagram"></i></div></a>
        <a
                href={`https://wa.me/${siteInfo.phone || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="no-decoration"
              >
                <div className="social-icon">
                  <i className="fa-brands fa-whatsapp"></i>
                </div>
              </a>

          </div>
        </div>

        {/* Bottom Copy */}
        <div className="footer-copyright">
          <p>
            © 2025-26 {siteInfo.storeName || 'Your Brand'}. All rights reserved. 
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
