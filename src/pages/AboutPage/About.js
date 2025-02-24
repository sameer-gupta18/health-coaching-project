import React from "react";
import NavMargin from "../../components/NavMargin";
import {} from "./about.css";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import aboutme from "../../assets/about_me.jpg";
import qual1 from "../../assets/17126824425018875866315374612835.png";
import qual2 from "../../assets/Certificate-of-Rama-Gupta-for-Introduction-To-Translational-Nutrigenetics-on-28-08-2024-22-22-PM.jpg";
import qual3 from "../../assets/IIN-graduation-certificate.jpg";
function About() {
  let qualifications = [
    {
      name: "Advanced Course on Gut Health",
      description: "Institute of Integrative Nutrition",
      image: qual1,
    },
    {
      name: "Introduction to Translational Nutrigenetics",
      description: "Institute of Nutrigenetics",
      image: qual2,
    },
    {
      name: "Certified Integrative Nutrition Health Coach",
      description: "Institute of Integrative Nutrition",
      image: qual3,
    },
  ];

  return (
    <>
      <NavMargin />
      <div className="about-me-container">
        <Header title={"About Me"} />
        <div className="about-us-front">
          <div className="about-me-journey-container">
            <h1>My Journey</h1>
            <p>
              At 48, I embraced my passion for holistic health and wellness,
              embarking on a transformative journey to empower others to live
              healthier, more fulfilling lives. My own experiences with physical
              and emotional health challenges inspired me to guide individuals
              and organisations toward achieving balanced well-being. My decade
              of corporate experience has uniquely equipped me to design health
              and wellness programs that resonate with busy professionals.
              Having navigated the challenges of corporate life, I understand
              the stress, time constraints, and lifestyle habits that often come
              with it. This insight allows me to create practical sustainable
              strategies tailored to help individuals and teams achieve optimal
              health without compromising their demanding schedules
            </p>
          </div>
          <div className="about-me-image-container">
            <img src={aboutme} alt="Rama Profile Photo" />
          </div>
        </div>
        <div className="about-me-qualifications-container">
          <h1>My Qualifications</h1>
          <div className="about-me-qualification-cards-container">
            {qualifications.map((qualification) => {
              return (
                <div className="qualification-card">
                  <img src={qualification.image} alt="qualification image" />
                  <h3>{qualification.name}</h3>
                  <p>{qualification.description}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mission-container-vector v-u" />
        <div className="about-me-mission-container">
          <p id="mission-title">MISSION</p>
          <p>
            "Empowering individuals to achieve holistic well-being by nurturing
            physical health, mental clarity, spiritual growth, and social
            harmony for a balanced, fulfilling life."
          </p>
        </div>
        <div className="mission-container-vector v-d" />
      </div>
      <Footer />
    </>
  );
}

export default About;
