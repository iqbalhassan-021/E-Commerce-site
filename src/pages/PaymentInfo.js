import React from 'react';
import { Link } from 'react-router-dom'; // assuming you're using react-router
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import BottomBar from '../components/BottomBar';

const PaymentInfo = () => {
  return (
    <>
      <div className='sticky'>
        <Navbar />
      </div>

      <div className="payment-container">
        <h1 className="payment-title">Payment Information</h1>

        <section className="payment-section">
          <h2>Cash on Delivery Only</h2>
          <p>
            Currently, we only accept <strong>Cash on Delivery (COD)</strong> for all orders placed on our store. 
            You’ll pay in cash when your order is delivered — no advance payment required.
          </p>
        </section>

        <section className="payment-section">
          <h2>Questions?</h2>
          <p>
            If you have any questions about your order or payment process, feel free to <Link to="/contact">contact us</Link>. 
            We're happy to help!
          </p>
        </section>

        <section className="payment-section">
          <h2>Note</h2>
          <p>
            Please make sure someone is available to receive the delivery and make the cash payment. 
            Orders may be canceled if delivery fails due to unavailability.
          </p>
        </section>
      </div>

      <BottomBar />
      <Footer />
    </>
  );
};

export default PaymentInfo;
