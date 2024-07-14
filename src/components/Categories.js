import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Categories = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'Category');
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
    <div className="product-showcase">
        
      <div className="cover" style={{textAlign:'center'}}>
   
            <h1>Categories</h1>

        <div className="showcase grid">
          {products.length === 0 ? (
            <p>No products are added yet</p>
          ) : (
            products.map((product) => (
                <div className="product-card">
                  <div className="image-container" style={{backgroundColor:'white'}}>
                    <img src={product.categoryImage} alt={product.categoryName} className="Product-image" />
                   
                  </div>
                  <p style={{opacity:'0%'}}>--</p>
                  <div className="text-holder" style={{textAlign:'center'}}>
                    <p>{product.categoryName}</p>
                   
                  </div>
                </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
