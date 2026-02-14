import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';


const Celebration = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.5 },
        colors: ['#00FF00', '#FFFFFF'], // green & white
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.5 },
        colors: ['#00FF00', '#FFFFFF'],
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="celebration-overlay">
      <div className="celebration-content">
        <button className="close-btn" onClick={() => setIsVisible(false)}>×</button>
        <img
          src="/assets/images/Special-Offer.png"
          alt="Special Offer"
          className="celebration-image"
        />
      </div>
    </div>
  );
};

export default Celebration;
