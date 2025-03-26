import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const ProductShowcase = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState(''); // State for mainDisplay selection

  // Fetch the selected productType from mainDisplay
  useEffect(() => {
    const fetchMainDisplay = async () => {
      const db = getFirestore();
      const mainDisplayCollection = collection(db, 'mainDisplay');
      try {
        const querySnapshot = await getDocs(mainDisplayCollection);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data(); // Assuming one doc (e.g., 'settings')
          setSelectedProductType(data.selectedProductType || 'Oversized T-Shirt Drop Shoulder'); // Fallback
        } else {
          setSelectedProductType('Oversized T-Shirt Drop Shoulder'); // Default if no selection
        }
      } catch (error) {
        console.error("Error retrieving main display data: ", error);
        setSelectedProductType('Oversized T-Shirt Drop Shoulder'); // Fallback on error
      }
    };
    fetchMainDisplay();
  }, []);

  // Fetch and filter products based on selectedProductType
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedProductType) return; // Wait until selectedProductType is set
      const db = getFirestore();
      const dataCollection = collection(db, 'products');
      try {
        const querySnapshot = await getDocs(dataCollection);
        const productList = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          // Filter by the selected productType
          .filter(product => product.productType === selectedProductType)
          // Sort by productCode in descending order
          .sort((a, b) => b.productCode.localeCompare(a.productCode));
        setProducts(productList);
      } catch (error) {
        console.error("Error retrieving product data: ", error);
      }
    };
    fetchData();
  }, [selectedProductType]); // Re-run when selectedProductType changes

  const displayedProducts = products.slice(0, 8);

  return (
    <div className="product-showcase">
      <div className="cover">
        <div className="showcase grid">
          {displayedProducts.length === 0 ? (
            <p>No "{selectedProductType}" products found</p>
          ) : (
            displayedProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className='no-decoration'>
                <div className="product-card">
                  <div className="image-container">
                    <img src={product.productImage} alt={product.productName} className="Product-image" />
                  </div>
                  <div className="text-holder">
                    <p>{product.productName}</p>
                    <p>Type: {product.productType}</p>
                    <p>Code: {product.productCode}</p>
                    <p className="price-tag">From RS.{product.productPrice}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
        {products.length > 0 && (
          <Link to='/products' className="no-decoration">
            <button className="primary-button">Show All Products</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductShowcase;