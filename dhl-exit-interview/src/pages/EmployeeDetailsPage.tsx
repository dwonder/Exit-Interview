import DHLLayout from "../components/layout/DHLLayout";

interface EmployeeDetailsValues {
  fullName: string;
  staffId: string;
  department: string;
  location: string;
  lastWorkingDay: string;
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

          <div className="dhl-form__group">
            <label className="dhl-form__label">
              <span className="dhl-form__label-required">*</span>
              Staff ID
            </label>
            <input
              className="dhl-form__control"
              value={values.staffId}
              onChange={(e) => onChange("staffId", e.target.value)}
              placeholder="e.g. NG12345"
              required
            />
          </div>

          <div className="dhl-form__group">
            <label className="dhl-form__label">Department / Function</label>
            <input
              className="dhl-form__control"
              value={values.department}
              onChange={(e) => onChange("department", e.target.value)}
              placeholder="e.g. Operations, Customer Service"
            />
          </div>

          <div className="dhl-form__group">
            <label className="dhl-form__label">Location</label>
            <input
              className="dhl-form__control"
              value={values.location}
              onChange={(e) => onChange("location", e.target.value)}
              placeholder="e.g. Lagos, Abuja"
            />
          </div>

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
