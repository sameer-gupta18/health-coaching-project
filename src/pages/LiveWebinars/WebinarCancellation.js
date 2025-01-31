import React from "react";
import { useLocation } from "react-router-dom";
import Error404 from "../Error404";
import NavMargin from "../../components/NavMargin";
import { RxCross2 } from "react-icons/rx";
import {} from "./webinarcancellation.css";
import Footer from "../../components/Footer/Footer";

function WebinarCancellation() {
  let state = useLocation();

  return (
    <>
      {state ? (
        <>
          <NavMargin />
          <div className="webinar-cancellation-container">
            <RxCross2 />
            <h2>Unable to Register You For {state.updatedWebinar.name}</h2>
            <p>{state.error.message}</p>
          </div>
          <Footer/>
        </>
      ) : (
        <>
          <Error404 />
        </>
      )}
    </>
  );
}

export default WebinarCancellation;
