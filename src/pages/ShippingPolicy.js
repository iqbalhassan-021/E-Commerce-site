import React from 'react';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import BottomBar from '../components/BottomBar';

const ShippingPolicy = () => {
  return (
    <>
      <div className='sticky'>
        <Navbar />
      </div>

      <div className="shipping-container">
        <h1 className="shipping-title">Shipping Policy</h1>

        <section className="shipping-section">
          <h2>Processing Time</h2>
          <p>
            All orders are processed within 2–3 business days. Orders are not shipped or delivered on weekends or public holidays.
            If we’re experiencing a high volume of orders, shipments may be delayed slightly.
          </p>
        </section>

        <section className="shipping-section">
          <h2>Shipping Coverage</h2>
          <p>
            We currently only ship within Pakistan. No international shipping is available at this time.
          </p>
        </section>

        <section className="shipping-section">
          <h2>Shipping Rates & Delivery Time</h2>
          <p>
            Shipping charges will be calculated at checkout based on your location within Pakistan.
            Estimated delivery times are:
          </p>
          <ul>
            <li><strong>Standard Shipping:</strong> 3–5 business days</li>
            <li><strong>Express Shipping:</strong> 1–2 business days (where available)</li>
          </ul>
        </section>

        <section className="shipping-section">
          <h2>Order Tracking</h2>
          <p>
            You’ll receive a shipping confirmation email with a tracking number once your order is dispatched.
            Tracking typically becomes active within 24 hours.
          </p>
        </section>

        <section className="shipping-section">
          <h2>Lost or Damaged Items</h2>
          <p>
            We are not responsible for any products lost or damaged during transit. If your order arrives damaged, please contact the courier directly to file a claim. 
            Be sure to keep all packaging materials and the product itself to support your case.
          </p>
        </section>
      </div>

      <BottomBar />
      <Footer />
    </>
  );
};

export default ShippingPolicy;
