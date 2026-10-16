import { Link } from 'react-router'

import { useTheme } from '../../hooks/useTheme'
import type { User } from '../../types'
import styles from './Navbar.module.css'

// TODO: брать текущего пользователя из API (src/api/auth.ts). null — не залогинен
const user = null as User | null

export default function NavBar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        Balb
      </Link>

      <div className={styles.actions}>
        {/* TODO: открывать модалку поиска */}
        <button
          type="button"
          className={`${styles.iconButton} ${styles.search}`}
          aria-label="Search"
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
          <Link to="/login" className={styles.login}>
            Login
          </Link>
        )}
      </div>
    </header>
  )
}
