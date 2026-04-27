import React from "react";

const TopBar: React.FC = () => {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-brand">
          {/* DHL logo placeholder */}
          <div className="logo-placeholder">
            DHL
          </div>
          <div className="topbar-text">
            <div className="topbar-title">Exit Interview</div>
            <div className="topbar-subtitle">DHL Express Nigeria</div>
          </div>
        </div>

        {/* Right-hand placeholder for user avatar or HR icon */}
        <div className="topbar-avatar">
          <div className="avatar-placeholder">HR</div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
