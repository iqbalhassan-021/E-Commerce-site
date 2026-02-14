import React, { useState, useEffect } from 'react';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import BottomBar from '../components/BottomBar';

const GiftPage = () => {
  const [giftItems, setGiftItems] = useState([]);
  const [shippingRate, setShippingRate] = useState(0);
  const db = getFirestore();

  useEffect(() => {
    const storedGiftCartRaw = localStorage.getItem('giftCart');
    try {
      const storedGiftCart = JSON.parse(storedGiftCartRaw) || [];
      const initializedCart = storedGiftCart.map(item => ({
        ...item,
        quantity: item.quantity || 1
      }));
      setGiftItems(initializedCart);
    } catch (err) {
      console.error('❌ Failed to parse giftCart from localStorage:', err);
      setGiftItems([]);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedGiftCart = JSON.parse(localStorage.getItem('giftCart')) || [];
      setGiftItems(updatedGiftCart.map(item => ({ ...item, quantity: item.quantity || 1 })));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (giftItems.length > 0) {
      localStorage.setItem('giftCart', JSON.stringify(giftItems));
    }
  }, [giftItems]);

  useEffect(() => {
    const fetchShippingRate = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'storeDetails'));
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if ('shippingrate' in data) {
            const parsedRate = parseFloat(data.shippingrate ?? 250);
            if (!isNaN(parsedRate)) {
              setShippingRate(parsedRate);
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
    setGiftItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max((item.quantity || 1) + delta, 1) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    const updatedCart = giftItems.filter((item) => item.id !== id);
    setGiftItems(updatedCart);
    localStorage.setItem('giftCart', JSON.stringify(updatedCart));
  };

  const subtotal = giftItems.reduce(
    (sum, item) => sum + Number(item.productPrice) * (item.quantity || 1),
    0
  );
  const total = subtotal + shippingRate;

  return (
    <>
      <div className="sticky">
        <Navbar />
      </div>

      <div className="cart-container">
        <h1 className="cart-title">Your Gift Cart</h1>

        {giftItems.length === 0 ? (
          <p className="empty-cart">Your gift cart is currently empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {giftItems.map((item) => (
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
              <p>Subtotal: PKR {subtotal.toFixed(2)}</p>
              <p>Shipping: PKR {shippingRate.toFixed(2)}</p>
              <h3>Total: PKR {total.toFixed(2)}</h3>

              <Link to="/checkout" className="primary-button no-decoration">
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
      <BottomBar/>
      <Footer />
    </>
  );
};

export default GiftPage;
