import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  const theme = {
    dark: {
      bg: '#0f0e0d',
      bg2: '#1a1816',
      bg3: '#252220',
      border: '#3a3530',
      border2: '#4a4238',
      text: '#f0ebe0',
      text2: '#c4b8a0',
      text3: '#7a7060',
      accent: '#4f7cff',
      accent2: '#7c5cfc',
      green: '#8fb569',
      red: '#d97171',
      orange: '#d4944a',
      yellow: '#f4d03f',
      teal: '#6aad92',
    },
    light: {
      bg: '#faf8f3',
      bg2: '#f5f2ea',
      bg3: '#ebe6db',
      border: '#d9d0bf',
      border2: '#c9bfae',
      text: '#2a2520',
      text2: '#5a5045',
      text3: '#8a7d6f',
      accent: '#4f7cff',
      accent2: '#7c5cfc',
      green: '#6a9048',
      red: '#c94545',
      orange: '#c9762e',
      yellow: '#f4d03f',
      teal: '#4a9275',
    },
  };

  const toggleTheme = () => setIsDark(!isDark);

  const colors = isDark ? theme.dark : theme.light;

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
