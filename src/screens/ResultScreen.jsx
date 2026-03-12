import { useState, useEffect } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import { fireConfetti } from '../utils/confetti';
import { exportToWord, exportToExcel } from '../utils/export';
import '../pages/Result.css';

const GRADES = [
  { min: 90, label: 'Гений! 🏆', color: '#ffd93d', emoji: '🏆', msg: 'Невероятный результат! Ты настоящий чемпион знаний!' },
  { min: 70, label: 'Отлично! 🌟', color: '#6bcb77', emoji: '🌟', msg: 'Замечательно! Ты очень хорошо знаешь этот материал!' },
  { min: 50, label: 'Хорошо! 👍', color: '#4d96ff', emoji: '👍', msg: 'Неплохой результат! Продолжай учиться и будет ещё лучше!' },
  { min: 0,  label: 'Учись! 💪', color: '#ff6b6b', emoji: '💪', msg: 'Не расстраивайся! Каждый тест — это новые знания!' },
];

export default function ResultScreen({ result, onRestart }) {
  const [showDetails, setShowDetails] = useState(false);
  const [exportLoading, setExportLoading] = useState(null);
  const [animCount, setAnimCount] = useState(0);

  const percent = Math.round((result.score / result.total) * 100);
  const grade = GRADES.find(g => percent >= g.min);

  useEffect(() => {
    if (percent >= 70) setTimeout(() => fireConfetti(), 400);
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setAnimCount(count);
      if (count >= result.score) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line

  const handleExportWord = async () => {
    setExportLoading('word');
    try { await exportToWord(result); } catch (e) { console.error(e); }
    setExportLoading(null);
  };

  const handleExportExcel = () => {
    setExportLoading('excel');
    try { exportToExcel(result); } catch (e) { console.error(e); }
    setExportLoading(null);
  };

  return (
    <div className="result-page">
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />

      <header className="result-header">
        <div className="result-header-inner">
          <div className="logo">
            <span className="logo-emoji">🧠</span>
            <span className="logo-text">BrainQuest</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="result-main">
        {/* Score hero */}
        <div className="score-hero animate-slide-up">
          <div className="score-emoji animate-float">{grade.emoji}</div>
          <h1 className="score-grade" style={{ color: grade.color }}>{grade.label}</h1>
          <p className="score-name">Молодец, {result.name}! 🎉</p>

          <div className="score-circle-wrap">
            <div className="score-circle">
              <svg viewBox="0 0 120 120" className="score-svg">
                <circle cx="60" cy="60" r="50" className="score-track" />
                <circle
                  cx="60" cy="60" r="50"
                  className="score-arc"
                  style={{ stroke: grade.color, strokeDasharray: `${percent * 3.14} 314` }}
                />
              </svg>
              <div className="score-inner">
                <span className="score-number">{animCount}</span>
                <span className="score-divider">/{result.total}</span>
              </div>
            </div>
          </div>

          <p className="score-message">{grade.msg}</p>

          <div className="score-stats">
            <div className="stat">
              <span className="stat-value" style={{ color: '#6bcb77' }}>{result.score}</span>
              <span className="stat-label">✓ Верно</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value" style={{ color: '#ff6b6b' }}>{result.total - result.score}</span>
              <span className="stat-label">✗ Неверно</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value" style={{ color: grade.color }}>{percent}%</span>
              <span className="stat-label">Результат</span>
            </div>
          </div>
        </div>

        {/* Export */}
        <div className="export-section card animate-slide-up">
          <h3 className="export-title">📥 Скачать результаты</h3>
          <div className="export-buttons">
            <button type="button" className="btn btn-primary export-btn" onClick={handleExportWord} disabled={!!exportLoading}>
              {exportLoading === 'word' ? '⏳ Создаётся...' : '📝 Word (.docx)'}
            </button>
            <button type="button" className="btn btn-success export-btn" onClick={handleExportExcel} disabled={!!exportLoading}>
              {exportLoading === 'excel' ? '⏳ Создаётся...' : '📊 Excel (.xlsx)'}
            </button>
          </div>
        </div>

        {/* Answers */}
        <div className="details-section animate-slide-up">
          <button type="button" className="details-toggle" onClick={() => setShowDetails(v => !v)}>
            <span>{showDetails ? '🙈 Скрыть' : '🔍 Посмотреть'} все ответы</span>
            <span className={`details-arrow ${showDetails ? 'open' : ''}`}>▼</span>
          </button>

          {showDetails && (
            <div className="answers-list animate-slide-up">
              {result.questions.map((q, i) => {
                const userAns = result.answers[i];
                const isCorrect = userAns === q.correct;
                return (
                  <div key={i} className={`answer-item ${isCorrect ? 'correct' : 'wrong'}`}>
                    <div className="answer-header">
                      <span className="answer-num">{i + 1}</span>
                      <span className="answer-emoji">{q.emoji}</span>
                      <span className="answer-q">{q.question}</span>
                      <span className={`answer-badge ${isCorrect ? 'correct' : 'wrong'}`}>{isCorrect ? '✓' : '✗'}</span>
                    </div>
                    <div className="answer-body">
                      <div className={`answer-choice ${isCorrect ? 'correct' : 'wrong'}`}>
                        <span>Твой ответ:</span>
                        <strong>{q.options[userAns]}</strong>
                      </div>
                      {!isCorrect && (
                        <div className="answer-choice correct">
                          <span>Правильно:</span>
                          <strong>{q.options[q.correct]}</strong>
                        </div>
                      )}
                      <p className="answer-explanation">💡 {q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="result-actions animate-slide-up">
          <button type="button" className="btn btn-primary" onClick={onRestart}>
            🔄 Пройти снова
          </button>
        </div>
      </main>
    </div>
  );
}
