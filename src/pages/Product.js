import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import ProductShowcase from '../components/Products';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [instaID, setInstaID] = useState('');
  const [currency, setcurrency] = useState('');
  const [shippingrate, setshippingrate] = useState('');
  
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'products');
      try {
        const querySnapshot = await getDocs(dataCollection);
        const productList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productList);
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
          const firstDocument = querySnapshot.docs[0];
          const siteInfo = firstDocument.data();
          const instaID = siteInfo.instaID;
          const currency = siteInfo.currency;
          const shippingrate = siteInfo.shippingrate;
          setInstaID(instaID);
          setcurrency(currency);
          setshippingrate(shippingrate);
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
    const fetchProduct = async () => {
      const db = getFirestore();
      const docRef = doc(db, 'products', id);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Product data:", docSnap.data());
          setProduct(docSnap.data());
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error retrieving product data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>No product found</p>;
  }

  return (
    <>
           <div className='sticky'>
            <Navbar/>
        </div>
      <div className="quick-buy">
        <div className="cover">
          <div className="container">
            <div className="the-product">
              <img src={product.productImage} alt={product.productName} />
            </div>
            <div className="the-details">
         
              <p className="title">{product.productName}</p>
              <br />
              <p>Shirt Type: {product.productType}</p>
              <p>Code: {product.productCode}</p>
              <p>From RS.{product.productPrice}</p>
              <p>Shipping fee : {currency}{shippingrate}</p>
              {instaID ? (
                <a href={instaID} className="no-decoration navLink" target='blank'>
                  <button className="primary-button white-button">Let's talk about this product</button>
                </a>
              ) : (
                <a href="#" className="no-decoration navLink" target='blank'>
                  <button className="primary-button white-button">Let's talk about this product</button>
                </a>
              )}
            
                    
            {products
  .filter((pay) => pay.productCode === product.productCode)
  .map((pay) => (
    <Link key={pay.id} to={`/Buy/${pay.id}`} className='no-decoration'>
      <button className="primary-button">Buy Now</button>
    </Link>
  ))
}

                 

    
            </div>
          </div>
        </div>
      </div>

      <Footer/>
    </>
  );
};

export default Product;
