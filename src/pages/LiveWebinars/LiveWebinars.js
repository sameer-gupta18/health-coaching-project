import React, { useEffect, useState } from "react";
import NavMargin from "../../components/NavMargin";
import {} from "./livewebinars.css";
import axios from "axios";
import { FiClock } from "react-icons/fi";
import { IoMdPin } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import convertTime from "../../common_functions/convertTime";
import placeholder from "../../assets/placeholder.png";
import convertDate from "../../common_functions/convertDate";
function LiveWebinars() {
  const navigate = useNavigate();
  let [webinarData, setWebinarData] = useState([]);
  useEffect(() => { 
     axios.get("http://localhost:3001/webinars").then((res) => {
      setWebinarData(res.data);
    });
  }, []);

  // <Route path="/live-webinars/register/:webinarid" element={<WebinarRegistration />}/>
  let convertToRoute = (id) => {                        //outputs the formatted route using the webinar id and route
    return `/live-webinars/register/${id.toString()}`;
  };
  let handleRegister = (webinar) => {
    navigate(convertToRoute(webinar.id), { state: { webinar } });   //passes the webinar object as a state to registration
  };

  return (
    <>
      <NavMargin />
      <div className="live-webinars-container">
        <Header title={"Upcoming Webinars"} />        {/**Passes the title as the parameter */}
        <div className="webinars-container">
          {webinarData.length === 0 ? (
            <>
              <p>No Upcoming Webinars! Stay Tuned</p>
            </>
          ) : (
            webinarData.map((webinar) => {
              return (
                <>
                  <div className="webinar-container">
                    <div className="webinar-content-container">
                      <h1>{webinar.name}</h1>
                      <div className="webinar-tags">
                        <p>{webinar.tags.paid === false ? "Free" : "Paid"}</p>
                        <p>
                          {webinar.tags.offline === false
                            ? "Online"
                            : "Offline"}
                        </p>
                        {webinar.tags.paid === true ? (
                          <p
                            style={{
                              background: "transparent",
                              color: "var(--secondary-one)",
                              fontSize: "1.3vw",
                            }}
                          >
                            INR{webinar.price}
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                      <p className="webinar-description">
                        {webinar.description}
                      </p>
                      <div className="webinar-information-container">
                        <div className="webinar-date-time-container">
                          <p>
                            <span>
                              <FiClock />
                            </span>
                            {convertDate(webinar.date, 2)} |{" "}
                            {convertTime(webinar.time)}
                          </p>
                          <p>
                            <span>
                              <IoMdPin />
                            </span>
                            {webinar.location}
                          </p>
                        </div>
                        <div className="webinar-register-container">
                          <button onClick={() => handleRegister(webinar)}>
                            Register Now
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="webinar-image-container">
                      <img
                        src={
                          webinar.cover_image
                            ? webinar.cover_image
                            : placeholder
                        }
                        alt="cover_image"
                      />
                    </div>
                  </div>
                </>
              );
            })
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LiveWebinars;
