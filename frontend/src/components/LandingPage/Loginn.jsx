import React, { useRef, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Loginn() {
  const containerRef = useRef(null);
  const registerBtnRef = useRef(null);
  const loginBtnRef = useRef(null);
  const navigate = useNavigate();

  // states for signin form
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // states for signup form
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpAddress, setSignUpAddress] = useState("");
  const [signUpTypeOfManufacturer, setSignUpTypeOfManufacturer] = useState("");

  useEffect(() => {
    const container = containerRef.current;
    const registerBtn = registerBtnRef.current;
    const loginBtn = loginBtnRef.current;

    if (!container || !registerBtn || !loginBtn) return;

    const addActiveClass = () => container.classList.add("active");
    const removeActiveClass = () => container.classList.remove("active");

    registerBtn.addEventListener("click", addActiveClass);
    loginBtn.addEventListener("click", removeActiveClass);

    return () => {
      registerBtn.removeEventListener("click", addActiveClass);
      loginBtn.removeEventListener("click", removeActiveClass);
    };
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const FormData = {
        email: signInEmail,
        password: signInPassword,
      };
      console.log("form data", FormData);
      const response = await axios.post(
        `http://localhost:3000/api/login`,
        {
          email: signInEmail,
          password: signInPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials:true
        }
      );
      if (response.status === 200) {
        toast.success("User logged in successfully");
        setSignInEmail("");
        setSignInPassword("");
        navigate("/manufacturer/dashboard");
      } else if (response.status === 401) {
        toast.error("Invalid credentials");
      } else {
        toast.error("User not found");
      }
    } catch (error) {
      console.error("Error during signin:", error);
      toast.error("Internal Server Error");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        email: signUpEmail,
        password: signUpPassword,
        phone_number: signUpPhone,
        address: signUpAddress,
        manufacturer_type: signUpTypeOfManufacturer,
      };
      console.log("form data", formData);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/signup`,
        {
          email: signUpEmail,
          password: signUpPassword,
          phone_number: signUpPhone,
          address: signUpAddress,
          manufacturer_type: signUpTypeOfManufacturer,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      toast.success("Manufacturer created successfully");
      setSignUpEmail("");
      setSignUpPassword("");
      setSignUpPhone("");
      setSignUpAddress("");
      setSignUpTypeOfManufacturer("");
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("Internal Server Error");
    }
  };

  return (
    <div className="container logiin" ref={containerRef}>
      {/* Sign In Form */}
      <div className="form-container sign-in">
        <form onSubmit={handleSignIn}>
          <h1 className="text-black text-2xl font-bold">Sign In</h1>
          <div className="social-icons">
            <NavLink to="#" className="icon">
              <i className="fa-brands fa-google-plus-g"></i>
            </NavLink>
            <NavLink to="#" className="icon">
              <i className="fa-brands fa-facebook-f"></i>
            </NavLink>
            <NavLink to="#" className="icon">
              <i className="fa-brands fa-github"></i>
            </NavLink>
            <NavLink to="#" className="icon">
              <i className="fa-brands fa-linkedin-in"></i>
            </NavLink>
          </div>
          <span>or use your email password</span>
          <input
            type="email"
            placeholder="Email"
            value={signInEmail}
            onChange={(e) => setSignInEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={signInPassword}
            onChange={(e) => setSignInPassword(e.target.value)}
            required
          />
          <NavLink to="#">Forget Your Password?</NavLink>
          <button type="submit">Sign In</button>
        </form>
      </div>

      {/* Sign Up Form */}
      <div className="form-container sign-up">
        <form onSubmit={handleSignUp}>
          <h1>Sign Up</h1>
          <div className="social-icons">
            <NavLink to="#" className="icon">
              <i className="fa-brands fa-google-plus-g"></i>
            </NavLink>
            <NavLink to="#" className="icon">
              <i className="fa-brands fa-facebook-f"></i>
            </NavLink>
            <NavLink to="#" className="icon">
              <i className="fa-brands fa-github"></i>
            </NavLink>
            <NavLink to="#" className="icon">
              <i className="fa-brands fa-linkedin-in"></i>
            </NavLink>
          </div>
          <span>or use your email and password</span>

          <input
            type="email"
            placeholder="Email"
            value={signUpEmail}
            onChange={(e) => setSignUpEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={signUpPassword}
            onChange={(e) => setSignUpPassword(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={signUpPhone}
            onChange={(e) => setSignUpPhone(e.target.value)}
            minLength={10}
            required
          />

          <input
            type="text"
            placeholder="Address"
            value={signUpAddress}
            onChange={(e) => setSignUpAddress(e.target.value)}
            required
          />

          <select
            value={signUpTypeOfManufacturer}
            className="bg-white border border-orange-200 w-[19rem] mt-2 p-1 mb-1 text-black"
            onChange={(e) => setSignUpTypeOfManufacturer(e.target.value)}
            required
          >
            <option value="">Select Manufacturer Type</option>
            <option value="Clothing">Clothing</option>
            <option value="Furniture">Furniture</option>
            <option value="Electronics">Electronics</option>
            <option value="Food">Food</option>
            <option value="Toys">Toys</option>
            <option value="Cosmetics">Cosmetics</option>
            <option value="Sports Equipment">Sports Equipment</option>
          </select>

          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Toggle Container */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1 className="text-xl">Welcome Back!</h1>
            <p className="text-black">
              Enter your personal details to use all of the site’s features
            </p>
            <button className="text-black" id="login" ref={loginBtnRef}>
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1 className="text-xl">Don't Have an Account?</h1>
            <p className="text-black">
              Register with your personal details to use all of the site’s
              features
            </p>
            <button className="border-2 border-red-800" id="register" ref={registerBtnRef}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginn;
