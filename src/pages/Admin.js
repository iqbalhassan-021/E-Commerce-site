import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, getFirestore, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { app } from '../firebase'; // Import your Firebase config
import ProductShowcase from '../components/Products'; // Assuming ProductShowcase is in a separate file

const AdminPage = () => {
  const db = getFirestore(app); // Initialize Firestore

  const handleProductSubmit = async (e) => {
    const productData = {
      productImage: document.getElementById('productImage').value,
      productName: document.getElementById('productName').value,
      productPrice: document.getElementById('productPrice').value,
      productCode: document.getElementById('productCode').value,
      productType: document.getElementById('productType').value
    };
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), productData);
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    }
  };

  const handleCateogy = async (e) => {
    const productData = {
      categoryImage: document.getElementById('categoryImage').value,
      categoryName: document.getElementById('categoryName').value
    };
    e.preventDefault();
    try {
      await addDoc(collection(db, 'Category'), productData);
      alert('Category added successfully!');
    } catch (error) {
      console.error('Error adding Category:', error);
      alert('Error adding Category. Please try again.');
    }
  };

  const handleStoreSubmit = async (e) => {
    const storeData = {
      storeLogo: document.getElementById('storeLogo').value,
      storeName: document.getElementById('storeName').value,
      instaID: document.getElementById('instaID').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      address: document.getElementById('address').value,
      storeBanner: document.getElementById('storeBanner').value,
      storeSlogan: document.getElementById('storeSlogan').value,
      currency: document.getElementById('currency').value,
      shippingrate: document.getElementById('ratedollar').value,
      bankHolder: document.getElementById('accHolder').value,
      bankName: document.getElementById('bank').value,
      iban: document.getElementById('iban').value,
      about: document.getElementById('about').value,
    };
    e.preventDefault();
    try {
      await addDoc(collection(db, 'storeDetails'), storeData);
      alert('Store details saved successfully!');
    } catch (error) {
      console.error('Error saving store details:', error);
      alert('Error saving store details. Please try again.');
    }
  };

  const handleBlogSubmit = async (e) => {
    const blogData = {
      blogHeading: document.getElementById('blogHeading').value,
      blogImage: document.getElementById('blogImage').value,
      blogContent: document.getElementById('blogContent').value,
    };
    e.preventDefault();
    try {
      await addDoc(collection(db, 'blogs'), blogData);
      alert('Blog uploaded successfully!');
    } catch (error) {
      console.error('Error uploading blog:', error);
      alert('Error uploading blog. Please try again.');
    }
  };

  const [subscribers, setsubscribers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'subscribers');
      try {
        const querySnapshot = await getDocs(dataCollection);
        const subscribersList = querySnapshot.docs.map(doc => doc.data());
        setsubscribers(subscribersList);
      } catch (error) {
        console.error("Error retrieving product data: ", error);
      }
    };
    fetchData();
  }, []);

  function toggle() {
    const togglebar = document.getElementById('togglebar');
    if (togglebar.style.display === 'flex') {
      togglebar.style.display = 'none';
    } else {
      togglebar.style.display = 'flex';
    }
  }

  function showHome() {
    const hometab = document.getElementById('hometab');
    const upoadBlog = document.getElementById('upoadBlog');
    const orders = document.getElementById('orders');
    const uploadtab = document.getElementById('uploadtab');
    const editstore = document.getElementById('editstore');
    const subscribers = document.getElementById('subscribers');
    const categories = document.getElementById('categories');
    if (hometab.style.display === 'grid') {
      hometab.style.display = 'grid';
    } else {
      hometab.style.display = 'grid';
      orders.style.display = 'none';
      uploadtab.style.display = 'none';
      editstore.style.display = 'none';
      subscribers.style.display = 'none';
      categories.style.display = 'none';
      upoadBlog.style.display = 'none';
      const togglebar = document.getElementById('togglebar');
      if (window.innerWidth <= 880) {
        togglebar.style.display = 'none';
      } else {
        togglebar.style.display = 'flex';
      }
    }
  }

  function showOrders() {
    const hometab = document.getElementById('hometab');
    const upoadBlog = document.getElementById('upoadBlog');
    const orders = document.getElementById('orders');
    const uploadtab = document.getElementById('uploadtab');
    const editstore = document.getElementById('editstore');
    const subscribers = document.getElementById('subscribers');
    const categories = document.getElementById('categories');
    if (orders.style.display === 'grid') {
      orders.style.display = 'none';
      hometab.style.display = 'grid';
    } else {
      categories.style.display = 'none';
      hometab.style.display = 'none';
      upoadBlog.style.display = 'none';
      orders.style.display = 'grid';
      uploadtab.style.display = 'none';
      editstore.style.display = 'none';
      subscribers.style.display = 'none';
      const togglebar = document.getElementById('togglebar');
      if (window.innerWidth <= 880) {
        togglebar.style.display = 'none';
      } else {
        togglebar.style.display = 'flex';
      }
    }
  }

  function showUploadProducts() {
    const hometab = document.getElementById('hometab');
    const upoadBlog = document.getElementById('upoadBlog');
    const orders = document.getElementById('orders');
    const uploadtab = document.getElementById('uploadtab');
    const editstore = document.getElementById('editstore');
    const subscribers = document.getElementById('subscribers');
    const categories = document.getElementById('categories');
    if (uploadtab.style.display === 'block') {
      uploadtab.style.display = 'none';
      hometab.style.display = 'grid';
    } else {
      categories.style.display = 'none';
      uploadtab.style.display = 'block';
      hometab.style.display = 'none';
      orders.style.display = 'none';
      upoadBlog.style.display = 'none';
      editstore.style.display = 'none';
      subscribers.style.display = 'none';
      const togglebar = document.getElementById('togglebar');
      if (window.innerWidth <= 880) {
        togglebar.style.display = 'none';
      } else {
        togglebar.style.display = 'flex';
      }
    }
  }

  function showEditStore() {
    const hometab = document.getElementById('hometab');
    const upoadBlog = document.getElementById('upoadBlog');
    const orders = document.getElementById('orders');
    const uploadtab = document.getElementById('uploadtab');
    const editstore = document.getElementById('editstore');
    const subscribers = document.getElementById('subscribers');
    const categories = document.getElementById('categories');
    if (editstore.style.display === 'block') {
      editstore.style.display = 'none';
      hometab.style.display = 'grid';
    } else {
      categories.style.display = 'none';
      editstore.style.display = 'block';
      hometab.style.display = 'none';
      orders.style.display = 'none';
      upoadBlog.style.display = 'none';
      uploadtab.style.display = 'none';
      subscribers.style.display = 'none';
      const togglebar = document.getElementById('togglebar');
      if (window.innerWidth <= 880) {
        togglebar.style.display = 'none';
      } else {
        togglebar.style.display = 'flex';
      }
    }
  }

  function showUploadBlog() {
    const hometab = document.getElementById('hometab');
    const upoadBlog = document.getElementById('upoadBlog');
    const orders = document.getElementById('orders');
    const uploadtab = document.getElementById('uploadtab');
    const editstore = document.getElementById('editstore');
    const subscribers = document.getElementById('subscribers');
    const categories = document.getElementById('categories');
    if (upoadBlog.style.display === 'block') {
      upoadBlog.style.display = 'none';
      hometab.style.display = 'grid';
    } else {
      categories.style.display = 'none';
      upoadBlog.style.display = 'block';
      hometab.style.display = 'none';
      orders.style.display = 'none';
      uploadtab.style.display = 'none';
      editstore.style.display = 'none';
      subscribers.style.display = 'none';
      const togglebar = document.getElementById('togglebar');
      if (window.innerWidth <= 880) {
        togglebar.style.display = 'none';
      } else {
        togglebar.style.display = 'flex';
      }
    }
  }

  function showSubscribers() {
    const hometab = document.getElementById('hometab');
    const upoadBlog = document.getElementById('upoadBlog');
    const orders = document.getElementById('orders');
    const uploadtab = document.getElementById('uploadtab');
    const editstore = document.getElementById('editstore');
    const subscribers = document.getElementById('subscribers');
    const categories = document.getElementById('categories');
    if (subscribers.style.display === 'block') {
      subscribers.style.display = 'none';
      hometab.style.display = 'grid';
    } else {
      categories.style.display = 'none';
      upoadBlog.style.display = 'none';
      hometab.style.display = 'none';
      orders.style.display = 'none';
      uploadtab.style.display = 'none';
      editstore.style.display = 'none';
      subscribers.style.display = 'block';
      const togglebar = document.getElementById('togglebar');
      if (window.innerWidth <= 880) {
        togglebar.style.display = 'none';
      } else {
        togglebar.style.display = 'flex';
      }
    }
  }

  function showCategories() {
    const hometab = document.getElementById('hometab');
    const upoadBlog = document.getElementById('upoadBlog');
    const orders = document.getElementById('orders');
    const uploadtab = document.getElementById('uploadtab');
    const editstore = document.getElementById('editstore');
    const subscribers = document.getElementById('subscribers');
    const categories = document.getElementById('categories');
    if (categories.style.display === 'block') {
      categories.style.display = 'none';
      hometab.style.display = 'grid';
    } else {
      categories.style.display = 'block';
      upoadBlog.style.display = 'none';
      hometab.style.display = 'none';
      orders.style.display = 'none';
      uploadtab.style.display = 'none';
      editstore.style.display = 'none';
      subscribers.style.display = 'none';
      const togglebar = document.getElementById('togglebar');
      if (window.innerWidth <= 880) {
        togglebar.style.display = 'none';
      } else {
        togglebar.style.display = 'flex';
      }
    }
  }

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'products');
      try {
        const querySnapshot = await getDocs(dataCollection);
        const productList = querySnapshot.docs.map(doc => doc.data());
        setProducts(productList);
      } catch (error) {
        console.error("Error retrieving product data: ", error);
      }
    };
    fetchData();
  }, []);

  const handleCopy = () => {
    const textToCopy = subscribers.length === 0
      ? 'No subscribers yet'
      : subscribers.map(subscriber => subscriber.email).join('\n');
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = textToCopy;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    alert('Emails copied to clipboard!');
  };

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'orders');
      const querySnapshot = await getDocs(dataCollection);
      if (!querySnapshot.empty) {
        const ordersData = querySnapshot.docs.map(doc => doc.data());
        setOrders(ordersData);
      } else {
        console.log('No orders found!');
      }
    };
    fetchData();
  }, []);

  const [Category, setCategory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'Category');
      const querySnapshot = await getDocs(dataCollection);
      if (!querySnapshot.empty) {
        const CategoryData = querySnapshot.docs.map(doc => doc.data());
        setCategory(CategoryData);
      } else {
        console.log('No orders found!');
      }
    };
    fetchData();
  }, []);

  // New state and logic for mainDisplay
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState('');

  // Fetch all unique productTypes from products collection
  useEffect(() => {
    const fetchProductTypes = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'products');
      try {
        const querySnapshot = await getDocs(dataCollection);
        const productList = querySnapshot.docs.map(doc => doc.data());
        const uniqueProductTypes = [...new Set(productList.map(product => product.productType))];
        setProductTypes(uniqueProductTypes);
      } catch (error) {
        console.error("Error retrieving product types: ", error);
      }
    };
    fetchProductTypes();
  }, []);

  // Fetch the selected productType from mainDisplay collection
  useEffect(() => {
    const fetchMainDisplay = async () => {
      const db = getFirestore();
      const mainDisplayDoc = await getDocs(collection(db, 'mainDisplay'));
      if (!mainDisplayDoc.empty) {
        const data = mainDisplayDoc.docs[0].data();
        setSelectedProductType(data.selectedProductType || '');
      }
    };
    fetchMainDisplay();
  }, []);

  // Handle saving the selected productType to mainDisplay
  const handleMainDisplaySubmit = async (e) => {
    e.preventDefault();
    const selectedType = document.getElementById('mainDisplayType').value;
    try {
      // Use a fixed document ID (e.g., 'settings') to overwrite the same doc
      await setDoc(doc(db, 'mainDisplay', 'settings'), {
        selectedProductType: selectedType
      });
      setSelectedProductType(selectedType);
      alert('Main display product type updated successfully!');
    } catch (error) {
      console.error('Error updating main display:', error);
      alert('Error updating main display. Please try again.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-section">
        <div className="cover">
          <div className="admin-actions">
            <button className="toggle-button" onClick={toggle}>
              <i className="fa-sharp fa-solid fa-bars"></i>
            </button>
            <h3>Admin Page</h3>
          </div>
        </div>
      </div>
      <div className="actions-holder">
        <div className="cover">
          <div className="Toggleactions">
            <div className="toggle-bar" id="togglebar">
              <button className="primary-button" onClick={showHome}>Home</button>
              <button className="primary-button" onClick={showOrders}>Orders</button>
              <button className="primary-button" onClick={showUploadProducts}>Upload a product</button>
              <button className="primary-button" onClick={showEditStore}>Edit Store</button>
              <button className="primary-button" onClick={showUploadBlog}>Upload a Blog</button>
              <button className="primary-button" onClick={showCategories}>Categories</button>
              <button className="primary-button" onClick={showSubscribers}>Subscribers</button>
              <Link to="/" className='no-decoration navLink'>
                <button className="primary-button">Go to store</button>
              </Link>
            </div>
            <div className="tabs">
              <div className="homeTab" id="hometab">
                {products.length === 0 ? (
                  <p>No products are added yet</p>
                ) : (
                  products.map((product) => (
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
                  ))
                )}
              </div>

              <div className="categories" id="categories">
                <p>Categories</p>
                <p>
                  Note: Upload all the images on <a href='https://imgbb.com/' target='blank'>imgbb</a>, select the image and copy image address then paste the link here.
                </p>
                <form onSubmit={handleCateogy}>
                  <div className="input-holder">
                    <label htmlFor="categoryImage">Category Image Source</label>
                    <input type="text" name="categoryImage" id="categoryImage" placeholder="src.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="categoryName">Category Name</label>
                    <input type="text" name="categoryName" id="categoryName" placeholder="Category Name.." required />
                  </div>
                  <button className="primary-button">Add Category</button>
                </form>

                {/* New Main Display Section */}
                <div className="main-display-section">
                  <h3>Set Main Display Product Type</h3>
                  <form onSubmit={handleMainDisplaySubmit}>
                    <div className="input-holder">
                      <label htmlFor="mainDisplayType">Select Product Type</label>
                      <select name="mainDisplayType" id="mainDisplayType" required>
                        {productTypes.length === 0 ? (
                          <option value="">No product types available</option>
                        ) : (
                          productTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                          ))
                        )}
                      </select>
                    </div>
                    <button className="primary-button">Save Main Display</button>
                  </form>
                  <p>Current Main Display: {selectedProductType || 'None selected'}</p>
                </div>
              </div>

              <div className="ordersTab" id="orders">
                {orders.length === 0 ? (
                  <p>No orders</p>
                ) : (
                  orders.map((order, index) => (
                    <div className="new-order" key={index}>
                      <img src={order.productImg} alt={order.productName} style={{ maxWidth: '200px' }} />
                      <p><strong>Name:</strong> {order.buyerName}</p>
                      <p><strong>Phone:</strong> {order.buyerEmail}</p>
                      <p><strong>Address:</strong> {order.buyerAddress}</p>
                      <p><strong>Product Name:</strong> {order.productName}</p>
                      <p><strong>Product Code:</strong> {order.productCode}</p>
                      <p><strong>Product Type:</strong> {order.productType}</p>
                      <p><strong>Quantity:</strong> {order.productQuantity}</p>
                      <p><strong>Size:</strong> {order.size}</p>
                      <p><strong>Color:</strong> {order.color}</p>
                      <p><strong>Total Bill:</strong> {order.totalAmount}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="uploadTab" id="uploadtab">
                <h3>Upload a Product</h3>
                <p>
                  Note: Upload all the images on <a href='https://imgbb.com/' target='blank'>imgbb</a>, select the image and copy image address then paste the link here.
                </p>
                <form onSubmit={handleProductSubmit}>
                  <div className="input-holder">
                    <label htmlFor="productImage">Product Image Source</label>
                    <input type="text" name="productImage" id="productImage" placeholder="src.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="productName">Product Name</label>
                    <input type="text" name="productName" id="productName" placeholder="product Name.." required />
                  </div>
                  <div className="input-holder mbl-actions">
                    <div className="input-holder">
                      <label htmlFor="productPrice">Product Price</label>
                      <input type="number" name="productPrice" id="productPrice" placeholder="Price.." required />
                    </div>
                    <div className="input-holder" style={{ marginLeft: '10px' }}>
                      <label htmlFor="productCode">Product Code</label>
                      <input type="text" name="productCode" id="productCode" placeholder="Product Code.." required />
                    </div>
                    <div className="input-holder" style={{ marginLeft: '10px' }}>
                      <label htmlFor="productType">Product Type</label>
                      <select type="text" name="productType" id="productType" required>
                        {Category.length === 0 ? (
                          <p>No Category</p>
                        ) : (
                          Category.map((categories, index) => (
                            <option value={categories.categoryName}>{categories.categoryName}</option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                  <button className="primary-button">Add Product</button>
                </form>
              </div>

              <div className="editStore" id="editstore">
                <h3>Edit Store</h3>
                <p>
                  Note: Upload all the images on <a href='https://imgbb.com/' target='blank'>imgbb</a>, select the image and copy image address then paste the link here.
                </p>
                <form onSubmit={handleStoreSubmit}>
                  <div className="input-holder">
                    <label htmlFor="storeLogo">Store Logo Source</label>
                    <input type="text" name="storeLogo" id="storeLogo" placeholder="src.." />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="storeBanner">Store Banner Source</label>
                    <input type="text" name="storeBanner" id="storeBanner" placeholder="src.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="storeSlogan">Store Slogan</label>
                    <input type="text" name="storeSlogan" id="storeSlogan" placeholder="src.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="storeName">Store Name</label>
                    <input type="text" name="storeName" id="storeName" placeholder="Name.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="instaID">Instagram Link</label>
                    <input type="text" name="instaID" id="instaID" placeholder="link.." />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="phone">Store Phone NO#</label>
                    <input type="text" name="phone" id="phone" placeholder="PhoneNO#.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="email">Store email</label>
                    <input type="text" name="email" id="email" placeholder="email.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="address">Store address</label>
                    <input type="text" name="address" id="address" placeholder="address.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="about">About Store</label>
                    <textarea type="text" name="about" id="about" cols="15" rows="15" required></textarea>
                  </div>
                  <p>Shipping Rates</p>
                  <hr />
                  <div className="input-holder">
                    <label htmlFor="currency">Choose a currency:</label>
                    <select id="currency" name="currency">
                      <option value="RS">Pak Rupees (RS)</option>
                      <option value="USD">United States Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound Sterling (GBP)</option>
                      <option value="JPY">Japanese Yen (JPY)</option>
                      <option value="AUD">Australian Dollar (AUD)</option>
                      <option value="CAD">Canadian Dollar (CAD)</option>
                      <option value="CHF">Swiss Franc (CHF)</option>
                      <option value="CNY">Chinese Yuan (CNY)</option>
                      <option value="INR">Indian Rupee (INR)</option>
                      <option value="BRL">Brazilian Real (BRL)</option>
                      <option value="ZAR">South African Rand (ZAR)</option>
                      <option value="RUB">Russian Ruble (RUB)</option>
                      <option value="KRW">South Korean Won (KRW)</option>
                      <option value="MXN">Mexican Peso (MXN)</option>
                      <option value="SGD">Singapore Dollar (SGD)</option>
                      <option value="HKD">Hong Kong Dollar (HKD)</option>
                      <option value="MYR">Malaysian Ringgit (MYR)</option>
                      <option value="THB">Thai Baht (THB)</option>
                      <option value="NZD">New Zealand Dollar (NZD)</option>
                      <option value="PKR">Pakistani Rupee (PKR)</option>
                      <option value="SAR">Saudi Riyal (SAR)</option>
                      <option value="TRY">Turkish Lira (TRY)</option>
                      <option value="AED">United Arab Emirates Dirham (AED)</option>
                    </select>
                  </div>
                  <div className="input-holder">
                    <label htmlFor="ratedollar">Average Shipping Rate</label>
                    <input type="text" name="ratedollar" id="ratedollar" placeholder="0" />
                  </div>
                  <p>Account Details</p>
                  <hr />
                  <div className="input-holder">
                    <label htmlFor="accHolder">Account Holder Name</label>
                    <input type="text" name="accHolder" id="accHolder" placeholder="Name" required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="bank">Bank Name</label>
                    <input type="text" name="bank" id="bank" placeholder="Bank Name" />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="iban">IBAN</label>
                    <input type="text" name="iban" id="iban" placeholder="IBAN" required />
                  </div>
                  <button className="primary-button">Save Details</button>
                </form>
              </div>

              <div className="uploadBlog" id="upoadBlog">
                <h3>Upload a Blog</h3>
                <p>
                  Note: Upload all the images on <a href='https://imgbb.com/' target='blank'>imgbb</a>, select the image and copy image address then paste the link here.
                </p>
                <form onSubmit={handleBlogSubmit}>
                  <div className="input-holder">
                    <label htmlFor="blogHeading">Blog Heading</label>
                    <input type="text" name="blogHeading" id="blogHeading" placeholder="blogHeading.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="blogImage">Blog Image Source</label>
                    <input type="text" name="blogImage" id="blogImage" placeholder="src.." required />
                  </div>
                  <div className="input-holder">
                    <label htmlFor="blogContent">Content</label>
                    <textarea type="text" name="blogContent" id="blogContent" cols="15" rows="15" required></textarea>
                  </div>
                  <button className="primary-button">Upload Blog</button>
                </form>
              </div>

              <div className="subscribers" id="subscribers">
                <h3>Subscribers</h3>
                <div className="new-order">
                  {subscribers.length === 0 ? (
                    <p>No subscribers yet</p>
                  ) : (
                    subscribers.map((subscriber) => (
                      <p>{subscriber.email},</p>
                    ))
                  )}
                </div>
                <br />
                <button className="primary-button" onClick={handleCopy}>Copy all emails</button>
              </div>
            </div>
          </div>
        </div>
      </div>

 
    </div>
  );
};

export default AdminPage;