import React from "react";
import { useLocation } from "react-router-dom";
import Error404 from "../Error404";
import NavMargin from "../../components/NavMargin";
import { RxCross2 } from "react-icons/rx";
import {} from "./contactfail.css";
import Footer from "../../components/Footer/Footer";

function ConsultationFail() {
  let state = useLocation();

  return (
    <>
      {state ? (
        <>
          <NavMargin />
          <div className="webinar-cancellation-container">
            <RxCross2 />
            <h2>Your Consultation Query Has Failed. Please Try Again</h2>
            <p>{state.error.message}</p>
          </div>
          <Footer />
        </>
      ) : (
        <>
          <Error404 />
        </>
      )}
    </>
  );
}

export default ConsultationFail;
