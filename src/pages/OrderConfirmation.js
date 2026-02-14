import React from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/navBar";
import Footer from "../components/footer";

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.orderData;

  if (!order) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "50px", textAlign: "center" }}>
          <h2>No order found!</h2>
          <Link to="/products">
            <button style={btnStyle}>Go to Products</button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const fullName = `${order.customer.firstName} ${order.customer.lastName}`;
  const address = `${order.customer.street} ${order.customer.address2}, ${order.customer.city}, ${order.customer.region}, ${order.customer.country}`;
  const email = order.customer.email;
  const phone = order.customer.phone;
  const shippingMethod = order.payment.shippingMethod;
  const paymentMethod = order.payment.method === "cod" ? "Cash on Delivery" : "Bank Deposit";
  const total = order.pricing.total;

  const googleMapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <>
      <Navbar />

      <div className="order-wrapper" style={{ display: "flex", gap: "20px", padding: "20px" }}>
        {/* LEFT SIDE */}
        <div className="order-left" style={{ flex: 1 }}>
          <section className="order-section-price" style={{ marginBottom: "20px" }}>
            <p>Amount</p>
            <p>Rs. {total}</p>
          </section>

          <section className="order-section-orderno" style={{ marginBottom: "20px" }}>
            <i className="fa-regular fa-circle-check" style={{ fontSize: "40px", color: "green" }}></i>
            <div className="orderno">
              <p>Order #{Math.floor(Math.random() * 90000 + 10000)}</p>
              <h1>Thank you, {order.customer.firstName}!</h1>
            </div>
          </section>

          <section className="order-section-map">
            <div className="map-image" style={{ border: "1px solid #ddd", borderRadius: "10px", overflow: "hidden" }}>
              <iframe
                src={googleMapsSrc}
                style={{ width: "100%", height: "300px", border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="location"
              ></iframe>

              <h3>Your order is confirmed</h3>
              <p>You'll receive a confirmation email with your order number shortly.</p>
            </div>
          </section>
        </div>

        {/* RIGHT SIDE */}
        <div className="order-right" style={{ flex: 1 }}>
          <div className="order-details" style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px" }}>
            <h3>Order details</h3>

            <h4>Contact Information</h4>
            <p>{email}</p>
            <p>{phone}</p>

            <h4>Shipping Address</h4>
            <p>{fullName}</p>
            <p>{order.customer.street}</p>
            {order.customer.address2 && <p>{order.customer.address2}</p>}
            <p>{order.customer.city}</p>
            <p>{order.customer.country}</p>
            <p>{phone}</p>

            <h4>Shipping Method</h4>
            <p>{shippingMethod}</p>

            <h4>Payment Method</h4>
            <p>{paymentMethod} - Rs. {total}</p>

            <h4>Products</h4>
            {order.cartItems.map((item, idx) => (
              <div key={idx} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <img src={item.productImage} alt={item.productName} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px", border: "1px solid #ddd" }} />
                <div>
                  <p>{item.productName}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Rs. {item.productPrice}</p>
                </div>
              </div>
            ))}
          </div>

          <Link to="/">
            <button style={btnStyle}>Continue Shopping</button>
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

const btnStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  background: "black",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default OrderConfirmation;
