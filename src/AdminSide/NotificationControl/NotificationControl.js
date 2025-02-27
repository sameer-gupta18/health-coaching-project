import React, { useEffect, useState } from "react";
import {} from "../dashboard.css";
import {} from "./notificationcontrol.css";
import NavMargin from "../../components/NavMargin";
import Error404 from "../../pages/Error404";
import verifyMAC from "../macCheck";
import AdminNavBar from "../../components/AdminNavBar/AdminNavBar";
import NotificationColumn from "../../components/NotificationColumn/NotificationColumn";
import axios from "axios";
import Splash from "../../pages/Splash/Splash";
function NotificationControl() {
  const options = [
    "",
    "/",
    "/about-us",
    "/live-webinars",
    "/blogs",
    "/bmi-calculator",
    "/calorie-tracker",
    "/contact-me",
    "/consultation",
  ];
  let [notification, setNotification] = useState();
  var [inputNotification, setInputNotification] = useState();
  //do two different states, one for storing the value and one for storing the select value
  var [inputRoute, setInputRoute] = useState();
  // var [routeStatus, setRouteStatus] = useState();
  var [actualRoute, setActualRoute] = useState();
  let access = verifyMAC();
  useEffect(() => {
    axios.get("http://localhost:3001/consumer-notifications").then((res) => {
      setNotification(res.data);
      setInputNotification(res.data[0].content);
      setInputRoute(
        options.includes(res.data[0].route) ? res.data[0].route : "other"
      );
      setActualRoute(res.data[0].route);
    });
  }, []);
  useEffect(() => {
    console.log(inputNotification);
    console.log(actualRoute);
  }, [inputNotification, actualRoute]);

  let routeChange = (route) => {
    setInputRoute(route);
    if (route !== "other") {
      setActualRoute(route);
    } else {
      setActualRoute("");
    }
  };

  let disableNotification = async (e) => {                  //remove the popup notification from the user-side
    e.preventDefault();
    await axios.put(
      `http://localhost:3001/consumer-notifications/${notification[0].id}`,
      {
        content: "",
        route: "",
      }
    );
    window.location.reload();                               //reload the page
  };
  let disableRoute = async (e) => {                         //disable the routing aspect of the notification
    e.preventDefault();
    await axios.put(
      `http://localhost:3001/consumer-notifications/${notification[0].id}`,
      {
        content: inputNotification,
        route: "",
      }
    );
    window.location.reload();                               //reload the page
  };
  let submitNotificationEditData = async (e) => {
    e.preventDefault();
    await axios.put(
      `http://localhost:3001/consumer-notifications/${notification[0].id}`,
      { content: inputNotification, route: actualRoute }
    );
    window.location.reload();
  };

  let clearNotificationHistory = async () => {
    var { data: objects } = await axios.get(
      "http://localhost:3001/notifications"
    );
    const deletePromises = objects.map((obj) => {
      axios.delete(`http://localhost:3001/notifications/${obj.id}`); //delete a particular object from the DB
    });
    await Promise.all(deletePromises).then(() => {
      window.location.reload();
    });
  };
  return (
    <>
      {access === null ? (
        <>
          <NavMargin />
          <p>Verifying Security...</p>
        </>
      ) : access && notification ? (
        <>
          <NavMargin />
          <div className="admin-container">
            <AdminNavBar />
            <div className="admin-container-body notificationcontrol-container">
              <h1>Notification Control</h1>
              <div className="current-popup-edit">
                <h2>Current Pop-Up</h2>
                <p>
                  {notification[0].content
                    ? notification[0].content
                    : "No Notification Set"}
                </p>
                <h2>Routed To</h2>
                <p>
                  {notification[0].route && notification[0].content
                    ? notification[0].route
                    : "No Notification/Route Set"}
                </p>
                <h2>Edit Notification</h2>
                <form>
                  <div className="edit-notification-textgroup">
                    <input
                      type="text"
                      maxLength={100}
                      placeholder="Enter Notification"
                      value={inputNotification}
                      onChange={(e) => {
                        setInputNotification(e.target.value);
                      }}
                    />
                    <input
                      type="submit"
                      value={"Disable Notification"}
                      onClick={disableNotification}
                    />
                  </div>
                  <div className="edit-notification-textgroup">
                    <select
                      value={inputRoute}
                      onChange={(e) => {
                        routeChange(e.target.value);
                      }}
                      disabled={inputNotification === ""}
                    >
                      <option value="" disabled>
                        Select Route
                      </option>
                      <option value="/">Home</option>
                      <option value="/about-us">About Me</option>
                      <option value="/live-webinars">Live Webinars</option>
                      <option value="/blogs">Blogs</option>
                      <option value="/bmi-calculator">BMI Calculator</option>
                      <option value="/calorie-tracker">Calorie Tracker</option>
                      <option value="/contact-me">Contact Me</option>
                      <option value="/consultation">Consultation</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="submit"
                      value={"Disable Route"}
                      onClick={disableRoute}
                    />
                    {inputRoute === "other" ? (     //if in the <select>, the "other" option is selected, this textbox is displayed
                      <>
                        <input
                          type="text"
                          placeholder="Enter Route"
                          value={actualRoute}
                          onChange={(e) => {
                            setActualRoute(e.target.value);
                          }}
                          disabled={inputNotification === ""}
                        />
                      </>
                    ) : null}
                  </div>
                  <input
                    type="submit"
                    value={"Save"}
                    className="notification-edit-save"
                    disabled={
                      inputNotification === notification[0].content &&
                      actualRoute === notification[0].route
                    }
                    onClick={submitNotificationEditData}
                  />
                </form>
              </div>
              <hr />
              <button
                className="clear-notification-button"
                onClick={clearNotificationHistory}
              >
                Clear Notification History
              </button>
            </div>
            <NotificationColumn />
          </div>
        </>
      ) : !access ? (
        <>
          <Error404 />
        </>
      ) : (
        <>
          <Splash />
        </>
      )}
    </>
  );
}

export default NotificationControl;
