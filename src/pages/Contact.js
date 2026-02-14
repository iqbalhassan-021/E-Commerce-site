import React, { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import emailjs from '@emailjs/browser';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import BottomBar from '../components/BottomBar';
import ContactEmailTemplate from '../emailing/ContactEmailTemplate';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '' });
  const [loading, setLoading] = useState(false);

  const SERVICE_ID = 'service_pe465dj';
  const TEMPLATE_ID = 'template_y9ma92f'; // Create a template in EmailJS if needed
  const PUBLIC_KEY = 'D-GMxVUU7C6937ZFN';
  const OWNER_EMAIL = 'hassan.ashfaq82@gmail.com';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate HTML from the React template
      const messageHTML = renderToStaticMarkup(<ContactEmailTemplate formData={formData} />);

      // Send email via EmailJS
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        to_email: OWNER_EMAIL,
        customer_name: formData.name,
        customer_email: formData.email,
        message_html: messageHTML
      }, PUBLIC_KEY);

      alert('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '' });
    } catch (error) {
      console.error('Email sending failed:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="sticky">
        <Navbar />
      </div>
      <div className="contactus">
        <div className="cover">
          <div className="contact-section">
            <div className="contact">
              <form onSubmit={handleSubmit} className="contact-form">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name..."
                  required
                />

                <label htmlFor="email">Email or Phone number</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email..."
                />

                <label htmlFor="subject">Message</label>
                <textarea
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Write something..."
                  style={{ height: '200px' }}
                ></textarea>

                <button type="submit" className="primary-button" disabled={loading}>
                  {loading ? 'Sending...' : 'Submit'}
                </button>
              </form>
            </div>

            <div className="vector-img">
              <img
                src="/assets/images/Contactus-amico.png"
                alt="Contact Image"
                className="floating"
              />
            </div>
          </div>
        </div>
      </div>
      <BottomBar />
      <Footer />
    </>
  );
};

export default ContactPage;
