import React, { useState } from "react";
import {} from "./contactus.css";
import Header from "../../components/Header/Header";
import { IoMdPin } from "react-icons/io";
import { HiOutlineMail } from "react-icons/hi";
import { FaPhone } from "react-icons/fa6";
import NavMargin from "../../components/NavMargin";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
function Contact() {
  let [disabled, setDisabled] = useState(false);
  let [name, setName] = useState("");
  let [phone, setPhone] = useState("");
  let [request, setRequest] = useState("");

  let navigate = useNavigate();

  let convertToFormat = (string) => {
    return string.toLowerCase().trim().replace(" ", "-");
  };

  function convertTime(string) {
    return string < 10 ? `0${string.toString()}` : string.toString();
  }
  let submitContactFormData = async (event) => {
    event.preventDefault();

    setDisabled(true);
    const today = new Date();

    const contactRequest = {
      time_stamp: `${convertTime(today.getDate())}/${convertTime(
        today.getMonth() + 1
      )}/${today.getFullYear()} | ${convertTime(
        today.getHours()
      )}:${convertTime(today.getMinutes())}`,
      name: name,
      phone_no: phone,
      description: request,
    };

    await axios 
      .post("http://localhost:3001/contacts", contactRequest)
      .then(() => {
        navigate(`/contact-me/confirmation/${convertToFormat(name)}`, {
          state: { contactRequest },
        });
      })
      .catch((error) => {
        console.log("Error updating participants:", error);
        navigate(`/contact-me/fail/${convertToFormat(name)}`, {
          state: { contactRequest, error },
        });
      });
    await axios
      .post("http://localhost:3001/notifications", {
        time_stamp: `${convertTime(today.getDate())}/${convertTime(
          today.getMonth() + 1
        )}/${today.getFullYear()} | ${convertTime(
          today.getHours()
        )}:${convertTime(today.getMinutes())}`,
        title: "New Contact Request",
        description: `${name} (${phone}) wants to contact you. Their query is: ${request}`,
        route: "/admin/client-queries",
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <NavMargin />
      <div className="contact-us-container">
        <div className="contact-us-header-container">
          <div className="webinars-header">
            <h1>Contact Me!</h1>
            <hr />
          </div>
        </div>
        <div className="main-contact-us-container">
          <div className="contact-info">
            <ul>
              <li>
                <span>
                  <HiOutlineMail />{" "}
                </span>
                xxxxx@gmail.com
              </li>
              <li>
                <span>
                  <FaPhone />
                </span>
                +91 99716XXXXX
              </li>
              <li>
                <span>
                  <IoMdPin />
                </span>
                XX Street, Sector XX, XXXX 
              </li>
            </ul>
            <div className="google-maps-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.842706158552!2d77.37762647455244!3d28.514379789437967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce89d16aaaaab%3A0x8a59a3c4f8fcdc3f!2sGenesis%20Global%20School%20%7C%20Best%20Boarding%20School%20in%20Delhi%20NCR!5e0!3m2!1sen!2sin!4v1738778459084!5m2!1sen!2sin"
                width="100%"
                height="100%"
                title="Google Maps Container"
                style={{ border: 0 }}
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                className="google-maps-iframe"
              />
            </div>
          </div>
          <div className="form-container-contact">
            <form onSubmit={submitContactFormData}>
              <div className="text-input">
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  required
                  maxLength={30}
                  disabled={disabled}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div className="text-input">
                <input
                  type="number"
                  required
                  placeholder="Enter Your Phone Number"
                  disabled={disabled}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
              </div>
              <div className="big-text-contact-page">
                <div className="text-input how-we-can-help">
                  <textarea
                    className="text-area-contact"
                    required
                    placeholder="How Can I Help You?"
                    spellCheck={true}
                    maxLength={500}
                    disabled={disabled}
                    onChange={(e) => {
                      setRequest(e.target.value);
                    }}
                  />
                </div>
              </div>
              <input
                type="submit"
                value={"Send Message!"}
                disabled={disabled}
              />
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Contact;
