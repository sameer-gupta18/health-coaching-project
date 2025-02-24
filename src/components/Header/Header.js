import React from "react";
import {} from './header.css'
function Header({ title }) { //parameters can be passed too
  return (
    <>
      <div className="webinars-header">
        <h1>{title}</h1>
        <hr />
      </div>
    </>
  );
}

export default Header;
