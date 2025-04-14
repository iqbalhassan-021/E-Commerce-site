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

              {/* Added Size and Color Display */}
              <style>
                {`
                  .size-container, .color-container {
                    margin: 16px 0;
                  }
                  .size-container h4, .color-container h4 {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #000000;
                  }
                  .size-list {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                  }
                  .size-item {
                    padding: 8px 16px;
                    border: 1px solid #d1d1d1;
                    border-radius: 4px;
                    background-color: #ffffff;
                    font-size: 14px;
                    color: #333333;
                    cursor: pointer;
                    transition: all 0.2s ease;
                  }
                  .size-item:hover {
                    border-color: #000000;
                    background-color: #f0f0f0;
                  }
                  .color-list {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                  }
                  .color-swatch {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 1px solid #d1d1d1;
                    cursor: pointer;
                    transition: all 0.2s ease;
                  }
                  .color-swatch:hover {
                    border-color: #000000;
                    transform: scale(1.1);
                  }
                  .color-swatch.white {
                    border: 1px solid #d1d1d1;
                  }
                `}
              </style>
              {
                (() => {
                  const manualProductData = [
                    { categoryName: "Sweat Shirt", size: "XL,L,S,M", colors: "Black,Charcoal Grey,Light Pink,White,Red,Gray" },
                    { categoryName: "Tanktop", size: "XL,L,S,M", colors: "Black,Yellow,Grey,White,Red,Gray,Navy" },
                    { categoryName: "Hoodie", size: "XL,L,S,M", colors: "Black,Yellow,Grey,White,Red,Gray,Navy,Pink,Purple" },
                    { categoryName: "Steel Water Bottle", size: "-", colors: "White" },
                    { categoryName: "Long Sleeves Shirt", size: "XL,L,S,M", colors: "Black,Yellow,Grey,White,Red,Gray,Navy,Pink,Purple" },
                    { categoryName: "Wallet", size: "-", colors: "Black,Green,Leather" },
                    { categoryName: "Zipper", size: "XL,L,S,M", colors: "Black,Yellow,Grey,White,Red,Gray,Navy,Pink,Purple" },
                    { categoryName: "Cap", size: "XL,L,S,M", colors: "Black,Yellow,Grey,White,Red,Gray,Navy,Pink,Purple" },
                    { categoryName: "T-Shirt", size: "XL,L,S,M", colors: "Black,Yellow,Grey,White,Red,Gray,Navy,Pink,Purple" },
                    { categoryName: "Oversized T-Shirt Drop Shoulder", size: "XL,L,S,M", colors: "Black,Yellow,Grey,White,Red,Gray,Navy,Pink,Purple" },
                    { categoryName: "Polo", size: "XL,L,S,M", colors: "Black,Yellow,Grey,White,Red,Gray,Navy,Pink,Purple" },
                    { categoryName: "Shopping Bag", size: "-", colors: "-" },
                    { categoryName: "Photo Frames", size: "A4", colors: "-" },
                    { categoryName: "Mug", size: "-", colors: "-" }
                  ];
                  const matchedProduct = manualProductData.find(p => p.categoryName === product.productType);
                  const getSizes = (sizeString) => sizeString && sizeString !== '-' ? sizeString.split(',').map(s => s.trim()) : [];
                  const getColors = (colorString) => colorString && colorString !== '-' ? colorString.split(',').map(c => c.trim()) : [];
                  const colorMap = {
                    Black: '#000000',
                    'Charcoal Grey': '#36454F',
                    'Light Pink': '#FFB6C1',
                    White: '#FFFFFF',
                    Red: '#FF0000',
                    Gray: '#808080',
                    Yellow: '#FFFF00',
                    Navy: '#000080',
                    Pink: '#FF69B4',
                    Purple: '#800080',
                    Green: '#008000',
                    Leather: '#8B4513'
                  };

                  return (
                    <>
                      {matchedProduct && getSizes(matchedProduct.size).length > 0 && (
                        <div className="size-container" style={{display: 'flex', flexDirection: 'column'}}>
                          <h4>Available Sizes</h4>
                         
                          <div className="size-list">
                            {getSizes(matchedProduct.size).map((size, index) => (
                              <div key={index} className="size-item">{size}</div>
                            ))}
                          </div>
                        </div>
                      )}
                      {matchedProduct && getColors(matchedProduct.colors).length > 0 && (
                        <div className="color-container">
                          <h4>Available Colors</h4>
                          <div className="color-list">
                            {getColors(matchedProduct.colors).map((color, index) => (
                              <div
                                key={index}
                                className={`color-swatch ${color.toLowerCase()}`}
                                style={{ backgroundColor: colorMap[color] || '#000000' }}
                                title={color}
                              ></div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()
              }

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