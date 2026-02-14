import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, [isOpen]);

  const updateQuantity = (id, delta) => {
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(item.quantity + delta, 1) } : item
    );
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);

  return (
    <div
      className={`cart-drawer fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h2>Your Cart</h2>
        <button onClick={onClose} className="text-xl font-bold">×</button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="flex mb-4">
              <img src={item.productImage} alt={item.productName} className="w-16 h-16 mr-3 object-cover"/>
              <div className="flex-1">
                <h3>{item.productName}</h3>
                <p>PKR {item.productPrice.toFixed(2)}</p>
                <div className="flex space-x-2 mt-2 items-center">
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  <button onClick={() => removeItem(item.id)} className="text-red-500">Remove</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="p-4 border-t">
          <h3 className="mb-3 font-semibold">Total: PKR {subtotal.toFixed(2)}</h3>
          <Link
            to="/checkout"
            className="block bg-blue-600 text-white text-center py-2 rounded"
            onClick={onClose}
          >
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;
