import React, { useState } from "react";
import {} from "./navbar.css";
import { Link } from "react-router-dom";
import logo from '../../assets/logo.png'
function Navbar() {
  var [navBackground, setNavBackground] = useState(window.scrollY === 0);
  window.addEventListener("scroll", () => { //listens for the scroll pixel in the background
    window.scrollY === 0 ? setNavBackground(true) : setNavBackground(false);
  });
  var navbar_style = {
    backdropFilter: navBackground ? "none" : "blur(7px)",
    // background:navBackground?'transparent':'rgba(90, 147, 103, 0.05)',
    boxShadow: navBackground ? "none" : "0px 5px 10px rgba(0, 0, 0, 0.05);",
    background:navBackground?'transparent':'rgba(225,225,203,0.2)',
    position: navBackground ? "absolute" : "fixed",
  };
  return (
    <>
      <div className="navbar-container" style={navbar_style}>
        <div className="navbar">
          <ul>                                                                    {/** Arranging all the routing links in a list */}
            <li>
              <Link to="/" className="navbar-logo-container">                     {/**Link element that routes to '/' upon clicking */}
                <img src={logo} alt="Prakruti Logo" className='navbar-logo'/>     {/** Visual element inside the link */}
              </Link>
            </li>
            <li>
              <Link to="/" className="nav-item-underlined">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about-us" className="nav-item-underlined">               {/**Link that routes to /about-us */}
                About Me
              </Link>
            </li>
            <li>
              <Link to="/live-webinars" className="nav-item-underlined">
                Live Webinars
              </Link>
            </li>
            <li>
            <Link to="/bmi-calculator" className="nav-item-underlined">
                BMI Calculator
              </Link>
            </li>
            <li>
            <Link to="/calorie-tracker" className="nav-item-underlined">
                Calorie Tracker
              </Link>
            </li>
            <li>
            <Link to="/contact-me" className="nav-item-underlined">
                Contact Me
              </Link>
            </li>
            <li className="consultation-nav">
              <Link to="/consultation">Consultation</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
