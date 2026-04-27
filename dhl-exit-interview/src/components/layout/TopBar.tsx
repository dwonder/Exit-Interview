import React from "react";
import logo from "../../assets/dhl-logo.svg";
import avatar from "../../assets/avatar-default.png";
import { useInterview } from "../../context/InterviewContext";
import "../../App.css";

const TopBar: React.FC = () => {
  const { data } = useInterview();

  return (
    <header className="dhl-topbar">
      <div className="dhl-topbar-left">
        <img src={logo} alt="DHL logo" className="dhl-logo" />
      </div>
      <div className="dhl-topbar-right">
        <div className="dhl-user-text">
          <div className="dhl-user-name">{data.name || "DHL Employee"}</div>
          {data.email && <div className="dhl-user-email">{data.email}</div>}
        </div>
        <img src={avatar} alt="Avatar" className="dhl-avatar" />
      </div>
    </header>
  );
};

export default TopBar;
