import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Navbar from '../components/navBar';
import Footer from '../components/footer';

const ProductShowcase = () => {
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

  return (
    <>
        <div className='sticky'>
            <Navbar/>
        </div>
      <div className="product-showcase">
        <div className="cover">
          <div className="showcase grid">
            {products.length === 0 ? (
              <p>No products are added yet</p>
            ) : (
              products.map((product) => (
                         <Link to={`/product/${product.id}`} className="no-decoration" key={product.id}>
                               <div className="product-card">
                                 <div
                                   className="product-img-container"
                                   style={{ backgroundImage: `url(${product.productImage})` }}
                                 >
                                   <div className="product-buttons">
                                     <button className="product-button">
                                       <i className="fa-regular fa-heart"></i>
                                       <p>-</p>
                                       <p>00</p>
                                     </button>
                                     <button className="product-button">
                                       <i className="fa-regular fas fa-cart-plus"></i>
                                     </button>
                                   </div>
                                 </div>
                                 <div className="product-text-holder">
                                   <div className="product-name">
                                     <p className="product-name-text">{product.productName}</p>
                                   </div>
                                   <div className="product-price">
                                     <p className="product-price-text">Rs.{product.productPrice}</p>
                                   </div>
                                 </div>
                               </div>
                             </Link>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductShowcase;
