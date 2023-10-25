import { SunIcon } from '@heroicons/react/24/outline';
import { MoonIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

export default function ThemeButton() {
  const [theme, setTheme] = useState();

  useEffect(() => setTheme(localStorage.theme), []);

  const toggleTheme = () => {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (localStorage.theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
    setTheme(localStorage.theme);

    // Whenever the user explicitly chooses to respect the OS preference
    // localStorage.removeItem('theme');
  };

  const isLightTheme = theme !== 'dark';

  return (
    <button aria-label='Switch Light/Dark Mode' onClick={() => toggleTheme()}>
      {isLightTheme ? (
        <SunIcon className='w-5 h-5' />
      ) : (
        <MoonIcon className='w-5 h-5' />
      )}
    </button>
  );
}
