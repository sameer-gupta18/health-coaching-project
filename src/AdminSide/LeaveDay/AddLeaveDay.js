import React, { useEffect, useState } from "react";
import {} from "../dashboard.css";
import NavMargin from "../../components/NavMargin";
import Error404 from "../../pages/Error404";
import verifyMAC from "../macCheck";
import AdminNavBar from "../../components/AdminNavBar/AdminNavBar";
import NotificationColumn from "../../components/NotificationColumn/NotificationColumn";
import axios from "axios";
import {} from "./addleaveday.css";
import convertDate from "../../common_functions/convertDate";
import DatePicker from "react-datepicker";
function AddLeaveDay() {
  let access = verifyMAC();
  let [offdays, setOffdays] = useState();
  let [currentDate, setCurrentDate] = useState();
  useEffect(() => {
    axios.get("http://localhost:3001/offdays").then((res) => {
      setOffdays(res.data);
    });
  }, []);
  const getMinDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };
  let handleDateChange = (inputDate) => {
    const formattedDate = inputDate.toISOString().split("T")[0];
    setCurrentDate(formattedDate);
  };
  const isWeekday = (date) => {
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return false;
    }
    const todayFormat = new Date(date);
    let offdaysFormat = offdays.map((offday) => offday.date);
    todayFormat.setDate(date.getDate() + 1);
    if (offdaysFormat.includes(todayFormat.toISOString().split("T")[0])) {
      return false;
    }
    return true;
  };
  function convertToTime(string) {
    return string < 10 ? `0${string.toString()}` : string.toString();
  }
  let addOffDay = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:3001/offdays", {
      date: currentDate,
    });
    const today = new Date();
    await axios
      .post("http://localhost:3001/notifications", {
        time_stamp: `${convertToTime(today.getDate())}/${convertToTime(
          today.getMonth() + 1
        )}/${today.getFullYear()} | ${convertToTime(
          today.getHours()
        )}:${convertToTime(today.getMinutes())}`,
        title: "Added New Leave Day",
        description: `Successfully added an off day for ${convertDate(
          currentDate,
          2
        )}`,
        route: "/admin/leave-day/add",
      })
      .then(() => {
        window.location.reload();
      });
  };

  let deleteOffday = async (targetId) => {
    setOffdays(offdays.filter((offday) => offday.id !== targetId));
    await axios.delete(`http://localhost:3001/offdays/${targetId}`)
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
            <div className="admin-container-body admin-leaveday-container">
              <h1>Add Leave Day</h1>
              {offdays ? (
                <>
                  <h2>Current Offdays</h2>
                  <div className="offdays-container">
                    {offdays.map((offday) => {
                      return (
                        <>
                          <p>
                            {convertDate(offday.date, 2)}{" "}
                            <button
                              onClick={() => {
                                deleteOffday(offday.id);
                              }}
                            >
                              X
                            </button>
                          </p>
                        </>
                      );
                    })}
                  </div>
                  <div className="add-offday">
                    <h2>Add Offday</h2>
                    <form onSubmit={addOffDay}>
                      <DatePicker
                        selected={currentDate ? new Date(currentDate) : null}
                        onChange={handleDateChange}
                        minDate={getMinDate()}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="YYYY-MM-DD"
                        filterDate={isWeekday}
                      />
                      <input type="submit" value={"Add Offday"} />
                    </form>
                  </div>
                </>
              ) : null}
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

export default AddLeaveDay;
