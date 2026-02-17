import { cn } from '../lib/cn';
import { useTheme } from '../../app/providers/theme-provider';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center rounded-lg bg-surface-elev/95 p-1 text-xs shadow-soft">
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={cn(
          'rounded-md px-2.5 py-1 transition',
          theme === 'dark' ? 'bg-surface-soft/85 text-slate-100' : 'text-slate-400 hover:bg-surface-soft/60 hover:text-slate-200'
        )}
      >
        Dark
      </button>
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={cn(
          'rounded-md px-2.5 py-1 transition',
          theme === 'light' ? 'bg-surface-soft/85 text-slate-100' : 'text-slate-400 hover:bg-surface-soft/60 hover:text-slate-200'
        )}
      >
        Light
      </button>
    </div>
  );
};
