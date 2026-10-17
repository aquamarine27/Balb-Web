import { useState } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

// Сохранённая тема
function getInitialTheme(): Theme {
  const saved = document.documentElement.dataset.theme
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      
    }
    setTheme(next)
  }

  return { theme, toggleTheme }
}
