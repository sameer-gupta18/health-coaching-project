import React, { useEffect, useState } from "react";
import {} from "../dashboard.css";
import NavMargin from "../../components/NavMargin";
import Error404 from "../../pages/Error404";
import verifyMAC from "../macCheck";
import AdminNavBar from "../../components/AdminNavBar/AdminNavBar";
import NotificationColumn from "../../components/NotificationColumn/NotificationColumn";
import times from "../../common_functions/generateValidTime";
import {} from "./consultationedit.css";
import { useLocation, useNavigate } from "react-router-dom";
import convertTime from "../../common_functions/convertTime";
import axios from "axios";
import convertDate from "../../common_functions/convertDate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function ConsultationEdit() {
  //Consultation Edit

  let access = verifyMAC(); //stores the boolean value determining if access has been granted or not
  let state = useLocation(); //Dynamic routing (gets the consultation from the admin dashboard)
  let consultation = state ? state.state.targetConsultation : null;
  let [currentConsultation, setCurrentConsultation] = useState({
    name: consultation.name,
    age: consultation.age,
    description: consultation.description,
    email: consultation.email,
    phone_no: consultation.phone_no,
    apt_date: consultation.apt_date,
    apt_time: consultation.apt_time,
    notes: "",
  });
  let [timeList, setTimeList] = useState();
  let [usedTimes, setUsedTimes] = useState();
  let [dateSpecificTimes, setDateSpecificTimes] = useState();
  let [offdays, setOffDays] = useState();
  let navigate = useNavigate();
  const isWeekday = (date) => {
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return false;
    }
    const todayFormat = new Date(date);
    todayFormat.setDate(date.getDate() + 1);
    if (offdays.includes(todayFormat.toISOString().split("T")[0])) {
      return false;
    }
    return true;
  };
  let getValues = async () => {
    try {
      await axios.get("http://localhost:3001/consultations").then((res) => {
        setUsedTimes(
          res.data.map((resData) => ({
            aptDate: resData.apt_date,
            aptTime: resData.apt_time,
          }))                                               //extracts and stores the appointments' date and time in a state
        );
      });
      const res1 = await axios.get("http://localhost:3001/offdays");
      setOffDays(res1.data.map((resData) => resData.date));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getValues();
  }, []);

  useEffect(() => {
    const newDateSpecificTimes = usedTimes
      ? usedTimes
          .filter(
            (usedTime) => usedTime.aptDate === currentConsultation.apt_date
          )
          .map((usedTime) => usedTime.aptTime)                           //find all the consultations which have the same date as the current consultation, and store their timings in an array
      : [];

    setDateSpecificTimes(newDateSpecificTimes);
    const newTimeList = dateSpecificTimes
      ? times.filter((time) => !newDateSpecificTimes.includes(time))
      : times;                                                   //from a full list of timings, remove all the times stored in the array before, using this list as the time list to be displayed
    setTimeList(newTimeList);

    return;
  }, [currentConsultation.apt_date, usedTimes, times]);

  function convertToTime(string) {
    return string < 10 ? `0${string.toString()}` : string.toString();
  }
  const getMinDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };
  let makeChanges = async (event) => {
    event.preventDefault();
    const today = new Date();
    let updatedConsultationObject = {
      id: consultation.id,
      time_stamp: consultation.time_stamp,
      name: currentConsultation.name,
      phone_no: currentConsultation.phone_no,
      email: currentConsultation.email,
      age: currentConsultation.age,
      apt_date: currentConsultation.apt_date,
      apt_time: currentConsultation.apt_time,
      description: currentConsultation.description,
      confirmed: consultation.confirmed,
      google_calender: consultation.google_calender,
      notes: currentConsultation.notes,
      time_stamp_updated: `${convertToTime(today.getDate())}/${convertToTime(
        today.getMonth() + 1
      )}/${today.getFullYear()} | ${convertToTime(
        today.getHours()
      )}:${convertToTime(today.getMinutes())}`,
      passed: consultation.passed,
    };
    await axios.put(
      `http://localhost:3001/consultations/${consultation.id}`,
      updatedConsultationObject
    );
    await axios.post("http://localhost:3001/notifications", {
      time_stamp: `${convertToTime(today.getDate())}/${convertToTime(
        today.getMonth() + 1
      )}/${today.getFullYear()} | ${convertToTime(
        today.getHours()
      )}:${convertToTime(today.getMinutes())}`,
      title: "Updated Consultation",
      description: `${consultation.name}'s consultation has been updated: ${
        currentConsultation.name
      } (${currentConsultation.age}) wants a consultation on ${convertDate(
        currentConsultation.apt_date
      )} at ${convertTime(currentConsultation.apt_time)}`,
      route: "/admin/dashboard",
    });
    navigate("/admin/dashboard");
  };
  let handleDateChange = (inputDate) => {
    const formattedDate = inputDate.toISOString().split("T")[0];
    setCurrentConsultation((prevConsultation) => ({
      ...prevConsultation,
      apt_date: formattedDate,
    }));
  };

  return (
    <>
      {access === null ? ( //access is still getting approved
        <>
          <NavMargin />
          <p>Verifying Security...</p>
        </>
      ) : access && consultation ? ( //only if access is granted and the consultation has been fetched will the components load
        <>
          <NavMargin />
          <div className="admin-container">
            <AdminNavBar />
            <div className="admin-container-body admin-consultations-edit-container">
              <h1>Edit Consultation | {consultation.name}</h1>
              <form onSubmit={makeChanges}>
                <div className="consultation-edit-textboxes-container">
                  <div className="edit-consultation-input-container">
                    <p>Name:</p>
                    <input
                      type="text"
                      required
                      defaultValue={consultation.name}
                      onChange={(res) => {
                        setCurrentConsultation((prevConsultation) => ({
                          //changes the consultation state
                          ...prevConsultation,
                          name: res.target.value, //update a singular parameter in objects
                        }));
                      }}
                    />
                  </div>

                  <div className="edit-consultation-input-container">
                    <p>Age:</p>
                    <input
                      type="number"
                      required
                      defaultValue={parseInt(consultation.age)}
                      onChange={(res) => {
                        setCurrentConsultation((prevConsultation) => ({
                          ...prevConsultation,
                          age: res.target.value,
                        }));
                      }}
                    />
                  </div>

                  <div className="edit-consultation-input-container edit-consultation-description">
                    <p>Description:</p>
                    <textarea
                      required
                      defaultValue={consultation.description}
                      onChange={(res) => {
                        setCurrentConsultation((prevConsultation) => ({
                          ...prevConsultation,
                          description: res.target.value,
                        }));
                      }}
                      maxLength={500}
                    />
                  </div>

                  <div className="edit-consultation-input-container ">
                    <p>Email:</p>
                    <input
                      type="email"
                      required
                      defaultValue={consultation.email}
                      onChange={(res) => {
                        setCurrentConsultation((prevConsultation) => ({
                          ...prevConsultation,
                          email: res.target.value,
                        }));
                      }}
                    />
                  </div>

                  <div className="edit-consultation-input-container">
                    <p>Phone Number:</p>
                    <input
                      type="number"
                      required
                      defaultValue={parseInt(consultation.phone_no)}
                      onChange={(res) => {
                        setCurrentConsultation((prevConsultation) => ({
                          ...prevConsultation,
                          phone_no: res.target.value,
                        }));
                      }}
                    />
                  </div>

                  <div className="edit-consultation-input-container">
                    <p>Appointment Date:</p>

                    <DatePicker
                      selected={
                        currentConsultation.apt_date
                          ? new Date(currentConsultation.apt_date)
                          : null
                      }
                      onChange={handleDateChange}
                      filterDate={isWeekday}
                      minDate={getMinDate()}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select a Weekday"
                    />
                  </div>

                  <div className="edit-consultation-input-container ">
                    <p>Appointment Time:</p>
                    <select
                      class="consultation-time-input"
                      onChange={(res) => {
                        setCurrentConsultation((prevConsultation) => ({
                          ...prevConsultation,
                          apt_time: res.target.value,
                        }));
                      }}
                      defaultValue={consultation.apt_time}
                    >
                      <option disabled key={"Choose Time"}>
                        Choose Time
                      </option>
                      {consultation.apt_date ===
                      currentConsultation.apt_date ? (
                        <option
                          key={consultation.apt_time}
                          value={consultation.apt_time}
                        >
                          {convertTime(consultation.apt_time)}
                        </option>
                      ) : null}

                      {timeList
                        ? timeList.map((time) => {
                            return (
                              <>
                                <option key={time} value={time}>
                                  {convertTime(time)}
                                </option>
                              </>
                            );
                          })
                        : null}
                    </select>
                  </div>

                  <div className="edit-consultation-input-container edit-consultation-description">
                    <p>Notes:</p>
                    <textarea
                      defaultValue={consultation.notes}
                      placeholder="Enter Any Remarks for discussion"
                      onChange={(res) => {
                        setCurrentConsultation((prevConsultation) => ({
                          ...prevConsultation,
                          notes: res.target.value,
                        }));
                      }}
                      maxLength={500}
                    />
                  </div>
                </div>
                <input type="submit" value={"Save"} />
              </form>
            </div>
            <NotificationColumn />
          </div>
        </>
      ) : (
        //else, an error will be thrown
        <>
          <Error404 />
        </>
      )}
    </>
  );
}

export default ConsultationEdit;
