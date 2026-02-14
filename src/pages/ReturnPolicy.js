import React from 'react';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import BottomBar from '../components/BottomBar';

const ReturnPolicy = () => {
  return (
    <>
      <div className="sticky">
        <Navbar />
      </div>

      <div className="return-container">
        {/* Hero / Store Info */}
        <header className="return-hero" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800' }}>ISHA PRINTS</h1>
          <p style={{ fontSize: '1.25rem', color: '#555', marginTop: '10px' }}>
            Wear what you love, Wear what you choose
          </p>
        </header>

        {/* Page Title */}
        <h1 className="return-title">Return & Refund Policy</h1>

        <section className="return-section">
          <h2>Overview</h2>
          <p>
            At ISHA PRINTS, we want you to love your purchase. While we strive to ensure every product meets our quality standards, all sales are considered final due to hygiene and safety reasons. If your item arrives damaged or incorrect, we are happy to assist.
          </p>
        </section>

        <section className="return-section">
          <h2>Damaged or Incorrect Items</h2>
          <p>
            If you receive a defective or wrong product, contact us within 3 days of delivery. Include your order number, a description of the issue, and clear photos. We'll review and provide a replacement or store credit where applicable.
          </p>
        </section>

        <section className="return-section">
          <h2>Non-Returnable Items</h2>
          <ul>
            <li>Items that have been used or worn</li>
            <li>Products not in their original packaging</li>
            <li>Custom-designed or limited edition items</li>
            <li>Gift cards</li>
          </ul>
        </section>

        <section className="return-section">
          <h2>Refunds</h2>
          <p>
            Refunds are issued only if a replacement is not possible. Once approved, refunds will be processed to your original payment method. Please allow 5–10 business days for the transaction to appear.
          </p>
        </section>
      </div>

      <BottomBar />
      <Footer />
    </>
  );
};

export default ReturnPolicy;
