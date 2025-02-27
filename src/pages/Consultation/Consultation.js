import React, { useState, useEffect } from "react";
import NavMargin from "../../components/NavMargin";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {} from "./consultation.css";
import Footer from "../../components/Footer/Footer";
import times from "../../common_functions/generateValidTime";
import convertTime from "../../common_functions/convertTime";
import { FaTemperatureArrowDown } from "react-icons/fa6";
import convertDate from "../../common_functions/convertDate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function Consultation() {
  let [disabled, setDisabled] = useState(false);
  let [name, setName] = useState("");
  let [phone, setPhone] = useState("");
  let [email, setEmail] = useState("");
  let [age, setAge] = useState("");
  let [date, setDate] = useState("");
  let [time, setTime] = useState("");
  let [description, setDescription] = useState("");
  let [timeList, setTimeList] = useState();
  let [usedTimes, setUsedTimes] = useState();
  let [dateSpecificTimes, setDateSpecificTimes] = useState();
  let [offdays, setOffDays] = useState();
  let navigate = useNavigate();

  useEffect(() => {
    let getValues = async () => {
      try {
        const res = await axios.get("http://localhost:3001/consultations");   //retrieves data from DB asynchronously
        setUsedTimes(
          res.data.map((resData) => ({
            aptDate: resData.apt_date,
            aptTime: resData.apt_time,
          }))
        );
        const res1 = await axios.get("http://localhost:3001/offdays");    //recieves data from DB asynchronously
        setOffDays(res1.data.map((resData) => resData.date));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getValues();
  }, []);

  useEffect(() => {
    if (usedTimes === undefined) {
      return;
    }
    setDateSpecificTimes(
      usedTimes
        ? usedTimes
            .filter((usedTime) => {
              return usedTime.aptDate === date;
            })
            .map((usedTime) => usedTime.aptTime)
        : []
    );
    setTimeList(
      dateSpecificTimes
        ? times.filter((time) => {
            return !dateSpecificTimes.includes(time);
          })
        : times
    );
    if (time === "" && timeList) {
      setTime(timeList[0]);
    }
    return;
  });
  let convertToFormat = (string) => {
    return string.toLowerCase().trim().replace(" ", "-");
  };

  function convertToTime(string) {
    return string < 10 ? `0${string.toString()}` : string.toString();
  }
  let submitContactFormData = async (event) => {
    event.preventDefault();

    setDisabled(true);
    const today = new Date();

    const consultationRequest = {
      time_stamp: `${convertToTime(today.getDate())}/${convertToTime(
        today.getMonth() + 1
      )}/${today.getFullYear()} | ${convertToTime(
        today.getHours()
      )}:${convertToTime(today.getMinutes())}`,
      name: name,
      phone_no: phone,
      email: email,
      age: age,
      apt_date: date,
      apt_time: time,
      description: description,
      confirmed: false,
      google_calender: false,
      notes: "",
      passed: false,
    };

    await axios
      .post("http://localhost:3001/consultations", consultationRequest)
      .then(() => {
        navigate(`/consultation/success/${convertToFormat(name)}`, {
          state: { consultationRequest },
        });
      })
      .catch((error) => {
        console.log("Error updating participants:", error);
        navigate(`/consultation/fail/${convertToFormat(name)}`, {
          state: { consultationRequest, error },
        });
      });
    await axios.post("http://localhost:3001/notifications", {                       //add to notifications as well
      time_stamp: `${convertToTime(today.getDate())}/${convertToTime(
        today.getMonth() + 1
      )}/${today.getFullYear()} | ${convertToTime(
        today.getHours()
      )}:${convertToTime(today.getMinutes())}`,
      title: "New Consultation",
      description: `${name} (${age}) wants a consultation on ${convertDate(
        date
      )} at ${convertTime(time)}`,
      route: "/admin/dashboard",
    });
  };
  const today = new Date();
  const getMinDate = () => {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };
  const isWeekday = (date) => {
    const day = date.getDay();      //gets todays day as an integer
    if (day === 0 || day === 6) {
      return false;                 //if its a weekend, then return false, indicating the date is to be hidden
    } 
    const todayFormat = new Date(date);       //todays date formatted
    todayFormat.setDate(date.getDate() + 1);
    if (offdays.includes(todayFormat.toISOString().split("T")[0])) {      //see if todays date is included int he offdays dates
      return false;                                                       //return false if yes
    }                                                                 
    return true;                                                          //true if no
  };

  let handleDateChange = (inputDate) => {
    const formattedDate = inputDate.toISOString().split("T")[0];
    setDate(formattedDate);
  };

  return (
    <>
      <NavMargin />
      <div className="consultation-us-container">
        <div className="consultation-us-header-container">
          <div className="webinars-header">
            <h1>Book a Consultation!</h1>
            <hr />
            <p
              style={{
                color: "var(--secondary-one)",
                marginTop: "0.5vh",
                fontWeight: "bold",
                fontSize: "1.3vw",
              }}
            >
              There is no issue too small or complaint too big
            </p>
          </div>
        </div>
        <div className="main-consultation-us-container">
          <div className="form-container-consultation">
            <form onSubmit={submitContactFormData}>
              <div className="text-input">
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  required //prevent unfilled input
                  maxLength={30} //no extreme data
                  disabled={disabled}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div className="text-input">
                <input
                  type="number" //no incorrect data type
                  required
                  placeholder="Enter Your Phone Number"
                  disabled={disabled}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                  maxLength={11} //no extreme data
                />
              </div>
              <div className="text-input">
                <input //email input
                  type="email"
                  required
                  placeholder="Enter Your Email"
                  disabled={disabled}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="text-input">
                <input //integer input
                  type="number"
                  required
                  placeholder="Enter Your Age"
                  disabled={disabled}
                  onChange={(e) => {
                    setAge(e.target.value);
                  }}
                  max={110}
                />
              </div>
              <p class="date-time-desc">
                Enter a Preferred Date for a Consultation
              </p>
              <p class="date-time-desc">
                Enter a Preferred Time for a Consultation (IST)
              </p>
              <div className="text-input">
                <DatePicker //date input
                  selected={date ? new Date(date) : null}
                  onChange={handleDateChange}
                  filterDate={isWeekday}
                  minDate={getMinDate()}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="YYYY-MM-DD (Select a Weekday)"
                />
              </div>
              <div className="text-input">
                <select //dropdown input
                  class="consultation-time-input"
                  onChange={(e) => {
                    setTime(e.target.value);
                  }}
                  required
                >
                  <option disabled key={"Choose Time"}>
                    Choose Time
                  </option>
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
              <div className="text-input how-we-can-help">
                <textarea //paragraph
                  className="text-area-consultation"
                  required
                  placeholder="Briefly Describe Your Problem"
                  spellCheck={true}
                  maxLength={500}
                  disabled={disabled}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </div>
              <input
                type="submit"
                value={"Send Message!"}
                disabled={disabled}
              />
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Consultation;
