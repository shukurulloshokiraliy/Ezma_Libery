import React, { useState, useEffect } from 'react';
import { Group, Button, Avatar } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { IconLogout, IconUser } from '@tabler/icons-react';

import light_logo from '../assets/images/logo-smart.svg';
import dark_logo from '../assets/images/logo1.png';

const Header = () => {
  const [isDark, setIsDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const savedDark = localStorage.getItem('darkMode');
    if (savedDark) setIsDark(savedDark === 'true');

    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(loginStatus === 'true');
      
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        try {
          setUserData(JSON.parse(userDataStr));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    };

    checkLoginStatus();
    
    // Barcha eventlarni tinglash
    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("loginSuccess", checkLoginStatus);
    window.addEventListener("logoutSuccess", checkLoginStatus);
    
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginSuccess", checkLoginStatus);
      window.removeEventListener("logoutSuccess", checkLoginStatus);
    };
  }, []);

  const toggleDark = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    localStorage.setItem('darkMode', newValue);
    window.dispatchEvent(new Event('darkModeChange'));
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('userPhone');
    setIsLoggedIn(false);
    setUserData(null);
    
    // Logout eventini yuborish
    window.dispatchEvent(new Event('logoutSuccess'));
    
    window.location.href = '/login';
  };

  const getUserName = () => {
    if (userData?.name) return userData.name;
    if (userData?.first_name) return userData.first_name;
    if (userData?.username) return userData.username;
    if (userData?.phone) return userData.phone;
    return 'Foydalanuvchi';
  };

  const getUserInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
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
                filter: isDark ? 'brightness(1.2)' : 'brightness(1)',
                transition: "filter 0.3s ease"
              }}
            />
          </NavLink>
        </Group>

        <Group gap="lg">
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <Button variant="subtle" style={{ color: isDark ? '#fff' : '#000', transition: "color 0.3s ease" }}>
              Bosh sahifa
            </Button>
          </NavLink>

          <NavLink to="/kitob" style={{ textDecoration: 'none' }}>
            <Button variant="subtle" style={{ color: isDark ? '#fff' : '#000', transition: "color 0.3s ease" }}>
              Kitoblar
            </Button>
          </NavLink>

          <NavLink to="/kutubxona" style={{ textDecoration: 'none' }}>
            <Button variant="subtle" style={{ color: isDark ? '#fff' : '#000', transition: "color 0.3s ease" }}>
              Kutubxonalar
            </Button>
          </NavLink>
        </Group>

        <Group gap="sm">
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

          {isLoggedIn ? (
            <>
              <NavLink to="/profile" style={{ textDecoration: 'none' }}>
                <Button
                  leftSection={
                    <Avatar 
                      color="orange" 
                      radius="xl" 
                      size={28}
                    >
                      {getUserInitial()}
                    </Avatar>
                  }
                  size="md"
                  radius="md"
                  variant="filled"
                  style={{
                    backgroundColor: isDark ? '#ffd43b' : '#fff',
                    color: isDark ? '#1a1d29' : '#c17d11',
                    fontWeight: 600,
                    transition: "all 0.3s ease"
                  }}
                >
                  {getUserName()}
                </Button>
              </NavLink>

              <Button
                leftSection={<IconLogout size={18} />}
                onClick={handleLogout}
                size="md"
                radius="md"
                variant="filled"
                color="red"
                style={{
                  transition: "all 0.3s ease"
                }}
              >
                Chiqish
              </Button>
            </>
          ) : (
            <NavLink to="/login" style={{ textDecoration: 'none' }}>
              <Button
                leftSection={<IconUser size={18} />}
                size="md"
                radius="md"
                variant="filled"
                style={{
                  backgroundColor: isDark ? '#ffd43b' : '#fff',
                  color: isDark ? '#1a1d29' : '#c17d11',
                  fontWeight: 600,
                  transition: "all 0.3s ease"
                }}
              >
                Kirish
              </Button>
            </NavLink>
          )}
        </Group>
      </Group>
    </header>
  );
};

export default Header;