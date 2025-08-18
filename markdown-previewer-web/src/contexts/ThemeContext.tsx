import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useCapacitor } from '../hooks/useCapacitor';

// 主题类型定义
export type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // 从localStorage读取保存的主题设置
    const savedTheme = localStorage.getItem('markdown-previewer-theme') as Theme;
    return savedTheme || 'auto';
  });

  const { updateStatusBar } = useCapacitor();

  // 获取系统主题偏好
  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // 计算实际应用的主题
  const actualTheme: 'light' | 'dark' = theme === 'auto' ? getSystemTheme() : theme;

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // 如果当前是auto模式，强制重新渲染
      if (theme === 'auto') {
        // 触发重新渲染
        setTheme('auto');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // 应用主题到DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', actualTheme);
    document.documentElement.className = actualTheme;
    
    // 更新移动端状态栏
    updateStatusBar(actualTheme === 'dark');
  }, [actualTheme, updateStatusBar]);

  // 保存主题设置到localStorage
  useEffect(() => {
    localStorage.setItem('markdown-previewer-theme', theme);
  }, [theme]);

  // 切换主题（在light和dark之间切换）
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('light');
    } else {
      // 如果是auto，切换到相反的主题
      const systemTheme = getSystemTheme();
      setTheme(systemTheme === 'light' ? 'dark' : 'light');
    }
  };

  const value: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义Hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;