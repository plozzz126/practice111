import './ProgressBar.css';

export default function ProgressBar({ current, total }) {
  const percent = (current / total) * 100;

  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="progress-label">Вопрос {current} из {total}</span>
        <span className="progress-percent">{Math.round(percent)}%</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percent}%` }}
        />
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`progress-dot ${i < current ? 'done' : i === current - 1 ? 'active' : ''}`}
            style={{ left: `${((i + 1) / total) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
