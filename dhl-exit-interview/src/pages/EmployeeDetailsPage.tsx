// src/pages/EmployeeDetailsPage.tsx
import React from "react";
import DHLLayout from "../components/layout/DHLLayout";

interface EmployeeDetailsValues {
  fullName: string;
  staffId: string;
  email: string;
  manager: string;
  department: string;
  location: string;
  lastWorkingDay: string;
  position: string;
  grade: string;
  lengthOfService: string;
  age: string;
}

interface EmployeeDetailsPageProps {
  currentStep: string;
  onNext: () => void;
  values: EmployeeDetailsValues;
  onChange: (field: keyof EmployeeDetailsValues, value: string) => void;
}

const EmployeeDetailsPage: React.FC<EmployeeDetailsPageProps> = ({
  currentStep,
  onNext,
  values,
  onChange,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <DHLLayout currentStep={currentStep} onStepChange={() => {}}>
      <div className="dhl-page">
        <h2 className="dhl-page__title">Employee details</h2>
        <p className="dhl-page__subtitle">
          Please confirm your basic details to help us link this feedback
          correctly in our HR systems.
        </p>

        <form className="dhl-form" onSubmit={handleSubmit}>
          {/* Full name */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">
              <span className="dhl-form__label-required">*</span>
              Full name
            </label>
            <input
              className="dhl-form__control"
              value={values.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Staff ID */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">
              <span className="dhl-form__label-required">*</span>
              Staff ID
            </label>
            <input
              className="dhl-form__control"
              value={values.staffId}
              onChange={(e) => onChange("staffId", e.target.value)}
              placeholder="e.g. GID123456"
              required
            />
          </div>

          {/* Email */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">Email</label>
            <input
              className="dhl-form__control"
              type="email"
              value={values.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="e.g. john.doe@dhl.com"
            />
          </div>

          {/* Manager (optional; you’re still using managerFeedback in experience page for now) */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">Line manager</label>
            <input
              className="dhl-form__control"
              value={values.manager}
              onChange={(e) => onChange("manager", e.target.value)}
              placeholder="e.g. Line manager name"
            />
          </div>

          {/* Department / Function */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">Department / Function</label>
            <input
              className="dhl-form__control"
              value={values.department}
              onChange={(e) => onChange("department", e.target.value)}
              placeholder="e.g. Operations, Customer Service"
            />
          </div>

          {/* Location */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">Location</label>
            <input
              className="dhl-form__control"
              value={values.location}
              onChange={(e) => onChange("location", e.target.value)}
              placeholder="e.g. Lagos, Abuja"
            />
          </div>

          {/* Job title / position */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">Job title / position</label>
            <input
              className="dhl-form__control"
              value={values.position}
              onChange={(e) => onChange("position", e.target.value)}
              placeholder="e.g. Operations Supervisor"
            />
          </div>

          {/* Grade / band */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">Grade / band</label>
            <input
              className="dhl-form__control"
              value={values.grade}
              onChange={(e) => onChange("grade", e.target.value)}
              placeholder="e.g. N, L, M"
            />
          </div>

          {/* Length of service */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">Length of service</label>
            <input
              className="dhl-form__control"
              value={values.lengthOfService}
              onChange={(e) => onChange("lengthOfService", e.target.value)}
              placeholder="e.g. 2 years 6 months"
            />
          </div>

          {/* Age */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">Age</label>
            <input
              className="dhl-form__control"
              type="number"
              min={16}
              max={80}
              value={values.age}
              onChange={(e) => onChange("age", e.target.value)}
              placeholder="e.g. 35"
            />
          </div>

          {/* Last working day */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">Last working day</label>
            <input
              type="date"
              className="dhl-form__control"
              value={values.lastWorkingDay}
              onChange={(e) => onChange("lastWorkingDay", e.target.value)}
            />
          </div>

          <div className="dhl-form__actions">
            <button
              type="submit"
              className="dhl-button dhl-button--primary"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </DHLLayout>
  );
};

export default EmployeeDetailsPage;
