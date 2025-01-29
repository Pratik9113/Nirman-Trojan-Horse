import React from "react";
import ChooseMeals from "../../Assets/choose-image.png";
import DeliveryMeals from "../../Assets/delivery-image.png";
import { CgScrollV } from "react-icons/cg";
import "./Style.css"

const Work = () => {
  const workInfoData = [
    {
      image: "none",
      title: "Choose Your Furniture",
      text: "Browse our extensive catalog to find the perfect pieces for your space.",
    },
    {
      image: ChooseMeals,
      title: "Set Your Rental Duration",
      text: "Select a rental period that fits your needs, whether it's short-term or long-term.",
    },
    {
      image: DeliveryMeals,
      title: "Quick Delivery and Setup",
      text: "Enjoy fast delivery and professional setup, so you can start using your furniture right away.",
    },
  ];
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Work</p>
        <h1 className="primary-heading">How It Works</h1>
        <p className="primary-text">
        <h4>Convenient Rental Process</h4>
        Experience a seamless rental process designed to make your life easier.
        </p>
      </div>
      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
            {data.image === 'none' ? <CgScrollV className="scrolb" /> : <img src={data.image} alt="" />}
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;
