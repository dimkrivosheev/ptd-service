export default function ProgressBar({ steps, currentKey }) {
  const currentIndex = steps.findIndex((s) => s.key === currentKey);

  return (
    <div className="progress-bar">
      {steps.map((step, i) => {
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <div key={step.key} className="progress-item">
            {i > 0 && <div className={`progress-line ${isDone ? "done" : ""}`} />}
            <div className="progress-node">
              <div className={`progress-circle ${isActive ? "active" : isDone ? "done" : ""}`}>
                {isDone ? "✓" : i + 1}
              </div>
              <div className={`progress-label ${isActive ? "active" : isDone ? "done" : ""}`}>
                {step.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
