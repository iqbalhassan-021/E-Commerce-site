import React from 'react';

const ShippingEmail = ({ orderData, storeDetails }) => {
  const { customer, cartItems, pricing, payment, shipping } = orderData;
  const currentYear = new Date().getFullYear();

  const styles = {
    body: { backgroundColor: '#f6f6f7', padding: '24px 0', fontFamily: 'sans-serif' },
    container: { backgroundColor: '#ffffff', borderRadius: '8px', width: '600px', margin: '0 auto', overflow: 'hidden', border: '1px solid #e5e7eb' },
    section: { padding: '24px 32px' },
    divider: { borderTop: '1px solid #e5e7eb' },
    textMuted: { color: '#6b7280', fontSize: '14px' },
  };

  return (
    <div style={styles.body}>
      <table style={styles.container} cellPadding="0" cellSpacing="0">
        <tbody>

          {/* Header */}
          <tr>
            <td style={{ textAlign: 'center', padding: '32px' }}>
              <img
                src={storeDetails?.storeLogo}
                alt="Store Logo"
                width="200"
                height="50"
                style={{ objectFit: 'contain' }}
              />
              <h1 style={{ fontSize: '24px', marginTop: '16px' }}>
                Thanks for your order, {customer.firstName}!
              </h1>
              <p style={styles.textMuted}>
                Order Date: {new Date().toLocaleDateString()}
              </p>
            </td>
          </tr>

          <tr><td style={styles.divider} /></tr>

          {/* Items */}
          <tr>
            <td style={styles.section}>
              <table width="100%">
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td width="80" style={{ padding: '12px 0' }}>
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          width="64"
                          height="64"
                          style={{
                            objectFit: 'cover',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                          }}
                        />
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <p style={{ margin: 0, fontWeight: 600 }}>
                          {item.productName}
                        </p>
                        <table width="100%" style={{ marginTop: '6px' }}>
                          <tbody>
                            <tr>
                              <td style={styles.textMuted}>
                                Qty: {item.quantity}
                              </td>
                                 <td style={styles.textMuted}>
                                Size: {item.productSize}
                              </td>
                              <td align="right" style={{ fontWeight: 500 }}>
                                Rs. {item.productPrice}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>

          <tr><td style={styles.divider} /></tr>

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
                  <tr style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    <td style={{ paddingTop: '12px' }}>Total</td>
                    <td align="right" style={{ paddingTop: '12px' }}>
                      Rs. {pricing.total}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr><td style={styles.divider} /></tr>

          {/* Shipping & Tracking */}
          <tr>
            <td style={styles.section}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>
                Shipping Information
              </h3>

              <table width="100%" style={{ fontSize: '14px' }}>
                <tbody>
                  <tr>
                    <td style={styles.textMuted}>Shipping Partner</td>
                    <td align="right" style={{ fontWeight: 500 }}>
                      {shipping?.partner || '—'}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.textMuted}>Tracking Number</td>
                    <td align="right" style={{ fontWeight: 500 }}>
                      {shipping?.trackingNumber || 'Will be shared soon'}
                    </td>
                  </tr>
                </tbody>
              </table>

              {shipping?.deliveryNote && (
                <p style={{ marginTop: '12px', color: '#374151', lineHeight: '1.6' }}>
                  <strong>Delivery Note:</strong><br />
                  {shipping.deliveryNote}
                </p>
              )}
            </td>
          </tr>

          <tr><td style={styles.divider} /></tr>

          {/* Address */}
          <tr>
            <td style={styles.section}>
              <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>
                Shipping Address
              </h3>
              <p style={{ ...styles.textMuted, lineHeight: '1.6', color: '#374151' }}>
                {customer.firstName} {customer.lastName}<br />
                {customer.street}, {customer.address2}<br />
                {customer.city}, {customer.region} {customer.postalCode}<br />
                {customer.phone}
              </p>
            </td>
          </tr>

          {/* Footer */}
          <tr>
            <td style={{ ...styles.section, backgroundColor: '#f9fafb', textAlign: 'center' }}>
              <p style={styles.textMuted}>
                Questions? Contact us at {storeDetails.email}
              </p>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '12px' }}>
                © {currentYear} {storeDetails?.storeName}
              </p>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  );
};

export default ShippingEmail;
