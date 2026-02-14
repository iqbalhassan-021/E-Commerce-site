import React from 'react';

const OwnerEmailTemplate = ({ orderData }) => {
  const { customer, cartItems, pricing, payment } = orderData;
  const orderDate = new Date().toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const styles = {
    body: { backgroundColor: '#f6f6f7', padding: '24px 0', fontFamily: 'sans-serif', color: '#111827' },
    container: { backgroundColor: '#ffffff', borderRadius: '8px', width: '600px', margin: '0 auto', overflow: 'hidden', border: '1px solid #e5e7eb' },
    section: { padding: '24px 32px' },
    divider: { borderTop: '1px solid #e5e7eb' },
    label: { color: '#6b7280', fontSize: '14px', width: '120px' },
    cell: { fontSize: '14px', padding: '4px 0' },
    th: { textAlign: 'left', paddingBottom: '8px', fontSize: '13px', color: '#6b7280', fontWeight: 'normal' }
  };

  return (
    <div style={styles.body}>
      <table style={styles.container} cellPadding="0" cellSpacing="0">
        <tbody>
          {/* Header */}
          <tr>
            <td style={styles.section}>
              <h1 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: '600' }}>New order received</h1>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                Order Date: {orderDate}
              </p>
            </td>
          </tr>

          <tr><td style={styles.divider}></td></tr>

          {/* Customer Details */}
          <tr>
            <td style={styles.section}>
              <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '600' }}>Customer details</h3>
              <table width="100%">
                <tbody>
                  <tr>
                    <td style={styles.label}>Name</td>
                    <td style={styles.cell}>{customer.firstName} {customer.lastName}</td>
                  </tr>
                  <tr>
                    <td style={styles.label}>Email</td>
                    <td style={styles.cell}>{customer.email}</td>
                  </tr>
                  <tr>
                    <td style={styles.label}>Phone</td>
                    <td style={styles.cell}>{customer.phone}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr><td style={styles.divider}></td></tr>
 {/* Order Items */}
          <tr>
            <td style={styles.section}>
              <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '600' }}>Order items</h3>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <thead>
                  <tr>
                    <th style={styles.th}>Item</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Qty</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                {cartItems.map((item, index) => (
  <tr key={index} style={{ borderTop: '1px solid #e5e7eb' }}>
    {/* Product Image */}
    <td style={{ padding: '12px', width: '64px' }}>
      <img 
        src={item.productImage} 
        alt={item.productName} 
        width="64" 
        height="64" 
        style={{ objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }}
      />
    </td>

    {/* Product Name */}
    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>
      {item.productName}
    </td>

    {/* Quantity */}
    <td align="center" style={{ padding: '12px', fontSize: '14px' }}>
      {item.quantity}
    </td>
      <td align="center" style={{ padding: '12px', fontSize: '14px' }}>
      {item.productSize}
    </td>

    {/* Price */}
    <td align="right" style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>
      Rs. {item.productPrice}
    </td>
  </tr>
))}

                </tbody>
              </table>
            </td>
          </tr>

          {/* Shipping Address */}
          <tr>
            <td style={styles.section}>
              <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '600' }}>Shipping address</h3>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                {customer.firstName} {customer.lastName}<br />
                {customer.street}, {customer.address2}<br />
                {customer.city}, {customer.region} {customer.postalCode}<br />
                Pakistan
              </p>
            </td>
          </tr>

          <tr><td style={styles.divider}></td></tr>

         

          {/* Totals */}
          <tr>
            <td style={styles.section}>
              <table width="100%" style={{ fontSize: '14px' }}>
                <tbody>
                  <tr>
                    <td>Subtotal</td>
                    <td align="right">Rs. {pricing.subtotal}</td>
                  </tr>
                  <tr>
                    <td>Shipping</td>
                    <td align="right">Rs. {pricing.shipping}</td>
                  </tr>
                  <tr>
                    <td style={{ paddingTop: '12px', fontWeight: '600' }}>Total</td>
                    <td align="right" style={{ paddingTop: '12px', fontWeight: '600' }}>Rs. {pricing.total}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr><td style={styles.divider}></td></tr>
          {/* Footer */}
          <tr>
            <td style={{ padding: '20px 32px', backgroundColor: '#f9fafb', fontSize: '12px', color: '#6b7280' }}>
              This is an automated notification for store administrators.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OwnerEmailTemplate;