import { useState } from 'react'
import { Link } from 'react-router'

import { useTheme } from '../../hooks/useTheme'
import type { User } from '../../types'
import AuthModal from '../AuthModal/AuthModal'
import SearchModal from '../SearchModal/SearchModal'
import styles from './Navbar.module.css'

// TODO: брать текущего пользователя из API (src/api/users.ts). null — не залогинен
const user = null as User | null

export default function NavBar() {
  const { theme, toggleTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <header className={styles.navbar}>
      <Link to="/" className={styles.logo}>
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
        >
          <span className={`${styles.icon} ${styles.moonIcon}`} />
        </button>

        {user ? (
          <Link to="/profile" className={styles.avatar} aria-label="Profile">
            {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : user.username[0].toUpperCase()}
          </Link>
        ) : (
          <button type="button" className={styles.login} onClick={() => setAuthOpen(true)}>
            Login
          </button>
        )}
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  )
}
