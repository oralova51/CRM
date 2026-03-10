import styles from "./StepIndicator.module.css";

type Props = {
  currentStep: number;
  totalSteps: number;
};

export function StepIndicator({ currentStep, totalSteps }: Props) {
  return (
    <div className={styles.container}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className={styles.stepWrapper}>
          <div
            className={`${styles.step} ${
              step <= currentStep ? styles.active : ""
            }`}
          >
            {step}
          </div>
          {step < totalSteps && (
            <div
              className={`${styles.line} ${
                step < currentStep ? styles.activeLine : ""
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}