import React, { useEffect, useState } from "react";
import {} from "./notificationcolumn.css";
import axios from "axios";
import { Link } from "react-router-dom";
function NotificationColumn() {
  let [notifications, setNotifications] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3001/notifications").then((res) => {
      setNotifications(res.data);
    });
  },[]);

  let deleteNotification = async (targetId) => {
    try {
      await axios.delete(`http://localhost:3001/notifications/${targetId}`);
      setNotifications(
        notifications.filter((notification) => notification.id !== targetId)
      );
    } catch (error) {
      console.log("Error deleting item");
    }
  };

  return (
    <div className="notifications-container">
      <h1>Notifications</h1>
      <ul className="notifications-list">
        {notifications.map((notification) => {
          return (
            <>
              <li>
                <div className="notification-header">
                  <button
                    onClick={() => {
                      deleteNotification(notification.id);
                    }}
                  >
                    x
                  </button>
                  <h3>{notification.title}</h3>
                </div>
                <Link to={notification.route}>
                  <p>{notification.description}</p>
                  <p className="time-stamp-admin-notification">
                    {notification.time_stamp}
                  </p>
                </Link>
              </li>
            </>
          );
        })}
      </ul>
    </div>
  );
}

export default NotificationColumn;
