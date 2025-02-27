import React, { useState } from "react";
import NavMargin from "../../components/NavMargin";
import { useLocation, useNavigate } from "react-router-dom";
import {} from "./webinarregistration.css";
import axios from "axios";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import convertDate from "../../common_functions/convertDate";
import convertTime from "../../common_functions/convertTime";
function WebinarRegistration() {
  let navigate = useNavigate();
  let [userName, setUserName] = useState();
  let [userEmail, setUserEmail] = useState();
  let [userPhone, setUserPhone] = useState();
  let [userDescription, setUserDescription] = useState();
  let [disable, setDisabled] = useState(false);

  let { state } = useLocation();    //extracts webinar object state from LiveWebinars
  const webinar = state ? state.webinar : null;     //stores the webinar here

  let convertToFormat = (string) => {
    return string.toLowerCase().trim().replace(" ", "-");
  };

  function convertToTime(string) {
    return string < 10 ? `0${string.toString()}` : string.toString();
  }
  let registerParticipant = async (event) => {
    event.preventDefault();
    const today = new Date();
    setDisabled(true);
    const updatedParticipants = [
      ...(webinar?.participants || []),
      {
        name: userName,
        email: userEmail,
        phone_number: userPhone,
        descriptor: userDescription || "",
        time_stamp: `${convertToTime(today.getDate())}/${convertToTime(
          today.getMonth() + 1
        )}/${today.getFullYear()} | ${convertToTime(
          today.getHours()
        )}:${convertToTime(today.getMinutes())}`,
      },
    ];

    const updatedWebinar = {
      ...webinar,
      participants: updatedParticipants,
    };

    //First updates the webinars DB

    await axios
      .put(`http://localhost:3001/webinars/${webinar.id}`, updatedWebinar)
      .then(() => {
        navigate(
          `/live-webinars/register/${webinar.id}/confirmation/${convertToFormat(
            userName
          )}`,
          { state: { updatedWebinar } }
        );
      })
      .catch((error) => {
        console.log("Error updating participants:", error);
        navigate(`/live-webinars/register/${webinar.id}/error404`, {
          state: { updatedWebinar, error },
        });
      });

    //Then updates the notifications column (procedural thinking)

    await axios
      .post("http://localhost:3001/notifications", {
        time_stamp: `${convertToTime(today.getDate())}/${convertToTime(
          today.getMonth() + 1
        )}/${today.getFullYear()} | ${convertToTime(
          today.getHours()
        )}:${convertToTime(today.getMinutes())}`,
        title: `New Webinar Registree`,
        description: `${userName} (${userPhone}) has registered for '${
          webinar.name
        }' to be hosted on ${convertDate(webinar.date, 2)} at ${convertTime(
          webinar.time
        )}`,
        route: "/admin/webinar/view",
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <NavMargin />
      <div className="webinar-registration-page-container">
        {!webinar ? (
          <>
            <div className="webinars-header">
              <h1>Webinar Not Found. Please Go Back To The Webinars List</h1>
              <hr />
            </div>
          </>
        ) : (
          <>
            <Header title={webinar.name} />
            <div className="webinar-registration-container">
              <div className="webinar-registration-form-container">
                <form onSubmit={registerParticipant}>
                  <p>
                    Name:*
                    <input
                      type="text"
                      required
                      maxLength={50}
                      onChange={(e) => {
                        setUserName(e.target.value); //updates the value of the state in real-time with form input
                      }}
                      disabled={disable}
                    />
                  </p>
                  <p>
                    Email:*
                    <input
                      type="email"
                      required
                      maxLength={50}
                      onChange={(e) => {
                        setUserEmail(e.target.value);
                      }}
                      disabled={disable}
                    />
                  </p>
                  <p>
                    Phone Number:*
                    <input
                      type="number"
                      required
                      onChange={(e) => {
                        setUserPhone(e.target.value);
                      }}
                      disabled={disable}
                    />
                  </p>
                  <p className="registration-textarea-title">
                    What are you looking to learn in this session? (Optional)
                  </p>
                  <textarea
                    style={{ resize: "none" }}
                    maxLength={400}
                    onChange={(e) => {
                      setUserDescription(e.target.value);
                    }}
                    disabled={disable}
                  ></textarea>
                  <input
                    type="submit"
                    value={"Register Now"}
                    disabled={disable}
                  />
                </form>
              </div>
              <div className="webinar-registration-image-container">
                <img src={webinar.cover_image} />
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default WebinarRegistration;
