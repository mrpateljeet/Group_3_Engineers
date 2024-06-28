import React from 'react';
import './HomePage.css';
import logo from '../images/budget_background.png';
import backgroundVideo from '../images/gif_background.mp4'; // Ensure this video is in the src/images directory

const Homepage = () => {
  return (
    <div className="Homepage">
      <div className="background-video">
        <video autoPlay muted loop className="background-video-element">
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <header className="Homepage-header">
        <div className="logo">
          <img src={logo} alt="Budget Minder Logo" />
          <span className="logo-text">Budget Minder</span>
        </div>
        <nav className="navbar">
          <ul>
            <li><a href="#forecast">Forecast</a></li>
            <li><a href="#finances">Finances</a></li>
            <li><a href="#savings">Savings</a></li>
          </ul>
        </nav>
        <a href="/register" className="get-started">Get Started</a>
      </header>
      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Smart Budgeting</h1>
            <p>Take control of your finances, smash your savings goals, and secure a brighter financial future with Budget Minder!</p>
            <button className="join-now">Join Now</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Homepage;
