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
import {} from "./clientqueries.css";
import { IoMdDownload } from "react-icons/io";

function ClientQueries() {
  let access = verifyMAC();
  let [contactRequests, setContactRequests] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3001/contacts").then((res) => {
      setContactRequests(res.data);
    });
  }, []);

  let deleteContactRequest = async (targetId) => {
    try {
      await axios.delete(`http://localhost:3001/contacts/${targetId}`);
      setContactRequests(
        contactRequests.filter(
          (contactrequest) => contactrequest.id !== targetId
        )
      );
    } catch (error) {
      console.log("Error deleting deleting item");
    }
  };

  let exportToCsv = () => {
    if (contactRequests.length > 0) {
      const csvRows = [];
      const headers = Object.keys(contactRequests[0]).join(",");
      csvRows.push(headers);

      contactRequests.forEach((row) => {
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
      a.download = "contactRequests.csv";
      a.click();

      URL.revokeObjectURL(url);
    } else {
      alert("There are no contact requests");
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
            <div className="admin-container-body admin-contactRequests-container">
              <div className="client-queries-admin-header">
                <h1>Contact Requests</h1>
                <button onClick={exportToCsv}>
                  <IoMdDownload />
                </button>
              </div>
              <div className="contactRequests-list-container">
                {contactRequests ? (
                  contactRequests.map((contactrequest) => {
                    return (
                      <>
                        <div className="contactrequest-card-container">
                          <div className="contactrequest-card-left">
                            <h2>{contactrequest.name}</h2>
                            <p>
                              <span style={{ fontWeight: "bold" }}>
                                Posted:
                              </span>{" "}
                              {convertDate(contactrequest.time_stamp, 1)}
                            </p>
                            {contactrequest.time_stamp_updated ? (
                              <>
                                <p>
                                  <span style={{ fontWeight: "bold" }}>
                                    Updated:
                                  </span>{" "}
                                  {convertDate(
                                    contactrequest.time_stamp_updated,
                                    1
                                  )}
                                </p>
                              </>
                            ) : null}

                            <div className="contactrequest-card-left-main">
                              <p>
                                <span>Phone Number: </span>
                                {contactrequest.phone_no}
                              </p>
                              <p>
                                <span>Query: </span>
                                {contactrequest.description}
                              </p>
                            </div>
                          </div>
                          <div className="buttons-admin-contactRequests">
                            <button
                              className="button-contactrequest cross-contactrequest"
                              onClick={() => {
                                deleteContactRequest(contactrequest.id);
                              }}
                            >
                              X
                            </button>
                          </div>
                        </div>
                      </>
                    );
                  })
                ) : (
                  <p>No Contacts At The Moment!</p>
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

export default ClientQueries;
