import React, { useEffect, useState } from "react";
import {} from "../dashboard.css";
import NavMargin from "../../components/NavMargin";
import Error404 from "../../pages/Error404";
import verifyMAC from "../macCheck";
import AdminNavBar from "../../components/AdminNavBar/AdminNavBar";
import NotificationColumn from "../../components/NotificationColumn/NotificationColumn";
import axios from "axios";
import {} from "./edittestimonials.css";
import { useNavigate } from "react-router-dom";

function EditTestimonials() {
  let access = verifyMAC();
  let [testimonials, setTestimonials] = useState();
  useEffect(() => {
    axios.get("http://localhost:3001/testimonials").then((res) => {
      setTestimonials(res.data);
    });
  }, []);
  let deleteTestimonial = async (targetId) => {
    setTestimonials(
      testimonials.filter((testimonial) => testimonial.id !== targetId)
    );
    await axios.delete(`http://localhost:3001/testimonials/${targetId}`);
  };
  let navigate = useNavigate();
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
            <div className="admin-container-body admin-edittestimonials-container">
              <h1>Edit/View Testimonials</h1>
              {testimonials ? (
                <>
                  <button
                    className="add-testimonial-btn"
                    onClick={() => {
                      navigate("/admin/testimonials/add");
                    }}
                  >
                    Add Testimonial
                  </button>
                  <div className="admin-testimonials-container">
                    {testimonials.map((testimonial) => {
                      return (
                        <>
                          <div className="admin-testimonial-container">
                            <div className="admin-testimonial-left">
                              <p>
                                {testimonial.name} | {testimonial.age}
                              </p>
                              <p>{testimonial.description}</p>
                              <p>"{testimonial.testimonial}"</p>
                              <div className="admin-testimonials-buttons">
                                <button
                                  onClick={() => {
                                    navigate(
                                      `/admin/testimonials/edit/${testimonial.id}`,
                                      { state: { testimonial } }
                                    );
                                  }}
                                >
                                  Edit Testimonial
                                </button>
                                <button
                                  onClick={() => {
                                    deleteTestimonial(testimonial.id);
                                  }}
                                >
                                  Delete Testimonial
                                </button>
                              </div>
                            </div>
                            <div className="admin-testimonial-right">
                              <img
                                src={testimonial.photo}
                                alt={`Testimonial - ${testimonial.name}`}
                              />
                            </div>
                          </div>
                        </>
                      );
                    })}
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

export default EditTestimonials;
