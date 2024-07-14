import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs,getDoc,doc } from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';


const QuickBuy = () => {
  
  const [productCode, setproductCode] = useState('');
  const [productImage, setproductImage] = useState('');
  const [productName, setproductName] = useState('');
  const [productPrice, setproductPrice] = useState(0);
  const [productType, setproductType] = useState('');
  const [instaID, setInstaID] = useState('');
  const [currency, setcurrency] = useState('');
  const [Dollars, setDollars] = useState('');

  

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'products');
      try {
        const querySnapshot = await getDocs(dataCollection);
        if (!querySnapshot.empty) {
          const firstDocument = querySnapshot.docs[0];
          const product = firstDocument.data(); // Corrected typo here
          const productCode = product.productCode;
          const productImage = product.productImage;
          const productName = product.productName;
          const productPrice = product.productPrice;
          const productType = product.productType;
     


          setproductName(productName);
          setproductCode(productCode);
          setproductImage(productImage);
          setproductPrice(productPrice);
          setproductType(productType);
    



        } else {
          console.log('No documents found!');
        }
      } catch (error) {
        console.error("Error retrieving site data: ", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'storeDetails');
      try {
        const querySnapshot = await getDocs(dataCollection);
        if (!querySnapshot.empty) {
          const firstDocument = querySnapshot.docs[0];
          const siteInfo = firstDocument.data(); // Corrected typo here

          const instaID = siteInfo.instaID;
          const currency = siteInfo.currency;
          const Dollars = siteInfo.shippingrate;
          setInstaID(instaID);
          setcurrency(currency);
          setDollars(Dollars);

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
   
    <div className="quick-buy">
      <div className="cover">
        <div className="container">
          <div className="the-product">
            <img src={productImage} alt="Product Image" className="Product-image" />
          </div>
          <div className="the-details">
  
            <p className="title">
              {productName}
            </p>
            <br />
            <p> Code: {productCode}</p>
            <p>Shirt Type: {productType}</p>
        
            <p>From RS. {productPrice}</p>
            <p>Shipping fee : {currency}{Dollars}</p>

            <p>Available sizes</p>
            <div className="size-container">
              <div className="size">S</div><p style={{opacity: '0%'}}>--</p>
              <div className="size">M</div><p style={{opacity: '0%'}}>--</p>
              <div className="size">L</div><p style={{opacity: '0%'}}>--</p>
              <div className="size">XL</div>
            </div>
            <br />
            <p>Available Colors</p>
            <div className="size-container">
              <div className="color" style={{ backgroundColor: '#000000' }} title="Black"></div><p style={{opacity: '0%'}}>-</p>
              <div className="color" style={{ backgroundColor: '#B7B7B7' }} title="Heather Grey"></div><p style={{opacity: '0%'}}>-</p>
              <div className="color" style={{ backgroundColor: '#FFB6C1' }} title="Light Pink"></div><p style={{opacity: '0%'}}>-</p>
              <div className="color" style={{ backgroundColor: '#000080' }} title="Navy"></div><p style={{opacity: '0%'}}>-</p>
              <div className="color" style={{ backgroundColor: '#FF0000' }} title="Red"></div><p style={{opacity: '0%'}}>-</p>
              <div className="color" style={{ backgroundColor: '#4169E1' }} title="Royal Blue"></div><p style={{opacity: '0%'}}>-</p>
              <div className="color" style={{ backgroundColor: '#FFFFFF', border: '1px solid black' }} title="White"></div><p style={{opacity: '0%'}}>-</p>
              <div className="color" style={{ backgroundColor: '#F5F5DC' }} title="Beige"></div><p style={{opacity: '0%'}}>-</p>
              <div className="color" style={{ backgroundColor: '#36454F' }} title="Charcoal Grey"></div><p style={{opacity: '0%'}}>-</p>
              <div className="color" style={{ backgroundColor: '#D8BFD8' }} title="Light Purple"></div><p style={{opacity: '0%'}}>-</p>
              <div className="color" style={{ backgroundColor: '#FFDB58' }} title="Mustard"></div><p style={{opacity: '0%'}}>-</p>
              <div className="color" style={{ backgroundColor: '#87CEEB' }} title="Sky Blue"></div>
            </div>
            <br />
            {instaID? (
              <a  href={instaID} className="no-decoration navLink" target='blank'>
                          <button className="primary-button white-button">Let's talk about this product</button>
              </a>                
                ) : (
                  <a  href="#" className="no-decoration navLink" target='blank'>
                             <button className="primary-button white-button">Let's talk about this product</button>
                  </a>
                )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickBuy;
