import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import BottomBar from '../components/BottomBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryProductsPage = () => {
  const { categoryName } = useParams(); // grabs category name from URL
  const [products, setProducts] = useState([]);
  const [storeSales, setStoreSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      const db = getFirestore();
      const salesCollection = collection(db, 'storeSale');
      const salesSnapshot = await getDocs(salesCollection);
      const salesList = salesSnapshot.docs.map(doc => doc.data());
      setStoreSales(salesList);
    };

    fetchSales();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'products');

      try {
        const querySnapshot = await getDocs(dataCollection);
        let productList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        productList = productList
          .filter(product =>
            (product.productType || '').trim().toLowerCase() === categoryName.trim().toLowerCase()
          )
          .map(product => {
            const matchingSale = storeSales.find(
              sale => (sale.categoryId || '').toLowerCase() === (product.productType || '').toLowerCase()
            );

            if (matchingSale) {
              const discount = (product.productPrice * matchingSale.salePercentage) / 100;
              return {
                ...product,
                salePrice: Math.round(product.productPrice - discount)
              };
            }

            return product;
          });

        productList.sort((a, b) =>
          b.productCode.localeCompare(a.productCode)
        );

        setProducts(productList);
      } catch (error) {
        console.error("❌ Error retrieving product data: ", error);
      }
    };

    fetchData();
  }, [categoryName, storeSales]);

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
            productPrice: product.salePrice || product.productPrice,
            productImage: product.productImage,
            productSize: product.productSize || 'L',
            productColor: product.productColor,
            productCode: product.productCode,
            productType: product.productType,
            quantity: 1,
          },
        ];
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart));
       window.dispatchEvent(new Event('toggle-cart'));

    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      toast.error('Failed to add to cart.', { position: 'bottom-right' });
    }
  };

  return (
    <>
      <div className="sticky">
        <Navbar />
      </div>
   
        <div className="body-cover">
          <div className="banner-title">
            <h1>{categoryName}</h1>
          </div>
     
      </div>

      <div className="product-container">
        <div className="body-cover">
          <div className="products">
            <div className="grid-4x">
              {products.length === 0 ? (
                <p>No products found for this category.</p>
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
                          {product.salePrice ? (
                            <>
                              <p className="product-price-text">
                                <span style={{ textDecoration: 'line-through', color: 'gray' }}>
                                  Rs.{product.productPrice}
                                </span>{' '}
                                <span style={{ color: 'red', fontWeight: 'bold' }}>
                                  Rs.{product.salePrice}
                                </span>
                              </p>
                            </>
                          ) : (
                            <p className="product-price-text">Rs.{product.productPrice}</p>
                          )}
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

      <ToastContainer />
      <BottomBar />
      <Footer />
    </>
  );
};

export default CategoryProductsPage;
