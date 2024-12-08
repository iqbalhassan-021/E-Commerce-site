import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Navbar from '../components/navBar';
import Footer from '../components/footer';

const NewProducts = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Hoodie'); // Default category

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const db = getFirestore();
      const categoriesCollection = collection(db, 'Category');
      try {
        const querySnapshot = await getDocs(categoriesCollection);
        const categoryList = querySnapshot.docs.map(doc => doc.data().categoryName);
        setCategories(categoryList);
        console.log("Categories fetched: ", categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const db = getFirestore();
      const productsCollection = collection(db, 'products');
      try {
        const querySnapshot = await getDocs(productsCollection);
        const productList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Reverse the products array to show the newest at the top
        setProducts(productList.reverse());
  
        // Default display: Hoodies if no category is selected
        const defaultCategory = 'Hoodie';
        const defaultFiltered = productList.filter(product => product.productType === defaultCategory);
        setFilteredProducts(defaultFiltered);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts();
  }, []);
  

  // Filter products by category
  const handleCategoryClick = (categoryName) => {
    const filtered = products.filter(product => product.productType === categoryName);
    setFilteredProducts(filtered);
  };

  // Handle category selection from the dropdown
  const handleSelectChange = (event) => {
    const categoryName = event.target.value;
    setSelectedCategory(categoryName);
    const filtered = products.filter(product => product.productType === categoryName);
    setFilteredProducts(filtered);
  };

  // Get the product count for each category
  const getProductCount = (categoryName) => {
    return products.filter(product => product.productType === categoryName).length;
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="background"></div>
        <div className="products-body">
          <div className="cover">

            <div className="products-partition">
              <div className="categories-section">
                <h2>Categories</h2>
                <ul>
                  {categories.length === 0 ? (
                    <li>No categories available</li>
                  ) : (
                    categories.map((category, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleCategoryClick(category)}
                          className="category-button"
                        >
                          {category} - {getProductCount(category)}
                        </button>
                      </li>
                    ))
                  )}
                </ul>

                <select
                  name='category'
                  id='category'
                  className='filter'
                  value={selectedCategory}
                  onChange={handleSelectChange}
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category} - {getProductCount(category)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="products-sections">
                <h2>Products</h2>
                <div className="showcase grid-3x">
                  {filteredProducts.length === 0 ? (
                    <p>No products available</p>
                  ) : (
                    filteredProducts.map((product) => (
                      <Link key={product.id} to={`/product/${product.id}`} className="no-decoration">
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NewProducts;
