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

const mainFile = resolve('src/main.tsx');
const appLayoutFile = resolve('src/app/layouts/app-layout.tsx');
const routerFile = resolve('src/app/router/index.tsx');

mustContain(mainFile, [
  "import { ThemeProvider } from './app/providers/theme-provider'",
  '<ThemeProvider>',
  '</ThemeProvider>'
]);

mustContain(appLayoutFile, [
  "import { ThemeToggle } from '../../shared/ui/theme-toggle'",
  '<ThemeToggle />'
]);

mustContain(routerFile, [
  "path: '/app'",
  "path: 'settings'",
  '<AppLayout />'
]);

console.log('theme-module-resolution-regression: PASS');
