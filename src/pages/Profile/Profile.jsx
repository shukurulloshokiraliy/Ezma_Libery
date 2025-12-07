import React, { useState, useEffect } from 'react';
import { Container, Paper, Avatar, Text, Box, Group, Stack, Switch, Loader, Alert, Button, Badge } from '@mantine/core';
import { IconUser, IconPhone, IconHome, IconBook, IconClock, IconAlertCircle, IconSettings, IconMail } from '@tabler/icons-react';
import axios from 'axios';

const Profile = () => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookRental, setBookRental] = useState(true);

  useEffect(() => {
    const handleDarkModeChange = () => {
      setIsDark(localStorage.getItem('darkMode') === 'true');
    };

    window.addEventListener('darkModeChange', handleDarkModeChange);
    window.addEventListener('storage', handleDarkModeChange);

    return () => {
      window.removeEventListener('darkModeChange', handleDarkModeChange);
      window.removeEventListener('storage', handleDarkModeChange);
    };
  }, []);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Token topilmadi. Iltimos qayta login qiling.');
        setLoading(false);
        return;
      }

      const { data } = await axios.get(
        'https://org-ave-jimmy-learners.trycloudflare.com/api/v1/auth/profile/',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setUserData(data);
      localStorage.setItem('userData', JSON.stringify(data));
    } catch (err) {
      console.error('Profile fetch error:', err);
      if (err.response?.status === 401) {
        setError('Sessiya tugagan. Iltimos qayta login qiling.');
      } else {
        setError(err.response?.data?.message || 'Profil ma\'lumotlarini yuklashda xatolik');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBookRentalToggle = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const newValue = !bookRental;
      
      await axios.patch(
        'https://org-ave-jimmy-learners.trycloudflare.com/api/v1/auth/profile/',
        { book_rental_enabled: newValue },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setBookRental(newValue);
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const theme = {
    light: {
      bg: '#f5f5f5',
      paper: '#ffffff',
      text: '#000000',
      subtext: '#666666',
      border: '#e0e0e0',
      accent: '#FF6B35',
      cardBg: '#fff',
    },
    dark: {
      bg: '#1a1a2e',
      paper: '#2a2a3e',
      text: '#e0e0e0',
      subtext: '#a0a0a0',
      border: '#3a3a5e',
      accent: '#64B5F6',
      cardBg: '#1e1e2e',
    }
  };

  const t = isDark ? theme.dark : theme.light;

  const getUserName = () => {
    if (!userData) return 'Foydalanuvchi';
    return userData.name || userData.first_name || userData.username || userData.phone || 'Foydalanuvchi';
  };

  const getUserInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <Box
        style={{
          minHeight: '100vh',
          background: t.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
        }}
      >
        <Stack align="center" gap="md">
          <Loader size="xl" color={t.accent} />
          <Text size="lg" style={{ color: t.text }}>Yuklanmoqda...</Text>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        style={{
          minHeight: '100vh',
          background: t.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          transition: 'all 0.3s ease',
        }}
      >
        <Container size="sm">
          <Alert
            icon={<IconAlertCircle size={24} />}
            title="Xatolik!"
            color="red"
            style={{
              backgroundColor: isDark ? '#3a2a2e' : '#fff5f5',
              color: t.text,
            }}
          >
            {error}
            <Button
              onClick={fetchProfile}
              mt="md"
              variant="light"
              color={isDark ? 'blue' : 'orange'}
            >
              Qayta urinish
            </Button>
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: t.bg,
        padding: '40px 20px',
        transition: 'all 0.3s ease',
      }}
    >
      <Container size="lg">
        <Stack gap="xl">
          {/* Profile Header Card */}
          <Paper
            shadow="md"
            p="xl"
            radius="lg"
            style={{
              backgroundColor: t.paper,
              border: `1px solid ${t.border}`,
              transition: 'all 0.3s ease',
            }}
          >
            <Group align="flex-start" gap="xl">
              <Avatar
                size={120}
                radius="xl"
                color={isDark ? 'blue' : 'orange'}
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                }}
              >
                {getUserInitial()}
              </Avatar>

              <Box style={{ flex: 1 }}>
                <Group gap="sm" mb="md">
                  <Text
                    size="32px"
                    fw={700}
                    style={{ color: t.text }}
                  >
                    {getUserName()}
                  </Text>
                  <Button
                    variant="subtle"
                    size="sm"
                    leftSection={<IconSettings size={16} />}
                    style={{ color: t.accent }}
                  >
                    Tahrirlash
                  </Button>
                </Group>

                <Stack gap="md">
                  <Group gap="xs">
                    <IconPhone size={20} color={t.accent} />
                    <Text size="md" style={{ color: t.subtext }}>
                      {userData?.phone || '+998999999999'}
                    </Text>
                  </Group>

                  {userData?.email && (
                    <Group gap="xs">
                      <IconMail size={20} color={t.accent} />
                      <Text size="md" style={{ color: t.subtext }}>
                        {userData.email}
                      </Text>
                    </Group>
                  )}

                  <Group gap="xs">
                    <IconHome size={20} color={t.accent} />
                    <Text size="md" style={{ color: t.subtext }}>
                      {userData?.address || '10, Afrasiyab Street, Yunus Rajabi mahalla, Yakkasaray District, Tashkent, 100000, Uzbekistan'}
                    </Text>
                  </Group>
                </Stack>
              </Box>
            </Group>
          </Paper>

          {/* Settings Card */}
          <Paper
            shadow="md"
            p="xl"
            radius="lg"
            style={{
              backgroundColor: t.paper,
              border: `1px solid ${t.border}`,
              transition: 'all 0.3s ease',
            }}
          >
            <Group justify="space-between" mb="lg">
              <Text size="xl" fw={600} style={{ color: t.text }}>
                Sozlamalar
              </Text>
            </Group>

            <Stack gap="lg">
              <Group justify="space-between" p="md" style={{
                backgroundColor: t.cardBg,
                borderRadius: '8px',
                border: `1px solid ${t.border}`,
              }}>
                <Group gap="md">
                  <IconBook size={24} color={t.accent} />
                  <Box>
                    <Text fw={500} style={{ color: t.text }}>Kitob ijarasi mavjud</Text>
                    <Text size="sm" style={{ color: t.subtext }}>
                      Kitoblarni ijaraga berish imkoniyati
                    </Text>
                  </Box>
                </Group>
                <Switch
                  checked={bookRental}
                  onChange={handleBookRentalToggle}
                  size="lg"
                  color={isDark ? 'blue' : 'orange'}
                />
              </Group>
            </Stack>
          </Paper>

          {/* Statistics Card */}
          <Paper
            shadow="md"
            p="xl"
            radius="lg"
            style={{
              backgroundColor: t.paper,
              border: `1px solid ${t.border}`,
              transition: 'all 0.3s ease',
            }}
          >
            <Text size="xl" fw={600} mb="lg" style={{ color: t.text }}>
              Statistika
            </Text>

            <Group grow>
              <Box
                p="lg"
                style={{
                  backgroundColor: t.cardBg,
                  borderRadius: '12px',
                  border: `1px solid ${t.border}`,
                  textAlign: 'center',
                }}
              >
                <IconBook size={32} color={t.accent} style={{ margin: '0 auto 12px' }} />
                <Text size="32px" fw={700} style={{ color: t.text }}>
                  {userData?.total_books || 0}
                </Text>
                <Text size="sm" style={{ color: t.subtext }}>
                  Jami kitoblar
                </Text>
              </Box>

              <Box
                p="lg"
                style={{
                  backgroundColor: t.cardBg,
                  borderRadius: '12px',
                  border: `1px solid ${t.border}`,
                  textAlign: 'center',
                }}
              >
                <IconClock size={32} color={t.accent} style={{ margin: '0 auto 12px' }} />
                <Text size="32px" fw={700} style={{ color: t.text }}>
                  {userData?.reading_hours || 0}
                </Text>
                <Text size="sm" style={{ color: t.subtext }}>
                  O'qish soatlari
                </Text>
              </Box>

              <Box
                p="lg"
                style={{
                  backgroundColor: t.cardBg,
                  borderRadius: '12px',
                  border: `1px solid ${t.border}`,
                  textAlign: 'center',
                }}
              >
                <IconUser size={32} color={t.accent} style={{ margin: '0 auto 12px' }} />
                <Text size="32px" fw={700} style={{ color: t.text }}>
                  {userData?.followers || 0}
                </Text>
                <Text size="sm" style={{ color: t.subtext }}>
                  Obunchilar
                </Text>
              </Box>
            </Group>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default Profile;