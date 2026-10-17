import { Outlet } from 'react-router'

import NavBar from '../components/NavBar/Navbar'
import styles from './MainLayout.module.css'

export default function MainLayout() {
  return (
    <div className={styles.layout}>
      <NavBar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
