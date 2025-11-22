import { Nav } from 'react-bootstrap';
import { SunFill, MoonStarsFill } from 'react-bootstrap-icons';
import { useTheme } from './useTheme';

const AppTheme = () => {
  const { theme, setTheme } = useTheme();
  const isLight = theme === 'light';
  const nextTheme = isLight ? 'dark' : 'light';
  const Icon = isLight ? MoonStarsFill : SunFill;

  const handleToggle = () => {
    setTheme(nextTheme);
  };

  return (
    <Nav.Link onClick={handleToggle} title="Toggle theme">
      <Icon size={20} />
    </Nav.Link>
  );
};

export default AppTheme;
