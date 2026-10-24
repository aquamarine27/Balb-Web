import { BrowserRouter, Routes, Route } from 'react-router'
import { ReactLenis } from 'lenis/react'

import MainLayout from './layouts/MainLayout'
import Home from './pages/Home/Home'

// для тач устройств
const SMOOTH_SCROLL = window.matchMedia('(hover: hover) and (pointer: fine)').matches

function App() {
  return (
    <BrowserRouter>
      {SMOOTH_SCROLL && <ReactLenis root options={{ lerp: 0.07 }} />}
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
