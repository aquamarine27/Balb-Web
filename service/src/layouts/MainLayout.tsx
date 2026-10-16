import { Outlet } from 'react-router'

import NavBar from '../components/NavBar/Navbar'

export default function MainLayout() {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </>
  )
}
