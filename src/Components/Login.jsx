import React, { useRef, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function Login() {
  const containerRef = useRef(null);
  const registerBtnRef = useRef(null);
  const loginBtnRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const container = containerRef.current;
    const registerBtn = registerBtnRef.current;
    const loginBtn = loginBtnRef.current;

    const addActiveClass = () => container.classList.add("active");
    const removeActiveClass = () => container.classList.remove("active");

    registerBtn.addEventListener("click", addActiveClass);
    loginBtn.addEventListener("click", removeActiveClass);

    return () => {
      registerBtn.removeEventListener("click", addActiveClass);
      loginBtn.removeEventListener("click", removeActiveClass);
    };
  }, []);

  const handleSignIn = (e) => {
    e.preventDefault();
    console.log("Sign In - Email:", email, "Password:", password);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    console.log("Sign Up - Email:", email, "Password:", password);
  };

  return (
    <div className="container logiin" ref={containerRef}>
      <div className="form-container sign-in">
        <form onSubmit={handleSignIn}>
          <h1>Sign In</h1>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <NavLink to="#">Forget Your Password?</NavLink>
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button className="hidden" id="login" ref={loginBtnRef}>
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>
              Register with your personal details to use all of site features
            </p>
            <button
              className="hidden"
              id="register"
              ref={registerBtnRef}
              onClick={handleSignUp}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
