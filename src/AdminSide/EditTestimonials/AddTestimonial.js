import React, { useEffect, useState } from "react";
import {} from "../dashboard.css";
import NavMargin from "../../components/NavMargin";
import Error404 from "../../pages/Error404";
import verifyMAC from "../macCheck";
import AdminNavBar from "../../components/AdminNavBar/AdminNavBar";
import NotificationColumn from "../../components/NotificationColumn/NotificationColumn";
import axios from "axios";
import {} from "./addtestimonial.css";
import placeholder from "../../assets/placeholder.png";
import { useNavigate } from "react-router-dom";
function AddTestimonial() {
  let access = verifyMAC();
  let [testimonial, setTestimonial] = useState({
    name: "",
    age: null,
    description: "",
    testimonial: "",
    photo: "",
  });
  let updateFile = async (file) => {
    let formData = new FormData();
    formData.append("file", file);
    let response = await axios.post("http://localhost:5000/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    let fileURL = response.data.url;
    setTestimonial((prevDetails) => ({
      ...prevDetails,
      photo: fileURL,
    }));
  };
  let navigate = useNavigate();
  let submitTestimonial = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:3001/testimonials", testimonial)
      .then(() => {
        alert("Added Testimonial Successfully");
        navigate("/admin/testimonials");
      });
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
            <div className="admin-container-body admin-addtestimonial-container">
              <h1>Add Testimonial</h1>
              <form onSubmit={submitTestimonial}>
                <div className="add-testimonial-input">
                  <p>Name: </p>
                  <input
                    type="text"
                    required
                    value={testimonial.name}
                    placeholder="Enter Name"
                    maxLength={30}
                    onChange={(e) => {
                      setTestimonial((prevDetails) => ({
                        ...prevDetails,
                        name: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="add-testimonial-input">
                  <p>Age: </p>
                  <input
                    type="number"
                    required
                    placeholder="Enter Age"
                    max={120}
                    value={testimonial.age}
                    onChange={(e) => {
                      setTestimonial((prevDetails) => ({
                        ...prevDetails,
                        age: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="add-testimonial-input">
                  <p>Testimonial Category: </p>
                  <input
                    type="text"
                    required
                    max={15}
                    placeholder="Client/Partner/Collaborator/..."
                    value={testimonial.description}
                    onChange={(e) => {
                      setTestimonial((prevDetails) => ({
                        ...prevDetails,
                        description: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="add-testimonial-input">
                  <p>Testimonial: </p>
                  <textarea
                    required
                    placeholder="Enter Testimonial"
                    value={testimonial.testimonial}
                    maxLength={200}
                    onChange={(e) => {
                      setTestimonial((prevDetails) => ({
                        ...prevDetails,
                        testimonial: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="add-testimonial-file-container">
                  <img
                    src={testimonial.photo ? testimonial.photo : placeholder}
                    alt="Testimonial Upload Photo"
                  />
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={(e) => {
                      updateFile(e.target.files[0] ?? e.target.files[0]);
                    }}
                  />
                </div>
                <input type="submit" value={"Add Testimonial"} />
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

export default AddTestimonial;
