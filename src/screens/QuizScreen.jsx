import { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import ProgressBar from '../components/ProgressBar';
import { questions9to11, questions12to14 } from '../data/questions';
import { fireSmallConfetti } from '../utils/confetti';
import '../pages/Quiz.css';

const FEEDBACK_DURATION = 1600;

export default function QuizScreen({ name, ageGroup, onFinish, onBack }) {
  const questions = ageGroup === '9-11' ? questions9to11 : questions12to14;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const [showStreak, setShowStreak] = useState(false);
  const [fading, setFading] = useState(false);

  const currentQ = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;

  const handleAnswer = (idx) => {
    if (selected !== null || fading) return;

    const isCorrect = idx === currentQ.correct;
    const newAnswers = [...answers, idx];
    const newStreak = isCorrect ? streak + 1 : 0;

    setSelected(idx);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setAnswers(newAnswers);
    setStreak(newStreak);

    if (isCorrect) {
      fireSmallConfetti();
      if (newStreak >= 3) {
        setShowStreak(true);
        setTimeout(() => setShowStreak(false), 2000);
      }
    }

    setTimeout(() => {
      if (isLast) {
        onFinish({
          name,
          age: ageGroup,
          score: newAnswers.filter((a, i) => a === questions[i].correct).length,
          total: questions.length,
          answers: newAnswers,
          questions,
          date: new Date().toISOString(),
        });
      } else {
        // Сначала убираем подсветку, потом показываем новый вопрос
        setFading(true);
        setSelected(null);
        setFeedback(null);
        setTimeout(() => {
          setCurrentIdx(i => i + 1);
          setFading(false);
        }, 300);
      }
    }, FEEDBACK_DURATION);
  };

  const getOptionClass = (idx) => {
    if (fading || selected === null) return 'option';
    if (idx === currentQ.correct) return 'option correct';
    if (idx === selected) return 'option wrong';
    return 'option dimmed';
  };

  const correctSoFar = answers.filter((a, i) => a === questions[i].correct).length;

  return (
    <div className="quiz-page">
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />

      <header className="quiz-header">
        <div className="quiz-header-inner">
          <button type="button" className="btn btn-outline back-btn" onClick={onBack}>← Выйти</button>
          <div className="quiz-header-right">
            <div className="score-badge">
              <span>⭐</span>
              <span>{correctSoFar}</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="quiz-main">
        <div className="quiz-progress animate-fade-in">
          <ProgressBar current={currentIdx + 1} total={questions.length} />
        </div>

        {showStreak && (
          <div className="streak-toast animate-bounce-in">
            🔥 {streak} подряд! Великолепно!
          </div>
        )}

        <div className={`question-card card ${!fading && feedback ? `feedback-${feedback}` : ''}`}>
          <div className="question-emoji">{currentQ.emoji}</div>
          <h2 className="question-text">{currentQ.question}</h2>

          <div className="options-grid">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                className={getOptionClass(idx)}
                onClick={() => handleAnswer(idx)}
                disabled={selected !== null}
              >
                <span className="option-letter">{['A', 'B', 'C', 'D'][idx]}</span>
                <span className="option-text">{opt}</span>
                {!fading && selected !== null && idx === currentQ.correct && <span className="option-icon">✓</span>}
                {!fading && selected === idx && idx !== currentQ.correct && <span className="option-icon">✗</span>}
              </button>
            ))}
          </div>

          {!fading && feedback && (
            <div className={`explanation animate-slide-up ${feedback}`}>
              <span className="explanation-icon">{feedback === 'correct' ? '🎉' : '💡'}</span>
              <div>
                <p className="explanation-title">{feedback === 'correct' ? 'Правильно!' : 'Почти!'}</p>
                <p className="explanation-text">{currentQ.explanation}</p>
              </div>
            </div>
          )}
        </div>

        <div className="quiz-footer">
          <span className="badge badge-purple">👶 {name}</span>
          <span className="badge badge-blue">🎂 {ageGroup} лет</span>
        </div>
      </main>
    </div>
  );
}
