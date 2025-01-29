/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { BsCart2 } from "react-icons/bs";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import { useNavigate, NavLink } from "react-router-dom";
import "./Style.css"

const Navbar = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const menuOptions = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "For Sellers", icon: <InfoIcon />, path: "/about" },
    { text: "Contact", icon: <PhoneRoundedIcon />, path: "/contact" },
  ];

  return (
    <nav className="navi">
      {/* Logo */}
      <div className="nav-logo-container">
        <h1 className="logoo">RentWize</h1>
      </div>

      {/* Links for desktop view */}
      <div className="navbar-links-container">
        {menuOptions.map((item) => (
          <NavLink
            key={item.text}
            to={item.path}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            {item.text}
          </NavLink>
        ))}
        <button onClick={() => navigate("/user/login")} className="primary-button">
          Login as User
        </button>
      </div>

      {/* Hamburger Menu for mobile view */}
      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>

      {/* Drawer for mobile menu */}
      <Drawer
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        anchor="right"
        role="navigation"
        aria-label="mobile navigation menu"
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem
                key={item.text}
                disablePadding
                onClick={() => navigate(item.path)}
              >
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/login")}>
                <ListItemIcon>
                  <BsCart2 />
                </ListItemIcon>
                <ListItemText primary="Login as User" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </nav>
  );
};

export default Navbar;
