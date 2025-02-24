import { useEffect, useState } from "react";
import {} from "./app.css";
import Navbar from "../components/Navbar/Navbar";
import HomePage from "../pages/HomePage/HomePage";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import About from "../pages/AboutPage/About";
import LiveWebinars from "../pages/LiveWebinars/LiveWebinars";
import CalorieTracker from "../pages/CalorieTracker/CalorieTracker";
import WebinarRegistration from "../pages/LiveWebinars/WebinarRegistration";
import Error404 from "../pages/Error404";
import KnowYourBody from "../pages/KnowYourBody/KnowYourBody";
import Contact from "../pages/Contact/Contact";
import WebinarConfirmation from "../pages/LiveWebinars/WebinarConfirmation";
import WebinarCancellation from "../pages/LiveWebinars/WebinarCancellation";
import ContactConfirmation from "../pages/Contact/ContactConfirmation";
import ContactFail from "../pages/Contact/ContactFail";
import Consultation from "../pages/Consultation/Consultation";
import Splash from "../pages/Splash/Splash";
import ConsultationConfirmation from "../pages/Consultation/ConsultationConfirmation";
import ConsultationFail from "../pages/Consultation/ConsultationFail";
import ScrollToTop from "./scrollToTop";
import Dashboard from "../AdminSide/Admin Home/ConsultationsDashboard";
import ClientQueries from "../AdminSide/Client Queries/ClientQueries";
import ConsultationEdit from "../AdminSide/Admin Home/ConsultationEdit";
import NotificationPopup from "../components/NotificationPopup/NotificationPopup";
import NotificationControl from "../AdminSide/NotificationControl/NotificationControl";
import AddWebinar from "../AdminSide/AddWebinar/AddWebinar";
import ViewWebinar from "../AdminSide/ViewWebinar/ViewWebinar";
import EditWebinar from "../AdminSide/ViewWebinar/EditWebinar";
import AddLeaveDay from "../AdminSide/LeaveDay/AddLeaveDay";
import EditTestimonials from "../AdminSide/EditTestimonials/EditTestimonials";
import AddTestimonial from "../AdminSide/EditTestimonials/AddTestimonial";
import TestimonialEdit from "../AdminSide/EditTestimonials/TestimonialEdit";
function AppWrapper() {
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();
  useEffect(() => {
    window.addEventListener("load", () => {
      setTimeout(() => {
        setIsLoaded(true);
      }, 2500);
    });

    return () => {
      window.removeEventListener("load", () => {
        setTimeout(() => {
          setIsLoaded(true);
        }, 2500);
      });
    };
  }, []);

  return isLoaded ? (
    <>
      <Navbar />
      {!location.pathname.startsWith("/admin") ? ( //admin routing
        <>
          <NotificationPopup />
        </>
      ) : null}
      <ScrollToTop />
        <Routes>
        <Route path="/" element={<HomePage />} /> {/*Routing of a few pages*/}
        <Route path="/about-us" element={<About />} />
        <Route path="/bmi-calculator" element={<KnowYourBody />} />
        <Route path="/live-webinars" element={<LiveWebinars />} />
        <Route
          path="/live-webinars/register/:webinarid"
          element={<WebinarRegistration />}
        />
        <Route
          path="/live-webinars/register/:webinarid/confirmation/:name"
          element={<WebinarConfirmation />}
        />
        <Route
          path="/live-webinars/register/:webinarid/error404"
          element={<WebinarCancellation />}
        />
        <Route
          path="/contact-me/confirmation/:name"
          element={<ContactConfirmation />}
        />
        <Route path="/consultation" element={<Consultation />} />
        <Route
          path="/consultation/success/:name"
          element={<ConsultationConfirmation />}
        />
        <Route path="/consultation/fail/:name" element={<ConsultationFail />} />
        <Route path="/contact-me/fail/:name" element={<ContactFail />} />
        {/* <Route path="/blogs" element={<Blogs />} /> */}
        <Route path="/contact-me" element={<Contact />} />
        <Route path="/calorie-tracker" element={<CalorieTracker />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/client-queries" element={<ClientQueries />} />
        <Route path="/admin/webinar/add" element={<AddWebinar />} />
        <Route path="/admin/webinar/view" element={<ViewWebinar />} />
        <Route path="/admin/webinar/edit/:id" element={<EditWebinar />} />
        <Route path="/admin/leave-day/add" element={<AddLeaveDay />} />
        <Route
          path="/admin/notification-control"
          element={<NotificationControl />}
        />
        <Route path="/admin/testimonials" element={<EditTestimonials />} />
        <Route
          path="/admin/consultation/edit/:id"
          element={<ConsultationEdit />}
        />
        <Route path="/admin/testimonials/add" element={<AddTestimonial />} />
        <Route
          path="/admin/testimonials/edit/:id"
          element={<TestimonialEdit />}
        />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  ) : (
    <>
      <Splash />
    </>
  );
}
function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
export default App;
