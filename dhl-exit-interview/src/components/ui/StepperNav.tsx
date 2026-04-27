import React from "react";
import DHLButton from "./DHLButton";
import "../../App.css";

type Props = {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  disableNext?: boolean;
};

const StepperNav: React.FC<Props> = ({
  onBack,
  onNext,
  nextLabel = "Next",
  disableNext,
}) => {
  return (
    <div className="stepper-nav">
      {onBack && (
        <DHLButton variant="secondary" onClick={onBack}>
          Back
        </DHLButton>
      )}
      {onNext && (
        <DHLButton onClick={onNext} disabled={disableNext}>
          {nextLabel}
        </DHLButton>
      )}
    </div>
  );
};

export default StepperNav;
