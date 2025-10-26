// No Button import needed
import { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { SunFill, MoonStarsFill } from 'react-bootstrap-icons';

const THEME_KEY = 'theme';

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
  const isLight = theme === 'light';
  const nextTheme = isLight ? 'dark' : 'light';
  const Icon = isLight ? MoonStarsFill : SunFill;

  const handleToggle = () => {
    setTheme(nextTheme);
  };

  return (
    <Nav.Link onClick={handleToggle} title="Login">
      <Icon size={20} />
    </Nav.Link>

  );
};

export default AppTheme;
