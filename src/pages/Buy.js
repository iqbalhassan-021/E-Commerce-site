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
  const [currency, setCurrency] = useState('');
  const [shippingFee, setShippingFee] = useState('');
  const [finalPrice, setFinalPrice] = useState(null);
  const [isOnSale, setIsOnSale] = useState(false);

  useEffect(() => {
    const fetchSiteDetails = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'storeDetails');
      try {
        const querySnapshot = await getDocs(dataCollection);
        if (!querySnapshot.empty) {
          const firstDocument = querySnapshot.docs[0];
          const siteInfo = firstDocument.data();
          setCurrency(siteInfo.currency);
          setShippingFee(siteInfo.shippingrate);
        }
      } catch (error) {
        console.error("Error retrieving site data: ", error);
      }
    };
    fetchSiteDetails();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      const db = getFirestore();
      const docRef = doc(db, 'products', id);

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const productData = docSnap.data();
          setProduct(productData);

          // Check onSale collection
          const saleCollection = collection(db, 'onSale');
          const saleSnapshot = await getDocs(saleCollection);
          const saleMatch = saleSnapshot.docs.find(
            doc => doc.data().productCode === productData.productCode
          );

          if (saleMatch) {
            const saleData = saleMatch.data();
            setFinalPrice(saleData.salePrice);
            setIsOnSale(true);
          } else {
            setFinalPrice(productData.productPrice);
          }
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

  const plus = (event) => {
    event.preventDefault();
    let count = parseInt(document.getElementById('quantity').innerHTML);
    let product_price = parseInt(finalPrice);
    let shipping_fee = parseInt(shippingFee);
    count += 1;
    let bill = product_price * count + shipping_fee;
    document.getElementById('total').innerHTML = bill;
    document.getElementById('quantity').innerHTML = count;
  };

  const minus = (event) => {
    event.preventDefault();
    let count = parseInt(document.getElementById('quantity').innerHTML);
    let product_price = parseInt(finalPrice);
    let shipping_fee = parseInt(shippingFee);
    if (count > 1) {
      count -= 1;
    }
    let bill = product_price * count + shipping_fee;
    document.getElementById('total').innerHTML = bill;
    document.getElementById('quantity').innerHTML = count;
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>No product found</p>;

  return (
    <>
      <div className="sticky">
        <Navbar />
      </div>
      <div className="buy-container">
        <div className="cover">
          <div className="buyit">
            <form action="https://api.web3forms.com/submit" method="POST">
              <input type="hidden" name="access_key" value="2f21b333-cfce-49ef-bd80-2c39a139de22" />
              <input type="hidden" id="code" name="code" value={product.productCode} required />

              <div className="product-side">
                <img src={product.productImage} alt={product.productName} style={{ maxWidth: '300px' }} />
                <p>
                  Product Name: <span id="productName">{product.productName}</span>
                </p>

                <p style={{ fontSize: '36px' }}>
                  {isOnSale && (
                    <span style={{ textDecoration: 'line-through', color: '#999', marginRight: '10px' }}>
                      {currency}{product.productPrice}
                    </span>
                  )}
                  {currency}
                  <span id="price">{finalPrice}</span>
                </p>

                <p>
                  Product Type: <span id="type">{product.productType}</span>
                </p>
                <p>
                  Product Code: <span>{product.productCode}</span>
                </p>
                <p>
                  Shipping fees: {currency}
                  <span id="fee">{shippingFee}</span>
                </p>
              </div>

              <div className="product-info">
     <div className="input-holder">
  <label htmlFor="firstName">First Name</label>
  <input type="text" id="firstName" name="firstName" placeholder="First Name" required />
</div>
<div className="input-holder">
  <label htmlFor="lastName">Last Name</label>
  <input type="text" id="lastName" name="lastName" placeholder="Last Name" required />
</div>
<div className="input-holder">
  <label htmlFor="email">Email</label>
  <input type="email" id="email" name="email" placeholder="Email Address" required />
</div>
<div className="input-holder">
  <label htmlFor="phone">Phone Number</label>
  <input type="tel" id="phone" name="phone" placeholder="Phone Number" required />
</div>
<div className="input-holder">
  <label htmlFor="address1">Address Line 1</label>
  <input type="text" id="address1" name="address1" placeholder="Street Address" required />
</div>
<div className="input-holder">
  <label htmlFor="address2">Address Line 2</label>
  <input type="text" id="address2" name="address2" placeholder="Apt, Suite, etc. (optional)" />
</div>
<div className="input-holder">
  <label htmlFor="city">City</label>
  <input type="text" id="city" name="city" placeholder="City" required />
</div>
<div className="input-holder">
  <label htmlFor="region">Region / State</label>
  <input type="text" id="region" name="region" placeholder="State or Province" required />
</div>
<div className="input-holder">
  <label htmlFor="postalCode">Postal Code</label>
  <input type="text" id="postalCode" name="postalCode" placeholder="Postal / ZIP Code" required />
</div>
<div className="input-holder">
  <label htmlFor="country">Country</label>
  <input type="text" id="country" name="country" placeholder="Country" required />
</div>


                <div className="input-holder mbl-actions">
                  <label htmlFor="quantity">Quantity</label>
                  <p style={{ opacity: '0%' }}>--</p>
                  <button className="primary-button" onClick={minus}>-</button>
                  <p style={{ fontSize: '26px' }} id="quantity" name="quantity">1</p>
                  <button className="primary-button" onClick={plus}>+</button>
                </div>

                <hr />


                <hr />

                <div className="input-holder" style={{ display: 'flex', justifyContent: 'right' }}>
                  <p>
                    <strong>Total: </strong><br />
                    <span id="total" style={{ fontSize: '36px' }} name="total">
                      {parseInt(finalPrice) + parseInt(shippingFee)}
                    </span>
                  </p>
                </div>

                <hr />
                <br />

                <button className="primary-button white-button" type="submit">Place Order</button>
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
