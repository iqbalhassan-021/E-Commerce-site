import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import BottomBar from '../components/BottomBar';

const ForHerPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'forHer');
      try {
        const querySnapshot = await getDocs(dataCollection);
        let productList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (selectedProductType) {
          productList = productList.filter(
            product => product.productType === selectedProductType
          );
        }

        productList.sort((a, b) =>
          b.productCode.localeCompare(a.productCode)
        );

        setProducts(productList);
      } catch (error) {
        console.error("❌ Error retrieving product data: ", error);
      }
    };

    fetchData();
  }, [selectedProductType]);

  const addToCart = (product) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
      let updatedCart;

      const existingProduct = existingCart.find(item => item.id === product.id);

      if (existingProduct) {
        updatedCart = existingCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [
          ...existingCart,
          {
            id: product.id,
            productName: product.productName,
            productPrice: product.productPrice,
            productImage: product.productImage,
            productSize: product.productSize,
            productColor: product.productColor,
            productCode: product.productCode,
            productType: product.productType,
            quantity: 1,
          },
        ];
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      console.log('✅ Cart saved:', updatedCart);
      alert(`${product.productName} added to cart!`);
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
    }
  };

  return (
    <>
           <div className='sticky'>
            <Navbar/>
        </div>
        
              <div className="body-cover">
                 <div className="banner-title">
                     <h1>
                        For Her
                    </h1>
                 </div>
           
      
   
         </div>
    <div className="product-container">
      <div className="body-cover">
        <div className="products">
          <div className="section-title">
            <p>All Products – For Her</p>
          </div>

          <div className="grid-4x">
            {products.length === 0 ? (
              <p>No products found</p>
            ) : (
              products.map(product => (
                <Link to={`/product/${product.id}`} className="no-decoration" key={product.id}>
                  <div className="product-card">
                    <div
                      className="product-img-container"
                      style={{ backgroundImage: `url(${product.productImage})` }}
                    >
                      <div className="product-buttons">
                        <button
                          className="product-button"
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                          }}
                        >
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
    </div>
    <BottomBar/>
        <Footer/>
    </>
  );
};

export default ForHerPage;
