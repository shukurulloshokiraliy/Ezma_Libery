import React, { useState, useEffect } from 'react';
import {
  Container, Box, Text, Group, Paper, Stack, Badge,
  Title, Card, Flex, Skeleton, SimpleGrid, Button, Alert
} from '@mantine/core';
import {
  IconUser, IconBuilding, IconBook, IconMapPin,
  IconBrandTelegram, IconBrandFacebook, IconBrandInstagram,
  IconWorld, IconAlertCircle
} from '@tabler/icons-react';

const API_URL = 'https://org-ave-jimmy-learners.trycloudflare.com/api/v1';

const DetailBook = () => {
  const [isDark, setIsDark] = useState(false);
  const [book, setBook] = useState(null);
  const [bookLibraries, setBookLibraries] = useState([]);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) setIsDark(savedMode === 'true');
    
    const handleDarkModeChange = () => {
      const currentMode = localStorage.getItem('darkMode');
      setIsDark(currentMode === 'true');
    };
    
    window.addEventListener('darkModeChange', handleDarkModeChange);
    return () => window.removeEventListener('darkModeChange', handleDarkModeChange);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Test uchun ID 123 ishlatamiz (rasmda ko'rsatilgan)
        const bookId = '123';
        
        console.log('Kitob yuklanmoqda:', bookId);
        const bookRes = await fetch(`${API_URL}/books/book/${bookId}/`);
        
        if (!bookRes.ok) {
          throw new Error(`Kitob topilmadi (Status: ${bookRes.status})`);
        }
        
        const bookData = await bookRes.json();
        console.log('Kitob ma\'lumoti:', bookData);
        setBook(bookData);

        // Barcha kitoblarni yuklash
        try {
          const booksRes = await fetch(`${API_URL}/books/books/`);
          if (booksRes.ok) {
            const booksData = await booksRes.json();
            console.log('Barcha kitoblar:', booksData);
            const books = booksData.results || booksData || [];
            // Hozirgi kitobdan boshqa 4 ta kitob olish
            const otherBooks = books.filter(b => b.id !== bookData.id).slice(0, 4);
            setRelatedBooks(otherBooks);
            console.log('4 ta kitob:', otherBooks);
          }
        } catch (e) {
          console.log('Barcha kitoblar yuklanmadi:', e);
        }

        // Kutubxonalarni yuklash
        if (bookData.libraries && bookData.libraries.length > 0) {
          console.log('Kutubxona IDlar:', bookData.libraries);
          
          const libraryPromises = bookData.libraries.map(async (libId) => {
            try {
              const res = await fetch(`${API_URL}/libraries/library/${libId}/`);
              if (!res.ok) return null;
              const data = await res.json();
              console.log(`Kutubxona ${libId}:`, data);
              return data;
            } catch (err) {
              console.error(`Kutubxona ${libId} xato:`, err);
              return null;
            }
          });
          
          const libraries = await Promise.all(libraryPromises);
          const validLibraries = libraries.filter(lib => lib !== null);
          console.log('Barcha kutubxonalar:', validLibraries);
          setBookLibraries(validLibraries);
        } else {
          console.log('Bu kitobda kutubxonalar yo\'q');
        }
      } catch (err) {
        console.error('Umumiy xatolik:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const bgColor = isDark ? '#1a1a1a' : '#f8f9fa';
  const cardBg = isDark ? '#2d2d2d' : 'linear-gradient(180deg, #c17d11 0%, #d4a11e 50%, #c17d11 100%)';
  const textColor = isDark ? '#e0e0e0' : 'white';
  const textSecondary = isDark ? '#999' : 'rgba(255,255,255,0.9)';

  if (loading) {
    return (
      <Box style={{ minHeight: '100vh', background: bgColor, padding: '20px 0' }}>
        <Container size="xl">
          <Paper shadow="xs" p={40} radius="md" mb={20} style={{ background: cardBg }}>
            <Flex gap={40} wrap="wrap">
              <Skeleton height={220} width={160} radius="md" />
              <Stack gap="md" style={{ flex: 1 }}>
                <Skeleton height={40} width="60%" />
                <Skeleton height={30} width={100} />
                <Skeleton height={20} width="40%" />
                <Skeleton height={20} width="50%" />
              </Stack>
            </Flex>
          </Paper>
          <Text size="sm" c="dimmed" ta="center">Ma'lumotlar yuklanmoqda...</Text>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box style={{ minHeight: '100vh', background: bgColor, padding: '20px 0' }}>
        <Container size="xl">
          <Alert icon={<IconAlertCircle />} title="Xatolik yuz berdi" color="red" radius="md">
            <Text mb="sm">{error}</Text>
            <Text size="sm">Console'ni tekshiring (F12) - batafsil ma'lumot uchun</Text>
            <Button mt="md" onClick={() => window.location.reload()}>
              Qayta yuklash
            </Button>
          </Alert>
        </Container>
      </Box>
    );
  }

  if (!book) {
    return (
      <Box style={{ minHeight: '100vh', background: bgColor, padding: '20px 0' }}>
        <Container size="xl">
          <Alert icon={<IconAlertCircle />} title="Ma'lumot topilmadi" color="yellow" radius="md">
            <Text>Kitob ma'lumotlari topilmadi. Console'ni tekshiring.</Text>
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box style={{ minHeight: '100vh', background: bgColor, padding: '20px 0' }}>
      <Container size="xl">
        {/* Kitob kartochkasi */}
        <Paper 
          shadow="sm" 
          p={40} 
          radius="lg" 
          mb={20}
          style={{ background: cardBg, border: isDark ? '1px solid #404040' : 'none' }}
        >
          <Flex gap={40} wrap="wrap" align="flex-start">
            <Box style={{ width: 160, flexShrink: 0 }}>
              <img 
                src={book.image || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400'}
                alt={book.name}
                style={{
                  width: '100%',
                  height: 220,
                  objectFit: 'cover',
                  borderRadius: 8
                }}
              />
            </Box>

            <Stack gap="lg" style={{ flex: 1, minWidth: 300 }}>
              <Box>
                <Title order={1} size={28} mb={12} style={{ color: textColor }}>
                  {book.name}
                </Title>
                <Badge 
                  size="md" 
                  variant="light"
                  leftSection={<Text size="xs">#</Text>}
                  style={{ 
                    background: isDark ? '#e3f2fd' : 'rgba(255,255,255,0.3)', 
                    color: isDark ? '#1976d2' : 'white',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  ID: {book.id}
                </Badge>
              </Box>

              <Stack gap="md">
                <Group gap={12}>
                  <IconUser size={18} color={isDark ? textSecondary : 'rgba(255,255,255,0.9)'} />
                  <Box>
                    <Text size="sm" style={{ color: isDark ? textSecondary : 'rgba(255,255,255,0.8)' }}>Muallif:</Text>
                    <Text size="sm" fw={500} style={{ color: textColor }}>
                      {book.author || 'Noma\'lum'}
                    </Text>
                  </Box>
                </Group>

                <Group gap={12}>
                  <IconBuilding size={18} color={isDark ? textSecondary : 'rgba(255,255,255,0.9)'} />
                  <Box>
                    <Text size="sm" style={{ color: isDark ? textSecondary : 'rgba(255,255,255,0.8)' }}>Nashriyotchi:</Text>
                    <Text size="sm" fw={500} style={{ color: textColor }}>
                      {book.publisher || 'Noma\'lum'}
                    </Text>
                  </Box>
                </Group>

                <Group gap={12}>
                  <IconBook size={18} color={isDark ? textSecondary : 'rgba(255,255,255,0.9)'} />
                  <Box>
                    <Text size="sm" style={{ color: isDark ? textSecondary : 'rgba(255,255,255,0.8)' }}>Kitoblar soni:</Text>
                    <Text size="sm" fw={500} style={{ color: textColor }}>
                      {bookLibraries.length}
                    </Text>
                  </Box>
                </Group>
              </Stack>
            </Stack>
          </Flex>
        </Paper>

        {/* Kutubxonalar */}
        {bookLibraries.length > 0 ? (
          <Box mb={30}>
            <Title order={2} size={20} mb={16} style={{ color: textColor }}>
              Kutubxonalar
            </Title>

            <Paper 
              shadow="sm" 
              p="lg" 
              radius="lg"
              style={{ 
                background: cardBg,
                border: isDark ? '1px solid #404040' : '1px solid #e0e0e0'
              }}
            >
              <Flex gap="lg" align="center" justify="space-between" wrap="wrap">
                <Group gap="lg">
                  <Box style={{
                    width: 80,
                    height: 80,
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: isDark ? '#404040' : '#e0e0e0',
                    flexShrink: 0
                  }}>
                    <img 
                      src={bookLibraries[0].image || "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=100"}
                      alt={bookLibraries[0].name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                  <Box>
                    <Group gap={8} mb={6}>
                      <IconMapPin size={18} color={textSecondary} />
                      <Text size="md" fw={500} style={{ color: textColor }}>
                        {bookLibraries[0].name}
                      </Text>
                    </Group>
                  </Box>
                </Group>

                <Group gap="lg" wrap="wrap">
                  <Group gap={8} style={{ cursor: 'pointer' }}>
                    <IconWorld size={18} style={{ color: '#00bcd4' }} />
                    <Text size="sm" style={{ color: '#00bcd4' }}>Manzil</Text>
                  </Group>
                  <Group gap={8} style={{ cursor: 'pointer' }}>
                    <IconBrandInstagram size={18} style={{ color: '#00bcd4' }} />
                    <Text size="sm" style={{ color: '#00bcd4' }}>Instagram</Text>
                  </Group>
                  <Group gap={8} style={{ cursor: 'pointer' }}>
                    <IconBrandFacebook size={18} style={{ color: '#00bcd4' }} />
                    <Text size="sm" style={{ color: '#00bcd4' }}>Facebook</Text>
                  </Group>
                  <Group gap={8} style={{ cursor: 'pointer' }}>
                    <IconBrandTelegram size={18} style={{ color: '#00bcd4' }} />
                    <Text size="sm" style={{ color: '#00bcd4' }}>Telegram</Text>
                  </Group>
                </Group>
              </Flex>
            </Paper>
          </Box>
        ) : (
          <Box mb={30}>
            <Alert color="blue" radius="md" >
              <Title order={2} size={20} style={{ color: isDark ? '#e7dfdf' : '#0d0d0d' }} >
              Bu kitob hozircha hech qaysi kutubxonada yo'q
              </Title>
             
            </Alert>
          </Box>
        )}

        {/* Barcha kitoblar */}
        {relatedBooks.length > 0 && (
          <Box>
            <Title order={2} size={20} mb={16} style={{ color: isDark ? '#e7dfdf' : '#0d0d0d' }}>
              Barcha kitoblar
            </Title>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
              {relatedBooks.map(b => (
                <Card 
                  key={b.id}
                  shadow="sm"
                  padding={0}
                  radius="lg"
                  style={{ 
                    background: cardBg,
                    border: isDark ? '1px solid #404040' : 'none',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Box style={{ 
                    width: '100%', 
                    height: 200,
                    background: isDark ? '#404040' : '#e0e0e0'
                  }}>
                    <img 
                      src={b.image || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400'}
                      alt={b.name}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }}
                    />
                  </Box>
                  <Box p="md">
                    <Text 
                      size="md" 
                      fw={600} 
                      mb={6} 
                      style={{ color: textColor }}
                      lineClamp={1}
                    >
                      {b.name}
                    </Text>
                    <Text size="xs" mb={4} style={{ color: textSecondary }}>
                      Muallif: <span style={{ fontWeight: 500 }}>{b.author || 'Noma\'lum'}</span>
                    </Text>
                    <Text size="xs" mb={12} style={{ color: textSecondary }}>
                      Nashriyot: <span style={{ fontWeight: 500 }}>{b.publisher || 'Noma\'lum'}</span>
                    </Text>
                    <Button 
                      fullWidth 
                      size="sm"
                      variant="light"
                      style={{ 
                        background: '#e3f2fd',
                        color: '#1976d2',
                        border: 'none',
                        textTransform: 'uppercase',
                        fontSize: 11,
                        fontWeight: 600
                      }}
                    >
                      {b.quantity_in_library || 1} TA KITOB MAVJUD
                    </Button>
                  </Box>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default DetailBook;