import React from 'react';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import ProductShowcase from '../components/Products';

const SearchPage = () => {
  return (
    <>
             <div className='sticky'>
            <Navbar/>
        </div>
        <div className="quick-buy">
      <div className="cover">
        <div className="container">
          <div className="the-product">
            <img src="/assets/images/s1.png" alt="Product Image" className="Product-image" />
          </div>
          <div className="the-details">
            <p>Quick Buy</p>
            <p className="title">Wolf and the moon printed shirt</p>
            <br />
            <p>Shirt Type: Oversized</p>
            <p>From RS. 1600</p>
            <p>Shipping fee may be added based on the location</p>
            <p>Available sizes - Click on any to see Size Chart</p>
            <div className="size-container">
              <div className="size">S</div>
              <div className="size">M</div>
              <div className="size">L</div>
              <div className="size">XL</div>
            </div>
            <br />
            <p>Available Colors</p>
            <div className="size-container">
              <div className="color" style={{ backgroundColor: '#000000' }} title="Black"></div>
              <div className="color" style={{ backgroundColor: '#B7B7B7' }} title="Heather Grey"></div>
              <div className="color" style={{ backgroundColor: '#FFB6C1' }} title="Light Pink"></div>
              <div className="color" style={{ backgroundColor: '#000080' }} title="Navy"></div>
              <div className="color" style={{ backgroundColor: '#FF0000' }} title="Red"></div>
              <div className="color" style={{ backgroundColor: '#4169E1' }} title="Royal Blue"></div>
              <div className="color" style={{ backgroundColor: '#FFFFFF', border: '1px solid black' }} title="White"></div>
              <div className="color" style={{ backgroundColor: '#F5F5DC' }} title="Beige"></div>
              <div className="color" style={{ backgroundColor: '#36454F' }} title="Charcoal Grey"></div>
              <div className="color" style={{ backgroundColor: '#D8BFD8' }} title="Light Purple"></div>
              <div className="color" style={{ backgroundColor: '#FFDB58' }} title="Mustard"></div>
              <div className="color" style={{ backgroundColor: '#87CEEB' }} title="Sky Blue"></div>
            </div>
            <br />
            <button className="primary-button white-button">Let's talk about this product</button>
            <button className="primary-button">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
        <ProductShowcase/>
        <Footer/>
    </>
  );
}
export default SearchPage;