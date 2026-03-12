import { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import '../pages/Home.css';

const AGE_GROUPS = [
  {
    id: '9-11',
    label: '9–11 лет',
    emoji: '🚀',
    description: '10 вопросов об IT и программировании',
    color: '#4d96ff',
    gradient: 'linear-gradient(135deg, #4d96ff, #c77dff)',
  },
  {
    id: '12-14',
    label: '12–14 лет',
    emoji: '🔬',
    description: '15 вопросов по программированию и технологиям',
    color: '#ff6b6b',
    gradient: 'linear-gradient(135deg, #ff6b6b, #ffd93d)',
  },
];

export default function HomeScreen({ onStart }) {
  const [name, setName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [nameError, setNameError] = useState('');

  const handleStart = () => {
    if (!name.trim()) {
      setNameError('Введи своё имя! 😊');
      return;
    }
    if (!selectedGroup) {
      setNameError('Выбери возрастную группу! 🎂');
      return;
    }
    onStart(name.trim(), selectedGroup);
  };

  return (
    <div className="home-page">
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />

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
        <div className="hero animate-slide-up">
          <div className="hero-emoji animate-float">🧠</div>
          <h1 className="hero-title">BrainQuest</h1>
          <p className="hero-subtitle">Стань крутым разработчиком будущего! 🚀</p>
          <div className="hero-stars">⭐⭐⭐⭐⭐</div>
        </div>

        <div className="form-card card animate-slide-up">
          <div className="form-section">
            <label className="form-label">👤 Твоё имя</label>
            <div className="input-wrapper">
              <input
                className={`name-input ${nameError ? 'error' : ''}`}
                type="text"
                placeholder="Напиши своё имя..."
                value={name}
                maxLength={30}
                onChange={e => { setName(e.target.value); setNameError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleStart()}
              />
              {name && <span className="input-check">✓</span>}
            </div>
            {nameError && <p className="field-error">{nameError}</p>}
          </div>

          <div className="form-section">
            <label className="form-label">🎂 Выбери свою группу</label>
            <div className="age-groups">
              {AGE_GROUPS.map(group => (
                <button
                  key={group.id}
                  type="button"
                  className={`age-group-card ${selectedGroup === group.id ? 'selected' : ''}`}
                  onClick={() => { setSelectedGroup(group.id); setNameError(''); }}
                  style={{ '--group-gradient': group.gradient, '--group-color': group.color }}
                >
                  <span className="age-group-emoji">{group.emoji}</span>
                  <span className="age-group-label">{group.label}</span>
                  <span className="age-group-desc">{group.description}</span>
                  {selectedGroup === group.id && <span className="age-group-check">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary start-btn"
            onClick={handleStart}
          >
            <span>Начать тест</span>
            <span>🚀</span>
          </button>
        </div>

        <div className="features animate-slide-up">
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
