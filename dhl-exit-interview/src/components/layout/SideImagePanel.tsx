import React from "react";
import sideImage from "../../assets/left-panel-image.jpg";
import "../../App.css";

const SideImagePanel: React.FC = () => {
  return (
    <aside className="dhl-side-panel">
      <img src={sideImage} alt="DHL courier" className="dhl-side-image" />
    </aside>
  );
};

export default SideImagePanel;
