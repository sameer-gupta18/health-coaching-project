import React, { useEffect, useState } from "react";
import {} from "../dashboard.css";
import NavMargin from "../../components/NavMargin";
import Error404 from "../../pages/Error404";
import verifyMAC from "../macCheck";
import AdminNavBar from "../../components/AdminNavBar/AdminNavBar";
import NotificationColumn from "../../components/NotificationColumn/NotificationColumn";
import axios from "axios";
import {} from "./addwebinar.css";
import DatePicker from "react-datepicker";
import times from "../../common_functions/generateValidTime";
import convertTime from "../../common_functions/convertTime";
// import convertDate from "../../common_functions/convertDate";
import placeholder from "../../assets/placeholder.png";
import { useNavigate } from "react-router-dom";
import convertDate from "../../common_functions/convertDate";
function AddWebinar() {
  let access = verifyMAC();
  let [currentWebinarDetails, setCurrentWebinarDetails] = useState({
    name: "",
    register_timestamp: "",
    description: "",
    tags: {
      paid: undefined,
      offline: undefined,
    },
    date: "",
    time: "10:00",
    location: "",
    link: "",
    cover_image: "",
    participants: [],
    price: "",
  });
  let [updateNotification, setUpdateNotification] = useState(false);
  const getMinDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };
  useEffect(() => {
    console.log(currentWebinarDetails);
  }, [currentWebinarDetails]);
  let handleDateChange = (inputDate) => {
    const formattedDate = inputDate.toISOString().split("T")[0];
    setCurrentWebinarDetails((prevDetails) => ({
      ...prevDetails,
      date: formattedDate,
    }));
  };
  function convertToTime(string) {
    return string < 10 ? `0${string.toString()}` : string.toString();
  }
  let navigate = useNavigate();
  let addWebinarData = async (e) => {
    e.preventDefault();
    try {
      const today = new Date();
      let formData = new FormData();
      formData.append("file", currentWebinarDetails.cover_image);
      let response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      let fileURL = response.data.url;
      // setCurrentWebinarDetails((prevDetails) => ({
      //   ...prevDetails,
      //   register_timestamp: `${convertToTime(today.getDate())}/${convertToTime(
      //     today.getMonth() + 1
      //   )}/${today.getFullYear()} | ${convertToTime(
      //     today.getHours()
      //   )}:${convertToTime(today.getMinutes())}`,
      // }));

      let updatedWebinarDetails = {
        ...currentWebinarDetails,
        cover_image: fileURL,
        register_timestamp: `${convertToTime(today.getDate())}/${convertToTime(
          today.getMonth() + 1
        )}/${today.getFullYear()} | ${convertToTime(
          today.getHours()
        )}:${convertToTime(today.getMinutes())}`,
      };
      await axios
        .post("http://localhost:3001/webinars", updatedWebinarDetails)
        .then(() => {
          navigate("/admin/webinar/view");
          alert(`"${currentWebinarDetails.name}" added`);
        });
      await axios.post("http://localhost:3001/notifications", {
        time_stamp: `${convertToTime(today.getDate())}/${convertToTime(
          today.getMonth() + 1
        )}/${today.getFullYear()} | ${convertToTime(
          today.getHours()
        )}:${convertToTime(today.getMinutes())}`,
        title: "Added New Webinar",
        description: `You have added a new webinar titled ${
          updatedWebinarDetails.name
        } on ${convertDate(updatedWebinarDetails.date, 2)} at ${convertTime(
          updatedWebinarDetails.time
        )}`,
        route: "/admin/webinar/view",
      });

      if (updateNotification) {
        await axios.put("http://localhost:3001/consumer-notifications/1", {
          content: `Join my Upcoming Webinar "${
            updatedWebinarDetails.name
          }" on ${convertDate(
            updatedWebinarDetails.date,
            2
          )}. Click Here to Join Now!`,
          route: "/live-webinars",
          id: "1",
        });
      }
    } catch (error) {
      alert("Failed to add webinar. Please try again");
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
            <div className="admin-container-body admin-addwebinar-container">
              <h1>Add Webinar</h1>
              <form onSubmit={addWebinarData}>
                <div class="add-webinar-name-cont">
                  <p>Name of Webinar</p>
                  <input
                    type="text"
                    required
                    maxLength={70}
                    placeholder="Enter Name"
                    value={currentWebinarDetails.name}
                    onChange={(e) => {
                      setCurrentWebinarDetails((prevDetails) => ({
                        ...prevDetails,
                        name: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="add-webinar-middle-container">
                  <div className="add-webinar-desc-container">
                    <p>Description</p>
                    <textarea
                      placeholder="Enter Description"
                      required
                      value={currentWebinarDetails.description}
                      maxLength={400}
                      onChange={(e) => {
                        setCurrentWebinarDetails((prevDetails) => ({
                          ...prevDetails,
                          description: e.target.value,
                        }));
                      }}
                    />
                  </div>
                  <div className="add-webinar-datetime-container">
                    <p>Add Date of Webinar</p>
                    <DatePicker
                      selected={
                        currentWebinarDetails.date
                          ? new Date(currentWebinarDetails.date)
                          : null
                      }
                      onChange={handleDateChange}
                      minDate={getMinDate()}
                      dateFormat="dd-MM-yyyy"
                      placeholderText="YYYY-MM-DD"
                    />
                    <p>Add Time of Webinar</p>
                    <select required onChange={(e) => {
                        setCurrentWebinarDetails((prevDetails) => ({
                          ...prevDetails,
                          time: e.target.value,
                        }));
                      }}>
                      <option disabled>Select Time</option>
                      {times.map((time) => {
                        return (
                          <>
                            <option key={time} value={time}>
                              {convertTime(time)}
                            </option>
                          </>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="add-webinar-bottom">
                  <div className="add-webinar-tags">
                    <p className="select-tags-heading">Select Tags</p>
                    <div className="add-webinar-tags-tags">
                      <div className="add-webinar-tag">
                        <p>Offline</p>
                        <input
                          type="radio"
                          value="Offline"
                          id="offline-tag"
                          name="offline-online"
                          required
                          className="offline-online-inputs"
                          onChange={() => {
                            setCurrentWebinarDetails((prevDetails) => ({
                              ...prevDetails,
                              tags: { ...prevDetails.tags, offline: true },
                            }));
                          }}
                        />
                      </div>
                      <div className="add-webinar-tag">
                        <p>Online</p>
                        <input
                          type="radio"
                          value="Online"
                          id="online-tag"
                          name="offline-online"
                          required
                          className="offline-online-inputs"
                          onChange={() => {
                            setCurrentWebinarDetails((prevDetails) => ({
                              ...prevDetails,
                              tags: { ...prevDetails.tags, offline: false },
                            }));
                          }}
                        />
                      </div>
                      <div className="add-webinar-tag">
                        <p>Free</p>
                        <input
                          type="radio"
                          value="Free"
                          id="free-tag"
                          name="free-paid"
                          required
                          className="free-paid-inputs"
                          onChange={() => {
                            setCurrentWebinarDetails((prevDetails) => ({
                              ...prevDetails,
                              tags: { ...prevDetails.tags, paid: false },
                            }));
                          }}
                        />
                      </div>
                      <div className="add-webinar-tag">
                        <p>Paid</p>
                        <input
                          type="radio"
                          value="Paid"
                          id="paid-tag"
                          name="free-paid"
                          required
                          className="free-paid-inputs"
                          onChange={() => {
                            setCurrentWebinarDetails((prevDetails) => ({
                              ...prevDetails,
                              tags: { ...prevDetails.tags, paid: true },
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="add-webinar-name-cont">
                    <p>Location</p>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      placeholder="Enter Location (Zoom/Google Meet/Physical Location)"
                      value={currentWebinarDetails.location}
                      onChange={(e) => {
                        setCurrentWebinarDetails((prevDetails) => ({
                          ...prevDetails,
                          location: e.target.value,
                        }));
                      }}
                    />
                  </div>

                  {currentWebinarDetails.tags.offline ? null : (
                    <>
                      <div class="add-webinar-name-cont">
                        <p>Meeting Link</p>
                        <input
                          type="text"
                          required
                          placeholder="Enter Link"
                          value={currentWebinarDetails.link}
                          onChange={(e) => {
                            setCurrentWebinarDetails((prevDetails) => ({
                              ...prevDetails,
                              link: e.target.value,
                            }));
                          }}
                        />
                      </div>
                    </>
                  )}
                  {currentWebinarDetails.tags.paid ? (
                    <>
                      <div class="add-webinar-name-cont">
                        <p>Price (INR)</p>
                        <input
                          type="number"
                          required
                          placeholder="Enter Price"
                          value={currentWebinarDetails.price}
                          onChange={(e) => {
                            setCurrentWebinarDetails((prevDetails) => ({
                              ...prevDetails,
                              price: e.target.value,
                            }));
                          }}
                        />
                      </div>
                    </>
                  ) : null}
                  <div className="add-webinar-file">
                    <img
                      src={
                        currentWebinarDetails.cover_image
                          ? URL.createObjectURL(
                              currentWebinarDetails.cover_image
                            )
                          : placeholder
                      }
                      alt="Webinar Add"
                    />
                    <div className="add-webinar-file-cont">
                      <p>Upload Cover Image</p>
                      <input
                        type="file"
                        required
                        accept="image/*"
                        onChange={(e) => {
                          setCurrentWebinarDetails((prevDetails) => ({
                            ...prevDetails,
                            // cover_image: URL.createObjectURL(e.target.files[0]),
                            cover_image: e.target.files[0],
                          }));
                        }}
                      />
                    </div>
                  </div>
                  <div className="update-notification-container">
                    <p>
                      Add Webinar Promotion in Front Page Notification Popup
                    </p>
                    <input
                      type="checkbox"
                      onChange={() => {
                        setUpdateNotification(!updateNotification);
                      }}
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
        <>
          <Error404 />
        </>
      )}
    </>
  );
}

export default AddWebinar;
