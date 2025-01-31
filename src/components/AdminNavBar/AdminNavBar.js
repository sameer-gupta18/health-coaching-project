import React from "react";
import {} from "./adminnavbar.css";
import { Link, useLocation } from "react-router-dom";
function AdminNavBar() {
  let location = useLocation();
  return (
    <div className="admin-navbar-container">
      <h1>Prakruti By Rama</h1>
      <div className="admin-navbar-links-container">
        <ul>
          <li>
            <Link
              to="/admin/dashboard"
              className={
                location.pathname === "/admin/dashboard" ? "active-link" : ""
              }
            >
              Consultations
            </Link>
          </li>
          <li>
            <Link
              to="/admin/client-queries"
              className={
                location.pathname === "/admin/client-queries"
                  ? "active-link"
                  : ""
              }
            >
              Client Queries
            </Link>
          </li>
          <li>
            <Link
              to="/admin/notification-control"
              className={
                location.pathname === "/admin/notification-control"
                  ? "active-link"
                  : ""
              }
            >
              Notification Control
            </Link>
          </li>
          <li>
            <Link
              to="/admin/webinar/add"
              className={
                location.pathname === "/admin/webinar/add" ? "active-link" : ""
              }
            >
              Add a Webinar
            </Link>
          </li>
          <li>
            <Link
              to="/admin/webinar/view"
              className={
                location.pathname === "/admin/webinar/view" ? "active-link" : ""
              }
            >
              View Webinars
            </Link>
          </li>
          {/* <li>
            <Link
              to=""
              className={
                location.pathname === "/admin/blog-control" ? "active-link" : ""
              }
            >
              Control Blogs
            </Link>
          </li> */}
          <li>
            <Link
              to="/admin/leave-day/add"
              className={
                location.pathname === "/admin/leave-day/add" ? "active-link" : ""
              }
            >
              Add Leave Day
            </Link>
          </li>
          <li>
            <Link
              to="/admin/testimonials"
              className={
                location.pathname === "/admin/testimonials" ? "active-link" : ""
              }
            >
              Manage Testimonials
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AdminNavBar;
