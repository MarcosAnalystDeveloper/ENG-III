import './StepIndicator.css';

const STEPS = ['Serviço', 'Profissional', 'Data e horário', 'Seus dados'];

export default function StepIndicator({ currentStep }) {
  return (
    <ol className="step-indicator">
      {STEPS.map((label, index) => {
        const step = index + 1;
        const state =
          step === currentStep ? 'current' : step < currentStep ? 'done' : 'upcoming';
        return (
          <li key={label} className={`step step--${state}`}>
            <span className="step__circle">{step < currentStep ? '✓' : step}</span>
            <span className="step__label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
