import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Grid,
  Box,
  Alert,
  Group,
  MantineProvider,
  createTheme
} from '@mantine/core';
import {
  IconUser,
  IconPhone,
  IconLock,
  IconMapPin,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTelegram,
  IconAlertCircle,
  IconCheck,
  IconCurrentLocation
} from '@tabler/icons-react';
import { YMaps, Map, Placemark, ZoomControl, FullscreenControl } from '@pbe/react-yandex-maps';

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
});

const SignupContent = () => {
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    address: '',
    instagram: '',
    facebook: '',
    telegram: '',
    latitude: '',
    longitude: ''
  });

  const [mapCenter, setMapCenter] = useState([41.2995, 69.2401]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    const checkDarkMode = () => {
      try {
        const savedDark = localStorage.getItem('darkMode');
        setIsDark(savedDark === 'true');
      } catch (e) {
        console.error('Dark mode check error:', e);
      }
    };

    checkDarkMode();

    const handleDarkModeChange = () => {
      checkDarkMode();
    };

    window.addEventListener('darkModeChange', handleDarkModeChange);
    window.addEventListener('storage', handleDarkModeChange);

    return () => {
      window.removeEventListener('darkModeChange', handleDarkModeChange);
      window.removeEventListener('storage', handleDarkModeChange);
    };
  }, []);

  const handleMapClick = async (e) => {
    const coords = e.get('coords');
    setMapCenter(coords);
    setSelectedLocation(coords);
    
    setFormData(prev => ({
      ...prev,
      latitude: coords[0].toString(),
      longitude: coords[1].toString()
    }));

    try {
      const response = await axios.get(
        `https://geocode-maps.yandex.ru/1.x/?apikey=bc32072f-a50d-4f7e-b22c-a4b70bba1202&geocode=${coords[1]},${coords[0]}&format=json&lang=uz_UZ`
      );
      
      const geoObject = response.data.response.GeoObjectCollection.featureMember[0];
      if (geoObject) {
        const name = geoObject.GeoObject.name;
        const description = geoObject.GeoObject.description;
        const fullAddress = `${name}${description ? ', ' + description : ''}`;
        setLocationName(fullAddress);
        setFormData(prev => ({
          ...prev,
          address: fullAddress
        }));
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          setMapCenter(coords);
          setSelectedLocation(coords);
          setFormData(prev => ({
            ...prev,
            latitude: coords[0].toString(),
            longitude: coords[1].toString()
          }));
          
          axios.get(
            `https://geocode-maps.yandex.ru/1.x/?apikey=bc32072f-a50d-4f7e-b22c-a4b70bba1202&geocode=${coords[1]},${coords[0]}&format=json&lang=uz_UZ`
          )
            .then(response => {
              const geoObject = response.data.response.GeoObjectCollection.featureMember[0];
              if (geoObject) {
                const name = geoObject.GeoObject.name;
                const description = geoObject.GeoObject.description;
                const fullAddress = `${name}${description ? ', ' + description : ''}`;
                setLocationName(fullAddress);
                setFormData(prev => ({
                  ...prev,
                  address: fullAddress
                }));
              }
            })
            .catch(error => console.error('Geocoding error:', error));
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Joylashuvni olishda xatolik');
        }
      );
    } else {
      setError('Brauzer geolokatsiyani qo\'llab-quvvatlamaydi');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Ism kiritilishi shart');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Telefon raqam kiritilishi shart');
      return false;
    }
    if (!/^\+?[0-9]{9,17}$/.test(formData.phone.replace(/\s/g, ''))) {
      setError('Telefon raqam formati noto\'g\'ri');
      return false;
    }
    if (!formData.password || formData.password.length < 1) {
      setError('Parol kiritilishi shart');
      return false;
    }
    if (formData.password.length > 128) {
      setError('Parol juda uzun (maksimum 128 ta belgi)');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const requestBody = {
        user: {
          password: formData.password,
          name: formData.name || null,
          phone: formData.phone
        },
        library: {
          address: formData.address || null,
          social_media: {},
          can_rent_books: false,
          latitude: formData.latitude || null,
          longitude: formData.longitude || null
        }
      };

      if (formData.instagram) {
        requestBody.library.social_media.instagram = formData.instagram;
      }
      if (formData.facebook) {
        requestBody.library.social_media.facebook = formData.facebook;
      }
      if (formData.telegram) {
        requestBody.library.social_media.telegram = formData.telegram;
      }

      const response = await axios.post(
        'https://org-ave-jimmy-learners.trycloudflare.com/api/v1/auth/register-library/',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const data = response.data;

      if (data.access) {
        try {
          localStorage.setItem('authToken', data.access);
        } catch (e) {
          console.error('Token saqlashda xatolik:', e);
        }
      }
      if (data.refresh) {
        try {
          localStorage.setItem('refreshToken', data.refresh);
        } catch (e) {
          console.error('Refresh token saqlashda xatolik:', e);
        }
      }

      if (data.user) {
        try {
          localStorage.setItem('userData', JSON.stringify(data.user));
        } catch (e) {
          console.error('User data saqlashda xatolik:', e);
        }
      }

      setSuccess(true);

      setTimeout(() => {
        window.location.href = '/kutubxona';
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          err.message || 
                          'Ro\'yxatdan o\'tishda xatolik yuz berdi';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDark ? '#1a1d29' : '#f8f9fa'
        }}
      >
        <Alert
          icon={<IconCheck size={24} />}
          title="Muvaffaqiyatli!"
          color="green"
          variant="filled"
          style={{ maxWidth: 400 }}
        >
          <Text>Ro'yxatdan muvaffaqiyatli o'tdingiz!</Text>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundColor: isDark ? '#1a1d29' : '#f8f9fa',
        transition: 'background-color 0.3s ease',
        padding: '40px 20px'
      }}
    >
      <Container size="lg">
        <Paper
          shadow="md"
          radius="lg"
          p="xl"
          style={{
            backgroundColor: isDark ? '#25262b' : '#ffffff',
            borderColor: isDark ? '#373A40' : '#dee2e6',
            transition: 'all 0.3s ease'
          }}
        >
          <Stack gap="lg">
            <Box ta="center" mb="md">
              <Title
                order={1}
                size="h2"
                c={isDark ? '#4dabf7' : '#1971c2'}
                mb="xs"
              >
                Kutubxonachi ro'yxatdan o'tish
              </Title>
              <Text size="sm" c={isDark ? '#909296' : 'dimmed'}>
                Kutubxona ma'lumotlarini to'ldiring
              </Text>
            </Box>

            {error && (
              <Alert
                icon={<IconAlertCircle size={20} />}
                title="Xatolik!"
                color="red"
                variant="light"
                withCloseButton
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}

            <Stack gap="md">
              <Box>
                <Text
                  size="sm"
                  fw={600}
                  c={isDark ? '#fff' : '#000'}
                  mb="sm"
                >
                  Shaxsiy ma'lumotlar
                </Text>
                <Grid gutter="md">
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Ism"
                      placeholder="Ismingiz"
                      leftSection={<IconUser size={18} />}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      styles={{
                        input: {
                          backgroundColor: isDark ? '#2C2E33' : '#ffffff',
                          color: isDark ? '#fff' : '#000',
                          borderColor: isDark ? '#373A40' : '#ced4da'
                        },
                        label: {
                          color: isDark ? '#C1C2C5' : '#495057'
                        }
                      }}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Telefon raqam"
                      placeholder="+998901234567"
                      leftSection={<IconPhone size={18} />}
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                      error={formData.phone && !/^\+?[0-9]{9,17}$/.test(formData.phone.replace(/\s/g, '')) ? 'Telefon raqam noto\'g\'ri' : ''}
                      styles={{
                        input: {
                          backgroundColor: isDark ? '#2C2E33' : '#ffffff',
                          color: isDark ? '#fff' : '#000',
                          borderColor: isDark ? '#373A40' : '#ced4da'
                        },
                        label: {
                          color: isDark ? '#C1C2C5' : '#495057'
                        }
                      }}
                    />
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <PasswordInput
                      label="Parol"
                      placeholder="Parolingiz"
                      leftSection={<IconLock size={18} />}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      styles={{
                        input: {
                          backgroundColor: isDark ? '#2C2E33' : '#ffffff',
                          color: isDark ? '#fff' : '#000',
                          borderColor: isDark ? '#373A40' : '#ced4da'
                        },
                        label: {
                          color: isDark ? '#C1C2C5' : '#495057'
                        }
                      }}
                    />
                  </Grid.Col>
                </Grid>
              </Box>

              <Box>
                <Text
                  size="sm"
                  fw={600}
                  c={isDark ? '#fff' : '#000'}
                  mb="sm"
                >
                  Ijtimoiy tarmoqlar
                </Text>
                <Grid gutter="md">
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput
                      label="Instagram"
                      placeholder="username"
                      leftSection={<IconBrandInstagram size={18} />}
                      value={formData.instagram}
                      onChange={(e) => handleInputChange('instagram', e.target.value)}
                      styles={{
                        input: {
                          backgroundColor: isDark ? '#2C2E33' : '#ffffff',
                          color: isDark ? '#fff' : '#000',
                          borderColor: isDark ? '#373A40' : '#ced4da'
                        },
                        label: {
                          color: isDark ? '#C1C2C5' : '#495057'
                        }
                      }}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput
                      label="Facebook"
                      placeholder="username"
                      leftSection={<IconBrandFacebook size={18} />}
                      value={formData.facebook}
                      onChange={(e) => handleInputChange('facebook', e.target.value)}
                      styles={{
                        input: {
                          backgroundColor: isDark ? '#2C2E33' : '#ffffff',
                          color: isDark ? '#fff' : '#000',
                          borderColor: isDark ? '#373A40' : '#ced4da'
                        },
                        label: {
                          color: isDark ? '#C1C2C5' : '#495057'
                        }
                      }}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput
                      label="Telegram"
                      placeholder="username"
                      leftSection={<IconBrandTelegram size={18} />}
                      value={formData.telegram}
                      onChange={(e) => handleInputChange('telegram', e.target.value)}
                      styles={{
                        input: {
                          backgroundColor: isDark ? '#2C2E33' : '#ffffff',
                          color: isDark ? '#fff' : '#000',
                          borderColor: isDark ? '#373A40' : '#ced4da'
                        },
                        label: {
                          color: isDark ? '#C1C2C5' : '#495057'
                        }
                      }}
                    />
                  </Grid.Col>
                </Grid>
              </Box>

              <Box>
                <Group justify="space-between" mb="sm">
                  <Text
                    size="sm"
                    fw={600}
                    c={isDark ? '#fff' : '#000'}
                  >
                    Manzil
                  </Text>
                  <Button
                    size="xs"
                    variant="light"
                    leftSection={<IconCurrentLocation size={16} />}
                    onClick={getCurrentLocation}
                  >
                    Hozirgi joyim
                  </Button>
                </Group>

                <TextInput
                  label="Manzil"
                  placeholder="Xaritadan tanlang yoki kiriting"
                  leftSection={<IconMapPin size={18} />}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  mb="md"
                  styles={{
                    input: {
                      backgroundColor: isDark ? '#2C2E33' : '#ffffff',
                      color: isDark ? '#fff' : '#000',
                      borderColor: isDark ? '#373A40' : '#ced4da'
                    },
                    label: {
                      color: isDark ? '#C1C2C5' : '#495057'
                    }
                  }}
                />

                <Text size="xs" c={isDark ? '#909296' : 'dimmed'} mb="sm">
                  💡 Xaritada kerakli joyni bosing
                </Text>

                <Box
                  style={{
                    width: '100%',
                    height: 400,
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: isDark ? '1px solid #373A40' : '1px solid #dee2e6'
                  }}
                >
                  <YMaps query={{ apikey: 'bc32072f-a50d-4f7e-b22c-a4b70bba1202', lang: 'uz_UZ' }}>
                    <Map
                      width="100%"
                      height="100%"
                      state={{
                        center: mapCenter,
                        zoom: 15,
                      }}
                      onClick={handleMapClick}
                    >
                      {selectedLocation && (
                        <Placemark
                          geometry={selectedLocation}
                          options={{
                            preset: 'islands#blueDotIcon',
                          }}
                          properties={{
                            balloonContent: locationName || 'Tanlangan joy',
                          }}
                        />
                      )}
                      <ZoomControl options={{ float: 'right' }} />
                      <FullscreenControl />
                    </Map>
                  </YMaps>
                </Box>

                <Grid gutter="xs" mt="sm">
                  <Grid.Col span={6}>
                    <TextInput
                      label="Kenglik"
                      placeholder="Latitude"
                      value={formData.latitude}
                      readOnly
                      size="xs"
                      styles={{
                        input: {
                          backgroundColor: isDark ? '#2C2E33' : '#f8f9fa',
                          color: isDark ? '#909296' : '#6c757d',
                          borderColor: isDark ? '#373A40' : '#ced4da'
                        },
                        label: {
                          color: isDark ? '#909296' : '#6c757d',
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Uzunlik"
                      placeholder="Longitude"
                      value={formData.longitude}
                      readOnly
                      size="xs"
                      styles={{
                        input: {
                          backgroundColor: isDark ? '#2C2E33' : '#f8f9fa',
                          color: isDark ? '#909296' : '#6c757d',
                          borderColor: isDark ? '#373A40' : '#ced4da'
                        },
                        label: {
                          color: isDark ? '#909296' : '#6c757d',
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  </Grid.Col>
                </Grid>
              </Box>

              <Group justify="space-between" mt="xl">
                <Button
                  variant="subtle"
                  color="gray"
                  onClick={() => window.history.back()}
                >
                  Ortga
                </Button>
                <Button
                  onClick={handleSubmit}
                  loading={loading}
                  size="md"
                  style={{
                    background: 'linear-gradient(135deg, #1971c2 0%, #1864ab 100%)'
                  }}
                >
                  Ro'yxatdan o'tish
                </Button>
              </Group>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default function Signup() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <SignupContent />
    </MantineProvider>
  );
}