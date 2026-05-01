import React from "react";
import { NavLink } from "react-router-dom";
import "../../App.css";

const HRNav: React.FC = () => {
  return (
    <nav className="hr-nav">
      <ul className="hr-nav-list">
        <li>
          <NavLink
            to="/hr"
            end
            className={({ isActive }) =>
              isActive ? "hr-nav-link hr-nav-link-active" : "hr-nav-link"
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/hr/interviews"
            className={({ isActive }) =>
              isActive ? "hr-nav-link hr-nav-link-active" : "hr-nav-link"
            }
          >
            Exit interviews
          </NavLink>
        </li>
        {/* Future: add more HR tools here */}
      </ul>
    </nav>
  );
};

export default HRNav;
