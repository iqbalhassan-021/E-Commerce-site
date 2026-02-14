import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const NewAlerts = () => {
  const [newAlert, setNewAlert] = useState('');

  useEffect(() => {
    const fetchLatestMessage = async () => {
      try {
        const db = getFirestore();
        const msgCollection = collection(db, 'floatingMessages');
        const snapshot = await getDocs(msgCollection);

        if (!snapshot.empty) {
          const messages = snapshot.docs
            .map(doc => doc.data())
            .filter(msg => msg.createdAt) // Ensure createdAt exists
            .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate()); // Latest first

          if (messages.length > 0) {
            setNewAlert(messages[0].message || '');
          }
        }
      } catch (err) {
        console.error('❌ Error fetching floating message:', err);
      }
    };

    fetchLatestMessage();
  }, []);

  return (
    <div className="new-alert">
      <div className="news-ticker">
        <span className="news">
          {newAlert
            ? newAlert.toUpperCase()
            : 'NEW ARRIVALS · NEW ARRIVALS · NEW ARRIVALS · NEW ARRIVALS'}
        </span>
      </div>
    </div>
  );
};

export default NewAlerts;
