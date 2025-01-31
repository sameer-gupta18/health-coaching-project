import React, { useState, useEffect } from "react";
import NavMargin from "../../components/NavMargin";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {} from "./webinarregistration.css";
import axios from "axios";
import Header from "../../components/Header/Header";
import { Resend } from "resend";
import Email from "./Email";
import Footer from "../../components/Footer/Footer";
import convertDate from "../../common_functions/convertDate";
import convertTime from "../../common_functions/convertTime";
function WebinarRegistration() {
  let { state } = useLocation();
  let navigate = useNavigate();
  let [userName, setUserName] = useState();
  let [userEmail, setUserEmail] = useState();
  let [userPhone, setUserPhone] = useState();
  let [userDescription, setUserDescription] = useState();
  let [disable, setDisabled] = useState(false);

  const webinar = state ? state.webinar : null;
  let convertToFormat = (string) => {
    return string.toLowerCase().trim().replace(" ", "-");
  };

  function convertToTime(string) {
    return string < 10 ? `0${string.toString()}` : string.toString();
  }
  const resend = new Resend("re_123456789");
  let sendEmail = async (emailId) => {
    const data = await resend.emails.send({
      from: "prakrutibyrama@noreply.com",
      to: emailId,
      subject: `${webinar.name} | ${userName} - Confirmation`,
      react: <Email webinar={webinar} participantName={userName} />,
    });
  };
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

    await axios
      .put(`http://localhost:3001/webinars/${webinar.id}`, updatedWebinar)
      .then(() => {
        // console.log("Participant added successfully:", response.data);
        sendEmail(userEmail);
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
  let paymentGateway = () => {
    // registerParticipant();
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
                        setUserName(e.target.value);
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
