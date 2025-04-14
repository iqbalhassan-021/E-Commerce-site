import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import { app } from '../firebase';

const Buy = () => {
  const db = getFirestore(app);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currency, setcurrency] = useState('');
  const [shippingFee, setshippingFee] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'storeDetails');
      try {
        const querySnapshot = await getDocs(dataCollection);
        if (!querySnapshot.empty) {
          const firstDocument = querySnapshot.docs[0];
          const siteInfo = firstDocument.data();
          setcurrency(siteInfo.currency);
          setshippingFee(siteInfo.shippingrate);
        } else {
          console.log('No documents found!');
        }
      } catch (error) {
        console.error("Error retrieving site data: ", error);
      }
    };
    fetchData();
  }, []);

  const handleBuyRequest = async (e) => {
    const buyerData = {
      productImg: product.productImage,
      buyerName: document.getElementById('name').value,
      buyerEmail: document.getElementById('phone').value,
      buyerAddress: document.getElementById('address').value,
      productName: document.getElementById('productName').innerHTML,
      productCode: document.getElementById('code').innerHTML,
      productQuantity: document.getElementById('quantity').innerHTML,
      productType: document.getElementById('type').innerHTML,
      totalAmount: document.getElementById('total').innerHTML,
      color: document.getElementById('color').value,
      size: document.getElementById('size').value,
    };
    e.preventDefault();
    try {
      await addDoc(collection(db, 'orders'), buyerData);
      alert('Request sent successfully!');
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Error sending request. Please try again.');
    }
  };

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

  const plus = (event) => {
    event.preventDefault();
    let count = parseInt(document.getElementById('quantity').innerHTML);
    let product_price = parseInt(document.getElementById('price').innerHTML);
    let shipping_fee = parseInt(document.getElementById('fee').innerHTML);
    count += 1;
    let bill = product_price * count + shipping_fee;
    document.getElementById('total').innerHTML = bill;
    document.getElementById('quantity').innerHTML = count;
  };

  const minus = (event) => {
    event.preventDefault();
    let count = parseInt(document.getElementById('quantity').innerHTML);
    let product_price = parseInt(document.getElementById('price').innerHTML);
    let shipping_fee = parseInt(document.getElementById('fee').innerHTML);
    if (count > 1) {
      count -= 1;
      let bill = product_price * count + shipping_fee;
      document.getElementById('total').innerHTML = bill;
      document.getElementById('quantity').innerHTML = count;
    } else {
      count = 1;
      let bill = product_price + shipping_fee;
      document.getElementById('total').innerHTML = bill;
      document.getElementById('quantity').innerHTML = count;
    }
  };

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
    { categoryName: "Mug", size: "-", colors: "-" },
  ];

  const matchedProduct = manualProductData.find((p) => p.categoryName === product.productType);
  const getSizes = (sizeString) => (sizeString && sizeString !== '-' ? sizeString.split(',').map((s) => s.trim()) : []);
  const getColors = (colorString) => (colorString && colorString !== '-' ? colorString.split(',').map((c) => c.trim()) : []);

  return (
    <>
      <div className="sticky">
        <Navbar />
      </div>
      <div className="buy-container">
        <div className="cover">
          <div className="buyit">
            <form  action="https://api.web3forms.com/submit" method="POST" >
            <input type="hidden" name="access_key" value="96dfec8b-2442-41ef-b291-a01b5f495183"/>
            <input type="hidden" id="code" name='code'  value={product.productCode} required />
              <div className="product-side">
                <img src={product.productImage} alt={product.productName} style={{ maxWidth: '300px' }} />
                <p>
                  Product Name: <span id="productName">{product.productName}</span>
                </p>
                <p style={{ fontSize: '36px' }}>
                  {currency}
                  <span id="price">{product.productPrice}</span>
                </p>
                <p>
                  Product Type: <span id="type">{product.productType}</span>
                </p>
                <p>
                  Product Code: <span id="code">{product.productCode}</span>
                </p>
                <p>
                  Shipping fees: {currency}
                  <span id="fee">{shippingFee}</span>
                </p>
              </div>
              <div className="product-info">
     
                <div className="input-holder">
                  <label htmlFor="name">Buyer Name</label>
                  <input type="text" id="name" placeholder="Name.." name='name' required />
                </div>
                <div className="input-holder">
                  <label htmlFor="address">Buyer Address</label>
                  <input type="text" id="address" placeholder="address.." name='address' required />
                </div>
                <div className="input-holder">
                  <label htmlFor="phone">Buyer phone or email</label>
                  <input type="text" id="phone" placeholder="phone.." name='phone' required />
                </div>
                <div className="input-holder mbl-actions">
                  {matchedProduct && getSizes(matchedProduct.size).length > 0 && (
                    <>
                      <label htmlFor="size">Size</label>
                      <p style={{ opacity: '0%' }}>--</p>
                      <select
                        name='size'
                        type="text"
                        id="size"
                        required
                        style={{ width: 'auto', minWidth: '70px' }}
                      >
                        {getSizes(matchedProduct.size).map((size, index) => (
                          <option key={index} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                      <p style={{ opacity: '0%' }}>--</p>
                    </>
                  )}
                  {matchedProduct && getColors(matchedProduct.colors).length > 0 && (
                    <>
                      <label htmlFor="color">Color</label>
                      <p style={{ opacity: '0%' }}>--</p>
                      <select
                        name='color'
                        type="text"
                        id="color"
                        required
                        style={{ width: 'auto', minWidth: '70px' }}
                      >
                        {getColors(matchedProduct.colors).map((color, index) => (
                          <option key={index} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                      <p style={{ opacity: '0%' }}>--</p>
                    </>
                  )}
                  <label htmlFor="quantity">Quantity</label>
                  <p style={{ opacity: '0%' }}>--</p>
                  <button className="primary-button" onClick={minus}>
                    -
                  </button>
                  <p style={{ opacity: '0%' }}>--</p>
                  <p style={{ fontSize: '26px' }} id="quantity" name='quantity'>
                    1
                  </p>
                  <p style={{ opacity: '0%' }}>--</p>
                  <button className="primary-button" onClick={plus}>
                    +
                  </button>
                  <p style={{ opacity: '0%' }}>--</p>
                </div>
                <hr />
                <div className="input-holder">
                  <style>
                    {`
                      .payment-details {
                        background: #f8f8f8;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        margin-top: 10px;
                      }
                      .payment-details p {
                        margin: 5px 0;
                      }
                      .payment-details strong {
                        color: #333;
                      }
                    `}
                  </style>
                  <p>Payment Method: Easypaisa</p>
                  <div className="payment-details">
                    <p>
                      <strong>Name: </strong>IQBAL HASSAN
                      <br />
                      <strong>Account Number: </strong>03121798713
                      <br />
                      <strong>Note: </strong>You'll receive your package within 7 working days after paying the amount.
                    </p>
                  </div>
                </div>
                <hr />
                <div
                  className="input-holder"
                  style={{ display: 'flex', justifyContent: 'right', textAlign: 'right' }}
                >
                  <p>
                    <strong>Total: </strong>
                    <br />
                    <span id="total" style={{ fontSize: '36px' }} name='total'>
                      {parseInt(product.productPrice) + parseInt(shippingFee)}
                    </span>
                  </p>
                </div>
                <hr />
                <br />
                <button className="primary-button white-button" type='submit'>Save Order</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Buy;