import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import "./App.css";
import Login from "@/components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Accordionn from "./components/Accordionn";
import Profile from "./components/Profile";
import ChatBox from "./components/Chatroom/ChatBox";
import AddPost from "./components/AddPost";
import ManufacturerSignup from "./components/ManufacturerSignup";
import ManufacturerLogin from "./components/ManufacturerLogin";
import Seller from "./components/Seller";
import InventoryDashboard from "./components/InventoryDashboard";
// import About from "./components/LandingPage/About"
// import Contact from "./components/LandingPage/Contact"
// import Footer from "./components/LandingPage/Footer"
// import Home from "./components/LandingPage/Home"
// import Navbar from "./components/LandingPage/Navbar"
// import Testimonial from "./components/LandingPage/Testimonial"
// import Work from "./components/LandingPage/Work"

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route
          path="/"
          element={
            <>
              <Home /> <About /> <Work /> <Testimonial /> <Contact />
            </>
          }
        /> */}
        {/* <Route path="/about" element={<About />} />
        <Route path="/work" element={<Work />} />
        <Route path="/testimonials" element={<Testimonial />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} /> */}

        <Route path="/" element={<Login />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/signup" element={<Signup />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route
          path="/dashboard/reads"
          element={
            <Dashboard>
              <InventoryDashboard />
            </Dashboard>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <Dashboard>
              <Profile />
            </Dashboard>
          }
        />
        <Route
          path="/dashboard/chat"
          element={
            <Dashboard>
              <ChatBox />
            </Dashboard>
          }
        />
        <Route
          path="/dashboard/add"
          element={
            <Dashboard>
              <AddPost />
            </Dashboard>
          }
        />
        <Route path="/manufacturer/login" element={<ManufacturerLogin />} />
        <Route path="/seller/signup" element={<Seller />} />
        <Route path="/manufacturer/signup" element={<ManufacturerSignup />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
