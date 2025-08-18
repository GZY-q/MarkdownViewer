import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();

  const getThemeIcon = () => {
    switch (actualTheme) {
      case 'light':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        );
      case 'dark':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return '浅色主题';
      case 'dark':
        return '深色主题';
      case 'auto':
        return `自动主题 (${actualTheme === 'light' ? '浅色' : '深色'})`;
      default:
        return '主题';
    }
  };

  return (
    <div className={`theme-toggle ${className}`}>
      <button
        className="theme-toggle-button"
        onClick={toggleTheme}
        title={`当前: ${getThemeLabel()}, 点击切换主题`}
        aria-label="切换主题"
      >
        <span className="theme-icon">
          {getThemeIcon()}
        </span>
        <span className="theme-label">
          {getThemeLabel()}
        </span>
      </button>
      
      <div className="theme-dropdown">
        <button
          className={`theme-option ${theme === 'light' ? 'active' : ''}`}
          onClick={() => setTheme('light')}
          title="浅色主题"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <span>浅色</span>
        </button>
        
        <button
          className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
          onClick={() => setTheme('dark')}
          title="深色主题"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <span>深色</span>
        </button>
        
        <button
          className={`theme-option ${theme === 'auto' ? 'active' : ''}`}
          onClick={() => setTheme('auto')}
          title="跟随系统主题"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          <span>自动</span>
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;