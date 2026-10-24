import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'

import { useTheme } from '../../hooks/useTheme'
import type { User } from '../../types'
import AuthModal from '../AuthModal/AuthModal'
import SearchModal from '../SearchModal/SearchModal'
import styles from './Navbar.module.css'

// TODO: брать текущего пользователя из API (src/api/users.ts). null — не залогинен
const user = null as User | null


const SHRINK_DISTANCE = 160

export default function NavBar() {
  const { theme, toggleTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const ref = useRef<HTMLElement>(null)

  
  useEffect(() => {
    let frame = 0
    const check = () => {
      frame = 0
      const p = Math.min(window.scrollY / SHRINK_DISTANCE, 1)
      ref.current?.style.setProperty('--shrink', (p * p * (3 - 2 * p)).toFixed(3))
      ref.current?.querySelectorAll<HTMLElement>('[data-adaptive]').forEach((el) => {
        const r = el.getBoundingClientRect()
        const below = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
        const color = below.map((node) => node.closest<HTMLElement>('[data-nav]')?.dataset.nav).find(Boolean)
        if (color) el.style.setProperty('--nav-color', color)
        else el.style.removeProperty('--nav-color')
      })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }

    check()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const id = setInterval(schedule, 500)
    return () => {
      cancelAnimationFrame(frame)
      clearInterval(id)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <header ref={ref} className={styles.navbar}>
      <div className={styles.bar} />

      <Link to="/" className={styles.logo} data-adaptive>
        Balb
      </Link>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.iconButton} ${styles.search}`}
          aria-label="Search"
          onClick={() => setSearchOpen(true)}
        >
          <span className={`${styles.icon} ${styles.searchIcon}`} />
        </button>

        {/* Смена темы готова */}
        <button
          type="button"
          className={styles.iconButton}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          onClick={toggleTheme}
          disabled
          data-adaptive
        >
          <span className={`${styles.icon} ${styles.moonIcon}`} />
        </button>

        {user ? (
          <Link to="/profile" className={styles.avatar} aria-label="Profile">
            {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : user.username[0].toUpperCase()}
          </Link>
        ) : (
          <button type="button" className={styles.login} onClick={() => setAuthOpen(true)} data-adaptive>
            Login
          </button>
        )}
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  )
}
