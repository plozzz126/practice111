import { useState, useEffect } from 'react';
import { ThemeProvider } from './hooks/useTheme';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import ResultScreen from './screens/ResultScreen';
import './styles/globals.css';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [quizData, setQuizData] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bq_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.screen === 'result' && parsed.result) {
          setResult(parsed.result);
          setScreen('result');
        }
      }
    } catch {}
  }, []);

  const startQuiz = (name, ageGroup) => {
    setQuizData({ name, ageGroup });
    setScreen('quiz');
  };

  const finishQuiz = (resultObj) => {
    setResult(resultObj);
    setScreen('result');
    try {
      localStorage.setItem('bq_session', JSON.stringify({ screen: 'result', result: resultObj }));
    } catch {}
  };

  const restart = () => {
    setQuizData(null);
    setResult(null);
    setScreen('home');
    try { localStorage.removeItem('bq_session'); } catch {}
  };

  return (
    <ThemeProvider>
      {screen === 'home' && <HomeScreen onStart={startQuiz} />}
      {screen === 'quiz' && quizData && (
        <QuizScreen
          name={quizData.name}
          ageGroup={quizData.ageGroup}
          onFinish={finishQuiz}
          onBack={restart}
        />
      )}
      {screen === 'result' && result && (
        <ResultScreen result={result} onRestart={restart} />
      )}
    </ThemeProvider>
  );
}
