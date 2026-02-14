import React from 'react';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import BottomBar from '../components/BottomBar';
const faqs = [
  {
    question: 'What types of products do you offer?',
    answer: 'We specialize in custom print-on-demand t-shirts, but also offer hoodies, sweatshirts, tote bags, and other apparel and accessories — all customizable with your designs.'
  },
  {
    question: 'How do I place an order?',
    answer: 'Placing an order is easy! Select your product, choose your size and color, upload your design, and complete the checkout. We’ll handle the rest!'
  },
  {
    question: 'Can I customize the design on my t-shirt?',
    answer: 'Yes! You can upload your own artwork, add text, or choose from our pre-made designs. Our platform makes it simple to create something unique.'
  },
  {
    question: 'Do you accept bulk or business orders?',
    answer: 'Absolutely. Whether you need custom shirts for events, teams, or gifts, we can handle bulk orders. Contact us for special pricing and setup.'
  }
];



const FAQPage = () => {
  return (
    <>
           <div className='sticky'>
            <Navbar/>
        </div>
    <div className="faq-container">
      <h1 className="faq-title">Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <details key={index} className="faq-item">
            <summary className="faq-question">
              {faq.question}
            </summary>
            <p className="faq-answer">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
    <BottomBar/>
             <Footer/>
             </>
  );
};

export default FAQPage;
