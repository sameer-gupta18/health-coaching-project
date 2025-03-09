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
      .post("http://localhost:3001/contacts", contactRequest)       //posts/adds an object to the array object of contacts in the DB
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
    await axios                                                     //asynchronously adds an accompnaying notification after adding the data in the contact array object
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22260354.356160913!2d75.71079400312729!
                3d20.649907168032573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4
                fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1741520155798!5m2!1sen!2sin"
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
