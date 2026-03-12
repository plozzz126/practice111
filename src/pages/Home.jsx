import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './Home.css';

const AGE_GROUPS = [
  {
    id: '9-11',
    label: '9–11 лет',
    emoji: '🚀',
    description: '10 вопросов об окружающем мире',
    color: '#4d96ff',
    gradient: 'linear-gradient(135deg, #4d96ff, #c77dff)',
    questions: 10,
  },
  {
    id: '12-14',
    label: '12–14 лет',
    emoji: '🔬',
    description: '15 вопросов по науке и истории',
    color: '#ff6b6b',
    gradient: 'linear-gradient(135deg, #ff6b6b, #ffd93d)',
    questions: 15,
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [nameError, setNameError] = useState('');
  const [, setQuizState] = useLocalStorage('bq_quiz_state', null);

  const handleStart = () => {
    if (!name.trim()) {
      setNameError('Введи своё имя! 😊');
      return;
    }
    if (!selectedGroup) {
      return;
    }

    setQuizState({
      name: name.trim(),
      ageGroup: selectedGroup,
      currentQuestion: 0,
      answers: [],
      startedAt: new Date().toISOString(),
    });

    navigate('/quiz');
  };

  return (
    <div className="home-page">
      {/* BG blobs */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />

      {/* Header */}
      <header className="home-header">
        <div className="home-header-inner">
          <div className="logo">
            <span className="logo-emoji">🧠</span>
            <span className="logo-text">BrainQuest</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="home-main">
        {/* Hero */}
        <div className="hero animate-slide-up">
          <div className="hero-emoji animate-float">🧠</div>
          <h1 className="hero-title">BrainQuest</h1>
          <p className="hero-subtitle">
            Проверь свои знания и стань чемпионом! 🏆
          </p>
          <div className="hero-stars">
            {'⭐'.repeat(5)}
          </div>
        </div>

        {/* Form Card */}
        <div className="form-card card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Name Input */}
          <div className="form-section">
            <label className="form-label">
              <span>👤 Твоё имя</span>
            </label>
            <div className="input-wrapper">
              <input
                className={`name-input ${nameError ? 'error' : ''}`}
                type="text"
                placeholder="Напиши своё имя..."
                value={name}
                maxLength={30}
                onChange={e => {
                  setName(e.target.value);
                  setNameError('');
                }}
                onKeyDown={e => e.key === 'Enter' && handleStart()}
              />
              {name && <span className="input-check">✓</span>}
            </div>
            {nameError && <p className="field-error">{nameError}</p>}
          </div>

          {/* Age Group */}
          <div className="form-section">
            <label className="form-label">
              <span>🎂 Выбери свою группу</span>
            </label>
            <div className="age-groups">
              {AGE_GROUPS.map(group => (
                <button
                  key={group.id}
                  className={`age-group-card ${selectedGroup === group.id ? 'selected' : ''}`}
                  onClick={() => setSelectedGroup(group.id)}
                  style={{
                    '--group-gradient': group.gradient,
                    '--group-color': group.color,
                  }}
                >
                  <span className="age-group-emoji">{group.emoji}</span>
                  <span className="age-group-label">{group.label}</span>
                  <span className="age-group-desc">{group.description}</span>
                  {selectedGroup === group.id && (
                    <span className="age-group-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            className={`btn btn-primary start-btn ${(!name.trim() || !selectedGroup) ? 'disabled' : ''}`}
            onClick={handleStart}
            disabled={!name.trim() || !selectedGroup}
          >
            <span>Начать тест</span>
            <span>🚀</span>
          </button>
        </div>

        {/* Features */}
        <div className="features animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {[
            { icon: '🎯', text: 'Интересные вопросы' },
            { icon: '🏆', text: 'Твой результат' },
            { icon: '📄', text: 'Скачать отчёт' },
            { icon: '🌟', text: 'Узнай новое!' },
          ].map((f, i) => (
            <div className="feature-chip" key={i}>
              <span>{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
