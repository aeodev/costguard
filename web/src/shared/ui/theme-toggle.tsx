import { MoonStar, Sun } from 'lucide-react';
import { useTheme } from '../../app/providers/theme-provider';
import { Button } from './button';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="ghost" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? <Sun size={16} /> : <MoonStar size={16} />}
    </Button>
  );
};
