import React from "react";
import NavMargin from "../../components/NavMargin";
import { useLocation} from "react-router-dom";
import Error404 from "../Error404";
import { FaCheck } from "react-icons/fa6";
import {} from "../LiveWebinars/webinarconfirmation.css";
import Footer from "../../components/Footer/Footer";
function ConsultationConfirmation() {
  let { state } = useLocation();
  return (
    <>
      {state ? (
        <>
          <NavMargin />
          <div className="webinar-confirmation-container">
            <FaCheck />
            <h2>
              Your Consultation has been forwarded to Rama,{" "}
              {state.consultationRequest.name}
            </h2>
            <p>
              You Should Be Hearing Back On Your Registered Phone Number/Email
              Soon!
            </p>
          </div>
          <Footer/>
        </>
      ) : (
        <Error404 />
      )}
    </>
  );
}

export default ConsultationConfirmation;
