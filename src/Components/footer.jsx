import React, { useState, useEffect } from 'react';
import { Container, Group, Text, Stack, Anchor } from '@mantine/core';

const Footer = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) setIsDark(saved === 'true');

    const handleDarkModeChange = () => {
      const saved = localStorage.getItem('darkMode');
      setIsDark(saved === 'true');
    };

    window.addEventListener('darkModeChange', handleDarkModeChange);
    return () => window.removeEventListener('darkModeChange', handleDarkModeChange);
  }, []);

  const toggleDark = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    localStorage.setItem('darkMode', newValue);
    window.dispatchEvent(new Event('darkModeChange'));
  };

  return (
    <footer style={{ 
      backgroundColor: isDark ? '#1a1b1e' : '#f8f9fa', 
      borderTop: `1px solid ${isDark ? '#373a40' : '#e9ecef'}`,
      padding: '48px 0 24px',
      transition: 'all 0.3s'
    }}>
      <Container size="xl">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '48px',
          marginBottom: '48px'
        }}>
          {/* Logo va tavsif */}
          <Stack gap="md">
            <Group gap="xs">
            <img 
            src={isDark 
              ? "	https://ezma-client.vercel.app/assets/ezma-dark-Bt8MX4wU.svg" 
              : "https://ezma-client.vercel.app/assets/ezma-light-D6Z9QF3F.svg"
            } 
            alt="Ezma"
            style={{ width: 100 }} 
          />
            </Group>
            <Text size="sm" c={isDark ? '#909296' : 'dimmed'} style={{ maxWidth: '300px' }}>
              O'zbekistonning eng yirik kutubxona tarmog'i. Biz bilan kitob o'qishni boshlang!
            </Text>
          </Stack>

          {/* Tezkor havolalar */}
          <Stack gap="md">
            <Text size="md" fw={600} c={isDark ? 'white' : 'black'}>Tezkor havolalar</Text>
            <Stack gap="xs">
              <Anchor href="#" size="sm" c={isDark ? '#909296' : 'dimmed'} style={{ textDecoration: 'none' }}>
                Bosh sahifa
              </Anchor>
              <Anchor href="#" size="sm" c={isDark ? '#909296' : 'dimmed'} style={{ textDecoration: 'none' }}>
                Kutubxonalar
              </Anchor>
              <Anchor href="#" size="sm" c={isDark ? '#909296' : 'dimmed'} style={{ textDecoration: 'none' }}>
                Kitoblar
              </Anchor>
              <Anchor href="#" size="sm" c={isDark ? '#909296' : 'dimmed'} style={{ textDecoration: 'none' }}>
                Tadbirlar
              </Anchor>
              <Anchor href="#" size="sm" c={isDark ? '#909296' : 'dimmed'} style={{ textDecoration: 'none' }}>
                Biz haqimizda
              </Anchor>
            </Stack>
          </Stack>

          {/* Bog'lanish */}
          <Stack gap="md">
            <Text size="md" fw={600} c={isDark ? 'white' : 'black'}>Bog'lanish</Text>
            <Stack gap="xs">
              <Group gap="xs">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#909296' : '#868e96'} strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <Text size="sm" c={isDark ? '#909296' : 'dimmed'}>+998 90 123 45 67</Text>
              </Group>
              <Group gap="xs">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#909296' : '#868e96'} strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <Text size="sm" c={isDark ? '#909296' : 'dimmed'}>info@ezma.uz</Text>
              </Group>
              <Group gap="xs">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#909296' : '#868e96'} strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <Text size="sm" c={isDark ? '#909296' : 'dimmed'}>Toshkent shahri, Yunusobod tumani</Text>
              </Group>
            </Stack>
          </Stack>

          {/* Ijtimoiy tarmoqlar */}
          <Stack gap="md">
            <Text size="md" fw={600} c={isDark ? 'white' : 'black'}>Ijtimoiy tarmoqlar</Text>
            <Group gap="md">
              
            </Group>
            <Group gap="md">
              <a href="#" style={{ color: isDark ? '#909296' : '#868e96', transition: 'color 0.2s' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" style={{ color: isDark ? '#909296' : '#868e96', transition: 'color 0.2s' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" style={{ color: isDark ? '#909296' : '#868e96', transition: 'color 0.2s' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </Group>
          </Stack>
        </div>

        {/* Copyright */}
        <div style={{ 
          borderTop: `1px solid ${isDark ? '#373a40' : '#e9ecef'}`, 
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <Text size="sm" c={isDark ? '#909296' : 'dimmed'}>
            © 2024 EZMA. Barcha huquqlar himoyalangan
          </Text>
          <Group gap="lg">
            <Anchor href="#" size="sm" c={isDark ? '#909296' : 'dimmed'} style={{ textDecoration: 'none' }}>
              Maxfiylik siyosati
            </Anchor>
            <Anchor href="#" size="sm" c={isDark ? '#909296' : 'dimmed'} style={{ textDecoration: 'none' }}>
              Foydalanish shartlari
            </Anchor>
          </Group>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;