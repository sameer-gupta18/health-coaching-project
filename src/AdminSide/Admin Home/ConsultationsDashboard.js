import React, { useEffect, useState } from "react";
import {} from "../dashboard.css";
import NavMargin from "../../components/NavMargin";
import Error404 from "../../pages/Error404";
import verifyMAC from "../macCheck";
import AdminNavBar from "../../components/AdminNavBar/AdminNavBar";
import NotificationColumn from "../../components/NotificationColumn/NotificationColumn";
import axios from "axios";
import convertDate from "../../common_functions/convertDate";
import convertTime from "../../common_functions/convertTime";
import {} from "./consultationAdmin.css";
import { RiPencilFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { IoMdDownload } from "react-icons/io";

function Dashboard() {
  let access = verifyMAC();
  let [consultations, setConsultations] = useState([]);
  let navigate = useNavigate();

  let passedConsultation = async (targetId, action) => {
    let targetConsultation = consultations.find(
      (consultation) => consultation.id === targetId
    );

    const updatedConsultation = { ...targetConsultation, passed: action };

    await axios.put(
      `http://localhost:3001/consultations/${targetId}`,
      updatedConsultation
    );
    setConsultations((prevConsultations) =>
      prevConsultations.map((consultation) =>
        consultation.id === targetId ? updatedConsultation : consultation
      )
    );
  };
  let checkConsultations = () => {
    let loadtoday = new Date();
    consultations.forEach((appointment) => {
      if (appointment.passed === false) {
        let appointmentDateTime = new Date(
          `${appointment.apt_date}T${appointment.apt_time}:00`
        );
        if (loadtoday > appointmentDateTime) {
          passedConsultation(appointment.id, true);
        }
      } else {
        let appointmentDateTime = new Date(
          `${appointment.apt_date}T${appointment.apt_time}:00`
        );
        if (loadtoday < appointmentDateTime) {
          passedConsultation(appointment.id, false);
        }
      }
    });
  };
  useEffect(() => {
    axios.get("http://localhost:3001/consultations").then((res) => {
      setConsultations(res.data);
    });
  }, []);

  useEffect(() => {
    checkConsultations();
  }, [consultations]);
  // checkConsultations()
  // const sendMessage = async (consultation) => {
  //   try {
  //     await axios.post("http://localhost:5000/send-sms", {
  //       phoneNumber: remove0s(consultation.phone_no),
  //       name: consultation.name,
  //     });
  //     // const updatedConsultations = consultations.map((item) =>
  //     //   item.id === consultation.id ? { ...item, confirmed: true } : item
  //     // );
  //     // setConsultations(updatedConsultations);
  //     //have to update using axios first
  //   } catch (error) {
  //     console.log("Error in sending the message");
  //   }
  // };

  let deleteConsultation = async (targetId) => {
    try {
      await axios.delete(`http://localhost:3001/consultations/${targetId}`);
      setConsultations(
        consultations.filter((consultation) => consultation.id !== targetId)
      );
    } catch (error) {
      console.log("Error deleting deleting item");
    }
  };
  function convertToTime(string) {
    return string < 10 ? `0${string.toString()}` : string.toString();
  }
  let confirmConsultation = async (targetId) => {
    let targetConsultation = consultations.find(
      (consultation) => consultation.id === targetId
    );

    const updatedConsultation = { ...targetConsultation, confirmed: true };

    await axios.put(
      `http://localhost:3001/consultations/${targetId}`,
      updatedConsultation
    );
    const today = new Date();
    await axios.post("http://localhost:3001/notifications", {
      time_stamp: `${convertToTime(today.getDate())}/${convertToTime(
        today.getMonth() + 1
      )}/${today.getFullYear()} | ${convertToTime(
        today.getHours()
      )}:${convertToTime(today.getMinutes())}`,
      title: "Confirmed Consultation",
      description: `Confirmed Consultation with ${
        targetConsultation.name
      } on ${convertDate(targetConsultation.apt_date)} at ${convertTime(
        targetConsultation.apt_time
      )}`,
      route: "/admin/dashboard",
    });

    setConsultations((prevConsultations) =>
      prevConsultations.map((consultation) =>
        consultation.id === targetId ? updatedConsultation : consultation
      )
    );

  };


  let editConsultation = (targetConsultation) => {
    navigate(`/admin/consultation/edit/${targetConsultation.id}`, {
      state: { targetConsultation },
    });
  };
  let exportToCsv = () => {
    if (consultations.length > 0) {
      const csvRows = [];
      const headers = Object.keys(consultations[0]).join(",");
      csvRows.push(headers);

      consultations.forEach((row) => {
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
      a.download = "consultationData.csv";
      a.click();

      URL.revokeObjectURL(url);
    } else {
      alert("There are no consultations");
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
            <div className="admin-container-body admin-consultations-container">
              <div className="consultations-admin-header">
                <h1>Consultations Log</h1>
                <button onClick={exportToCsv}>
                  <IoMdDownload />
                </button>
              </div>
              <div className="consultations-list-container">
                {consultations ? (
                  consultations.map((consultation) => {
                    return (
                      <>
                        <div
                          className={`consultation-card-container ${
                            consultation.passed ? "consultation-passed" : null
                          }`}
                        >
                          <div className="consultation-card-left">
                            <h2>
                              <span>{consultation.name}</span> | Age:{" "}
                              {consultation.age}
                            </h2>
                            <p>
                              <span style={{ fontWeight: "bold" }}>
                                Posted:
                              </span>{" "}
                              {convertDate(consultation.time_stamp, 1)}
                            </p>
                            {consultation.time_stamp_updated ? (
                              <>
                                <p>
                                  <span style={{ fontWeight: "bold" }}>
                                    Updated:
                                  </span>{" "}
                                  {convertDate(
                                    consultation.time_stamp_updated,
                                    1
                                  )}
                                </p>
                              </>
                            ) : null}

                            <div className="consultation-card-left-main">
                              <p>
                                <span>Phone Number: </span>
                                {consultation.phone_no}
                              </p>
                              <p>
                                <span>Email: </span>
                                {consultation.email}
                              </p>
                              <p>
                                <span>Preferred Date: </span>
                                {convertDate(consultation.apt_date, 2)}
                              </p>
                              <p>
                                <span>Preffered Time: </span>
                                {convertTime(consultation.apt_time)}
                              </p>
                              {consultation.notes !== "" ? (
                                <>
                                  <p>
                                    <span>Notes: </span>
                                    {consultation.notes}
                                  </p>
                                </>
                              ) : null}
                              {consultation.passed ? (
                                <>
                                  <p>
                                    <span>THIS CONSULTATION HAS PASSED</span>
                                  </p>
                                </>
                              ) : null}
                            </div>
                          </div>
                          <div className="consultation-card-right">
                            <p>"{consultation.description}"</p>
                            <div className="consultation-card-buttons">
                              <button
                                disabled={
                                  consultation.confirmed || consultation.passed
                                }
                                onClick={() => {
                                  confirmConsultation(consultation.id);
                                }}
                              >
                                {consultation.confirmed
                                  ? "Confirmed"
                                  : "Confirm"}
                              </button>
                              {/* <button
                                disabled={
                                  (consultation.google_calender &&
                                    !consultation.confirmed) ||
                                  consultation.passed
                                }
                                onClick={() => {
                                  addToCalender(consultation);
                                }}
                              >
                                {consultation.google_calender
                                  ? "Added to Google Calender"
                                  : "Add to Google Calender"}
                              </button> */}
                            </div>
                          </div>
                          <div className="buttons-admin-consultations">
                            <button
                              className="button-consultation cross-consultation"
                              onClick={() => {
                                deleteConsultation(consultation.id);
                              }}
                            >
                              X
                            </button>
                            {!consultation.confirmed ? (
                              <button
                                className="button-consultation edit-consultation"
                                onClick={() => {
                                  editConsultation(consultation);
                                }}
                                disabled={consultation.confirmed}
                              >
                                <RiPencilFill />
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </>
                    );
                  })
                ) : (
                  <p>No Consultees At The Moment!</p>
                )}
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

export default Dashboard;
