import React, { useState, useEffect } from "react";
import {} from "./homepage.css";
import video from "../../assets/7677118-hd_1920_1080_25fps.mp4";
import video2 from "../../assets/7677876-hd_1920_1080_25fps.mp4";
import { FaInstagram } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import benefits from "./benefits";
import NavMargin from "../../components/NavMargin";
import { ReactTyped } from "react-typed";
import services from "./clientservices";
import dummy from "../../assets/bg-dummy.avif";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "../../components/Footer/Footer";
import BlendVector from "../../components/BlendVector/BlendVector";
import coverphoto from "../../assets/about_me.jpg";
import coverphoto1 from "../../assets/momimage1.JPG";
import coverphoto2 from "../../assets/IMG_2193-removebg-preview.png";
import convertDate from "../../common_functions/convertDate";
import convertTime from "../../common_functions/convertTime";
function NextArrowSample(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        WebkitTextFillColor: "var(--secondary-one)",
      }}
      onClick={onClick}
    />
  );
}
function PrevArrowSample(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        WebkitTextFillColor: "var(--secondary-one)",
      }}
      onClick={onClick}
    />
  );
}

function HomePage() {
  let [webinarData, setWebinarData] = useState();
  let [testimonials, setTestimonials] = useState();
  let navigate = useNavigate();

  useEffect(() => {
    let webinars = axios.get("http://localhost:3001/webinars");
    webinars.then((res) => {
      setWebinarData(res.data[res.data.length - 1]);
    });
    let testimonialsData = axios.get("http://localhost:3001/testimonials");
    testimonialsData.then((res) => {
      setTestimonials(res.data);
    });
  }, []);


  let convertToRoute = (id) => {
    return `/live-webinars/register/${id.toString()}`;
  };

  let handleRegister = (webinar) => {
    navigate(convertToRoute(webinar.id), { state: { webinar } });
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrowSample />,
    prevArrow: <PrevArrowSample />,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
  };
  return (
    <>
      <div className="home-page">
        <div className="landing-page">
          <div className="landing-page-content">
            <NavMargin />
            <div className="landing-page-content-active">
              <div className="landing-text-container">
                <h3>Hi, I'm Rama! Your</h3>
                <h1>Health Coach</h1>
                <p>
                  I'm a CERTIFIED Health Coach from the prestigious Institute of
                  Integrative Nutrition (US), Gut Health Specialist & Genetics
                  Based Nutritional Counsellor
                </p>
                <div className="landing-social-media">
                  <ul>
                    <a
                      href="https://www.instagram.com/prakrutibyrama/"
                      target="_blank"
                    >
                      <li>
                        <FaInstagram />
                      </li>
                    </a>
                    <a href="#">
                      <li>
                        <FaFacebookF />
                      </li>
                    </a>
                    <a
                      href="https://in.linkedin.com/in/rama-gupta-71ba5b2b1?trk=people-guest_people_search-card"
                      target="_blank"
                    >
                      <li>
                        <FaLinkedinIn />
                      </li>
                    </a>
                  </ul>
                </div>
              </div>
              <div className="landing-photo">
                <img src={coverphoto1} alt="Mom Image" />
              </div>
            </div>
            <div className="gradient-filler"></div>
          </div>

          <div className="video-background">
            <video autoPlay loop muted>
              <source src={video} type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="benefits-rl3">
          <h1>
            Elevate Your{" "}
            <ReactTyped
              strings={[
                "Health Game",
                "Wellness Journey",
                "Life Balance",
                "Healthy Habits",
                "Self Care",
              ]}
              loop
              typeSpeed={100}
            />
          </h1>
          <p className="benefit-descriptor">
            A health coach empowers you to achieve your wellness goals through
            personalized guidance, sustainable habits, and expert support,
            transforming your journey to better health and lasting vitality.
          </p>
          <div className="benefits-card-container">
            {benefits.map((benefit) => {
              return (
                <div className="benefit-card">
                  <div className="benefit-card-image">{benefit.image}</div>
                  <h2>{benefit.title}</h2>
                  <p>{benefit.byline}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="client-services">
          <h1>
            Helping You <span>Thrive</span>
          </h1>
          <div className="client-service-card-container">
            {services.map((service) => {
              return (
                <div className="client-service">
                  <h2>{service.title}</h2>
                  <p>{service.subtitle}</p>
                  <div className="client-service-image">{service.image}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="why-rama">
          <h1>Why Rama?</h1>
          <h3>Coach | Motivator | Friend</h3>
          <div className="why-rama-container">
            <div className="why-rama-left">
              <div className="why-rama-q1">
                <h3>Holistic Health Coaching</h3>
                <hr />
                <p>
                  Personalized 1:1 coaching to evaluate lifestyle factors like
                  stress, sleep, relationships, and career. Offers actionable
                  strategies and accountability for achieving sustainable,
                  long-term health goals.
                </p>
              </div>

              <div className="why-rama-q1">
                <h3>Lifestyle Optimization Programs</h3>
                <hr />
                <p>
                  Comprehensive assessment and strategies to enhance physical
                  and mental health. Covers stress reduction, mindful living,
                  and healthy routines for achieving balance and fulfillment in
                  lif
                </p>
              </div>
            </div>
            <div className="why-rama-center">
              <img src={coverphoto2} alt="Client-image" />
            </div>
            <div className="why-rama-right">
              <div className="why-rama-q1">
                <h3>Corporate Wellness Workshops</h3>
                <hr />
                <p>
                  Tailored programs for stress management, quality sleep, and
                  work-life balance. Designed to boost employee productivity,
                  foster emotional resilience, and cultivate a thriving
                  workplace culture.
                </p>
              </div>
              <div className="why-rama-q1">
                <h3>Gut Health Expertise</h3>
                <hr />
                <p>
                  Specialized guidance to improve gut health addressing core
                  wellness issues. Empowers individuals to enhance digestion,
                  energy, and immunity, promoting well-being from the inside
                  out.
                </p>
              </div>
            </div>
          </div>
        </div>
        {webinarData ? (
          <div className="webinar-banner-container">
            <div className="webinar-banner-img-container">
              <img src={webinarData.cover_image} alt="cover_image" />
            </div>
            <div className="webinar-banner-content-container">
              <h1>Tune In On My Upcoming Webinar!</h1>
              <h2>{webinarData.name}</h2>
              <p className="webinar-banner-content-date-time">
                {convertDate(webinarData.date,2)} | {convertTime(webinarData.time)}
              </p>
              <p className="webinar-banner-content-description">
                {webinarData.description}
              </p>
              <button
                onClick={() => {
                  handleRegister(webinarData);
                }}
              >
                Register Now
              </button>
            </div>
          </div>
        ) : (
          <p>Loading Webinar Details...</p>
        )}
        {testimonials ? (
          <div className="testimonials-container">
            <h1>Hear From Others!</h1>
            <div className="slider-container">
              <Slider {...settings}>
                {testimonials.map((testimonial, index) => {
                  return (
                    <div className="testimonial-container-s">
                      <div className="testimonial-container" key={index}>
                        <div className="testimonial-image-container">
                          <img src={testimonial.photo} alt={"Profile Photo"} />
                        </div>
                        <div className="testimonial-content-container">
                          <div className="testimonial-content-testimonial">
                            <p>"{testimonial.testimonial}"</p>
                          </div>
                          <div className="testimonial-content-testimonial-desc">
                            <p>{testimonial.name}</p>
                            <p>{`${testimonial.description} (${testimonial.age})`}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>
        ) : (
          <p>Loading Testimonials...</p>
        )}
        <div className="consultation-banner-container">
          <h2>Book a Consultation</h2>
          <h1>NOW!</h1>
          <button
            onClick={() => {
              navigate("/consultation");
            }}
          >
            Book Now!
          </button>
        </div>
      </div>
      <BlendVector color1={"rgba(74, 219, 200, 0.3)"} color2={"rgba(0,0,0)"} />
      <Footer />
    </>
  );
}

export default HomePage;
