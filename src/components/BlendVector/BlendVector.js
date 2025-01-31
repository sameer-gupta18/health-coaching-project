import React from "react";
function BlendVector({ color1, color2 }) {
  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "2vw",
          background: `linear-gradient(to bottom, ${color1} 0%,${color2} 50%`,
          transform: "translateY(-0.001vw)",
        }}
      />
    </>
  );
}

export default BlendVector;
