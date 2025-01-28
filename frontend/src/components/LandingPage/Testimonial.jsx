import React from "react";
import ProfilePic from "../../Assets/john-doe-image.png";
import { AiFillStar } from "react-icons/ai";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Style.css"

const Testimonial = () => {
  return (<>
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Testimonial</p>
        <h1 className="primary-heading">What They Are Saying</h1>
        <p className="primary-text">
          Hear from our satisfied customers about their experience with our
          service.
        </p>
      </div>
      <div className="testimonial-section-bottom">
        <img src={ProfilePic} alt="" />
        <p>
          "Renting furniture from "RentWize" was the best decision I made when
          moving for my job. The process was quick, and the quality of the
          furniture exceeded my expectations."
        </p>
        <div className="testimonials-stars-container">
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
        </div>
        <h2>Akshadh</h2>
      </div>
    </div>
    </>
  );
};

export default Testimonial;
