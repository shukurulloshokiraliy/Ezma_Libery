import React from 'react'
import Header from './header'
import { Outlet } from 'react-router-dom'
import Footer from './footer'

const Layout = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
      }}
    >
      <Header />

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default Layout
