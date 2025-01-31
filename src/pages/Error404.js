import React from "react";
import NavMargin from "../components/NavMargin";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

function Error404() {
  return (
    <>
      <NavMargin />
      <div style={{ padding: "0vw 1vw", height: "100vh" }}>
        <Header title={"Error404. Page Not Found"} />
      </div>
      <Footer />
    </>
  );
}

export default Error404;
