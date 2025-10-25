import NavDropdown from 'react-bootstrap/NavDropdown';
import { useEffect, useState } from 'react';
import { SunFill, MoonStarsFill } from 'react-bootstrap-icons';

const THEME_KEY = 'theme';
const THEMES = [
  { value: 'light', label: 'Light', icon: <SunFill className="me-2" /> },
  { value: 'dark', label: 'Dark', icon: <MoonStarsFill className="me-2" /> },
];

export const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light');

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return { theme, setTheme };
};

const AppTheme = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  const current = THEMES.find(t => t.value === theme) || THEMES[2];
  return (
    <NavDropdown align="end" title={current.icon} id="theme-nav-dropdown">
      {THEMES.map(t => (
        <NavDropdown.Item
          key={t.value}
          active={theme === t.value}
          onClick={() => handleThemeChange(t.value)}
        >
          {t.icon}{t.label}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};

export default AppTheme;
