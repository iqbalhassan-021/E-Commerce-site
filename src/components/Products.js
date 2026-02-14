import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const ProductShowcase = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState('');

  useEffect(() => {
    const fetchMainDisplay = async () => {
      const db = getFirestore();
      const mainDisplayCollection = collection(db, 'mainDisplay');
      try {
        const querySnapshot = await getDocs(mainDisplayCollection);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setSelectedProductType(data.selectedProductType || 'Oversized T-Shirt Drop Shoulder');
        } else {
          setSelectedProductType('Oversized T-Shirt Drop Shoulder');
        }
      } catch (error) {
        console.error("Error retrieving main display data: ", error);
        setSelectedProductType('Oversized T-Shirt Drop Shoulder');
      }
    };
    fetchMainDisplay();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedProductType) return;
      const db = getFirestore();
      const dataCollection = collection(db, 'products');
      try {
        const querySnapshot = await getDocs(dataCollection);
        const productList = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(product => product.productType === selectedProductType)
          .sort((a, b) => b.productCode.localeCompare(a.productCode));
        setProducts(productList);
      } catch (error) {
        console.error("Error retrieving product data: ", error);
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
    
    console.log('✅ Cart saved:', updatedCart); // ADD THIS
    alert(`${product.productName} added to cart!`);
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
  }
};




  const displayedProducts = products.slice(0, 8);

  return (
    <div className="product-container">
      <div className="body-cover">
        <div className="products">
          <div className="section-title">
            <p>Featured Products</p>
          </div>

          <div className="grid-4x">
            {displayedProducts.length === 0 ? (
              <p>No "{selectedProductType}" products found</p>
            ) : (
              displayedProducts.map(product => (
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
                            e.preventDefault(); // Prevent Link navigation
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
  );
};

export default ProductShowcase;
