import React from "react";

export default function BentoGrid({
  heroImage,
  topLeftImage,
  topRightImage,
  bottomImage,
}) {
  const gridStyle = {
    display: "grid",
    gap: "0px",
    width: "100%",

    /* Desktop layout */
    gridTemplateColumns: "2fr 1fr 1fr",
    gridTemplateRows: "300px 300px",
  };

  const heroStyle = {
    position: "relative",
    gridRow: "1 / span 2",
    overflow: "hidden",

  };

  const itemStyle = {
    position: "relative",
    overflow: "hidden",

  };

  const bottomStyle = {
    ...itemStyle,
    gridColumn: "2 / span 2",
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  const overlayStyle = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "flex-end",
    background:
      "linear-gradient(to top, rgba(0,0,0,.8), rgba(0,0,0,.2), transparent)",
  };

  const contentStyle = {
    padding: "32px",
    color: "white",
    maxWidth: "520px",
  };

  const buttonStyle = {
    marginTop: "12px",
    background: "black",
    border: "none",
    padding: "12px 22px",
    fontWeight: "700",
    cursor: "pointer",
    color: "white",
  };

  /* Responsive without media queries */
  const responsiveWrapper = {
    padding: "0px",
  };

  const responsiveGrid = {
    ...gridStyle,
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gridTemplateRows: "auto",
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div style={responsiveWrapper}>
      <div style={isMobile ? responsiveGrid : gridStyle}>
        {/* LEFT LARGE */}
        <div style={heroStyle}>
          <img src={heroImage} alt="hero" style={imgStyle} />

          <div style={overlayStyle}>
            {/* <div style={contentStyle}>
              <p>
                Isha Prints is your go-to destination for high-quality custom printed 
                clothing that lets you wear your personality with confidence. Whether 
                you’re looking to promote your brand, create memorable event merch, 
                design team uniforms, or bring your creative ideas to life, Isha Prints 
                delivers vibrant, long-lasting prints on comfortable, premium fabrics.
              </p>
              <button style={buttonStyle}>SHOP NOW</button>
            </div> */}
          </div>
        </div>

        {/* TOP RIGHT */}
        <div style={itemStyle}>
          <img src={topLeftImage} alt="top" style={imgStyle} />
        </div>

        <div style={itemStyle}>
          <img src={topRightImage} alt="top" style={imgStyle} />
        </div>

        {/* BOTTOM EXPANDED */}
        <div style={bottomStyle}>
          <img src={bottomImage} alt="bottom" style={imgStyle} />
        </div>
      </div>
    </div>
  );
}