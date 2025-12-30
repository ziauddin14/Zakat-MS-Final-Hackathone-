import React from "react";
import donateIconImg from "../../assets/donate-icon-final.png";

const DonateIcon = ({ size = 28, className = "" }) => {
  return (
    <img
      src={donateIconImg}
      alt="Donate Icon"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
      }}
      className={className}
    />
  );
};

export default DonateIcon;
