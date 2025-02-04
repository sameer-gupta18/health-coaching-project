import React, { useEffect, useState } from "react";
import {} from "../dashboard.css";
import NavMargin from "../../components/NavMargin";
import Error404 from "../../pages/Error404";
import verifyMAC from "../macCheck";
import AdminNavBar from "../../components/AdminNavBar/AdminNavBar";
import NotificationColumn from "../../components/NotificationColumn/NotificationColumn";
import axios from "axios";
import {} from "./viewwebinar.css";
import { FiClock } from "react-icons/fi";
import { IoMdPin } from "react-icons/io";
import convertDate from "../../common_functions/convertDate";
import convertTime from "../../common_functions/convertTime";
import { RiPencilFill } from "react-icons/ri";
import { IoMdDownload } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function ViewWebinar() {
  let access = verifyMAC();
  let [webinars, setWebinars] = useState();
  let navigate = useNavigate();
  useEffect(() => {
    axios.get("http://localhost:3001/webinars").then((res) => {
      setWebinars(res.data);
    });
  }, []);
  let deleteWebinar = async (targetId) => {
    try {
      await axios.delete(`http://localhost:3001/webinars/${targetId}`);
      setWebinars(webinars.filter((webinar) => webinar.id !== targetId));
    } catch (error) {
      console.log("Error deleting deleting item");
    }
  };

  let editWebinar = (targetWebinar) => {
    navigate(`/admin/webinar/edit/${targetWebinar.id}`, {
      state: { targetWebinar },
    });
  };

  let exportToCsv = (webinar) => {
    if (webinar.participants.length > 0) {
      const csvRows = [];
      const headers = Object.keys(webinar.participants[0]).join(",");
      csvRows.push(headers);

      webinar.participants.forEach((row) => {
        let values = Object.values(row)
          .map((value) => `"${value}"`)
          .join(",");
        csvRows.push(values);
      });
      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const today = new Date();
      a.download = `${webinar.name}-${today.toISOString()}.csv`;
      a.click();

      URL.revokeObjectURL(url);
    } else {
      alert("There are no participants yet");
    }
  };
  return (
    <>
      {access === null ? (
        <>
          <NavMargin />
          <p>Verifying Security...</p>
        </>
      ) : access ? (
        <>
          <NavMargin />
          <div className="admin-container">
            <AdminNavBar />
            <div className="admin-container-body admin-viewwebinar-container">
              <h1>Webinars List</h1>
              <div className="admin-webinars-container">
                {webinars ? (
                  <>
                    {webinars.map((webinar) => {
                      return (
                        <>
                          <div className="admin-webinar-container">
                            <div className="admin-webinar-header-container">
                              <h2>{webinar.name}</h2>
                              <div className="admin-webinar-header-buttons">
                                <button
                                  onClick={() => {
                                    editWebinar(webinar);
                                  }}
                                >
                                  <RiPencilFill />
                                </button>
                                <button
                                  onClick={() => {
                                    exportToCsv(webinar);
                                  }}
                                >
                                  <IoMdDownload />
                                </button>
                                <button
                                  onClick={() => {
                                    deleteWebinar(webinar.id);
                                  }}
                                >
                                  X
                                </button>
                              </div>
                            </div>
                            <div className="viewwebinar-datetimelocation-container">
                              <div className="viewwebinar-datetime-container">
                                <p>
                                  <FiClock />
                                  {`${convertDate(
                                    webinar.date,
                                    2
                                  )} | ${convertTime(webinar.time)}`}
                                </p>
                              </div>
                              <div className="viewwebinar-location-container">
                                <p>
                                  <IoMdPin />
                                  {webinar.location}
                                </p>
                              </div>
                            </div>
                            <div className="view-webinar-bottom">
                              <h4>Attendees ({webinar.participants.length})</h4>
                              {webinar.participants.length !== 0 ? (
                                <>
                                  <div className="view-webinar-participants">
                                    {webinar.participants.map((participant) => {
                                      return (
                                        <>
                                          <div className="view-webinar-participant">
                                            <p>{participant.name}</p>
                                            <p>{participant.phone_number}</p>
                                            <p>
                                              Registered on{" "}
                                              {convertDate(
                                                participant.time_stamp,
                                                1
                                              )}
                                            </p>
                                          </div>
                                        </>
                                      );
                                    })}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <p className="no-one-registered">
                                    No One Has Registered Till Now
                                  </p>
                                </>
                              )}

                              {webinar.tags.paid ? (
                                <>
                                  <p className="total-earnings-view-webinar">
                                    <span>Total Earnings:</span> INR
                                    {parseInt(webinar.price) *
                                      webinar.participants.length}
                                  </p>
                                </>
                              ) : null}
                              {webinar.tags.offline ? null : (
                                <>
                                  <a href={webinar.link} target="_blank" rel='noreferrer'>
                                    Join Webinar Now
                                  </a>
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </>
                ) : null}
              </div>
            </div>
            <NotificationColumn />
          </div>
        </>
      ) : (
        <>
          <Error404 />
        </>
      )}
    </>
  );
}

export default ViewWebinar;
