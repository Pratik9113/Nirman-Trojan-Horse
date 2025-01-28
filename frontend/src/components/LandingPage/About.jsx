import React from "react";
import AboutBackground from "../../Assets/about-background.png";
import { BsFillPlayCircleFill } from "react-icons/bs";
import styles from "./Style.css";

const About = () => {
  return (
    <div className="styles.about-section-container">
      <div className="styles.about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="styles.about-section-image-container">
        <img
          className="sofa"
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
      </div>
      <div className="styles.about-section-text-container">
        <h1 className="styles.primary-heading">
          Effortless Selling, Maximum Reach
        </h1>
        <p className="styles.primary-text">
          Manage your raw material inventory, track orders from manufacturers,
          and monitor payments with ease.
        </p>
        <h3>Login as Seller</h3>
        <div className="styles.about-buttons-container">
          <button className="styles.secondary-button">Login</button>
          <button className="styles.watch-video-button">
            <BsFillPlayCircleFill /> Watch Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
