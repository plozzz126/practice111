import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import ProgressBar from '../components/ProgressBar';
import { questions9to11, questions12to14 } from '../data/questions';
import { fireSmallConfetti } from '../utils/confetti';
import './Quiz.css';

const FEEDBACK_DURATION = 1800;

// Read/write localStorage directly to avoid re-render loops
function readLS(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function writeLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export default function Quiz() {
  const navigate = useNavigate();

  // Read quizState once on mount — use ref so updates don't trigger re-renders
  const quizStateRef = useRef(readLS('bq_quiz_state'));
  const [quizState, setQuizStateLocal] = useState(quizStateRef.current);

  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showStreak, setShowStreak] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(
    quizStateRef.current?.currentQuestion ?? 0
  );
  const [answers, setAnswers] = useState(
    quizStateRef.current?.answers ?? []
  );

  useEffect(() => {
    if (!quizState) navigate('/');
  }, []); // eslint-disable-line

  if (!quizState) return null;

  const questions = quizState.ageGroup === '9-11' ? questions9to11 : questions12to14;
  const currentQ = questions[currentQuestion];
  const isLast = currentQuestion === questions.length - 1;

  const handleAnswer = (idx) => {
    if (selected !== null || isTransitioning) return;
    setSelected(idx);

    const isCorrect = idx === currentQ.correct;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak);

    if (isCorrect) {
      fireSmallConfetti();
      if (newStreak >= 3) {
        setShowStreak(true);
        setTimeout(() => setShowStreak(false), 2000);
      }
    }

    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);

    // Save progress to localStorage
    writeLS('bq_quiz_state', {
      ...quizState,
      currentQuestion: currentQuestion + 1,
      answers: newAnswers,
    });

    setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        if (isLast) {
          const result = {
            name: quizState.name,
            age: quizState.ageGroup,
            score: newAnswers.filter((a, i) => a === questions[i].correct).length,
            total: questions.length,
            answers: newAnswers,
            questions,
            date: new Date().toISOString(),
          };
          writeLS('bq_quiz_result', result);
          localStorage.removeItem('bq_quiz_state');
          navigate('/result');
        } else {
          setCurrentQuestion(q => q + 1);
          setSelected(null);
          setFeedback(null);
          setIsTransitioning(false);
        }
      }, 300);
    }, FEEDBACK_DURATION);
  };

  const getOptionClass = (idx) => {
    if (selected === null) return 'option';
    if (idx === currentQ.correct) return 'option correct';
    if (idx === selected && idx !== currentQ.correct) return 'option wrong';
    return 'option dimmed';
  };


  const correctCount = answers.filter((a, i) => a === questions[i].correct).length;

  return (
    <div className={`quiz-page ${isTransitioning ? 'transitioning' : ''}`}>
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />

      {/* Header */}
      <header className="quiz-header">
        <div className="quiz-header-inner">
          <div className="logo">
            <span className="logo-emoji">🧠</span>
            <span className="logo-text">BrainQuest</span>
          </div>
          <div className="quiz-header-right">
            <div className="score-badge">
              <span>⭐</span>
              <span>{correctCount}</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="quiz-main">
        {/* Progress */}
        <div className="quiz-progress animate-fade-in">
          <ProgressBar
            current={currentQuestion + 1}
            total={questions.length}
          />
        </div>

        {/* Streak notification */}
        {showStreak && (
          <div className="streak-toast animate-bounce-in">
            🔥 {streak} подряд! Великолепно!
          </div>
        )}

        {/* Question Card */}
        <div className={`question-card card animate-slide-up ${feedback ? `feedback-${feedback}` : ''}`}>
          <div className="question-emoji">{currentQ.emoji}</div>
          <h2 className="question-text">{currentQ.question}</h2>

          {/* Options */}
          <div className="options-grid">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                className={getOptionClass(idx)}
                onClick={() => handleAnswer(idx)}
                disabled={selected !== null}
              >
                <span className="option-letter">
                  {['A', 'B', 'C', 'D'][idx]}
                </span>
                <span className="option-text">{opt}</span>
                {selected !== null && idx === currentQ.correct && (
                  <span className="option-icon">✓</span>
                )}
                {selected === idx && idx !== currentQ.correct && (
                  <span className="option-icon">✗</span>
                )}
              </button>
            ))}
          </div>

          {/* Explanation */}
          {feedback && (
            <div className={`explanation animate-slide-up ${feedback}`}>
              <span className="explanation-icon">
                {feedback === 'correct' ? '🎉' : '💡'}
              </span>
              <div>
                <p className="explanation-title">
                  {feedback === 'correct' ? 'Правильно!' : 'Почти!'}
                </p>
                <p className="explanation-text">{currentQ.explanation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Fun fact at bottom */}
        <div className="quiz-footer">
          <span className="badge badge-purple">
            👶 {quizState.name}
          </span>
          <span className="badge badge-blue">
            🎂 {quizState.ageGroup} лет
          </span>
        </div>
      </main>
    </div>
  );
}
