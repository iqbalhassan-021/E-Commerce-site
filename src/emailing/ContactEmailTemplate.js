import React from 'react';

const ContactEmailTemplate = ({ formData }) => {
  const { name, email, subject } = formData;
  const submittedDate = new Date().toLocaleDateString('en-PK', {
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
              <h1 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: '600' }}>New contact form submission</h1>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                Submitted on: {submittedDate}
              </p>
            </td>
          </tr>

          <tr><td style={styles.divider}></td></tr>

          {/* Contact Details */}
          <tr>
            <td style={styles.section}>
              <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '600' }}>Contact details</h3>
              <table width="100%">
                <tbody>
                  <tr>
                    <td style={styles.label}>Name</td>
                    <td style={styles.cell}>{name}</td>
                  </tr>
                  <tr>
                    <td style={styles.label}>Email / Phone</td>
                    <td style={styles.cell}>{email}</td>
                  </tr>
                  <tr>
                    <td style={styles.label}>Message</td>
                    <td style={styles.cell}>{subject}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr><td style={styles.divider}></td></tr>

          {/* Footer */}
          <tr>
            <td style={{ padding: '20px 32px', backgroundColor: '#f9fafb', fontSize: '12px', color: '#6b7280' }}>
              This is an automated notification for site administrators.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ContactEmailTemplate;
