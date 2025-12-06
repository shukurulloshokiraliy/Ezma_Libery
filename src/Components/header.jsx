import React, { useState, useEffect } from 'react';
import { Group, Button } from '@mantine/core';
import { NavLink } from 'react-router-dom';

// LOGO FILES
import light_logo from '../assets/images/logo-smart.svg';
import dark_logo from '../assets/images/logo1.png';

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
        height: "80px",
        padding: "0 48px",
        background: isDark 
          ? "linear-gradient(90deg, #1a1d29 0%, #2d1f3f 50%, #1a1d29 100%)"
          : "linear-gradient(90deg, #c17d11 0%, #d4a11e 50%, #c17d11 100%)",
        display: "flex",
        alignItems: "center",
        transition: "background 0.3s ease",
        position: "relative",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
      }}
    >
      <Group style={{ width: "100%", justifyContent: "space-between" }}>
    
        <Group>
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <img 
              src={isDark ? light_logo : dark_logo}
              alt="Ezma"
              style={{ 
                width: 80,
                filter: isDark ? 'brightness(1.2)' : 'brightness(1)'
              }}
            />
          </NavLink>
        </Group>

        <Group gap="lg">
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Button
                variant={isActive ? "filled" : "subtle"}
                color={isActive ? "yellow" : undefined}
                style={{
                  fontWeight: isActive ? 600 : 500,
                  color: isActive 
                    ? (isDark ? '#1a1d29' : '#000') 
                    : (isDark ? '#ffffff' : '#ffffff'),
                  backgroundColor: isActive 
                    ? (isDark ? '#ffd43b' : '#fff') 
                    : 'transparent',
                  transition: 'all 0.2s ease'
                }}
                styles={{
                  root: {
                    '&:hover': {
                      backgroundColor: isActive 
                        ? undefined 
                        : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)')
                    }
                  }
                }}
              >
                Bosh sahifa
              </Button>
            )}
          </NavLink>

          <NavLink to="/kitob" style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Button
                variant={isActive ? "filled" : "subtle"}
                color={isActive ? "yellow" : undefined}
                style={{
                  fontWeight: isActive ? 600 : 500,
                  color: isActive 
                    ? (isDark ? '#1a1d29' : '#000') 
                    : (isDark ? '#ffffff' : '#ffffff'),
                  backgroundColor: isActive 
                    ? (isDark ? '#ffd43b' : '#fff') 
                    : 'transparent',
                  transition: 'all 0.2s ease'
                }}
                styles={{
                  root: {
                    '&:hover': {
                      backgroundColor: isActive 
                        ? undefined 
                        : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)')
                    }
                  }
                }}
              >
                Kitoblar
              </Button>
            )}
          </NavLink>

          <NavLink to="/kutubxona" style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Button
                variant={isActive ? "filled" : "subtle"}
                color={isActive ? "yellow" : undefined}
                style={{
                  fontWeight: isActive ? 600 : 500,
                  color: isActive 
                    ? (isDark ? '#1a1d29' : '#000') 
                    : (isDark ? '#ffffff' : '#ffffff'),
                  backgroundColor: isActive 
                    ? (isDark ? '#ffd43b' : '#fff') 
                    : 'transparent',
                  transition: 'all 0.2s ease'
                }}
                styles={{
                  root: {
                    '&:hover': {
                      backgroundColor: isActive 
                        ? undefined 
                        : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)')
                    }
                  }
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
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.3)",
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
                fontSize: 13,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
              }}
            >
              {isDark ? "🌙" : "☀️"}
            </div>
          </button>

          <NavLink to="/login" style={{ textDecoration: 'none' }}>
            <Button 
              variant="filled" 
              radius="md"
              style={{
                backgroundColor: isDark ? '#ffd43b' : '#fff',
                color: isDark ? '#1a1d29' : '#c17d11',
                fontWeight: 600,
                border: 'none',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s ease'
              }}
              styles={{
                root: {
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                  }
                }
              }}
            >
              Kutubxonachi bo'lish
            </Button>
          </NavLink>
        </Group>
      </Group>
    </header>
  );
};

export default Header;