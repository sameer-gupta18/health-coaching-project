import React, { useEffect, useState } from "react";
import {} from "./footer.css";
import footercontent from "./footercontent";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa6";
function Footer() {
  let [webinarsData, setWebinarData] = useState();

  useEffect(() => {
    let webinars = axios.get("http://localhost:3001/webinars");
    webinars.then((res) => {
      setWebinarData(res.data);
    });
  }, []);

  return (
    <>
      <div className="footer-container">
        <div className="footer-container-links">
          {footercontent ? (
            <>
              {footercontent.map((section) => {
                return (
                  <>
                    <div className="footer-section">
                      <h3>{section.title}</h3>
                      <ul>
                        {section.content.map((link) => {
                          return (
                            <li>
                              <Link to={link.link}>{link.name}</Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </>
                );
              })}
              {webinarsData ? (
                <div className="footer-section">
                  <h3>Upcoming Webinars</h3>
                  <ul>
                    {webinarsData.map((webinar) => {
                      return (
                        <li>
                          <Link to="/live-webinars">{webinar.name}</Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <p>No Upcoming Webinars</p>
              )}
            </>
          ) : (
            <p>Loading Footer...</p>
          )}
        </div>
        <div className="footer-socials-container">
          <ul>
            <a href="https://www.instagram.com/prakrutibyrama/" target="_blank" rel='noreferrer'>
              <li>
                <FaInstagram />
              </li>
            </a>
            <a href="https://www.facebook.com">
              <li>
                <FaFacebookF />
              </li>
            </a>
            <a href="https://in.linkedin.com/in/rama-gupta-71ba5b2b1?trk=people-guest_people_search-card" target="_blank">
              <li>
                <FaLinkedin />
              </li>
            </a>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Footer;
