import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const mustContain = (file, snippets) => {
  const source = readFileSync(file, 'utf8');
  for (const snippet of snippets) {
    if (!source.includes(snippet)) {
      throw new Error(`Expected "${snippet}" in ${file}`);
    }
  }
};

const themeProviderFile = resolve('src/app/providers/theme-provider.tsx');
const themeToggleFile = resolve('src/shared/ui/theme-toggle.tsx');
const storageFile = resolve('src/shared/lib/storage.ts');

mustContain(themeProviderFile, [
  "root.classList.remove('dark', 'light')",
  'root.classList.add(theme)',
  'setStoredTheme(theme)',
  "toggleTheme: () => setThemeState((current) => (current === 'dark' ? 'light' : 'dark'))"
]);

mustContain(themeToggleFile, [
  'const { theme, toggleTheme } = useTheme()',
  'onClick={toggleTheme}',
  "{theme === 'dark' ? <Sun size={16} /> : <MoonStar size={16} />}"
]);

mustContain(storageFile, [
  "const THEME_KEY = 'aicostguard_theme'",
  "if (raw === 'light' || raw === 'dark') return raw",
  "window.matchMedia('(prefers-color-scheme: light)').matches",
  "window.matchMedia('(prefers-color-scheme: dark)').matches"
]);

console.log('theme-toggle-regression: PASS');
