import React, { useState, useEffect } from 'react';
import {
  Container, Box, Text, SimpleGrid, Paper, Group, Button,
  Stack, Flex, Card, Badge, Skeleton, Title, ThemeIcon,
  Divider, Progress, Alert
} from '@mantine/core';
import {
  IconBook, IconPhone, IconBrandTelegram, IconMapPin,
  IconArrowLeft, IconUser, IconCalendar, IconBuilding,
  IconCheck, IconLanguage, IconCategory, IconFileText,
  IconStar, IconAlertCircle
} from '@tabler/icons-react';

const API_URL = 'https://org-ave-jimmy-learners.trycloudflare.com/api/v1';
const LIBRARY_IMAGE = 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800';

const DetailLibrary = () => {
  const [isDark, setIsDark] = useState(false);
  const [library, setLibrary] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getLibraryIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const idFromQuery = params.get('id');
    if (idFromQuery) return idFromQuery;
    
    const pathParts = window.location.pathname.split('/');
    const idFromPath = pathParts[pathParts.length - 1];
    return idFromPath || '1';
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) setIsDark(savedMode === 'true');
    
    const handleDarkModeChange = () => {
      setIsDark(localStorage.getItem('darkMode') === 'true');
    };
    
    window.addEventListener('darkModeChange', handleDarkModeChange);
    return () => window.removeEventListener('darkModeChange', handleDarkModeChange);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const libraryId = getLibraryIdFromUrl();
        console.log('Kutubxona yuklanmoqda:', libraryId);
        
        const libRes = await fetch(`${API_URL}/libraries/library/${libraryId}/`);
        if (!libRes.ok) throw new Error('Kutubxona topilmadi');
        
        const libData = await libRes.json();
        console.log('Kutubxona:', libData);
        setLibrary(libData);

        try {
          const booksRes = await fetch(`${API_URL}/books/books/`);
          if (booksRes.ok) {
            const booksData = await booksRes.json();
            const allBooks = booksData.results || booksData || [];
            const libraryBooks = allBooks.filter(book => 
              book.libraries && book.libraries.includes(parseInt(libraryId))
            );
            console.log('Kitoblar:', libraryBooks);
            setBooks(libraryBooks);
          }
        } catch (e) {
          console.log('Kitoblar yuklanmadi');
        }
      } catch (err) {
        console.error('Xatolik:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const bgColor = isDark ? '#1a1a1a' : '#f8f9fa';
  const cardBg = isDark ? '#2d2d2d' : 'linear-gradient(180deg, #c17d11 0%, #d4a11e 50%, #c17d11 100%)';
  const cardBgWhite = isDark ? '#2d2d2d' : 'white';
  const textColor = isDark ? '#e0e0e0' : 'white';
  const textDark = isDark ? '#e0e0e0' : '#1a1a1a';
  const textSecondary = isDark ? '#999' : 'rgba(255,255,255,0.9)';

  if (loading) {
    return (
      <Box style={{ minHeight: '100vh', background: bgColor, padding: '20px 0' }}>
        <Container size="xl">
          <Skeleton height={60} mb={20} />
          <Skeleton height={400} radius="lg" mb={20} />
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mb={20}>
            <Skeleton height={120} />
            <Skeleton height={120} />
            <Skeleton height={120} />
          </SimpleGrid>
          <Skeleton height={300} />
        </Container>
      </Box>
    );
  }

  if (error || !library) {
    return (
      <Box style={{ minHeight: '100vh', background: bgColor, padding: '20px 0' }}>
        <Container size="xl">
          <Alert icon={<IconAlertCircle />} title="Xatolik" color="red" radius="md">
            <Text mb="sm">{error || 'Kutubxona topilmadi'}</Text>
            <Button onClick={() => window.location.reload()}>Qayta yuklash</Button>
          </Alert>
        </Container>
      </Box>
    );
  }

  const categories = books.reduce((acc, book) => {
    if (book.category) {
      acc[book.category] = (acc[book.category] || 0) + 1;
    }
    return acc;
  }, {});

  const topCategories = Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const handleOpenMap = () => {
    if (library.location) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(library.location)}`, '_blank');
    }
  };

  return (
    <Box style={{ minHeight: '100vh', background: bgColor, padding: '20px 0' }}>
      <Container size="xl">
        {/* Kutubxona asosiy kartochka */}
        <Paper 
          shadow="sm" 
          p={0} 
          radius="lg" 
          mb={20}
          style={{ background: cardBg, border: isDark ? '1px solid #404040' : 'none', overflow: 'hidden' }}
        >
          <Flex direction={{ base: 'column', md: 'row' }}>
            <Box 
              w={{ base: '100%', md: '40%' }}
              h={{ base: 250, md: 400 }}
              style={{
                backgroundImage: `url(${library.image || LIBRARY_IMAGE})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}
            >
              <Box style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                padding: '30px 20px 15px'
              }}>
                {library.books > 0 && (
                  <Badge 
                    size="lg"
                    leftSection={<IconCheck size={14} />}
                    style={{ background: 'rgba(212,161,30,0.9)', color: 'white' }}
                  >
                    Faol kutubxona
                  </Badge>
                )}
              </Box>
            </Box>

            <Stack gap="lg" p={30} style={{ flex: 1 }}>
              <Box>
                <Group gap={8} mb={8}>
                  <IconBuilding size={20} color={isDark ? '#d4a11e' : 'rgba(255,255,255,0.9)'} />
                  <Text size="xs" fw={500} style={{ color: textSecondary, textTransform: 'uppercase' }}>
                    Kutubxona haqida
                  </Text>
                </Group>
                <Title order={1} size={28} mb={10} style={{ color: textColor }}>
                  {library.name}
                </Title>
                {library.description && (
                  <Text size="sm" style={{ color: textSecondary, lineHeight: 1.5 }}>
                    {library.description}
                  </Text>
                )}
              </Box>

              <Group gap={20}>
                <Box>
                  <Text size="xs" style={{ color: textSecondary, marginBottom: 4 }}>Jami kitoblar</Text>
                  <Group gap={6}>
                    <IconBook size={18} color={isDark ? '#d4a11e' : 'white'} />
                    <Text size="xl" fw={700} style={{ color: textColor }}>
                      {books.length}
                    </Text>
                  </Group>
                </Box>
              </Group>

              <Box style={{ height: 1, background: isDark ? '#404040' : 'rgba(255,255,255,0.3)' }} />

              <Stack gap="sm">
                {library.phone && (
                  <Group gap={10}>
                    <IconPhone size={16} color={textSecondary} />
                    <Text size="sm" style={{ color: textSecondary }}>
                      {library.phone}
                    </Text>
                  </Group>
                )}

                {library.telegram && (
                  <Group gap={10}>
                    <IconBrandTelegram size={16} color={textSecondary} />
                    <Text size="sm" style={{ color: textSecondary }}>
                      {library.telegram}
                    </Text>
                  </Group>
                )}

                {library.location && (
                  <Group gap={10}>
                    <IconMapPin size={16} color={textSecondary} />
                    <Text size="sm" style={{ color: textSecondary, cursor: 'pointer' }} onClick={handleOpenMap}>
                      {library.location}
                    </Text>
                  </Group>
                )}
              </Stack>

              <Button 
                size="md"
                fullWidth
                leftSection={<IconMapPin size={18} />}
                onClick={handleOpenMap}
                style={{ 
                  background: isDark ? 'rgba(212,161,30,0.2)' : 'rgba(255,255,255,0.3)',
                  color: isDark ? '#d4a11e' : 'white',
                  border: `1px solid ${isDark ? '#d4a11e' : 'rgba(255,255,255,0.5)'}`
                }}
              >
                Google mapsda ko'rish
              </Button>
            </Stack>
          </Flex>
        </Paper>

        {/* Statistika */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb={20}>
          <Paper p={20} radius="lg" style={{ background: cardBgWhite }}>
            <Group gap="md">
              <ThemeIcon size={50} radius="lg" style={{ background: isDark ? 'rgba(212,161,30,0.2)' : 'linear-gradient(180deg, #c17d11, #d4a11e)' }}>
                <IconBook size={24} />
              </ThemeIcon>
              <Box>
                <Text size="xs" c="dimmed">Mavjud kitoblar</Text>
                <Text size="xl" fw={700} style={{ color: textDark }}>
                  {books.length}
                </Text>
              </Box>
            </Group>
          </Paper>

          <Paper p={20} radius="lg" style={{ background: cardBgWhite }}>
            <Group gap="md">
              <ThemeIcon size={50} radius="lg" style={{ background: isDark ? 'rgba(212,161,30,0.2)' : 'linear-gradient(180deg, #c17d11, #d4a11e)' }}>
                <IconCategory size={24} />
              </ThemeIcon>
              <Box>
                <Text size="xs" c="dimmed">Kategoriyalar</Text>
                <Text size="xl" fw={700} style={{ color: textDark }}>
                  {Object.keys(categories).length}
                </Text>
              </Box>
            </Group>
          </Paper>

          <Paper p={20} radius="lg" style={{ background: cardBgWhite }}>
            <Group gap="md">
              <ThemeIcon size={50} radius="lg" style={{ background: isDark ? 'rgba(212,161,30,0.2)' : 'linear-gradient(180deg, #c17d11, #d4a11e)' }}>
                <IconStar size={24} />
              </ThemeIcon>
              <Box>
                <Text size="xs" c="dimmed">Holat</Text>
                <Text size="xl" fw={700} style={{ color: textDark }}>
                  {library.books > 0 ? 'Faol' : 'Nofaol'}
                </Text>
              </Box>
            </Group>
          </Paper>
        </SimpleGrid>

        {/* Kategoriyalar */}
        {topCategories.length > 0 && (
          <Paper p={20} radius="lg" mb={20} style={{ background: cardBgWhite }}>
            <Group gap={8} mb={15}>
              <IconCategory size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
              <Text size="md" fw={600} style={{ color: textDark }}>
                Top kategoriyalar
              </Text>
            </Group>
            <Stack gap="md">
              {topCategories.map(([category, count]) => (
                <Box key={category}>
                  <Group justify="space-between" mb={6}>
                    <Text size="sm" fw={500} style={{ color: textDark }}>
                      {category}
                    </Text>
                    <Text size="sm" fw={600} style={{ color: isDark ? '#d4a11e' : '#c17d11' }}>
                      {count} kitob
                    </Text>
                  </Group>
                  <Progress 
                    value={(count / books.length) * 100} 
                    size="sm" 
                    radius="xl"
                    color={isDark ? '#d4a11e' : '#c17d11'}
                  />
                </Box>
              ))}
            </Stack>
          </Paper>
        )}

        {/* Kitoblar */}
        <Box>
          <Group justify="space-between" mb={15}>
            <Title order={2} size={20} style={{ color: textDark }}>
              Barcha kitoblar
            </Title>
            <Badge size="lg" style={{ background: isDark ? '#2d2d2d' : '#c17d11', color: 'white' }}>
              {books.length} ta
            </Badge>
          </Group>

          {books.length === 0 ? (
            <Paper p={40} radius="lg" ta="center" style={{ background: cardBgWhite }}>
              <IconBook size={48} color="#999" style={{ margin: '0 auto 15px' }} />
              <Text size="md" fw={600} mb={6} style={{ color: textDark }}>
                Hozircha kitoblar yo'q
              </Text>
              <Text size="sm" c="dimmed">
                Tez orada qo'shiladi
              </Text>
            </Paper>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
              {books.map(book => (
                <Card 
                  key={book.id}
                  shadow="sm"
                  padding={0}
                  radius="lg"
                  style={{
                    background: cardBgWhite,
                    border: isDark ? '1px solid #404040' : 'none',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Box 
                    style={{
                      height: 200,
                      backgroundImage: `url(${book.image || LIBRARY_IMAGE})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}
                  >
                    {book.rating && (
                      <Box style={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        background: 'rgba(0,0,0,0.7)',
                        padding: '4px 8px',
                        borderRadius: 6
                      }}>
                        <Group gap={4}>
                          <IconStar size={14} color="#ffd43b" fill="#ffd43b" />
                          <Text size="xs" fw={600} c="white">{book.rating}</Text>
                        </Group>
                      </Box>
                    )}
                  </Box>

                  <Stack gap="xs" p="md">
                    <Text fw={600} size="sm" lineClamp={2} style={{ color: textDark, minHeight: 40 }}>
                      {book.name}
                    </Text>

                    <Stack gap={4}>
                      {book.author && (
                        <Group gap={6}>
                          <IconUser size={14} color="#999" />
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            {book.author}
                          </Text>
                        </Group>
                      )}

                      {book.category && (
                        <Group gap={6}>
                          <IconCategory size={14} color="#999" />
                          <Text size="xs" c="dimmed">
                            {book.category}
                          </Text>
                        </Group>
                      )}
                    </Stack>

                    <Badge 
                      variant="light"
                      fullWidth
                      size="sm"
                      style={{ background: isDark ? 'rgba(212,161,30,0.2)' : 'rgba(193,125,17,0.15)', color: isDark ? '#d4a11e' : '#c17d11' }}
                    >
                      Mavjud
                    </Badge>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default DetailLibrary;