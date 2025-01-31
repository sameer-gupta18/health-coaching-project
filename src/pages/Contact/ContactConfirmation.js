import React from "react";
import NavMargin from "../../components/NavMargin";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Error404 from "../Error404";
import { FaCheck } from "react-icons/fa6";
import {} from "../LiveWebinars/webinarconfirmation.css";
import Footer from "../../components/Footer/Footer";
function ContactConfirmation() {
  let { state } = useLocation();
  return (
    <>
      {state ? (
        <>
          <NavMargin />
          <div className="webinar-confirmation-container">
            <FaCheck />
            <h2>Your Query has been forwarded to Rama, {state.contactRequest.name}</h2>
            <p>You Should Be Hearing Back On Your Registered Phone Number Soon!</p>
          </div>
          <Footer/>
        </>
      ) : (
        <Error404 />
      )}
    </>
  );
}

export default ContactConfirmation;
