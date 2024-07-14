import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Navbar from '../components/navBar';
import Footer from '../components/footer';

const BlogPage = () => {
  
  const [blogs, setblogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const dataCollection = collection(db, 'blogs');
      try {
        const querySnapshot = await getDocs(dataCollection);
        const blogsList = querySnapshot.docs.map(doc => doc.data());
        setblogs(blogsList);
      } catch (error) {
        console.error("Error retrieving product data: ", error);
      }
    };
    fetchData();
  }, []);




  return (
    <>
        <div className='sticky'>
            <Navbar/>
        </div>
    <div className="blog-section">
      <div className="cover">
        <div className="blogs">
          {blogs.length === 0?(
            <h2>No blogs are posted yet...</h2>
          ) : (
            blogs.map((blogs) => (
            <div className="the-blog">
            <h1>
              {blogs.blogHeading}
            </h1>

            <p>Auther : Admin</p>

            <br />
            <img src={blogs.blogImage} alt="blog-image" />
            <p>
              {blogs.blogContent}
            </p>
          </div>
          )))}

        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default BlogPage;
