import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';

const QuickBuy = () => {
  const [productCode, setProductCode] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productType, setProductType] = useState('');
  const [instaID, setInstaID] = useState('');
  const [currency, setCurrency] = useState('');
  const [dollars, setDollars] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'products');
      try {
        const querySnapshot = await getDocs(dataCollection);
        if (!querySnapshot.empty) {
          // Filter for "Oversized T-Shirt Drop Shoulder"
          const matchingProducts = querySnapshot.docs
            .map(doc => doc.data())
            .filter(product => product.productType === "Oversized T-Shirt Drop Shoulder");
          
          if (matchingProducts.length > 0) {
            // Prioritize OV21 if it exists, otherwise take the last one
            const latestProduct = matchingProducts.find(product => product.productCode === "OV22") || 
                                 matchingProducts[matchingProducts.length - 1];
            setProductName(latestProduct.productName);
            setProductCode(latestProduct.productCode);
            setProductImage(latestProduct.productImage);
            setProductPrice(latestProduct.productPrice);
            setProductType(latestProduct.productType);
          } else {
            console.log('No products found with productType "Oversized T-Shirt Drop Shoulder"!');
          }
        } else {
          console.log('No documents found!');
        }
      } catch (error) {
        console.error("Error retrieving product data: ", error);
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
          const firstDocument = querySnapshot.docs[0].data();
          setInstaID(firstDocument.instaID);
          setCurrency(firstDocument.currency);
          setDollars(firstDocument.shippingrate);
        } else {
          console.log('No store details found!');
        }
      } catch (error) {
        console.error("Error retrieving store data: ", error);
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
            <p className="title">{productName}</p>
            <br />
            <p>Code: {productCode}</p>
            <p>Shirt Type: {productType}</p>
            <p>From RS. {productPrice}</p>
            <p>Shipping fee: {currency}{dollars}</p>
            <p>Available sizes</p>
            <div className="size-container">
              <div className="size">S</div><p style={{ opacity: '0%' }}>--</p>
              <div className="size">M</div><p style={{ opacity: '0%' }}>--</p>
              <div className="size">L</div><p style={{ opacity: '0%' }}>--</p>
              <div className="size">XL</div>
            </div>
 
            <br />
            {instaID ? (
              <a href={instaID} className="no-decoration navLink" target="_blank">
                <button className="primary-button white-button">Let's talk about this product</button>
              </a>
            ) : (
              <a href="#" className="no-decoration navLink" target="_blank">
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