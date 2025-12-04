import React from 'react'
import Homepage from './pages/HomePage.jsx'
import Layout from './Components/Layout.jsx'
import { Route, Routes } from 'react-router-dom'
import Kitob from './pages/Kitob.jsx'
import Kutubxonalar from './pages/Kutubxonalar.jsx'

const App = () => {
  return (
    <div>
       <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/kitob" element={<Kitob />} />
          <Route path="/kutubxona" element={<Kutubxonalar />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
