import React, { useState, useEffect } from 'react';
import { 
  Container, Box, Text, SimpleGrid, Paper, Group, Button,
  Stack, Flex, Card, Badge, Skeleton, MantineProvider,
  Divider, Title, Progress, ThemeIcon, Avatar
} from '@mantine/core';
import { 
  IconBook, IconPhone, IconBrandTelegram, IconMapPin,
  IconArrowLeft, IconUser, IconCalendar, IconClock,
  IconInfoCircle, IconBuildingLibrary, IconCheck,
  IconLanguage, IconCategory, IconFileText, IconStar
} from '@tabler/icons-react';

const BOOK_IMAGE = 'https://ezma-client.vercel.app/assets/library-CY0z204p.webp';

const DetailLibrary = ({ libraryId, onBack }) => {
  const [isDark, setIsDark] = useState(false);
  const [library, setLibrary] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) setIsDark(saved === 'true');
    
    const handleDarkModeChange = () => {
      const newMode = localStorage.getItem('darkMode') === 'true';
      setIsDark(newMode);
    };
    
    window.addEventListener('darkModeChange', handleDarkModeChange);
    return () => window.removeEventListener('darkModeChange', handleDarkModeChange);
  }, []);

  useEffect(() => {
    const fetchLibraryDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://org-ave-jimmy-learners.trycloudflare.com/api/v1/libraries/libraries/${libraryId}/`);
        const data = await response.json();
        setLibrary(data);
        
        const booksResponse = await fetch(`https://org-ave-jimmy-learners.trycloudflare.com/api/v1/libraries/books/?library=${libraryId}`);
        const booksData = await booksResponse.json();
        setBooks(Array.isArray(booksData) ? booksData : booksData.results || []);
      } catch (err) {
        setError(err.message || 'Xatolik');
      } finally {
        setLoading(false);
      }
    };
    
    if (libraryId) {
      fetchLibraryDetail();
    }
  }, [libraryId]);

  if (loading) {
    return (
      <MantineProvider>
        <Box 
          style={{
            minHeight: '100vh',
            background: isDark 
              ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)'
              : 'linear-gradient(180deg, #c17d11 0%, #d4a11e 50%, #c17d11 100%)',
            padding: '40px 0',
          }}
        >
          <Container size="xl">
            <Skeleton height={500} radius="xl" mb="xl" />
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mb="xl">
              <Skeleton height={150} radius="xl" />
              <Skeleton height={150} radius="xl" />
              <Skeleton height={150} radius="xl" />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
              {[1,2,3,4,5,6].map(i => (
                <Skeleton key={i} height={400} radius="xl" />
              ))}
            </SimpleGrid>
          </Container>
        </Box>
      </MantineProvider>
    );
  }

  if (error || !library) {
    return (
      <MantineProvider>
        <Box 
          style={{
            minHeight: '100vh',
            background: isDark 
              ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)'
              : 'linear-gradient(180deg, #c17d11 0%, #d4a11e 50%, #c17d11 100%)',
            padding: '40px 0',
          }}
        >
          <Container size="xl">
            <Paper p={40} radius="xl" ta="center" style={{ background: 'rgba(255, 107, 107, 0.15)' }}>
              <Text size="xl" style={{ color: 'white' }}>Xatolik: {error || 'Kutubxona topilmadi'}</Text>
            </Paper>
          </Container>
        </Box>
      </MantineProvider>
    );
  }

  const handleOpenMap = () => {
    if (library.location) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(library.location)}`, '_blank');
    }
  };

  const categories = books.reduce((acc, book) => {
    if (book.category) {
      acc[book.category] = (acc[book.category] || 0) + 1;
    }
    return acc;
  }, {});

  const topCategories = Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <MantineProvider>
      <Box 
        style={{
          minHeight: '100vh',
          background: isDark 
            ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)'
            : 'linear-gradient(180deg, #c17d11 0%, #d4a11e 50%, #c17d11 100%)',
          position: 'relative',
          overflow: 'hidden',
          padding: '40px 0',
        }}
      >
        <Box
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(40px)',
          }}
        />
        <Box
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-150px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            filter: 'blur(60px)',
          }}
        />

        <Container size="xl" style={{ position: 'relative', zIndex: 1 }}>
          {onBack && (
            <Button 
              leftSection={<IconArrowLeft size={18} />}
              variant="light"
              size="md"
              radius="md"
              mb={30}
              onClick={onBack}
              style={{
                background: isDark 
                  ? 'rgba(26, 27, 30, 0.95)' 
                  : 'rgba(255, 255, 255, 0.95)',
                color: isDark ? '#d4a11e' : '#c17d11',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
              }}
            >
              Orqaga
            </Button>
          )}

       
          <Paper 
            p={0} 
            radius="xl" 
            mb={30}
            style={{
              background: isDark 
                ? 'rgba(26, 27, 30, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
              overflow: 'hidden',
            }}
          >
            <Flex direction={{ base: 'column', md: 'row' }}>
              <Box 
                w={{ base: '100%', md: '45%' }}
                h={{ base: 300, md: 450 }}
                style={{ 
                  backgroundImage: `url(${BOOK_IMAGE})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                <Box
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    padding: '40px 30px 20px',
                  }}
                >
                  {library.books > 0 && (
                    <Badge 
                      size="lg"
                      variant="filled"
                      leftSection={<IconCheck size={16} />}
                      style={{ 
                        background: 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)',
                      }}
                    >
                      Faol kutubxona
                    </Badge>
                  )}
                </Box>
              </Box>

              <Stack gap="lg" p={40} style={{ flex: 1 }}>
                <Box>
                  <Group gap={8} mb={10}>
                    <IconBuildingLibrary size={24} color={isDark ? '#d4a11e' : '#c17d11'} />
                    <Text size="sm" fw={500} style={{ color: isDark ? '#d4a11e' : '#c17d11', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Kutubxona haqida
                    </Text>
                  </Group>
                  <Title 
                    order={1} 
                    size={38}
                    style={{ 
                      color: isDark ? 'white' : '#2D3748',
                      marginBottom: 15,
                      lineHeight: 1.2,
                    }}
                  >
                    {library.name}
                  </Title>
                  {library.description && (
                    <Text size="md" style={{ color: isDark ? '#cbd5e0' : '#718096', lineHeight: 1.6 }}>
                      {library.description}
                    </Text>
                  )}
                </Box>

                <Group gap={30}>
                  <Box>
                    <Text size="xs" style={{ color: '#718096', marginBottom: 5 }}>Jami kitoblar</Text>
                    <Group gap={8}>
                      <IconBook size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                      <Text size="xl" fw={700} style={{ color: isDark ? '#d4a11e' : '#c17d11' }}>
                        {library.books || 0}
                      </Text>
                    </Group>
                  </Box>
                  {library.established_year && (
                    <Box>
                      <Text size="xs" style={{ color: '#718096', marginBottom: 5 }}>Tashkil etilgan</Text>
                      <Group gap={8}>
                        <IconCalendar size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                        <Text size="xl" fw={700} style={{ color: isDark ? 'white' : '#2D3748' }}>
                          {library.established_year}
                        </Text>
                      </Group>
                    </Box>
                  )}
                </Group>

                <Divider color={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} />

                <Stack gap="md">
                  <Text size="sm" fw={600} style={{ color: isDark ? 'white' : '#2D3748', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Aloqa ma'lumotlari
                  </Text>
                  {library.phone && (
                    <Group gap={12}>
                      <ThemeIcon size={40} radius="md" style={{ background: isDark ? 'rgba(212, 161, 30, 0.15)' : 'rgba(193, 125, 17, 0.15)' }}>
                        <IconPhone size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                      </ThemeIcon>
                      <Box>
                        <Text size="xs" style={{ color: '#718096' }}>Telefon</Text>
                        <Text size="md" fw={500} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>
                          {library.phone}
                        </Text>
                      </Box>
                    </Group>
                  )}

                  {library.telegram && (
                    <Group gap={12}>
                      <ThemeIcon size={40} radius="md" style={{ background: isDark ? 'rgba(212, 161, 30, 0.15)' : 'rgba(193, 125, 17, 0.15)' }}>
                        <IconBrandTelegram size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                      </ThemeIcon>
                      <Box>
                        <Text size="xs" style={{ color: '#718096' }}>Telegram</Text>
                        <Text size="md" fw={500} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>
                          {library.telegram}
                        </Text>
                      </Box>
                    </Group>
                  )}

                  {library.location && (
                    <Group gap={12}>
                      <ThemeIcon size={40} radius="md" style={{ background: isDark ? 'rgba(212, 161, 30, 0.15)' : 'rgba(193, 125, 17, 0.15)' }}>
                        <IconMapPin size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                      </ThemeIcon>
                      <Box style={{ flex: 1 }}>
                        <Text size="xs" style={{ color: '#718096' }}>Manzil</Text>
                        <Text 
                          size="md" 
                          fw={500}
                          style={{ 
                            color: isDark ? '#d4a11e' : '#c17d11',
                            cursor: 'pointer',
                          }}
                          onClick={handleOpenMap}
                        >
                          {library.location}
                        </Text>
                      </Box>
                    </Group>
                  )}
                </Stack>

                <Button 
                  size="lg"
                  radius="md"
                  fullWidth
                  leftSection={<IconMapPin size={20} />}
                  onClick={handleOpenMap}
                  style={{
                    background: 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)',
                    marginTop: 10,
                  }}
                >
                  Google mapsda ko'rish
                </Button>
              </Stack>
            </Flex>
          </Paper>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg" mb={40}>
            <Paper 
              p={30} 
              radius="xl"
              style={{
                background: isDark 
                  ? 'rgba(26, 27, 30, 0.95)' 
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
              }}
            >
              <Group gap="md">
                <ThemeIcon size={60} radius="xl" style={{ background: 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)' }}>
                  <IconBook size={30} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" style={{ color: '#718096', marginBottom: 5 }}>Mavjud kitoblar</Text>
                  <Text size={28} fw={700} style={{ color: isDark ? 'white' : '#2D3748' }}>
                    {books.length}
                  </Text>
                </Box>
              </Group>
            </Paper>

            <Paper 
              p={30} 
              radius="xl"
              style={{
                background: isDark 
                  ? 'rgba(26, 27, 30, 0.95)' 
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
              }}
            >
              <Group gap="md">
                <ThemeIcon size={60} radius="xl" style={{ background: 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)' }}>
                  <IconCategory size={30} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" style={{ color: '#718096', marginBottom: 5 }}>Kategoriyalar</Text>
                  <Text size={28} fw={700} style={{ color: isDark ? 'white' : '#2D3748' }}>
                    {Object.keys(categories).length}
                  </Text>
                </Box>
              </Group>
            </Paper>

            <Paper 
              p={30} 
              radius="xl"
              style={{
                background: isDark 
                  ? 'rgba(26, 27, 30, 0.95)' 
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
              }}
            >
              <Group gap="md">
                <ThemeIcon size={60} radius="xl" style={{ background: 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)' }}>
                  <IconStar size={30} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" style={{ color: '#718096', marginBottom: 5 }}>Holat</Text>
                  <Text size={28} fw={700} style={{ color: isDark ? 'white' : '#2D3748' }}>
                    {library.books > 0 ? 'Faol' : 'Nofaol'}
                  </Text>
                </Box>
              </Group>
            </Paper>
          </SimpleGrid>

       
          {topCategories.length > 0 && (
            <Paper 
              p={30} 
              radius="xl" 
              mb={40}
              style={{
                background: isDark 
                  ? 'rgba(26, 27, 30, 0.95)' 
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
              }}
            >
              <Group gap={8} mb={20}>
                <IconCategory size={24} color={isDark ? '#d4a11e' : '#c17d11'} />
                <Text size="lg" fw={600} style={{ color: isDark ? 'white' : '#2D3748' }}>
                  Eng ko'p kitoblar kategoriyalar bo'yicha
                </Text>
              </Group>
              <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
                {topCategories.map(([category, count], index) => (
                  <Box key={category}>
                    <Group justify="space-between" mb={8}>
                      <Text size="sm" fw={500} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>
                        {category}
                      </Text>
                      <Text size="sm" fw={600} style={{ color: isDark ? '#d4a11e' : '#c17d11' }}>
                        {count} kitob
                      </Text>
                    </Group>
                    <Progress 
                      value={(count / books.length) * 100} 
                      size="md" 
                      radius="xl"
                      style={{
                        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      }}
                      styles={{
                        section: {
                          background: 'linear-gradient(90deg, #c17d11 0%, #d4a11e 100%)',
                        }
                      }}
                    />
                  </Box>
                ))}
              </SimpleGrid>
            </Paper>
          )}

          <Box>
            <Group justify="space-between" align="center" mb={30}>
              <Group gap={10}>
                <IconBook size={32} color="white" />
                <Title 
                  order={2} 
                  size={32}
                  style={{ color: 'white', textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)' }}
                >
                  Barcha kitoblar
                </Title>
              </Group>
              <Badge 
                size="xl" 
                variant="filled"
                style={{ 
                  background: isDark 
                    ? 'rgba(26, 27, 30, 0.95)' 
                    : 'rgba(255, 255, 255, 0.95)',
                  color: isDark ? '#d4a11e' : '#c17d11',
                  padding: '12px 20px',
                }}
              >
                {books.length} ta kitob
              </Badge>
            </Group>

            {books.length === 0 ? (
              <Paper 
                p={60} 
                radius="xl" 
                ta="center"
                style={{
                  background: isDark 
                    ? 'rgba(26, 27, 30, 0.95)' 
                    : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
                }}
              >
                <IconBook size={64} color={isDark ? '#d4a11e' : '#c17d11'} stroke={1.5} style={{ margin: '0 auto 20px' }} />
                <Text size="lg" fw={600} mb={8} style={{ color: isDark ? 'white' : '#2D3748' }}>
                  Hozircha kitoblar mavjud emas
                </Text>
                <Text size="sm" style={{ color: '#718096' }}>
                  Tez orada yangi kitoblar qo'shiladi
                </Text>
              </Paper>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
                {books.map(book => (
                  <Card 
                    key={book.id} 
                    shadow="sm" 
                    padding={0}
                    radius="xl"
                    style={{
                      background: isDark 
                        ? 'rgba(26, 27, 30, 0.95)' 
                        : 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      height: '100%',
                      overflow: 'hidden',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 25px 70px rgba(0, 0, 0, 0.25)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Card.Section>
                      <Box 
                        h={280}
                        style={{ 
                          backgroundImage: book.image ? `url(${book.image})` : `url(${BOOK_IMAGE})`,
                          backgroundSize: 'cover', 
                          backgroundPosition: 'center',
                          position: 'relative',
                        }}
                      >
                        <Box
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                            padding: '30px 15px 10px',
                          }}
                        >
                          {book.rating && (
                            <Group gap={4} justify="flex-end">
                              <IconStar size={16} color="#ffd43b" fill="#ffd43b" />
                              <Text size="sm" fw={700} style={{ color: 'white' }}>
                                {book.rating}
                              </Text>
                            </Group>
                          )}
                        </Box>
                      </Box>
                    </Card.Section>

                    <Stack gap="xs" p="lg">
                      <Text 
                        fw={600} 
                        size="md" 
                        lineClamp={2}
                        style={{ 
                          color: isDark ? 'white' : '#2D3748',
                          minHeight: 44,
                          lineHeight: 1.4,
                        }}
                      >
                        {book.title || book.name}
                      </Text>

                      <Stack gap={6}>
                        {book.author && (
                          <Group gap={8}>
                            <IconUser size={16} color={isDark ? '#d4a11e' : '#c17d11'} />
                            <Text size="xs" lineClamp={1} style={{ color: '#718096', flex: 1 }}>
                              {book.author}
                            </Text>
                          </Group>
                        )}

                        {book.category && (
                          <Group gap={8}>
                            <IconCategory size={16} color={isDark ? '#d4a11e' : '#c17d11'} />
                            <Text size="xs" style={{ color: '#718096' }}>
                              {book.category}
                            </Text>
                          </Group>
                        )}

                        {book.published_date && (
                          <Group gap={8}>
                            <IconCalendar size={16} color={isDark ? '#d4a11e' : '#c17d11'} />
                            <Text size="xs" style={{ color: '#718096' }}>
                              {book.published_date}
                            </Text>
                          </Group>
                        )}

                        {book.pages && (
                          <Group gap={8}>
                            <IconFileText size={16} color={isDark ? '#d4a11e' : '#c17d11'} />
                            <Text size="xs" style={{ color: '#718096' }}>
                              {book.pages} sahifa
                            </Text>
                          </Group>
                        )}

                        {book.language && (
                          <Group gap={8}>
                            <IconLanguage size={16} color={isDark ? '#d4a11e' : '#c17d11'} />
                            <Text size="xs" style={{ color: '#718096' }}>
                              {book.language}
                            </Text>
                          </Group>
                        )}
                      </Stack>

                      <Badge 
                        variant="light"
                        fullWidth
                        mt="xs"
                        size="md"
                        leftSection={<IconCheck size={14} />}
                        style={{ 
                          background: isDark 
                            ? 'rgba(212, 161, 30, 0.15)' 
                            : 'rgba(193, 125, 17, 0.15)',
                          color: isDark ? '#d4a11e' : '#c17d11',
                        }}
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
    </MantineProvider>
  );
};

export default () => {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedLibraryId, setSelectedLibraryId] = useState(1);

  if (showDetail) {
    return <DetailLibrary libraryId={selectedLibraryId} onBack={() => setShowDetail(false)} />;
  }

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <Button 
        onClick={() => setShowDetail(true)}
        size="lg"
        style={{ background: 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)' }}
      >
        Test - Kutubxona tafsilotlarini ko'rish (ID: 1)
      </Button>
    </div>
  );
};