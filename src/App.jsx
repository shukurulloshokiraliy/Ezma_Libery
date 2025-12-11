import React from 'react'
import Homepage from './pages/HomePage.jsx'
import Layout from './Components/Layout.jsx'
import { Route, Routes } from 'react-router-dom'
import Kitob from './pages/Kitob.jsx'
import Kutubxonalar from './pages/Kutubxonalar.jsx'
import Login from './pages/Login/Login.jsx'
import DetailBook from './pages/Details/DetailBook.jsx'
import DetailLibrary from './pages/Details/DetailLibrary.jsx'
import Profile from './pages/Profile/Profile.jsx'
import Signup from './pages/Sign/Signup.jsx'

const App = () => {
  return (
    <div>
       <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/kitob" element={<Kitob />} />
          <Route path="/kitob/:id" element={<DetailBook />} />
          <Route path="/kutubxona" element={<Kutubxonalar />} />
          <Route path="/kutubxona/:id" element={<DetailLibrary />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/sign" element={<Signup/>} />
        </Route>
      </Routes>
    </div>
  )
}

export default App