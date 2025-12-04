import React, { useState, useEffect } from 'react';
import { Group, Button } from '@mantine/core';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) setIsDark(saved === 'true');
  }, []);

  const toggleDark = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    localStorage.setItem('darkMode', newValue);
    window.dispatchEvent(new Event('darkModeChange'));
  };

  return (
    <header
      style={{
        height: "70px",
        padding: "0 48px",
        borderBottom: `1px solid ${isDark ? '#373a40' : '#e0e0e0'}`,
        backgroundColor: isDark ? "#1a1b1e" : "#ffffff",
        display: "flex",
        alignItems: "center",
        transition: "0.3s"
      }}
    >
      <Group style={{ width: "100%", justifyContent: "space-between" }}>
        <Group>
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <img 
              src={isDark 
                ? "https://ezma-client.vercel.app/assets/ezma-dark-Bt8MX4wU.svg" 
                : "https://ezma-client.vercel.app/assets/ezma-light-D6Z9QF3F.svg"
              } 
              alt="Ezma"
              style={{ width: 120 }} 
            />
          </NavLink>
        </Group>

        <Group gap="lg">
          <NavLink 
            to="/" 
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <Button 
                variant={isActive ? "light" : "subtle"}
                color={isActive ? "blue" : (isDark ? 'gray.4' : 'gray')}
                style={{ 
                  fontWeight: isActive ? 600 : 400,
                  color: isActive 
                    ? undefined 
                    : (isDark ? '#fff' : '#000')
                }}
              >
                Bosh sahifa
              </Button>
            )}
          </NavLink>
          
          <NavLink 
            to="/kitob" 
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <Button 
                variant={isActive ? "light" : "subtle"}
                color={isActive ? "blue" : (isDark ? 'gray.4' : 'gray')}
                style={{ 
                  fontWeight: isActive ? 600 : 400,
                  color: isActive 
                    ? undefined 
                    : (isDark ? '#fff' : '#000')
                }}
              >
                Kitoblar
              </Button>
            )}
          </NavLink>
          
          <NavLink 
            to="/kutubxona" 
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <Button 
                variant={isActive ? "light" : "subtle"}
                color={isActive ? "blue" : (isDark ? 'gray.4' : 'gray')}
                style={{ 
                  fontWeight: isActive ? 600 : 400,
                  color: isActive 
                    ? undefined 
                    : (isDark ? '#fff' : '#000')
                }}
              >
                Kutubxonalar
              </Button>
            )}
          </NavLink>
        </Group>

        <Group>
          <button
            onClick={toggleDark}
            style={{
              width: 50,
              height: 26,
              borderRadius: 13,
              border: "none",
              backgroundColor: isDark ? "#373a40" : "#e9ecef",
              position: "relative",
              cursor: "pointer",
              transition: "0.3s"
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: "#fff",
                position: "absolute",
                top: 3,
                left: isDark ? 27 : 3,
                transition: "0.3s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13
              }}
            >
              {isDark ? "🌙" : "☀️"}
            </div>
          </button>

          <Button variant="filled" radius="md">
            Kutubxonachi bo'lish
          </Button>
        </Group>
      </Group>
    </header>
  );
};

export default Header;