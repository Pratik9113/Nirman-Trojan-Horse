import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import "./App.css";
import InventoryDashboard from "./components/InventoryDashboard";
import ProducersDashboard from "./components/ProducersDashboard";
import About from "./components/LandingPage/About";
import Contact from "./components/LandingPage/Contact";
import Footer from "./components/LandingPage/Footer";
import Home from "./components/LandingPage/Home";
import Navbar from "./components/LandingPage/Navbar";
import Testimonial from "./components/LandingPage/Testimonial";
import Work from "./components/LandingPage/Work";
import Loginn from "./components/LandingPage/Loginn";
import RetailerDashboard from "./components/RetailerDashboard";
import ShopkeeperDashboard from "./components/ShopkeeperDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home /> <About /> <Work /> <Testimonial /> <Contact /> <Footer />
            </>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/work" element={<Work />} />
        <Route path="/testimonials" element={<Testimonial />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/loginn" element={<Loginn />} />
        <Route
          path="/manufacturer/dashboard"
          element={
            <>
              {" "}
              <Navbar /> <InventoryDashboard />{" "}
            </>
          }
        />
        <Route
          path="/producers/dashboard"
          element={
            <>
              {" "}
              <Navbar />
              <ProducersDashboard />{" "}
            </>
          }
        />
        <Route
          path="/retailer/dashboard"
          element={
            <>
              {" "}
              <Navbar />
              <RetailerDashboard />{" "}
            </>
          }
        />

        <Route
          path="/shopkeeper/dashboard"
          element={
            <>
              {" "}
              <Navbar />
              <ShopkeeperDashboard />{" "}
            </>
          }
        />

        <Route path="*" element={<Loginn />} />
      </Routes>
    </Router>
  );
}

export default App;
