import React, { useState, useEffect } from 'react';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import BottomBar from '../components/BottomBar';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingRate, setShippingRate] = useState(0);

  const db = getFirestore();

  // Load cart from localStorage
  useEffect(() => {
    const storedCartRaw = localStorage.getItem('cart');
    try {
      const storedCart = JSON.parse(storedCartRaw) || [];
      setCartItems(storedCart);
    } catch (err) {
      console.error('❌ Failed to parse cart from localStorage:', err);
      setCartItems([]);
    }
  }, []);

  // Listen for localStorage changes (optional)
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(updatedCart);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // 🔥 Fetch shippingRate from Firestore using getDocs
useEffect(() => {
  const fetchShippingRate = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'storeDetails'));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('📄 Fetched document data:', data);
        if ('shippingrate' in data) {
          const parsedRate = parseFloat(data.shippingRate ?? 250); // Default to 250 if undefined

          if (!isNaN(parsedRate)) {
            setShippingRate(parsedRate);
            console.log(`🚚 Found shipping rate: PKR ${parsedRate}`);
          } else {
            console.warn('⚠️ shippingRate is not a valid number:', data.shippingRate);
          }
        }
      });
    } catch (error) {
      console.error('❌ Failed to fetch shipping rate:', error);
    }
  };

  fetchShippingRate();
}, [db]);


  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.productPrice) * item.quantity,
    0
  );
  const total = subtotal;

  return (
    <>
      <div className="sticky">
        <Navbar />
      </div>

      <div className="cart-container">
        <h1 className="cart-title">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="empty-cart">Your cart is currently empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="item-image"
                  />

                  <div className="item-details">
                    <h2>{item.productName}</h2>
                    <p>PKR {Number(item.productPrice).toFixed(2)}</p>
                    <div className="item-actions">
                      <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      <button className="remove-btn" onClick={() => removeItem(item.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>

         
              <h2>Total: PKR {total.toFixed(2)}</h2>

              <Link to="/checkout" className="primary-button no-decoration">
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
        <BottomBar />
      <Footer />
    </>
  );
};

export default CartPage;
