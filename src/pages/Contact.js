import React from 'react';
import Navbar from '../components/navBar';
import Footer from '../components/footer';

const ContactPage = () => {
  return (
    <>
        <div className='sticky'>
            <Navbar/>
        </div>
    <div className="contactus">
      <div className="cover">
        <div className="contact-section">
          <div className="contact">
            <form action="https://api.web3forms.com/submit" method="POST"  className="contact-form">
            <input type="hidden" name="access_key" value="96dfec8b-2442-41ef-b291-a01b5f495183"/>
              <label htmlFor="name">First Name</label>
              <input type="text" id="name" name="name" placeholder="Your name.." required />
            
              <label htmlFor="email">Email or Phone number</label>
              <input type="text" id="email" name="email" placeholder="Your email.." />
            
              <label htmlFor="subject">Message</label>
              <textarea id="subject" name="subject" placeholder="Write something.." style={{ height: '200px' }}></textarea>
            
              <button type="submit" className="primary-button">Submit</button>
            </form>
          </div>
          <div className="vector-img">
            <img src="/assets/images/Contactus-amico.png" alt="Contact Image" className="floating" />
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ContactPage;
