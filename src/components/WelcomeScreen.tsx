// src/components/WelcomeScreen.tsx
import React, { useState, useEffect } from 'react';
import './WelcomeScreen.css';

const WelcomeScreen: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [neverShowAgain, setNeverShowAgain] = useState(false);

  useEffect(() => {
    const neverShow = localStorage.getItem('neverShowWelcomeScreen');
    if (neverShow === 'true') {
      setShowWelcome(false);
    }
  }, []);

  const handleClose = () => {
    setShowWelcome(false);
  };

  const handleNeverShowAgain = () => {
    setNeverShowAgain(true);
    localStorage.setItem('neverShowWelcomeScreen', 'true');
    setShowWelcome(false);
  };

  if (!showWelcome) return null;

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <img src="assets/intro.png" alt="Game Art" />
        <p>Hordes of spiders are attacking your land. 
        You have 10000 of gold to hire 3 types of defenders: archers, wizards and shieldwielders. 
        Choose your warriors and their positions wisely. Your goal is to kill 2000 spiders. Try to kill as many spiders as you can.</p>
        <div className="button-container">
          <button onClick={handleClose}>Close</button>
          <button onClick={handleNeverShowAgain}>Don't show again</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
