import React, { useEffect, useState } from "react";
import {} from "./notificationpopup.css";
import axios from "axios";
import { Link } from "react-router-dom";
function NotificationPopup() {
  let [notification, setNotification] = useState();
  useEffect(() => {
    axios.get("http://localhost:3001/consumer-notifications").then((res)=>{
      setNotification(res.data);
    });
  }, []);
  let [show, setShow] = useState(true);

  return notification && show && notification[0].content ? (
    <>
      <div className="notificationpopup-container">
        {notification[0].route[0] === "/" ? (
          <>
            <Link to={notification[0].route}>
              <p>{notification[0].content}</p>
            </Link>
          </>
        ) : (
          <>
            <a href={notification[0].route} target="_blank">
              <p>{notification[0].content}</p>
            </a>
          </>
        )}

        <button
          onClick={() => {
            setShow(false);
          }}
        >
          X
        </button>
      </div>
    </>
  ) : null;
}

export default NotificationPopup;
