import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage({ setIsLoggedIn }) {
  const [siteName, setSiteName] = useState('');
  const [siteLogo, setSiteLogo] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'storeDetails');
      try {
        const querySnapshot = await getDocs(dataCollection);
        if (!querySnapshot.empty) {
          const firstDocument = querySnapshot.docs[0];
          const siteInfo = firstDocument.data();
          setSiteName(siteInfo.siteName);
          setSiteLogo(siteInfo.storeLogo);
        } else {
          console.log('No documents found!');
        }
      } catch (error) {
        console.error("Error retrieving site data: ", error);
      }
    };
    fetchData();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    const db = getFirestore();
    const credentialsCollection = collection(db, 'admin');
    
    try {
      const querySnapshot = await getDocs(credentialsCollection);
      let validCredentials = false;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.username === username && data.password === password) {
          validCredentials = true;
        }
      });

      if (validCredentials) {
        setIsLoggedIn(true);
        navigate('/Admin');
      } else {
        setErrorMessage("Incorrect credentials");
      }
    } catch (error) {
      console.error("Error checking credentials: ", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-holder">
      <div className="cover" style={{ textAlign: 'center' }}>
        <div className="login-section">
          <div className="login">
            {siteLogo ? (
              <Link to="/">
                <img src={siteLogo} alt="Logo" className="logo" />
              </Link>
            ) : (
              <Link to="/">
                <h1>{siteName}</h1>
              </Link>
            )}
            <form onSubmit={handleLogin}>
              <div className="tab">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="tab">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="primary-button">Login</button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </div>
          <p className="bottom">Note : Login with the credentials provided by the <a href="https://hassansbio.netlify.app/">developer</a>, in case of forgetting or changing the credentials please contact the <a href="https://hassansbio.netlify.app/">developer</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
