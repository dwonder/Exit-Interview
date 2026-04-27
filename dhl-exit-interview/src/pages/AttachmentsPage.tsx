import React, { useRef } from "react";
import DHLLayout from "../components/layout/DHLLayout";

interface AttachmentsPageProps {
  currentStep: string;
  onNext: () => void;
  onBack: () => void;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const AttachmentsPage: React.FC<AttachmentsPageProps> = ({
  currentStep,
  onNext,
  onBack,
  files,
  setFiles,
}) => {
  const safeFiles = files || [];
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files;
    if (!selected) return;
    const newFiles = Array.from(selected);
    setFiles(newFiles);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <DHLLayout currentStep={currentStep} onStepChange={() => {}}>
      <div className="dhl-page">
        <h2 className="dhl-page__title">Attachments (optional)</h2>
        <p className="dhl-page__subtitle">
          You may upload any documents that you feel are relevant to your exit
          (for example: resignation letter, additional written feedback). This
          step is optional.
        </p>

        <form className="dhl-form" onSubmit={handleSubmit}>
          <div className="dhl-upload">
            <input
              ref={inputRef}
              type="file"
              multiple
              className="dhl-upload__input"
              onChange={handleFileChange}
            />

            <button
              type="button"
              className="dhl-upload__box"
              onClick={() => inputRef.current?.click()}
            >
              <div className="dhl-upload__icon" aria-hidden="true">
                ⬆
              </div>
              <div className="dhl-upload__text">
                <span className="dhl-upload__title">
                  Click to upload or drag &amp; drop
                </span>
                <span className="dhl-upload__subtitle">
                  PDF, Word, or image files. Max size per file as per HR policy.
                </span>
              </div>
            </button>

            {safeFiles.length > 0 && (
              <div className="dhl-upload__list">
                <h3 className="dhl-upload__list-title">Selected files</h3>
                <ul>
                  {safeFiles.map((file, index) => (
                    <li key={file.name + index} className="dhl-upload__item">
                      <span className="dhl-upload__item-name">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        className="dhl-upload__remove"
                        onClick={() => handleRemoveFile(index)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="dhl-form__actions">
            <button
              type="button"
              className="dhl-button dhl-button--secondary"
              onClick={onBack}
            >
              Back
            </button>
            <button type="submit" className="dhl-button dhl-button--primary">
              Next
            </button>
          </div>
        </form>
      </div>
    </DHLLayout>
  );
};

export default AttachmentsPage;
