import React from "react";
import "./AIImages.css";

export default function AIImages({ link, image_alt }) {
  return (
    <li className="imageContainer">
      <img src={link} alt={image_alt} />
    </li>
  );
} 
