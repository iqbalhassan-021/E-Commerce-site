import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, getFirestore, getDocs, deleteDoc, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../firebase';
import emailjs from '@emailjs/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import shippingemail from '../emailing/shippingemail';
import { firestore } from '../firebase';
import ShippingEmail from '../emailing/shippingemail';

const AdminPage = () => {
  const db = getFirestore(app);

  // State for products, orders, categories, subscribers, product types, hero slider, sale, and banner
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // default active tab

  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [saleProduct, setSaleProduct] = useState(null);
  const [newSalePrice, setNewSalePrice] = useState('');
  const [forHerProduct, setForHerProduct] = useState(null);
  const [heroSlides, setHeroSlides] = useState([]);
  const [editingSlide, setEditingSlide] = useState(null);
  const [saleSections, setSaleSections] = useState([]);
  const [editingSaleSection, setEditingSaleSection] = useState(null);
  const [bannerSections, setBannerSections] = useState([]);
  const [editingBannerSection, setEditingBannerSection] = useState(null);
  const [onSale, setOnSale] = useState([]);
  const [salePercentage, setSalePercentage] = useState('');
  const [notification, setNotification] = useState('');
  const [floatingMessage, setFloatingMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sales, setSales] = useState([]);
  const [showShipmentPopup, setShowShipmentPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shipmentPartner, setShipmentPartner] = useState('');
  const [shipmentCode, setShipmentCode] = useState('');
  const [storeDetails, setStoreDetails] = useState(null);

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error(err);
    }
  };

  // Open shipment popup
  const handleCompleteOrder = (order) => {
    setSelectedOrder(order);
    setShipmentPartner('');
    setShipmentCode('');
    setShowShipmentPopup(true);
  };

  // Submit shipment details
  // const submitShipmentDetails = async () => {
  //   if (!shipmentPartner || !shipmentCode) {
  //     alert('Please fill in all fields');
  //     return;
  //   }
  //   try {
  //     await updateDoc(doc(db, 'orders', selectedOrder.id), {
  //       status: 'shipped',
  //       shipment: {
  //         partner: shipmentPartner,
  //         trackingCode: shipmentCode
  //       }
  //     });
  //     setOrders((prev) =>
  //       prev.map((o) =>
  //         o.id === selectedOrder.id
  //           ? { ...o, status: 'shipped', shipment: { partner: shipmentPartner, trackingCode: shipmentCode } }
  //           : o
  //       )
  //     );
  //     setShowShipmentPopup(false);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  useEffect(() => {
    const fetchShippingRate = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'storeDetails'));
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();
          setStoreDetails(data);

        }

      } catch (error) {
        console.error('❌ Error fetching shipping rate:', error);
      }
    };

    fetchShippingRate();
  }, []);

  const submitShipmentDetails = async () => {
    const SERVICE_ID = 'service_c5fku3d';
    const PUBLIC_KEY = 'Gged1csCAQNLJIJ5E';
    const SHIPMENT_TEMPLATE_ID = 'template_bblnpqa'; 
    if (!shipmentPartner || !shipmentCode) {
      alert('Please fill in all fields');
      return;
    }
    if (!selectedOrder?.id || !selectedOrder?.customer?.email) {
      alert('Order data missing');
      return;
    }try 
    {
      const shippingData = {
        partner: shipmentPartner,
        trackingNumber: shipmentCode
      };
      await updateDoc(doc(db, 'orders', selectedOrder.id), {
        status: 'shipped',
        shipping: shippingData});
        setOrders(prev =>
          prev.map(order =>
            order.id === selectedOrder.id?{
              ...order,
              status: 'shipped',
              shipping: shippingData
            }
            : order
          )
        );
        const emailOrderData = {
          customer: selectedOrder.customer,
          cartItems: selectedOrder.cartItems,
          pricing: selectedOrder.pricing,
          payment: selectedOrder.payment,
          shipping: shippingData
        };
        const customerHTML = renderToStaticMarkup(
        // <shippingdetails orderData={emailOrderData} storeDetails={storeDetails} />
          <ShippingEmail orderData={emailOrderData} storeDetails={storeDetails} />
      );
      await emailjs.send(
        SERVICE_ID,
        SHIPMENT_TEMPLATE_ID,
        {
          to_email: selectedOrder.customer.email,
          customer_name: selectedOrder.customer.firstName,
          message_html: customerHTML
        },
        PUBLIC_KEY
      );
      setShowShipmentPopup(false);
      setShipmentPartner('');
      setShipmentCode('');
    } catch (error) {
      console.error('Shipment email failed:', error);
      alert('Shipment saved but email failed');
    }
  };
  const fetchSales = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'storeSale'));
      const salesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSales(salesList);
    } catch (error) {
      console.error('❌ Error fetching sales:', error);
    }
  };
  useEffect(() => {
    fetchSales();
  }, []);
  const handleDeleteSale = async (saleId) => {
    try {
      await deleteDoc(doc(db, 'storeSale', saleId));
      fetchSales(); // refresh list after deletion
    } catch (error) {
      console.error('❌ Failed to delete sale:', error);
      alert('Could not delete sale.');
    }
  };
  const handleEditSale = (sale) => {
    setSalePercentage(sale.salePercentage);
    setSelectedCategory(sale.categoryId);
    // You can add an "edit mode" flag if you want to actually update the existing sale instead of creating a new one
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const dataCollection = collection(db, 'products');
      try {
        const querySnapshot = await getDocs(dataCollection);
        const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productList);
        const uniqueProductTypes = [...new Set(productList.map(product => product.productType))];
        setProductTypes(uniqueProductTypes);
      } catch (error) {
        console.error("Error retrieving product data: ", error);
      }
    };
    fetchProducts();
  }, []);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      const dataCollection = collection(db, 'orders');
      const querySnapshot = await getDocs(dataCollection);
      if (!querySnapshot.empty) {
        const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);
      }
    };
    fetchOrders();
  }, []);
  useEffect(() => {
    const fetchOnSaleItems = async () => {
      try {
        const dataCollection = collection(db, 'onSale');
        const querySnapshot = await getDocs(dataCollection);

        if (!querySnapshot.empty) {
          const saleItems = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOnSale(saleItems);
        } else {
          setOnSale([]); // Optional: clear if empty
        }
      } catch (error) {
        console.error("Error fetching onSale items:", error);
      }
    };

    fetchOnSaleItems();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const dataCollection = collection(db, 'Category');
      const querySnapshot = await getDocs(dataCollection);
      if (!querySnapshot.empty) {
        const categoryData = querySnapshot.docs.map(doc => doc.data());
        setCategories(categoryData);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subscribers
  useEffect(() => {
    const fetchSubscribers = async () => {
      const dataCollection = collection(db, 'subscribers');
      try {
        const querySnapshot = await getDocs(dataCollection);
        const subscribersList = querySnapshot.docs.map(doc => doc.data());
        setSubscribers(subscribersList);
      } catch (error) {
        console.error("Error retrieving subscribers: ", error);
      }
    };
    fetchSubscribers();
  }, []);

  // Fetch main display product type
  useEffect(() => {
    const fetchMainDisplay = async () => {
      const mainDisplayDoc = await getDocs(collection(db, 'mainDisplay'));
      if (!mainDisplayDoc.empty) {
        const data = mainDisplayDoc.docs[0].data();
        setSelectedProductType(data.selectedProductType || '');
      }
    };
    fetchMainDisplay();
  }, []);

  // Fetch hero slider
  useEffect(() => {
    const fetchHeroSlides = async () => {
      const dataCollection = collection(db, 'heroSlider');
      try {
        const querySnapshot = await getDocs(dataCollection);
        const slideList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHeroSlides(slideList);
      } catch (error) {
        console.error("Error retrieving hero slider data: ", error);
      }
    };
    fetchHeroSlides();
  }, []);

  // Fetch sale sections
  useEffect(() => {
    const fetchSaleSections = async () => {
      const dataCollection = collection(db, 'saleSection');
      try {
        const querySnapshot = await getDocs(dataCollection);
        const saleList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSaleSections(saleList);
      } catch (error) {
        console.error("Error retrieving sale section data: ", error);
      }
    };
    fetchSaleSections();
  }, []);

  // Fetch banner sections
  useEffect(() => {
    const fetchBannerSections = async () => {
      const dataCollection = collection(db, 'bannerSection');
      try {
        const querySnapshot = await getDocs(dataCollection);
        const bannerList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBannerSections(bannerList);
      } catch (error) {
        console.error("Error retrieving banner section data: ", error);
      }
    };
    fetchBannerSections();
  }, []);

  // Handle product submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      productImage: document.getElementById('productImage').value,
      productImage1: document.getElementById('productImage1').value,
      productImage2: document.getElementById('productImage2').value,
      productImage3: document.getElementById('productImage3').value,
      productName: document.getElementById('productName').value,
      productPrice: document.getElementById('productPrice').value,
      productCode: document.getElementById('productCode').value,
      productType: document.getElementById('productType').value,
      productSize: document.getElementById('productSize').value,
      productColor: document.getElementById('productColor').value,
      productDescription: document.getElementById('productDescription').value,
    };
    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
        alert('Product updated successfully!');
        setEditingProduct(null);
      } else {
        await addDoc(collection(db, 'products'), {
  ...productData,
  createdAt: serverTimestamp()
});

        alert('Product added successfully!');
      }
      document.getElementById('productForm').reset();
      const querySnapshot = await getDocs(collection(db, 'products'));
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      showTab('hometab');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(products.filter(product => product.id !== productId));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    document.getElementById('productImage').value = product.productImage || '';
    document.getElementById('productImage1').value = product.productImage1 || '';
    document.getElementById('productImage2').value = product.productImage2 || '';
    document.getElementById('productImage3').value = product.productImage3 || '';
    document.getElementById('productName').value = product.productName || '';
    document.getElementById('productPrice').value = product.productPrice || '';
    document.getElementById('productCode').value = product.productCode || '';
    document.getElementById('productType').value = product.productType || '';
    document.getElementById('productDescription').value = product.productDescription || '';
    showTab('uploadtab');
  };

  // Handle category submission
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const categoryData = {
      categoryImage: document.getElementById('categoryImage').value,
      categoryName: document.getElementById('categoryName').value,
    };
    try {
      await addDoc(collection(db, 'Category'), categoryData);
      alert('Category added successfully!');
      const querySnapshot = await getDocs(collection(db, 'Category'));
      setCategories(querySnapshot.docs.map(doc => doc.data()));
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category. Please try again.');
    }
  };

  // Handle store submission
  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    const storeData = {
      storeLogo: document.getElementById('storeLogo').value,
      storeName: document.getElementById('storeName').value,
      instaID: document.getElementById('instaID').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      address: document.getElementById('address').value,
      storeBanner: document.getElementById('storeBanner').value,
      storeSlogan: document.getElementById('storeSlogan').value,
      currency: document.getElementById('currency').value,
      shippingrate: document.getElementById('ratedollar').value,
      bankHolder: document.getElementById('accHolder').value,
      bankName: document.getElementById('bank').value,
      iban: document.getElementById('iban').value,
      about: document.getElementById('about').value,
    };
    try {
      await addDoc(collection(db, 'storeDetails'), storeData);
      alert('Store details saved successfully!');
    } catch (error) {
      console.error('Error saving store details:', error);
      alert('Error saving store details. Please try again.');
    }
  };

  // Handle blog submission
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    const blogData = {
      blogHeading: document.getElementById('blogHeading').value,
      blogImage: document.getElementById('blogImage').value,
      blogContent: document.getElementById('blogContent').value,
    };
    try {
      await addDoc(collection(db, 'blogs'), blogData);
      alert('Blog uploaded successfully!');
    } catch (error) {
      console.error('Error uploading blog:', error);
      alert('Error uploading blog. Please try again.');
    }
  };

  // Handle main display submission
  const handleMainDisplaySubmit = async (e) => {
    e.preventDefault();
    const selectedType = document.getElementById('mainDisplayType').value;
    try {
      await setDoc(doc(db, 'mainDisplay', 'settings'), { selectedProductType: selectedType });
      setSelectedProductType(selectedType);
      alert('Main display product type updated successfully!');
    } catch (error) {
      console.error('Error updating main display:', error);
      alert('Error updating main display. Please try again.');
    }
  };

  // Handle sale product submission
  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    if (!saleProduct) return;

    const percentage = parseFloat(newSalePrice);

    if (isNaN(percentage) || percentage <= 0 || percentage >= 100) {
      alert('Please enter a valid percentage (1-99).');
      return;
    }

    try {
      const discountAmount = saleProduct.productPrice * (percentage / 100);
      const salePrice = saleProduct.productPrice - discountAmount;

      await setDoc(doc(db, 'onSale', saleProduct.id), {
        ...saleProduct,
        salePrice: parseFloat(salePrice.toFixed(2)), // optional: round to 2 decimals
        salePercentage: percentage,
      });

      alert(`Product added to sale at ${percentage}% off!`);
      setSaleProduct(null);
      setNewSalePrice('');
    } catch (error) {
      console.error('❌ Error adding product to sale:', error);
      alert('Error adding product to sale. Please try again.');
    }
  };

  // Handle gifts for her submission
  const handleForHerSubmit = async (e) => {
    e.preventDefault();
    if (!forHerProduct) return;
    try {
      await setDoc(doc(db, 'forHer', forHerProduct.id), forHerProduct);
      alert('Product added to Gifts for Her successfully!');
      setForHerProduct(null);
    } catch (error) {
      console.error('Error adding product to Gifts for Her:', error);
      alert('Error adding product to Gifts for Her. Please try again.');
    }
  };

  // Handle hero slider submission
  const handleHeroSliderSubmit = async (e) => {
    e.preventDefault();
    const slideData = {
      title: document.getElementById('slideTitle').value,
      description: document.getElementById('slideDescription').value,
      image: document.getElementById('slideImage').value,
    };
    try {
      if (editingSlide) {
        await updateDoc(doc(db, 'heroSlider', editingSlide.id), slideData);
        alert('Slide updated successfully!');
        setEditingSlide(null);
      } else {
        await addDoc(collection(db, 'heroSlider'), slideData);
        alert('Slide added successfully!');
      }
      document.getElementById('heroSliderForm').reset();
      const querySnapshot = await getDocs(collection(db, 'heroSlider'));
      setHeroSlides(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      showTab('heroSliderTab');
    } catch (error) {
      console.error('Error saving slide:', error);
      alert('Error saving slide. Please try again.');
    }
  };

  // Handle hero slide deletion
  const handleDeleteSlide = async (slideId) => {
    try {
      await deleteDoc(doc(db, 'heroSlider', slideId));
      setHeroSlides(heroSlides.filter(slide => slide.id !== slideId));
      alert('Slide deleted successfully!');
    } catch (error) {
      console.error('Error deleting slide:', error);
      alert('Error deleting slide. Please try again.');
    }
  };

  // Handle edit slide
  const handleEditSlide = (slide) => {
    setEditingSlide(slide);
    document.getElementById('slideTitle').value = slide.title || '';
    document.getElementById('slideDescription').value = slide.description || '';
    document.getElementById('slideImage').value = slide.image || '';
    showTab('heroSliderTab');
  };

  // Handle sale section submission
  const handleSaleSectionSubmit = async (e) => {
    e.preventDefault();
    const saleSectionData = {
      heading: document.getElementById('saleHeading').value,
      subheading: document.getElementById('saleSubheading').value,
      image: document.getElementById('saleImage').value,
    };
    try {
      if (editingSaleSection) {
        await updateDoc(doc(db, 'saleSection', editingSaleSection.id), saleSectionData);
        alert('Sale section updated successfully!');
        setEditingSaleSection(null);
      } else {
        await addDoc(collection(db, 'saleSection'), saleSectionData);
        alert('Sale section added successfully!');
      }
      document.getElementById('saleSectionForm').reset();
      const querySnapshot = await getDocs(collection(db, 'saleSection'));
      setSaleSections(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      showTab('saleSectionTab');
    } catch (error) {
      console.error('Error saving sale section:', error);
      alert('Error saving sale section. Please try again.');
    }
  };

  // Handle sale section deletion
  const handleDeleteSaleSection = async (saleId) => {
    try {
      await deleteDoc(doc(db, 'saleSection', saleId));
      setSaleSections(saleSections.filter(sale => sale.id !== saleId));
      alert('Sale section deleted successfully!');
    } catch (error) {
      console.error('Error deleting sale section:', error);
      alert('Error deleting sale section. Please try again.');
    }
  };

  // Handle edit sale section
  const handleEditSaleSection = (sale) => {
    setEditingSaleSection(sale);
    document.getElementById('saleHeading').value = sale.heading || '';
    document.getElementById('saleSubheading').value = sale.subheading || '';
    document.getElementById('saleImage').value = sale.image || '';
    showTab('saleSectionTab');
  };

  // Handle banner section submission
  const handleBannerSectionSubmit = async (e) => {
    e.preventDefault();
    const bannerSectionData = {
      image: document.getElementById('bannerImage').value,
    };
    try {
      if (editingBannerSection) {
        await updateDoc(doc(db, 'bannerSection', editingBannerSection.id), bannerSectionData);
        alert('Banner section updated successfully!');
        setEditingBannerSection(null);
      } else {
        await addDoc(collection(db, 'bannerSection'), bannerSectionData);
        alert('Banner section added successfully!');
      }
      document.getElementById('bannerSectionForm').reset();
      const querySnapshot = await getDocs(collection(db, 'bannerSection'));
      setBannerSections(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      showTab('bannerSectionTab');
    } catch (error) {
      console.error('Error saving banner section:', error);
      alert('Error saving banner section. Please try again.');
    }
  };

  // Handle banner section deletion
  const handleDeleteBannerSection = async (bannerId) => {
    try {
      await deleteDoc(doc(db, 'bannerSection', bannerId));
      setBannerSections(bannerSections.filter(banner => banner.id !== bannerId));
      alert('Banner section deleted successfully!');
    } catch (error) {
      console.error('Error deleting banner section:', error);
      alert('Error deleting banner section. Please try again.');
    }
  };

  // Handle edit banner section
  const handleEditBannerSection = (banner) => {
    setEditingBannerSection(banner);
    document.getElementById('bannerImage').value = banner.image || '';
    showTab('bannerSectionTab');
  };

  // Toggle sidebar
  const toggle = () => {
    const togglebar = document.getElementById('togglebar');
    togglebar.style.display = togglebar.style.display === 'flex' ? 'none' : 'flex';
  };

  // Tab visibility functions
  const showTab = (tabId) => {
    setActiveTab(tabId); // mark the clicked tab as active

    const tabs = [
      'hometab',
      'storeSaleTab',
      'orders',
      'uploadtab',
      'editstore',
      'uploadBlog',
      'subscribers',
      'categories',
      'saleTab',
      'forHerTab',
      'heroSliderTab',
      'saleSectionTab',
      'bannerSectionTab',
      'notification',
      'floatingMessage'
    ];

    tabs.forEach(id => {
      const tab = document.getElementById(id);
      if (tab) tab.style.display = id === tabId ? 'block' : 'none';
    });

    const togglebar = document.getElementById('togglebar');
    if (togglebar) togglebar.style.display = window.innerWidth <= 880 ? 'none' : 'flex';
  };


  // Copy subscribers' emails
  const handleCopy = () => {
    const textToCopy = subscribers.length === 0
      ? 'No subscribers yet'
      : subscribers.map(subscriber => subscriber.email).join('\n');
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = textToCopy;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    alert('Emails copied to clipboard!');
  };
  const handleRemoveFromSale = async (id) => {
    try {
      await deleteDoc(doc(db, 'onSale', id));
      setOnSale(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing item from sale:", error);
    }
  };

  {/* Store Sale */ }



  const handleStoreSale = async (e) => {
    e.preventDefault();

    const parsedPercentage = parseFloat(salePercentage);

    if (isNaN(parsedPercentage) || parsedPercentage <= 0 || parsedPercentage >= 100) {
      alert('Please enter a valid percentage.');
      return;
    }

    if (!selectedCategory) {
      alert('Please select a category.');
      return;
    }

    try {
      await addDoc(collection(db, 'storeSale'), {
        salePercentage: parsedPercentage,
        categoryId: selectedCategory,
        createdAt: serverTimestamp()
      });

      alert(`Sale of ${parsedPercentage}% recorded for selected category!`);
      setSalePercentage('');
      setSelectedCategory('');
      fetchSales(); // If you're displaying the table
    } catch (error) {
      console.error('❌ Error storing sale percentage:', error);
      alert('Failed to store sale value.');
    }
  };


  const handleNotification = async (e) => {
    //it will just a message in firestore database from a form
    e.preventDefault();
    const notificationMessage = document.getElementById('notificationMessage').value;

    try {
      await addDoc(collection(db, 'notifications'), {
        message: notificationMessage,
        createdAt: serverTimestamp()
      });
      alert('Notification sent successfully!');
    }
    catch (error) {
      console.error('❌ Error sending notification:', error);
      alert('Failed to send notification.');
      return;
    }
  }
  const handleFloatingMessage = async (e) => {
    e.preventDefault();
    const message = floatingMessage.trim();

    if (!message) {
      alert('Please enter a message.');
      return;
    }

    try {
      await addDoc(collection(db, 'floatingMessages'), {
        message,
        createdAt: serverTimestamp()
      });
      setFloatingMessage('');
      alert('Floating message sent successfully!');
    } catch (error) {
      console.error('❌ Error sending floating message:', error);
      alert('Failed to send floating message.');
    }
  }
  const thStyle = {
    padding: '12px',
    fontWeight: 600,
    color: '#202223',
    borderBottom: '1px solid #e1e3e5'
  };

  const tdStyle = {
    padding: '12px',
    verticalAlign: 'top',
    color: '#202223'
  };


  return (

    <div className="admin-page">
      <div className="admin-section">
        <div className="cover">
          <div className="admin-actions">
            <button className="toggle-button" onClick={toggle}>
              <i className="fa-sharp fa-solid fa-bars"></i>
            </button>
            <h3>Admin Page</h3>
          </div>
        </div>
      </div>
      <div className="actions-holder">
        <div className="cover">
          <div className="Toggleactions">
            <div
              className="toggle-bar"
              id="togglebar"
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '220px',
                height: '100vh',
                padding: '20px 10px',
                background: '#fff',
                borderRight: '1px solid #e1e3e5',
                boxSizing: 'border-box',
                overflowY: 'auto',
                gap: '6px'
              }}
            >
              {[
                { label: 'Home', tab: 'hometab' },
                { label: 'Store Sale', tab: 'storeSaleTab' },
                { label: 'Orders', tab: 'orders' },
                { label: 'Notification', tab: 'notification' },
                { label: 'Floating Message', tab: 'floatingMessage' },
                { label: 'Upload a Product', tab: 'uploadtab' },
                { label: 'Edit Store', tab: 'editstore' },
                { label: 'Upload a Blog', tab: 'uploadBlog' },
                { label: 'Categories', tab: 'categories' },
                { label: 'Subscribers', tab: 'subscribers' },
                { label: 'Products on Sale', tab: 'saleTab' },
                { label: 'Gifts for Her', tab: 'forHerTab' },
                { label: 'Hero Slider', tab: 'heroSliderTab' },
                { label: 'Sale Slider', tab: 'saleSectionTab' },
                { label: 'Banner Slider', tab: 'bannerSectionTab' },
              ].map((item) => (
                <button
                  key={item.tab}
                  onClick={() => showTab(item.tab)}
                  style={{
                    padding: '10px 14px',
                    textAlign: 'left',
                    border: 'none',
                    borderRadius: '6px',
                    background: activeTab === item.tab ? '#f1f2f3' : 'transparent',
                    color: '#202223',
                    fontWeight: activeTab === item.tab ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f9f9f9')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = activeTab === item.tab ? '#f1f2f3' : 'transparent')
                  }
                >
                  {item.label}
                </button>
              ))}

              <Link
                to="/"
                className="no-decoration navLink"
                style={{ marginTop: '10px', textDecoration: 'none' }}
              >
                <button
                  style={{
                    padding: '10px 14px',
                    textAlign: 'left',
                    border: 'none',
                    borderRadius: '6px',
                    background: '#1a73e8',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  Go to Store
                </button>
              </Link>
            </div>

            <div className="tabs">


              {/* Notification message tab */}
              {/* it will just a message in firestore database from a form */}
              <div
                className="homeTab"
                id="notification"
                style={{ display: 'none', margin: 0, fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#111827' }}
              >
                <div
                  style={{

                    margin: 'auto',
                    background: '#ffffff',
                    padding: '32px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  }}
                >
                  <h3 style={{ marginTop: 0, fontSize: '22px', fontWeight: 600 }}>Notification</h3>

                  <form style={{ marginTop: '24px' }} onSubmit={handleNotification}>
                    <div style={{ marginBottom: '24px' }}>
                      <label
                        htmlFor="notificationMessage"
                        style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}
                      >
                        Notification Message
                      </label>
                      <input
                        type="text"
                        id="notificationMessage"
                        placeholder="Enter notification message..."
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        background: '#111827',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Send Notification
                    </button>
                  </form>
                </div>
              </div>

              {/* Floating Message */}

              <div
                className="homeTab"
                id="floatingMessage"
                style={{
                  display: 'none',
                  margin: 0,

                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  color: '#111827',
                }}
              >
                <div
                  style={{

                    margin: 'auto',
                    background: '#ffffff',
                    padding: '32px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  }}
                >
                  <h3 style={{ marginTop: 0, fontSize: '22px', fontWeight: 600 }}>Floating Message</h3>

                  <form style={{ marginTop: '24px' }} onSubmit={handleFloatingMessage}>
                    <div style={{ marginBottom: '24px' }}>
                      <label
                        htmlFor="floatingMessage"
                        style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}
                      >
                        Message
                      </label>
                      <input
                        type="text"
                        id="floatingMessage"
                        placeholder="Enter floating message..."
                        value={floatingMessage}
                        onChange={(e) => setFloatingMessage(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        background: '#111827',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Add Floating Message
                    </button>
                  </form>
                </div>
              </div>

              {/* Home Tab - Product List */}

              <div
                className="homeTab"
                id="hometab"
                style={{
                  display: 'block',
                  margin: 0,

                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  color: '#111827',
                }}
              >
                <div
                  style={{

                    margin: 'auto',
                    background: '#ffffff',
                    padding: '32px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  }}
                >
                  <h3 style={{ marginTop: 0, fontSize: '22px', fontWeight: 600, marginBottom: '24px' }}>Products</h3>

                  {products.length === 0 ? (
                    <p>No products are added yet</p>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f9fafb' }}>
                      <thead>
                        <tr style={{ background: '#f3f4f6' }}>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Image</th>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Name</th>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Type</th>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Code</th>
                          {/* <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Description</th> */}
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Price</th>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <td style={{ padding: '12px' }}>
                              <img
                                src={product.productImage || 'https://via.placeholder.com/80'}
                                alt={product.productName}
                                style={{ width: '80px', height: 'auto', borderRadius: '6px', objectFit: 'cover' }}
                              />
                            </td>
                            <td style={{ padding: '12px', fontWeight: 500 }}>{product.productName}</td>
                            <td style={{ padding: '12px' }}>{product.productType}</td>
                            <td style={{ padding: '12px' }}>{product.productCode}</td>
                            {/* <td style={{ padding: '12px', color: '#6b7280' }}>
                {product.productDescription || 'No description'}
              </td> */}
                            <td style={{ padding: '12px', fontWeight: 600 }}>RS.{product.productPrice}</td>
                            <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleEditProduct(product)}
                                style={{
                                  background: '#f3f4f6',
                                  border: '1px solid #D1D5DB',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                style={{
                                  background: '#fee2e2',
                                  border: '1px solid #FECACA',
                                  color: '#991b1b',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>



              {/* Orders Tab */}

              <div
                className="ordersTab"
                id="orders"
                style={{
                  display: 'none',
                  margin: 0,

                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  color: '#111827',
                }}
              >
                <div
                  style={{

                    margin: 'auto',
                    background: '#ffffff',
                    padding: '32px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  }}
                >
                  <h3 style={{ marginBottom: '16px', fontSize: '22px', fontWeight: 600 }}>Orders</h3>

                  {orders.length === 0 ? (
                    <p style={{ color: '#6d7175' }}>No orders</p>
                  ) : (
                    <div
                      style={{

                        overflow: 'auto',
                        border: '1px solid #E1E3E5',
                        borderRadius: '8px',
                        background: '#fff',
                        padding: '10px',
                      }}
                    >
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                          <tr style={{ background: '#f1f2f3', textAlign: 'left' }}>
                            <th style={thStyle}>Order #</th>
                            <th style={thStyle}>Customer</th>
                            <th style={thStyle}>Address</th>
                            <th style={thStyle}>Items</th>
                            <th style={thStyle}>Total</th>
                            <th style={thStyle}>Payment</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order, index) => (
                            <tr key={order.id || index} style={{ borderBottom: '1px solid #E1E3E5', verticalAlign: 'top' }}>
                              <td style={tdStyle}>#{index + 1}</td>

                              <td style={tdStyle}>
                                <strong>{order.customer?.firstName} {order.customer?.lastName}</strong>
                                <br />
                                <span style={{ color: '#6d7175' }}>{order.customer?.email}</span>
                                <br />
                                <span style={{ color: '#6d7175' }}>{order.customer?.phone}</span>
                              </td>

                              <td style={tdStyle}>
                                {order.customer?.street}{order.customer?.address2 && `, ${order.customer.address2}`}
                                <br />
                                {order.customer?.city}, {order.customer?.region}, {order.customer?.country}
                              </td>

                              <td style={tdStyle}>
                                {order.cartItems?.map((item, i) => (
                                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                    <img
                                      src={item.productImage || 'https://via.placeholder.com/36'}
                                      alt={item.productName}
                                      style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #ddd' }}
                                    />
                                    <div>
                                      <div>{item.productName}</div>
                                      <div style={{ color: '#6d7175', fontSize: '12px' }}>Qty: {item.quantity}</div>
                                    </div>
                                  </div>
                                ))}
                              </td>

                              <td style={tdStyle}>
                                <strong>Rs.{order.pricing?.total}</strong>
                                <br />
                                <span style={{ color: '#6d7175', fontSize: '12px' }}>Shipping: Rs.{order.pricing?.shipping}</span>
                              </td>

                              <td style={tdStyle}>
                                {order.payment?.method === 'cod' ? 'Cash on Delivery' : 'Bank Deposit'}
                              </td>

                              <td style={tdStyle}>
                                <span
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    background: order.status === 'pending' ? '#fff4e5' : '#e3f1df',
                                    color: order.status === 'pending' ? '#916a00' : '#1a7f37',
                                  }}
                                >
                                  {order.status}
                                </span>
                              </td>

                              <td style={{ ...tdStyle, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <button
                                  onClick={() => handleDeleteOrder(order.id)}
                                  style={{
                                    padding: '4px 8px',
                                    background: '#ff4d4f',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                  }}
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => handleCompleteOrder(order)}
                                  style={{
                                    padding: '4px 8px',
                                    background: '#1a73e8',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                  }}
                                >
                                  Complete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Shipment Popup */}
                  {showShipmentPopup && selectedOrder && (
                    <div
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                      }}
                    >
                      <div
                        style={{
                          background: '#fff',
                          padding: '32px',
                          borderRadius: '10px',
                          width: '400px',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        }}
                      >
                        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>Add Shipment Details</h3>

                        <input
                          type="text"
                          placeholder="Shipping Partner"
                          value={shipmentPartner}
                          onChange={(e) => setShipmentPartner(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            marginBottom: '16px',
                            borderRadius: '6px',
                            border: '1px solid #D1D5DB',
                            fontSize: '14px',
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Tracking Code"
                          value={shipmentCode}
                          onChange={(e) => setShipmentCode(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            marginBottom: '16px',
                            borderRadius: '6px',
                            border: '1px solid #D1D5DB',
                            fontSize: '14px',
                          }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                          <button
                            onClick={() => setShowShipmentPopup(false)}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '6px',
                              border: 'none',
                              background: '#ddd',
                              cursor: 'pointer',
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={submitShipmentDetails}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '6px',
                              border: 'none',
                              background: '#1a73e8',
                              color: '#fff',
                              cursor: 'pointer',
                            }}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>



              {/* Upload Product Tab */}

              <div
                className="uploadTab"
                id="uploadtab"
                style={{
                  display: 'none',
                  margin: 0,

                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  color: '#111827',
                }}
              >
                <div
                  style={{
                    margin: 'auto',
                  }}
                >
                  <h3 style={{ marginTop: 0, fontSize: '22px', fontWeight: 600 }}>
                    {editingProduct ? 'Edit Product' : 'Upload Product'}
                  </h3>
                  <p>
                    Note: Upload all images on{' '}
                    <a href="https://imgbb.com/" target="_blank" rel="noopener noreferrer">
                      imgbb
                    </a>
                    , select the image, copy the image address, and paste the link here.
                  </p>

                  <form id="productForm" onSubmit={handleProductSubmit} style={{ marginTop: '24px' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '32px',
                      }}
                    >
                      {/* IMAGE SECTION */}
                      <div>
                        <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>Product Images</h4>
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 500 }}>
                              {i === 0
                                ? 'Main Image'
                                : i === 1
                                  ? 'Second Image'
                                  : i === 2
                                    ? 'Third Image'
                                    : 'Fourth Image'}
                            </label>
                            <input
                              type="text"
                              name={`productImage${i === 0 ? '' : i}`}
                              id={`productImage${i === 0 ? '' : i}`}
                              placeholder="https://"
                              required
                              style={{
                                width: '100%',
                                marginTop: '6px',
                                padding: '10px 12px',
                                border: '1px solid #D1D5DB',
                                borderRadius: '6px',
                                fontSize: '14px',
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* PRODUCT INFO SECTION */}
                      <div>
                        <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>Product Details</h4>

                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '13px', fontWeight: 500 }}>Product Name</label>
                          <input
                            type="text"
                            name="productName"
                            id="productName"
                            placeholder="Product Name.."
                            required
                            style={{
                              width: '100%',
                              marginTop: '6px',
                              padding: '10px 12px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px',
                            }}
                          />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '13px', fontWeight: 500 }}>Price</label>
                          <input
                            type="number"
                            name="productPrice"
                            id="productPrice"
                            placeholder="Price.."
                            required
                            style={{
                              width: '100%',
                              marginTop: '6px',
                              padding: '10px 12px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px',
                            }}
                          />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '13px', fontWeight: 500 }}>Product Code</label>
                          <input
                            type="text"
                            name="productCode"
                            id="productCode"
                            placeholder="Product Code.."
                            required
                            style={{
                              width: '100%',
                              marginTop: '6px',
                              padding: '10px 12px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px',
                            }}
                          />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '13px', fontWeight: 500 }}>Size</label>
                          <input
                            type="text"
                            name="productSize"
                            id="productSize"
                            placeholder="Product Size.."
                            required
                            style={{
                              width: '100%',
                              marginTop: '6px',
                              padding: '10px 12px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px',
                            }}
                          />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '13px', fontWeight: 500 }}>Color</label>
                          <input
                            type="text"
                            name="productColor"
                            id="productColor"
                            placeholder="Product Color.."
                            required
                            style={{
                              width: '100%',
                              marginTop: '6px',
                              padding: '10px 12px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px',
                            }}
                          />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '13px', fontWeight: 500 }}>Category</label>
                          <select
                            name="productType"
                            id="productType"
                            required
                            style={{
                              width: '100%',
                              marginTop: '6px',
                              padding: '10px 12px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px',
                              background: '#fff',
                            }}
                          >
                            {categories.length === 0 ? (
                              <option value="">No Category</option>
                            ) : (
                              categories.map((category, index) => (
                                <option key={index} value={category.categoryName}>
                                  {category.categoryName}
                                </option>
                              ))
                            )}
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 500 }}>Description</label>
                          <textarea
                            name="productDescription"
                            id="productDescription"
                            placeholder="Description.."
                            rows="4"
                            style={{
                              width: '100%',
                              marginTop: '6px',
                              padding: '12px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px',
                              resize: 'vertical',
                            }}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                      <button
                        className="primary-button"
                        type="submit"
                        style={{
                          background: '#111827',
                          color: '#fff',
                          border: 'none',
                          padding: '10px 18px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        {editingProduct ? 'Update Product' : 'Add Product'}
                      </button>
                      {editingProduct && (
                        <button
                          className="primary-button"
                          type="button"
                          onClick={() => {
                            setEditingProduct(null);
                            document.getElementById('productForm').reset();
                            showTab('hometab');
                          }}
                          style={{
                            background: '#f3f4f6',
                            color: '#111827',
                            border: '1px solid #D1D5DB',
                            padding: '10px 18px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>




              {/* Edit Store Tab */}
              <div
                className="editStore"
                id="editstore"
                style={{
                  display: 'none',
                  margin: 0,

                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  color: '#111827',
                }}
              >
                <div
                  style={{
                    maxWidth: '1000px',
                    margin: 'auto',

                  }}
                >
                  <h3 style={{ marginTop: 0, fontSize: '22px', fontWeight: 600 }}>Edit Store</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                    Upload images on{' '}
                    <a
                      href="https://imgbb.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
                    >
                      imgbb
                    </a>{' '}
                    and paste the image URLs below.
                  </p>

                  <form onSubmit={handleStoreSubmit}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '32px',
                      }}
                    >
                      {/* SECTION 1: STORE INFO */}
                      <div>
                        <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>Store Information</h4>

                        {[
                          { label: 'Store Logo', name: 'storeLogo', placeholder: 'https://', required: false },
                          { label: 'Store Banner', name: 'storeBanner', placeholder: 'https://', required: true },
                          { label: 'Store Slogan', name: 'storeSlogan', placeholder: 'Slogan', required: true },
                          { label: 'Store Name', name: 'storeName', placeholder: 'Name', required: true },
                          { label: 'Instagram Link', name: 'instaID', placeholder: 'https://', required: false },
                          { label: 'Phone Number', name: 'phone', placeholder: '+92...', required: true },
                          { label: 'Email', name: 'email', placeholder: 'email@example.com', required: true },
                        ].map((field) => (
                          <div key={field.name} style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 500 }}>{field.label}</label>
                            <input
                              type={field.name === 'email' ? 'email' : 'text'}
                              name={field.name}
                              id={field.name}
                              placeholder={field.placeholder}
                              required={field.required}
                              style={{
                                width: '100%',
                                marginTop: '6px',
                                padding: '10px 12px',
                                border: '1px solid #D1D5DB',
                                borderRadius: '6px',
                                fontSize: '14px',
                              }}
                            />
                          </div>
                        ))}

                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '13px', fontWeight: 500 }}>About Store</label>
                          <textarea
                            name="about"
                            id="about"
                            cols="15"
                            rows="6"
                            required
                            style={{
                              width: '100%',
                              marginTop: '6px',
                              padding: '12px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px',
                              resize: 'vertical',
                            }}
                          ></textarea>
                        </div>
                      </div>

                      {/* SECTION 2: BUSINESS & PAYMENTS */}
                      <div>
                        <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>Business Details</h4>

                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '13px', fontWeight: 500 }}>Store Address</label>
                          <input
                            type="text"
                            name="address"
                            id="address"
                            placeholder="Address"
                            required
                            style={{
                              width: '100%',
                              marginTop: '6px',
                              padding: '10px 12px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px',
                            }}
                          />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '13px', fontWeight: 500 }}>About Store</label>
                          <textarea
                            name="aboutDetails"
                            rows="4"
                            style={{
                              width: '100%',
                              marginTop: '6px',
                              padding: '12px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px',
                              resize: 'vertical',
                            }}
                          ></textarea>
                        </div>

                        <h4 style={{ margin: '24px 0 12px', fontSize: '15px', fontWeight: 600 }}>Shipping Rates</h4>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '13px', fontWeight: 500 }}>Currency</label>
                          <select
                            name="currency"
                            id="currency"
                            style={{
                              width: '100%',
                              marginTop: '6px',
                              padding: '10px 12px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px',
                              background: '#fff',
                            }}
                          >
                            <option value="PKR">PKR</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="JPY">JPY</option>
                          </select>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                          <label style={{ fontSize: '13px', fontWeight: 500 }}>Average Shipping Rate</label>
                          <input
                            type="text"
                            name="ratedollar"
                            id="ratedollar"
                            placeholder="0"
                            style={{
                              width: '100%',
                              marginTop: '6px',
                              padding: '10px 12px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px',
                            }}
                          />
                        </div>

                        <h4 style={{ marginBottom: '12px', fontSize: '15px', fontWeight: 600 }}>Account Details</h4>
                        {[
                          { label: 'Account Holder', name: 'accHolder', placeholder: 'Name', required: true },
                          { label: 'Bank Name', name: 'bank', placeholder: 'Bank', required: false },
                          { label: 'IBAN', name: 'iban', placeholder: 'IBAN', required: true },
                        ].map((field) => (
                          <div key={field.name} style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 500 }}>{field.label}</label>
                            <input
                              type="text"
                              name={field.name}
                              id={field.name}
                              placeholder={field.placeholder}
                              required={field.required}
                              style={{
                                width: '100%',
                                marginTop: '6px',
                                padding: '10px 12px',
                                border: '1px solid #D1D5DB',
                                borderRadius: '6px',
                                fontSize: '14px',
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SAVE BUTTON */}
                    <div style={{ marginTop: '24px' }}>
                      <button
                        type="submit"
                        className="primary-button"
                        style={{
                          background: '#111827',
                          color: '#fff',
                          border: 'none',
                          padding: '10px 18px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Save Details
                      </button>
                    </div>
                  </form>
                </div>
              </div>


              {/* Store Sale */}

              <div
                className="homeTab"
                id="storeSaleTab"
                style={{
                  display: 'none',
                  margin: 0,

                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  color: '#111827',
                }}
              >
                <div
                  style={{

                    margin: 'auto',

                  }}
                >
                  <h3 style={{ marginTop: 0, fontSize: '22px', fontWeight: 600 }}>Store Sale</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                    Apply a percentage discount to all products in the selected category.
                  </p>

                  {/* SALE FORM */}
                  <form
                    onSubmit={handleStoreSale}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      flexWrap: 'wrap',
                      marginBottom: '32px',
                    }}
                  >
                    <select
                      name="productType"
                      id="productType"
                      required
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      style={{
                        flex: 1,
                        minWidth: '220px',
                        padding: '10px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        fontSize: '14px',
                        background: '#fff',
                      }}
                    >
                      <option value="">Select Category</option>
                      {categories.length === 0 ? (
                        <option value="">No Category</option>
                      ) : (
                        categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.categoryName}
                          </option>
                        ))
                      )}
                    </select>

                    <input
                      type="number"
                      placeholder="Sale %"
                      value={salePercentage}
                      onChange={(e) => setSalePercentage(e.target.value)}
                      style={{
                        width: '160px',
                        padding: '10px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    />

                    <button
                      type="submit"
                      className="primary-button"
                      style={{
                        background: '#111827',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Apply Sale
                    </button>
                  </form>

                  {/* EXISTING SALES */}
                  <h4 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}>Existing Sales</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ background: '#f9fafb' }}>
                        <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #E5E7EB' }}>
                          Category
                        </th>
                        <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #E5E7EB' }}>
                          Sale %
                        </th>
                        <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #E5E7EB' }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.map((sale) => {
                        const category = categories.find((cat) => cat.id === sale.categoryId);
                        return (
                          <tr key={sale.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <td style={{ padding: '12px' }}>{category?.categoryName || sale.categoryId}</td>
                            <td style={{ padding: '12px' }}>{sale.salePercentage}%</td>
                            <td style={{ padding: '12px' }}>
                              <button
                                onClick={() => handleEditSale(sale)}
                                style={{
                                  background: '#f3f4f6',
                                  border: '1px solid #D1D5DB',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                  marginRight: '6px',
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteSale(sale.id)}
                                style={{
                                  background: '#fee2e2',
                                  border: '1px solid #FECACA',
                                  color: '#991b1b',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Upload Blog Tab */}

              <div
                className="uploadBlog"
                id="uploadBlog"
                style={{
                  display: 'none',
                  margin: 0,

                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  color: '#111827',
                }}
              >
                <div
                  style={{

                    margin: 'auto',
                    background: '#ffffff',

                  }}
                >
                  <h3 style={{ marginTop: 0, fontSize: '22px', fontWeight: 600 }}>Upload a Blog</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                    Upload images on{' '}
                    <a
                      href="https://imgbb.com/"
                      target="_blank"
                      style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
                    >
                      imgbb
                    </a>{' '}
                    and paste the image URL below.
                  </p>

                  <form onSubmit={handleBlogSubmit}>
                    <div style={{ marginBottom: '18px' }}>
                      <label
                        htmlFor="blogHeading"
                        style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        Blog Heading
                      </label>
                      <input
                        type="text"
                        name="blogHeading"
                        id="blogHeading"
                        placeholder="Blog heading"
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '18px' }}>
                      <label
                        htmlFor="blogImage"
                        style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        Blog Image Source
                      </label>
                      <input
                        type="text"
                        name="blogImage"
                        id="blogImage"
                        placeholder="https://"
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label
                        htmlFor="blogContent"
                        style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        Content
                      </label>
                      <textarea
                        name="blogContent"
                        id="blogContent"
                        rows="10"
                        placeholder="Write your blog content here..."
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '14px',
                          resize: 'vertical',
                          lineHeight: 1.6,
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        background: '#111827',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Upload Blog
                    </button>
                  </form>
                </div>
              </div>


              {/* Subscribers Tab */}
              <div className="subscribers" id="subscribers" style={{ display: 'none' }}>
                <h3>Subscribers</h3>
                <div className="new-order">
                  {subscribers.length === 0 ? (
                    <p>No subscribers yet</p>
                  ) : (
                    subscribers.map((subscriber, index) => (
                      <p key={index}>{subscriber.email}</p>
                    ))
                  )}
                </div>
                <button className="primary-button" onClick={handleCopy}>Copy All Emails</button>
              </div>

              {/* Categories Tab */}

              <div
                className="categories"
                id="categories"
                style={{
                  display: 'none',
                  margin: 0,

                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  color: '#111827',
                }}
              >
                <div
                  style={{

                    margin: 'auto',
                    background: '#ffffff',

                  }}
                >
                  <h3 style={{ marginTop: 0, fontSize: '22px', fontWeight: 600 }}>Categories</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                    Upload images on{' '}
                    <a
                      href="https://imgbb.com/"
                      target="_blank"
                      style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
                    >
                      imgbb
                    </a>{' '}
                    and paste the image URL below.
                  </p>

                  {/* Add Category */}
                  <form onSubmit={handleCategorySubmit} style={{ marginBottom: '40px' }}>
                    <div style={{ marginBottom: '18px' }}>
                      <label
                        htmlFor="categoryImage"
                        style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}
                      >
                        Category Image Source
                      </label>
                      <input
                        type="text"
                        name="categoryImage"
                        id="categoryImage"
                        placeholder="https://"
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label
                        htmlFor="categoryName"
                        style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}
                      >
                        Category Name
                      </label>
                      <input
                        type="text"
                        name="categoryName"
                        id="categoryName"
                        placeholder="Category Name.."
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="primary-button"
                      style={{
                        background: '#111827',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Add Category
                    </button>
                  </form>

                  <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '40px 0' }} />

                  {/* Main Display Section */}
                  <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>
                    Set Main Display Product Type
                  </h3>
                  <form onSubmit={handleMainDisplaySubmit} style={{ maxWidth: '420px' }}>
                    <div style={{ marginBottom: '24px' }}>
                      <label
                        htmlFor="mainDisplayType"
                        style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}
                      >
                        Select Product Type
                      </label>
                      <select
                        name="mainDisplayType"
                        id="mainDisplayType"
                        required
                        value={selectedProductType}
                        onChange={(e) => setSelectedProductType(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '14px',
                          background: '#ffffff',
                        }}
                      >
                        {productTypes.length === 0 ? (
                          <option value="">No product types available</option>
                        ) : (
                          productTypes.map((type, index) => (
                            <option key={index} value={type}>
                              {type}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="primary-button"
                      style={{
                        background: '#111827',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Save Main Display
                    </button>
                  </form>

                  <p style={{ marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
                    Current Main Display:{' '}
                    <strong style={{ color: '#111827' }}>{selectedProductType || 'None selected'}</strong>
                  </p>
                </div>
              </div>


              {/* Products on Sale Tab */}

              <div
                className="saleTab"
                id="saleTab"
                style={{
                  display: 'none',
                  margin: 0,

                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  color: '#111827',
                }}
              >
                <div
                  style={{

                    margin: 'auto',
                    background: '#ffffff',

                  }}
                >
                  <h3 style={{ marginTop: 0, fontSize: '22px', fontWeight: 600 }}>Products on Sale</h3>

                  {/* Select Product */}
                  <div style={{ marginBottom: '24px' }}>
                    <label
                      htmlFor="saleProduct"
                      style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}
                    >
                      Select Product for Sale
                    </label>
                    <select
                      id="saleProduct"
                      value={saleProduct?.id || ''}
                      onChange={(e) => {
                        const selected = products.find((p) => p.id === e.target.value);
                        setSaleProduct(selected);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        fontSize: '14px',
                        background: '#fff',
                      }}
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.productName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Product Sale Form */}
                  {saleProduct && (
                    <form onSubmit={handleSaleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '40px' }}>
                      <div
                        style={{
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          padding: '16px',
                          display: 'flex',
                          gap: '16px',
                          width: '100%',

                          background: '#f9fafb',
                        }}
                      >
                        <img
                          src={saleProduct.productImage}
                          alt={saleProduct.productName}
                          style={{
                            width: '120px',
                            height: 'auto',
                            borderRadius: '6px',
                            objectFit: 'cover',
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: 600 }}>{saleProduct.productName}</p>
                          <p style={{ margin: '4px 0 12px', fontSize: '14px', color: '#6b7280' }}>
                            Original Price: RS.{saleProduct.productPrice}
                          </p>
                          <div style={{ marginBottom: '12px' }}>
                            <label
                              htmlFor="newSalePrice"
                              style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}
                            >
                              Sale value in %
                            </label>
                            <input
                              type="number"
                              id="newSalePrice"
                              value={newSalePrice}
                              onChange={(e) => setNewSalePrice(e.target.value)}
                              placeholder="Enter sale %"
                              required
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #D1D5DB',
                                borderRadius: '6px',
                                fontSize: '14px',
                              }}
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                              type="submit"
                              className="primary-button"
                              style={{
                                background: '#111827',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 18px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                              }}
                            >
                              Add to Sale
                            </button>
                            <button
                              type="button"
                              className="primary-button"
                              onClick={() => {
                                setSaleProduct(null);
                                setNewSalePrice('');
                              }}
                              style={{
                                background: '#f3f4f6',
                                color: '#111827',
                                border: '1px solid #D1D5DB',
                                padding: '10px 18px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                cursor: 'pointer',
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Current Sale Products */}
                  <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Current Sale Products</h3>
                  {onSale.length === 0 ? (
                    <p>No sale items added yet</p>
                  ) : (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '24px',
                      }}
                    >
                      {onSale.map((item) => (
                        <div
                          key={item.id}
                          className="product-card"
                          style={{
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            background: '#f9fafb',
                          }}
                        >
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                          />
                          <div style={{ padding: '12px' }}>
                            <p style={{ margin: 0, fontWeight: 600 }}>{item.productName}</p>
                            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>
                              Original Price: RS.{item.productPrice}
                            </p>
                            <p style={{ margin: '4px 0', fontSize: '14px', color: '#111827' }}>
                              Sale Price: RS.{item.salePrice}
                            </p>
                            <button
                              onClick={() => handleRemoveFromSale(item.id)}
                              style={{
                                background: '#fee2e2',
                                border: '1px solid #FECACA',
                                color: '#991b1b',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                cursor: 'pointer',
                                marginTop: '8px',
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>


              {/* Gifts for Her Tab */}

              <div
                className="forHerTab"
                id="forHerTab"
                style={{
                  display: 'none',
                  margin: 0,

                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  color: '#111827',
                }}
              >
                <div
                  style={{

                    margin: 'auto',

                  }}
                >
                  <h3 style={{ marginTop: 0, fontSize: '22px', fontWeight: 600 }}>Gifts for Her</h3>

                  {/* Select Product */}
                  <div style={{ marginBottom: '24px' }}>
                    <label
                      htmlFor="forHerProduct"
                      style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: 500,
                        marginBottom: '6px',
                      }}
                    >
                      Select Product for Gifts for Her
                    </label>
                    <select
                      id="forHerProduct"
                      onChange={(e) => {
                        const selected = products.find((p) => p.id === e.target.value);
                        setForHerProduct(selected);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        fontSize: '14px',
                        background: '#fff',
                      }}
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.productName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Product Card */}
                  {forHerProduct && (
                    <form
                      onSubmit={handleForHerSubmit}
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '24px',
                        marginBottom: '40px',
                      }}
                    >
                      <div
                        className="product-card"
                        style={{
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          padding: '16px',
                          display: 'flex',
                          gap: '16px',
                          width: '100%',
                          maxWidth: '500px',
                          background: '#f9fafb',
                        }}
                      >
                        <img
                          src={forHerProduct.productImage}
                          alt={forHerProduct.productName}
                          style={{
                            width: '120px',
                            height: 'auto',
                            borderRadius: '6px',
                            objectFit: 'cover',
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: 600 }}>{forHerProduct.productName}</p>
                          <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>
                            Type: {forHerProduct.productType}
                          </p>
                          <p style={{ margin: '4px 0', fontSize: '14px', color: '#111827' }}>
                            Price: RS.{forHerProduct.productPrice}
                          </p>
                          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <button
                              type="submit"
                              style={{
                                background: '#111827',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 18px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                              }}
                            >
                              Add to Gifts for Her
                            </button>
                            <button
                              type="button"
                              onClick={() => setForHerProduct(null)}
                              style={{
                                background: '#f3f4f6',
                                color: '#111827',
                                border: '1px solid #D1D5DB',
                                padding: '10px 18px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                cursor: 'pointer',
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Optional: Could add a list of all “Gifts for Her” items here if needed */}
                </div>
              </div>


              {/* Hero Slider Tab */}
              <div
                className="heroSliderTab"
                id="heroSliderTab"
                style={{
                  display: 'none',
                  margin: 0,

                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  color: '#111827',
                }}
              >
                <div
                  style={{

                    margin: 'auto',
                    background: '#ffffff',

                  }}
                >
                  <h3 style={{ marginTop: 0, fontSize: '22px', fontWeight: 600 }}>
                    {editingSlide ? 'Edit Hero Slide' : 'Add Hero Slide'}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                    Upload images on{' '}
                    <a
                      href="https://imgbb.com/"
                      target="_blank"
                      style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
                    >
                      imgbb
                    </a>{' '}
                    and paste the URL below.
                  </p>

                  {/* Hero Slide Form */}
                  <form id="heroSliderForm" onSubmit={handleHeroSliderSubmit} style={{ marginBottom: '40px' }}>
                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                        Slide Title
                      </label>
                      <input
                        type="text"
                        name="slideTitle"
                        id="slideTitle"
                        placeholder="Slide Title.."
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                        Slide Description
                      </label>
                      <textarea
                        name="slideDescription"
                        id="slideDescription"
                        placeholder="Description.."
                        rows="5"
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '14px',
                          resize: 'vertical',
                          lineHeight: 1.6,
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                        Slide Image Source
                      </label>
                      <input
                        type="text"
                        name="slideImage"
                        id="slideImage"
                        placeholder="src.."
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        type="submit"
                        className="primary-button"
                        style={{
                          background: '#111827',
                          color: '#ffffff',
                          border: 'none',
                          padding: '10px 18px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        {editingSlide ? 'Update Slide' : 'Add Slide'}
                      </button>
                      {editingSlide && (
                        <button
                          type="button"
                          className="primary-button"
                          onClick={() => {
                            setEditingSlide(null);
                            document.getElementById('heroSliderForm').reset();
                            showTab('heroSliderTab');
                          }}
                          style={{
                            background: '#f3f4f6',
                            color: '#111827',
                            border: '1px solid #D1D5DB',
                            padding: '10px 18px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Current Slides */}
                  <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Current Slides</h3>
                  {heroSlides.length === 0 ? (
                    <p>No slides added yet</p>
                  ) : (
                    <div
                      className="slide-list"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '24px',
                      }}
                    >
                      {heroSlides.map((slide) => (
                        <div
                          key={slide.id}
                          className="slide-card"
                          style={{
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            background: '#f9fafb',
                          }}
                        >
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="Slide-image"
                            style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                          />
                          <div style={{ padding: '12px' }}>
                            <p style={{ margin: 0, fontWeight: 600 }}>{slide.title}</p>
                            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>
                              Description: {slide.description}
                            </p>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                              <button
                                className="classic-button"
                                onClick={() => handleEditSlide(slide)}
                                style={{
                                  background: '#f3f4f6',
                                  border: '1px solid #D1D5DB',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="classic-button"
                                onClick={() => handleDeleteSlide(slide.id)}
                                style={{
                                  background: '#fee2e2',
                                  border: '1px solid #FECACA',
                                  color: '#991b1b',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>


              {/* Sale Section Tab */}

              <div
                className="saleSectionTab"
                id="saleSectionTab"
                style={{
                  display: 'none',
                  margin: 0,

                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  color: '#111827',
                }}
              >
                <div
                  style={{
                    margin: 'auto',
                    background: '#ffffff',

                  }}
                >
                  <h3 style={{ marginTop: 0, fontSize: '22px', fontWeight: 600 }}>
                    {editingSaleSection ? 'Edit Sale Section' : 'Add Sale Section'}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                    Upload images on{' '}
                    <a
                      href="https://imgbb.com/"
                      target="_blank"
                      style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
                    >
                      imgbb
                    </a>{' '}
                    and paste the URL below.
                  </p>

                  {/* Sale Section Form */}
                  <form id="saleSectionForm" onSubmit={handleSaleSectionSubmit} style={{ marginBottom: '40px' }}>
                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                        Sale Heading
                      </label>
                      <input
                        type="text"
                        name="saleHeading"
                        id="saleHeading"
                        placeholder="Sale Heading.."
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                        Sale Subheading
                      </label>
                      <textarea
                        name="saleSubheading"
                        id="saleSubheading"
                        placeholder="Subheading.."
                        rows="5"
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '14px',
                          resize: 'vertical',
                          lineHeight: 1.6,
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                        Sale Image Source
                      </label>
                      <input
                        type="text"
                        name="saleImage"
                        id="saleImage"
                        placeholder="src.."
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        type="submit"
                        className="primary-button"
                        style={{
                          background: '#111827',
                          color: '#ffffff',
                          border: 'none',
                          padding: '10px 18px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        {editingSaleSection ? 'Update Sale Section' : 'Add Sale Section'}
                      </button>
                      {editingSaleSection && (
                        <button
                          type="button"
                          className="primary-button"
                          onClick={() => {
                            setEditingSaleSection(null);
                            document.getElementById('saleSectionForm').reset();
                            showTab('saleSectionTab');
                          }}
                          style={{
                            background: '#f3f4f6',
                            color: '#111827',
                            border: '1px solid #D1D5DB',
                            padding: '10px 18px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Current Sale Sections */}
                  <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Current Sale Sections</h3>
                  {saleSections.length === 0 ? (
                    <p>No sale sections added yet</p>
                  ) : (
                    <div
                      className="sale-list"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '24px',
                      }}
                    >
                      {saleSections.map((sale) => (
                        <div
                          key={sale.id}
                          className="sale-card"
                          style={{
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            background: '#f9fafb',
                          }}
                        >
                          <img
                            src={sale.image}
                            alt={sale.heading}
                            className="Sale-image"
                            style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                          />
                          <div style={{ padding: '12px' }}>
                            <p style={{ margin: 0, fontWeight: 600 }}>{sale.heading}</p>
                            <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>
                              Subheading: {sale.subheading}
                            </p>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                              <button
                                className="classic-button"
                                onClick={() => handleEditSaleSection(sale)}
                                style={{
                                  background: '#f3f4f6',
                                  border: '1px solid #D1D5DB',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="classic-button"
                                onClick={() => handleDeleteSaleSection(sale.id)}
                                style={{
                                  background: '#fee2e2',
                                  border: '1px solid #FECACA',
                                  color: '#991b1b',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>


              {/* Banner Section Tab */}

              <div
                className="bannerSectionTab"
                id="bannerSectionTab"
                style={{
                  display: 'none',
                  margin: 0,

                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  color: '#111827',
                }}
              >
                <div
                  style={{

                    margin: 'auto',
                    background: '#ffffff',

                  }}
                >
                  <h3 style={{ marginTop: 0, fontSize: '22px', fontWeight: 600 }}>
                    {editingBannerSection ? 'Edit Banner Section' : 'Add Banner Section'}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                    Upload images on{' '}
                    <a
                      href="https://imgbb.com/"
                      target="_blank"
                      style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
                    >
                      imgbb
                    </a>{' '}
                    and paste the URL below.
                  </p>

                  {/* Banner Section Form */}
                  <form
                    id="bannerSectionForm"
                    onSubmit={handleBannerSectionSubmit}
                    style={{ marginBottom: '40px' }}
                  >
                    <div style={{ marginBottom: '24px' }}>
                      <label
                        style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        Banner Image Source
                      </label>
                      <input
                        type="text"
                        name="bannerImage"
                        id="bannerImage"
                        placeholder="src.."
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        type="submit"
                        className="primary-button"
                        style={{
                          background: '#111827',
                          color: '#ffffff',
                          border: 'none',
                          padding: '10px 18px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        {editingBannerSection ? 'Update Banner Section' : 'Add Banner Section'}
                      </button>
                      {editingBannerSection && (
                        <button
                          type="button"
                          className="primary-button"
                          onClick={() => {
                            setEditingBannerSection(null);
                            document.getElementById('bannerSectionForm').reset();
                            showTab('bannerSectionTab');
                          }}
                          style={{
                            background: '#f3f4f6',
                            color: '#111827',
                            border: '1px solid #D1D5DB',
                            padding: '10px 18px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Current Banner Sections */}
                  <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>
                    Current Banner Sections
                  </h3>
                  {bannerSections.length === 0 ? (
                    <p>No banner sections added yet</p>
                  ) : (
                    <div
                      className="banner-list"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '24px',
                      }}
                    >
                      {bannerSections.map((banner) => (
                        <div
                          key={banner.id}
                          className="banner-card"
                          style={{
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            background: '#f9fafb',
                          }}
                        >
                          <img
                            src={banner.image}
                            alt="Banner"
                            className="Banner-image"
                            style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                          />
                          <div style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                            <button
                              className="classic-button"
                              onClick={() => handleEditBannerSection(banner)}
                              style={{
                                background: '#f3f4f6',
                                border: '1px solid #D1D5DB',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                cursor: 'pointer',
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="classic-button"
                              onClick={() => handleDeleteBannerSection(banner.id)}
                              style={{
                                background: '#fee2e2',
                                border: '1px solid #FECACA',
                                color: '#991b1b',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                cursor: 'pointer',
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default AdminPage;