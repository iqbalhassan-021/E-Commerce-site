import React, { useState, useEffect } from 'react';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs ,query, where, addDoc, serverTimestamp  } from 'firebase/firestore';
import BottomBar from '../components/BottomBar';
import '../components/checkout.css';
import { firestore } from '../firebase';
import { renderToStaticMarkup } from 'react-dom/server';
import emailjs from '@emailjs/browser';

import EmailTemplate from '../emailing/customerside'
import OwnerEmailTemplate from '../emailing/ownerside'

const provinces = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Gilgit-Baltistan',
  'Azad Jammu and Kashmir'
];

const citiesByProvince = {
  Punjab: [
    'Ahmadpur East','Ahmed Nager Chatha','Ali Khan Abad','Alipur','Arifwala','Attock',
    'Bahawalnagar','Bahawalpur','Bhakkar','Burewala','Chakwal','Chichawatni',
    'Chiniot','Daska','Dera Ghazi Khan','Dipalpur','Faisalabad','Gojra',
    'Gujranwala','Gujrat','Hafizabad','Jaranwala','Jhang','Jhelum','Kasur',
    'Khanewal','Khanpur','Lahore','Layyah','Lodhran','Mandi Bahauddin',
    'Mian Channu','Mianwali','Multan','Murree','Muzaffargarh','Narowal',
    'Okara','Pakpattan','Rahim Yar Khan','Rawalpindi','Sahiwal','Sargodha',
    'Sheikhupura','Sialkot','Toba Tek Singh','Vehari','Wah Cantonment','Wazirabad'
  ],
  Sindh: [
    'Karachi','Hyderabad','Sukkur','Larkana','Mirpurkhas','Nawabshah','Thatta'
  ],
  'Khyber Pakhtunkhwa': [
    'Peshawar','Abbottabad','Mardan','Swat','Mansehra','Charsadda'
  ],
  Balochistan: [
    'Quetta','Gwadar','Turbat','Khuzdar','Zhob'
  ],
  'Islamabad Capital Territory': ['Islamabad'],
  'Gilgit-Baltistan': ['Gilgit','Skardu'],
  'Azad Jammu and Kashmir': ['Muzaffarabad','Mirpur']
};

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingRate, setShippingRate] = useState(0);
  const [storeDetails, setStoreDetails] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    address2: '',
    city: '',
    region: '',
    postalCode: '',
    country: 'Pakistan',
    orderNotes: '',
    shippingMethod: 'Cash on Delivery',
    paymentMethod: 'cod'
  });
const [showSummary, setShowSummary] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const totalProducts = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const previewImage = cartItems[0]?.productImage;
  const toggleSummary = () => {
    setShowSummary(prev => !prev);
  };

  const navigate = useNavigate();
  const [giftBoxes, setGiftBoxes] = useState([]);
  
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    const fetchShippingRate = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'storeDetails'));
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();
          setStoreDetails(data);

          const rate = parseFloat(data.shippingrate ?? 250);
          if (!isNaN(rate)) setShippingRate(rate);
        }
      } catch (error) {
        console.error('❌ Error fetching shipping rate:', error);
      }
    };

    fetchShippingRate();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchGiftBoxes = async () => {
      const q = query(collection(firestore, 'products'), where('productType', '==', 'Giftbox'));
      const snapshot = await getDocs(q);
      const boxes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGiftBoxes(boxes);
    };
    fetchGiftBoxes();
  }, []);

  const isFormFilled = Object.values(formData).every(v => String(v).trim() !== '');
  const itemsTotal = cartItems.reduce((s, i) => s + Number(i.productPrice) * i.quantity, 0);
  const calculatedShipping =  shippingRate;
  const grandTotal = itemsTotal + calculatedShipping;


  const clearCart = () => {
    localStorage.removeItem('cart');
    setCartItems([]);
  }
//   const saveOrderToFirestore = async (e) => {
//   e.preventDefault();

//   if (cartItems.length === 0) return;

//   try {
//     await addDoc(collection(firestore, 'orders'), {
//       customer: { ...formData },

//       cartItems: cartItems.map(item => ({
//         productId: item.id,
//         productName: item.productName,
//         productImage: item.productImage,
//         productPrice: Number(item.productPrice),
//         quantity: item.quantity
//       })),

//       pricing: {
//         subtotal: itemsTotal,
//         shipping: calculatedShipping,
//         total: grandTotal
//       },

//       payment: {
//         method: formData.paymentMethod,
//         shippingMethod: formData.shippingMethod
//       },

//       status: 'pending',
//       createdAt: serverTimestamp()
//     });

//     clearCart();
//     navigate('/OrderConfirmation', { state: { orderData: {
//   customer: formData,
//   cartItems,
//   pricing: { subtotal: itemsTotal, shipping: calculatedShipping, total: grandTotal },
//   payment: { method: formData.paymentMethod, shippingMethod: formData.shippingMethod }
// }}});


//   } catch (error) {
//     console.error('❌ Order save failed:', error);
//   }
// };

const saveOrderToFirestore = async (e) => {
  e.preventDefault();
  if (cartItems.length === 0) return;
  const SERVICE_ID = 'service_pe465dj';
  const PUBLIC_KEY = 'D-GMxVUU7C6937ZFN';
  const CUSTOMER_TEMPLATE_ID = 'template_pc72olo';
  const OWNER_TEMPLATE_ID = 'template_y9ma92f';
  try {
const sanitize = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(sanitize);
  } else if (obj && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      const value = obj[key];
      newObj[key] = value === undefined ? null : sanitize(value);
    }
    return newObj;
  } else {
    return obj === undefined ? null : obj;
  }
};

await addDoc(collection(firestore, 'orders'), sanitize({
  customer: formData,
  cartItems: cartItems.map(item => ({
    productId: item.id,
    productName: item.productName,
    productImage: item.productImage,
    productPrice: Number(item.productPrice),
    quantity: item.quantity,
    productSize: item.productSize
  })),
  pricing: {
    subtotal: itemsTotal,
    shipping: calculatedShipping,
    total: grandTotal
  },
  payment: {
    method: formData.paymentMethod,
    shippingMethod: formData.shippingMethod
  },
  status: 'pending',
  createdAt: serverTimestamp()
}));

    const emailOrderData = {
      customer: formData,
      cartItems: cartItems,
      pricing: { 
        subtotal: itemsTotal, 
        shipping: calculatedShipping, 
        total: grandTotal 
      }};
      const customerHTML = renderToStaticMarkup(<EmailTemplate orderData={emailOrderData} storeDetails={storeDetails} />);
      const ownerHTML = renderToStaticMarkup(<OwnerEmailTemplate orderData={emailOrderData} />);
      // const ownerEmail = storeDetails?.email;
      await Promise.all([
        emailjs.send(SERVICE_ID, CUSTOMER_TEMPLATE_ID, {
          to_email: formData.email,
          customer_name: formData.firstName,
          message_html: customerHTML,
        }, PUBLIC_KEY),
        emailjs.send(SERVICE_ID, OWNER_TEMPLATE_ID, {
          to_email: "hassan.ashfaq82@gmail.com", // 👈 REQUIRED
          // to_email: formData.owneremail, // ✅ FROM FIRESTORE
          customer_name: `${formData.firstName} ${formData.lastName}`,
          message_html: ownerHTML,
        }, PUBLIC_KEY)]);
        clearCart();
        navigate('/OrderConfirmation', { 
          state: { 
            orderData: {
            customer: formData,
            cartItems,
            pricing: { 
              subtotal: itemsTotal, 
              shipping: calculatedShipping, 
              total: grandTotal 
            },
            payment: { 
              method: formData.paymentMethod, 
              shippingMethod: formData.shippingMethod 
            }}}});
          } catch (error) {
            console.error(' Process failed:', error);
            alert("Something went wrong while processing your order.");
          }
        };
      
  return (
    <>
    
        <Navbar />
     

      <form
        className="checkout-wrapper"
          onSubmit={saveOrderToFirestore}
      >
        <input type="hidden" name="access_key" value="2f21b333-cfce-49ef-bd80-2c39a139de22" />
        <input type="hidden" name="shippingRate" value={calculatedShipping} />
        <input type="hidden" name="totalAmount" value={grandTotal.toFixed(2)} />
       
        
        {cartItems.map((item, index) => (
          <div key={item.id}>
            <input type="hidden" name={`cart[${index}][productImage]`} value={item.productImage} />
            <input type="hidden" name={`cart[${index}][productName]`} value={item.productName} />
            <input type="hidden" name={`cart[${index}][quantity]`} value={item.quantity} />
            <input type="hidden" name={`cart[${index}][productPrice]`} value={item.productPrice} />
          </div>
        ))}

        <div className="checkout-left">
          {/* add a order summary here */}
         <div className="top-order-summary">
<button
  type="button"
  className="order-summary-top"
  onClick={toggleSummary}
>
  <h2>Order Summary</h2>
  <h2>
    PKR {itemsTotal}{" "}
    <i className={`fa fa-arrow-${showSummary ? "up" : "down"}`}></i>
  </h2>
</button>


      {showSummary && (
        <div className="new-order-sum">
          <div className="checkout-right">
            <div className="order-items">
              {cartItems.map(item => (
                <div className="order-item" key={item.id}>
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="order-item-img"
                  />
                  <div>
                    <p>{item.productName}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>Size: {item.productSize}</p>
                    <p>Rs.{item.productPrice}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <p>Subtotal: Rs.{itemsTotal}</p>
              <p>Shipping: Rs.{calculatedShipping}</p>
              <h4>Total: Rs.{grandTotal}</h4>
            </div>
            <br />
          </div>
        </div>
      )}
       </div>
          <br></br>
          <section className="checkout-section">
            <h3>Email</h3>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
          </section>

          <section className="checkout-section">
            <h3>Delivery</h3>

            <div className="name">
              <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required />
              <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required />
            </div>

            <input type="text" name="street" placeholder="Address" value={formData.street} onChange={handleInputChange} required />

            <input type="text" name="address2" placeholder="Apartment, suite, etc [optional]"   value={formData.address2} onChange={handleInputChange} />

            <select name="region" value={formData.region} onChange={handleInputChange} required>
              <option value="">Province</option>
              {provinces.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <div className="citycode">
              <select name="city" value={formData.city} onChange={handleInputChange} required>
                <option value="">City</option>
                {citiesByProvince[formData.region]?.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <input type="text" name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleInputChange} required />
            </div>

            <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required />

            <textarea name="orderNotes" placeholder="Order notes [optional]" value={formData.orderNotes} onChange={handleInputChange} />
          </section>

<section className="checkout-section accordion">
  <h3>Payment</h3>

  {/* Cash on Delivery */}
  <label className="radio-wrapper">
    <input
      type="radio"
      name="paymentMethod"
      value="cod"
      checked={formData.paymentMethod === 'cod'}
      onChange={handleInputChange}
    />
    <span>Cash on Delivery (Rs. {shippingRate})</span>
  </label>

  {/* Bank Deposit */}
  <label className="radio-wrapper">
    <input
      type="radio"
      name="paymentMethod"
      value="bank"
      checked={formData.paymentMethod === 'bank'}
      onChange={handleInputChange}
      className='bank-radio'
    />
    <span>Bank Deposit</span>
  </label>

  {/* Bank details */}
  <div
    className="accordion-content-checkout"
  >
    {storeDetails && (
        <p>
      <strong>Bank:</strong> {storeDetails.bankName} <br/>
        <strong>Account Holder:</strong> {storeDetails.bankHolder} <br/>
        <strong>Account Number:</strong> {storeDetails.iban} <br/>
      

        Note: Please transfer Rs. {grandTotal} to the above account and send the screenshot on whatsapp {storeDetails.phone}.
        </p>
      
    )}
  </div>
</section>

        
        </div>

      <div className="checkout-right">

      {/* TOP SUMMARY CARD */}
      <div className="summary-card">
     

<button
  className="toggle-summary-btn"
  onClick={(e) => {
    e.preventDefault();
    setShowDetails(prev => !prev);
  }}
>

  <div className="btn-left">
    {previewImage && (
      <img
        src={previewImage}
        alt="Order preview"
        className="btn-preview-img"
      />
    )}
    <span>{totalProducts} items</span>
  </div>

  <div className="btn-right">
    <strong>Rs.{grandTotal}</strong>
    <i className={`fa fa-chevron-${showDetails ? "up" : "down"}`}></i>
  </div>
</button>

      </div>

      {/* DETAILS SECTION */}
      {showDetails && (
        <>
          <div className="order-items">
            {cartItems.map(item => (
              <div className="order-item" key={item.id}>
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="order-item-img"
                />
                <div>
                  <p>{item.productName}</p>
                  <p>Qty: {item.quantity}</p>
                   <p>Size: {item.productSize}</p>
                  <p>Rs.{item.productPrice}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <p>Subtotal: Rs.{itemsTotal}</p>
            <p>Shipping: Rs.{calculatedShipping}</p>
            <h4>Total: Rs.{grandTotal}</h4>
          </div>

        </>
      )}
      <br/>
          <button type="submit" className="complete-order">
            Complete Order
          </button>
    </div>
      </form>

      <BottomBar />
      <Footer />
    </>
  );
};

export default CheckoutPage;
