import { BrowserRouter, Routes, Route } from 'react-router'
import { ReactLenis } from 'lenis/react'

import MainLayout from './layouts/MainLayout'
import Home from './pages/Home/Home'

function App() {
  return (
    <BrowserRouter>
      <ReactLenis root />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
