import React from "react";
import "../../App.css";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

const DHLButton: React.FC<Props> = ({ variant = "primary", ...rest }) => {
  const className = [
    "dhl-btn",
    variant === "primary" ? "dhl-btn-primary" : "dhl-btn-secondary",
    rest.className,
  ]
    .filter(Boolean)
    .join(" ");

  return <button {...rest} className={className} />;
};

export default DHLButton;
