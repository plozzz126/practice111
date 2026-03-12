import { useTheme } from '../hooks/useTheme';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
    >
      <span className="theme-toggle-track">
        <span className={`theme-toggle-thumb ${theme === 'dark' ? 'dark' : ''}`}>
          {theme === 'light' ? '☀️' : '🌙'}
        </span>
      </span>
    </button>
  );
}
