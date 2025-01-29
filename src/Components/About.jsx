import React from "react";
import AboutBackground from "../Assets/about-background.png";
import sofa from "../Assets/sofa1.jpg"
import { BsFillPlayCircleFill } from "react-icons/bs";

const About = () => {
  return (
    <div className="about-section-container">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="about-section-image-container">
        <img className="sofa" src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
      </div>
      <div className="about-section-text-container">
        <h1 className="primary-heading">
        Effortless Selling, Maximum Reach
        </h1>
        <p className="primary-text">
        Procure your raw material, track orders from retailers, and monitor payments with ease. 
        </p>
          {/* <h3>Login as Seller</h3> */}
        <div className="about-buttons-container">
          <button className="secondary-button">Get Started</button>
          <button className="watch-video-button">
            <BsFillPlayCircleFill /> Watch Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
