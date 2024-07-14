import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, collection, getDocs ,addDoc} from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import { app } from '../firebase'; 
import AdminPage from './Admin';

const Buy = () => {
  const db = getFirestore(app);

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [currency, setcurrency] = useState('');
  const [shippingFee, setshippingFee] = useState('');
  const [accHolder, setaccHolder] = useState('');
  const [bankName, setbankName] = useState('');
  const [iban, setiban] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'storeDetails');
      try {
        const querySnapshot = await getDocs(dataCollection);
        if (!querySnapshot.empty) {
          const firstDocument = querySnapshot.docs[0];
          const siteInfo = firstDocument.data();

          const currency = siteInfo.currency;
    
          const iban = siteInfo.iban;
          const accName = siteInfo.bankHolder;
          const bank = siteInfo.bankName;
          const shippingFee = siteInfo.shippingrate;

          setcurrency(currency);
          setshippingFee(shippingFee);
          setaccHolder(accName);
          setbankName(bank);
          setiban(iban);

        } else {
          console.log('No documents found!');
        }
      } catch (error) {
        console.error("Error retrieving site data: ", error);
      }
    };
    fetchData();
  }, []);
  const handleBuyRequest = async (e) => {
    const buyerData = {
      productImg : product.productImage,
      buyerName : document.getElementById('name').value,
      buyerEmail : document.getElementById('phone').value,
      buyerAddress : document.getElementById('address').value,
      productName : document.getElementById('productName').innerHTML,
      productCode : document.getElementById('code').innerHTML,
      productQuantity : document.getElementById('quantity').innerHTML,
      productType : document.getElementById('type').innerHTML,
      totalAmount : document.getElementById('total').innerHTML,
      color: document.getElementById('color').value,
      size : document.getElementById('size').value
    }
    e.preventDefault();
    try {
      await addDoc(collection(db, 'orders'), buyerData);
      alert('Request sent successfully!');
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Error sending request. Please try again.');
    }
  };
  useEffect(() => {
    const fetchProduct = async () => {
      const db = getFirestore();
      const docRef = doc(db, 'products', id);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Product data:", docSnap.data());
          setProduct(docSnap.data());
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error retrieving product data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>No product found</p>;
  }
  const plus = (event) =>{
    event.preventDefault();
    // Get the current count from the quantity element
    let count = parseInt(document.getElementById('quantity').innerHTML);

    // Get the product price and shipping fee
    let product_price = parseInt(document.getElementById('price').innerHTML);
    let shipping_fee = parseInt(document.getElementById('fee').innerHTML);

    // Increment the product count
    count += 1;

    // Calculate the total bill by multiplying the product price by the count and adding the shipping fee
    let bill = (product_price * count) + shipping_fee;

    // Update the total price and quantity on the webpage
    document.getElementById('total').innerHTML = bill;
    document.getElementById('quantity').innerHTML = count;
}

const minus = (event) => {
  event.preventDefault();
  // Get the current count from the quantity element
  let count = parseInt(document.getElementById('quantity').innerHTML);

  // Get the product price and shipping fee
  let product_price = parseInt(document.getElementById('price').innerHTML);
  let shipping_fee = parseInt(document.getElementById('fee').innerHTML);

  // Decrement the product count if greater than 1
  if (count > 1) {
      count -= 1;

      // Calculate the total bill by multiplying the product price by the count and adding the shipping fee
      let bill = (product_price * count) + shipping_fee;

      // Update the total price and quantity on the webpage
      document.getElementById('total').innerHTML = bill;
      document.getElementById('quantity').innerHTML = count;
  } else {
      // Reset the values if count is less than or equal to 1
      count = 1;
      let bill = product_price + shipping_fee;

      // Update the total price and quantity on the webpage
      document.getElementById('total').innerHTML = bill;
      document.getElementById('quantity').innerHTML = count;
  }
}
  return (
    <>
        <div className='sticky'>
            <Navbar/>
        </div>
      <div className="buy-container">
        <div className="cover">
            <div className="buyit">
                <form onSubmit={handleBuyRequest}>
                    <div className="product-side">
                    <img src={product.productImage} alt={product.productName} style={{maxWidth:'300px'}}/>
                        <p > Product Name :
                          <span id='productName' >
                            {product.productName}
                          </span>
                        
                        </p>
                        <p  style={{fontSize:'36px'}}> {currency}
                          <span id='price'>
                          {product.productPrice} 
                          </span>
                        
                        </p>
                        <p  > Product Type :
                          <span id='type'>
                          {product.productType} 
                          </span>
                       
                        </p>
                        <p > Product Code :
                        <span id='code'>
                        {product.productCode}
                        </span>
                        </p>
                        <p > Shipping fees :  {currency}
                        <span id='fee'>
                        {shippingFee}
                        </span>
                 
                        </p>
                    </div>
                    <div className="product-info">
                    <div className="input-holder">
                              <label for="name">Buyer Name</label>
                              <input type="text"  id="name" placeholder="Name.." required/>
                          </div>
                          <div className="input-holder">
                              <label for="address">Buyer Address</label>
                              <input type="text"  id="address" placeholder="address.." required/>
                          </div>
                          <div className="input-holder">
                              <label for="phone">Buyer phone or email</label>
                              <input type="text"  id="phone" placeholder="phone.." required/>
                          </div>
                          <div className="input-holder mbl-actions">
                              <label for="size">Size</label> <p style={{opacity:"0%"}}>--</p>
                              <select type="text" id="size" required style={{width:'auto',minWidth:'70px'}}>
                                  <option value='XL'>XL</option>
                                  <option value='L'>L</option>
                                  <option value='M'>M</option>
                                  <option value='S'>S</option>
                              </select>
                              <p style={{opacity:"0%"}}>--</p>
                              <label for="color">Color</label> <p style={{opacity:"0%"}}>--</p>
                              <select type="text"  id="color" required style={{width:'auto',minWidth:'70px'}}>
                                  <option value="black">Black</option>
                                  <option value="HeatherGrey" >Heather Grey</option>
                                  <option value="LightPink" >Light Pink</option>
                                  <option value="Navy" >Navy </option>
                                  <option value="Red" >Red</option>
                                  <option value="RoyalBlue" >Royal Blue</option>
                                  <option value="White">White</option>
                                  <option value="Beige">Beige</option>
                                  <option value="CharcoalGre" >Charcoal Grey</option>
                                  <option value="LightPurple" >Light Purple</option>
                                  <option value="Mustard" >Mustard</option>
                                  <option value="SkyBlue" >Sky Blue</option>
                              </select>
                              <p style={{opacity:"0%"}}>--</p>
                              <label for="quantity">Quantity</label><p style={{opacity:"0%"}}>--</p>
                              <button className='primary-button' onClick={minus}>-</button><p style={{opacity:"0%"}}>--</p>
                              <p style={{fontSize:'26px'}} id='quantity'>1</p><p style={{opacity:"0%"}}>--</p>
                              <button className='primary-button' onClick={plus}>+</button><p style={{opacity:"0%"}}>--</p>
                          </div>
                          <hr></hr>
                          <div className="input-holder">
                            <p>Payment Method : only Direct Payment avaiable</p>
                            <p>
                              <strong>
                                Account Holder : 
                              </strong>
                                {accHolder}
                                <br/>
                                <strong>
                                Bank Name : 
                              </strong>
                                {bankName}
                                <br/>
                                <strong>
                                IBAN : 
                              </strong>
                                {iban}
                                <br/>
                                Note : you'll recieve your package within 7 working days after paying the amount. 
                            </p>
                          </div>

                          <hr></hr>
                          <div className="input-holder" style={{display:'flex',justifyContent:'right',textAlign:'right'}}> 
                            <p>
                              <strong>Total : </strong><br/>
                              <span id='total' style={{fontSize:'36px'}}>
                              {parseInt(product.productPrice) + parseInt(shippingFee)}
                              </span>
                            </p>
                          
                          </div>
                          <hr></hr>
                          <br/>
                          <button className='primary-button'>Save Order</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
      <Footer/>
    </>
  );
};

export default Buy;
