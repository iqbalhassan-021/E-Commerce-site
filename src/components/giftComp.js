import React from 'react'
import { Link } from 'react-router-dom'

function giftComp() {
  return (
    <div className='gift-comp'>
        <div className='info-box'>
            <h1 className='gift-title'>Gift Boxes</h1>
            <p className='gift-description'>Explore our exclusive gift collection, perfect for any occasion. Find the ideal present that shows you care.</p>
            <Link to='/Category/Giftbox' className='primary-button'>Shop Now</Link>
        </div>
    </div>
  )
}

export default giftComp