import React from 'react'
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="error-404">
        <img src='/assets/images/404 Error-pana.png' alt='error 404'/>
      <h1>Oops! Page not found</h1>
      <p>The page you requested is unavailable.</p>
      <Link to="/" className=''>Go back to home page</Link>
    </div>
  )
}
export default ErrorPage;