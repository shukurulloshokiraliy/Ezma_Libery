import React, { useState, useEffect } from 'react';
import {
  Container, Box, Text, SimpleGrid, Paper, Group, Button,
  Stack, Flex, Card, Badge, Skeleton, MantineProvider,
  Divider, Title, ThemeIcon
} from '@mantine/core';
import {
  IconBook, IconArrowLeft, IconUser, IconCalendar,
  IconFileText, IconLanguage, IconCategory, IconHash,
  IconBookmark, IconDownload, IconBuildingLibrary, IconStar
} from '@tabler/icons-react';

const BOOK_IMAGE = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=60';

const DetailBook = ({ bookId, onBack }) => {
  const [isDark, setIsDark] = useState(false);
  const [book, setBook] = useState(null);
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dark mode state
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDark(savedMode === 'true');
    }
    
    const handleDarkModeChange = () => {
      const currentMode = localStorage.getItem('darkMode');
      setIsDark(currentMode === 'true');
    };
    
    window.addEventListener('darkModeChange', handleDarkModeChange);
    return () => window.removeEventListener('darkModeChange', handleDarkModeChange);
  }, []);

  // Kitob va kutubxonalarni yuklash
  useEffect(() => {
    console.log('=== DetailBook useEffect started ===');
    console.log('Received bookId:', bookId);
    console.log('bookId type:', typeof bookId);
    
    if (!bookId) {
      setError('Kitob ID topilmadi');
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    
    const loadBookData = async () => {
      setLoading(true);
      setError(null);
      setBook(null);
      setLibraries([]);

      try {
      
        let cleanBookId = String(bookId);
        
        console.log('Step 1 - Original:', cleanBookId);
        
  
        if (cleanBookId.includes('/')) {
          cleanBookId = cleanBookId.split('/').pop();
          console.log('Step 2 - After split by /:', cleanBookId);
        }
        
        if (cleanBookId.includes(':')) {
          cleanBookId = cleanBookId.split(':')[0];   
          console.log('Step 3 - After split by ::', cleanBookId);
        }
        
        cleanBookId = cleanBookId.trim();            
        cleanBookId = cleanBookId.replace(/[^0-9]/g, ''); 
        
        console.log('Final cleaned bookId:', cleanBookId);
        
        if (!cleanBookId || cleanBookId === '') {
          throw new Error('Kitob ID noto\'g\'ri formatda');
        }
        

        const bookUrl = `https://org-ave-jimmy-learners.trycloudflare.com/api/v1/books/book/${cleanBookId}/`;
        console.log('Final URL:', bookUrl);
        
        const bookResponse = await fetch(bookUrl, { 
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        if (!bookResponse.ok) {
          throw new Error(`Server xatosi: ${bookResponse.status}`);
        }

        const contentType = bookResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server JSON formatda javob bermadi');
        }

        const bookData = await bookResponse.json();
        
        if (!bookData) {
          throw new Error('Kitob ma\'lumotlari topilmadi');
        }

        setBook(bookData);

        const libraryIds = Array.isArray(bookData.libraries) ? bookData.libraries : [];
        
        if (libraryIds.length > 0) {
          const libraryPromises = libraryIds.map(async (libId) => {
            try {
              const libResponse = await fetch(
                `https://org-ave-jimmy-learners.trycloudflare.com/api/v1/libraries/library/${libId}/`,
                { 
                  signal: controller.signal,
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  }
                }
              );
              
              if (!libResponse.ok) return null;
              
              const libContentType = libResponse.headers.get('content-type');
              if (!libContentType || !libContentType.includes('application/json')) {
                return null;
              }
              
              return await libResponse.json();
            } catch (err) {
              console.error(`Kutubxona ${libId} yuklanmadi:`, err);
              return null;
            }
          });

          const libraryResults = await Promise.all(libraryPromises);
          const validLibraries = libraryResults.filter(lib => lib !== null);
          setLibraries(validLibraries);
        }

      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('So\'rov bekor qilindi');
          return;
        }

        console.error('Xatolik:', err);
        
        if (err.message.includes('Failed to fetch')) {
          setError('Serverga ulanib bo\'lmadi. Internetni tekshiring.');
        } else if (err.message.includes('404')) {
          setError('Kitob topilmadi. ID noto\'g\'ri bo\'lishi mumkin.');
        } else {
          setError(err.message || 'Noma\'lum xatolik yuz berdi');
        }
      } finally {
        setLoading(false);
      }
    };

    loadBookData();

    return () => {
      controller.abort();
    };
  }, [bookId]);

  if (loading) {
    return (
      <MantineProvider>
        <Box style={{
          minHeight: '100vh',
          background: isDark 
            ? 'linear-gradient(180deg, #1a1a2e, #16213e)' 
            : 'linear-gradient(180deg, #c17d11, #d4a11e, #c17d11)',
          padding: '40px 0'
        }}>
          <Container size="xl">
            <Skeleton height={500} radius="xl" mb="xl" />
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mb="xl">
              <Skeleton height={150} radius="xl" />
              <Skeleton height={150} radius="xl" />
              <Skeleton height={150} radius="xl" />
            </SimpleGrid>
            <Skeleton height={300} radius="xl" />
          </Container>
        </Box>
      </MantineProvider>
    );
  }

  if (error) {
    return (
      <MantineProvider>
        <Box style={{
          minHeight: '100vh',
          background: isDark 
            ? 'linear-gradient(180deg, #1a1a2e, #16213e)' 
            : 'linear-gradient(180deg, #c17d11, #d4a11e, #c17d11)',
          padding: '40px 0'
        }}>
          <Container size="xl">
            {onBack && (
              <Button 
                leftSection={<IconArrowLeft size={18} />} 
                variant="light" 
                size="md" 
                radius="md" 
                mb={30} 
                onClick={onBack}
                style={{ 
                  background: isDark ? 'rgba(26,27,30,0.95)' : 'rgba(255,255,255,0.95)', 
                  color: isDark ? '#d4a11e' : '#c17d11' 
                }}
              >
                Orqaga
              </Button>
            )}
            <Paper 
              p={40} 
              radius="xl" 
              style={{ 
                background: isDark ? 'rgba(26,27,30,0.95)' : 'rgba(255,255,255,0.95)',
                textAlign: 'center'
              }}
            >
              <Text size="xl" fw={600} mb="md" style={{ color: '#ff6b6b' }}>
                Xatolik yuz berdi
              </Text>
              <Text size="md" mb="xl" style={{ color: isDark ? '#cbd5e0' : '#718096' }}>
                {error}
              </Text>
              <Group justify="center" gap="md">
                <Button onClick={() => window.location.reload()}>
                  Qayta urinish
                </Button>
                {onBack && (
                  <Button variant="light" onClick={onBack}>
                    Orqaga qaytish
                  </Button>
                )}
              </Group>
            </Paper>
          </Container>
        </Box>
      </MantineProvider>
    );
  }

  if (!book) return null;

  return (
    <MantineProvider>
      <Box style={{
        minHeight: '100vh',
        background: isDark 
          ? 'linear-gradient(180deg, #1a1a2e, #16213e)' 
          : 'linear-gradient(180deg, #c17d11, #d4a11e, #c17d11)',
        padding: '40px 0',
        position: 'relative'
      }}>
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
                background: isDark ? 'rgba(26,27,30,0.95)' : 'rgba(255,255,255,0.95)', 
                color: isDark ? '#d4a11e' : '#c17d11' 
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
              background: isDark ? 'rgba(26,27,30,0.95)' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)', 
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.3)'}`
            }}
          >
            <Flex direction={{ base: 'column', md: 'row' }}>
              <Box 
                w={{ base: '100%', md: '40%' }} 
                h={{ base: 350, md: 550 }} 
                style={{
                  backgroundImage: `url(${book.image || BOOK_IMAGE})`,
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center',
                  borderRadius: '24px 0 0 24px'
                }} 
              />
              <Stack gap="lg" p={40} style={{ flex: 1 }}>
                <Box>
                  <Group gap={8} mb={10}>
                    <IconBook size={24} color={isDark ? '#d4a11e' : '#c17d11'} />
                    <Text size="sm" fw={500} style={{ color: isDark ? '#d4a11e' : '#c17d11' }}>
                      Kitob haqida
                    </Text>
                  </Group>
                  <Title order={1} size={38} mb="md" style={{ color: isDark ? 'white' : '#2D3748' }}>
                    {book.name}
                  </Title>
                  {book.description && (
                    <Text size="md" style={{ color: isDark ? '#cbd5e0' : '#718096', lineHeight: 1.7 }}>
                      {book.description}
                    </Text>
                  )}
                </Box>
                
                <Divider />
                
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  {book.author && (
                    <Group gap={12}>
                      <ThemeIcon 
                        size={40} 
                        radius="md" 
                        style={{ background: isDark ? 'rgba(212,161,30,0.15)' : 'rgba(193,125,17,0.15)' }}
                      >
                        <IconUser size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                      </ThemeIcon>
                      <Box>
                        <Text size="xs" style={{ color: '#718096' }}>Muallif</Text>
                        <Text size="md" fw={600} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>
                          {book.author}
                        </Text>
                      </Box>
                    </Group>
                  )}
                  
                  {book.publisher && (
                    <Group gap={12}>
                      <ThemeIcon 
                        size={40} 
                        radius="md" 
                        style={{ background: isDark ? 'rgba(212,161,30,0.15)' : 'rgba(193,125,17,0.15)' }}
                      >
                        <IconBuildingLibrary size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                      </ThemeIcon>
                      <Box>
                        <Text size="xs" style={{ color: '#718096' }}>Nashriyot</Text>
                        <Text size="md" fw={600} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>
                          {book.publisher}
                        </Text>
                      </Box>
                    </Group>
                  )}
                  
                  {book.published_date && (
                    <Group gap={12}>
                      <ThemeIcon 
                        size={40} 
                        radius="md" 
                        style={{ background: isDark ? 'rgba(212,161,30,0.15)' : 'rgba(193,125,17,0.15)' }}
                      >
                        <IconCalendar size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                      </ThemeIcon>
                      <Box>
                        <Text size="xs" style={{ color: '#718096' }}>Nashr yili</Text>
                        <Text size="md" fw={600} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>
                          {book.published_date}
                        </Text>
                      </Box>
                    </Group>
                  )}
                  
                  {book.pages && (
                    <Group gap={12}>
                      <ThemeIcon 
                        size={40} 
                        radius="md" 
                        style={{ background: isDark ? 'rgba(212,161,30,0.15)' : 'rgba(193,125,17,0.15)' }}
                      >
                        <IconFileText size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                      </ThemeIcon>
                      <Box>
                        <Text size="xs" style={{ color: '#718096' }}>Sahifalar</Text>
                        <Text size="md" fw={600} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>
                          {book.pages} sahifa
                        </Text>
                      </Box>
                    </Group>
                  )}
                  
                  {book.language && (
                    <Group gap={12}>
                      <ThemeIcon 
                        size={40} 
                        radius="md" 
                        style={{ background: isDark ? 'rgba(212,161,30,0.15)' : 'rgba(193,125,17,0.15)' }}
                      >
                        <IconLanguage size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                      </ThemeIcon>
                      <Box>
                        <Text size="xs" style={{ color: '#718096' }}>Til</Text>
                        <Text size="md" fw={600} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>
                          {book.language}
                        </Text>
                      </Box>
                    </Group>
                  )}
                  
                  {book.category && (
                    <Group gap={12}>
                      <ThemeIcon 
                        size={40} 
                        radius="md" 
                        style={{ background: isDark ? 'rgba(212,161,30,0.15)' : 'rgba(193,125,17,0.15)' }}
                      >
                        <IconCategory size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                      </ThemeIcon>
                      <Box>
                        <Text size="xs" style={{ color: '#718096' }}>Kategoriya</Text>
                        <Text size="md" fw={600} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>
                          {book.category}
                        </Text>
                      </Box>
                    </Group>
                  )}
                  
                  {book.isbn && (
                    <Group gap={12}>
                      <ThemeIcon 
                        size={40} 
                        radius="md" 
                        style={{ background: isDark ? 'rgba(212,161,30,0.15)' : 'rgba(193,125,17,0.15)' }}
                      >
                        <IconHash size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                      </ThemeIcon>
                      <Box>
                        <Text size="xs" style={{ color: '#718096' }}>ISBN</Text>
                        <Text size="md" fw={600} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>
                          {book.isbn}
                        </Text>
                      </Box>
                    </Group>
                  )}
                </SimpleGrid>

                <Group gap="md" mt="md">
                  <Button 
                    size="lg" 
                    radius="md" 
                    flex={1} 
                    leftSection={<IconBookmark size={20} />} 
                    style={{ background: 'linear-gradient(180deg, #c17d11, #d4a11e)' }}
                  >
                    Saqlash
                  </Button>
                  <Button 
                    size="lg" 
                    radius="md" 
                    flex={1} 
                    variant="light" 
                    leftSection={<IconDownload size={20} />} 
                    style={{ color: isDark ? '#d4a11e' : '#c17d11' }}
                  >
                    Yuklab olish
                  </Button>
                </Group>
              </Stack>
            </Flex>
          </Paper>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg" mb={40}>
            <Paper 
              p={30} 
              radius="xl" 
              style={{ background: isDark ? 'rgba(26,27,30,0.95)' : 'rgba(255,255,255,0.95)' }}
            >
              <Group gap="md">
                <ThemeIcon 
                  size={60} 
                  radius="xl" 
                  style={{ background: 'linear-gradient(180deg, #c17d11, #d4a11e)' }}
                >
                  <IconBook size={30} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" style={{ color: '#718096' }}>Mavjud nusxalar</Text>
                  <Text size={28} fw={700} style={{ color: isDark ? 'white' : '#2D3748' }}>
                    {book.quantity_in_library || 0}
                  </Text>
                </Box>
              </Group>
            </Paper>

            <Paper 
              p={30} 
              radius="xl" 
              style={{ background: isDark ? 'rgba(26,27,30,0.95)' : 'rgba(255,255,255,0.95)' }}
            >
              <Group gap="md">
                <ThemeIcon 
                  size={60} 
                  radius="xl" 
                  style={{ background: 'linear-gradient(180deg, #c17d11, #d4a11e)' }}
                >
                  <IconBuildingLibrary size={30} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" style={{ color: '#718096' }}>Kutubxonalar</Text>
                  <Text size={28} fw={700} style={{ color: isDark ? 'white' : '#2D3748' }}>
                    {libraries.length}
                  </Text>
                </Box>
              </Group>
            </Paper>

            <Paper 
              p={30} 
              radius="xl" 
              style={{ background: isDark ? 'rgba(26,27,30,0.95)' : 'rgba(255,255,255,0.95)' }}
            >
              <Group gap="md">
                <ThemeIcon 
                  size={60} 
                  radius="xl" 
                  style={{ background: 'linear-gradient(180deg, #c17d11, #d4a11e)' }}
                >
                  <IconStar size={30} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" style={{ color: '#718096' }}>Reyting</Text>
                  <Text size={28} fw={700} style={{ color: isDark ? 'white' : '#2D3748' }}>
                    {book.rating ?? '—'}
                  </Text>
                </Box>
              </Group>
            </Paper>
          </SimpleGrid>

          {libraries.length > 0 && (
            <Box>
              <Group justify="space-between" align="center" mb={30}>
                <Group gap={10}>
                  <IconBuildingLibrary size={32} color="white" />
                  <Title order={2} size={32} style={{ color: 'white' }}>
                    Kutubxonalar
                  </Title>
                </Group>
                <Badge 
                  size="xl" 
                  variant="filled" 
                  style={{ 
                    background: isDark ? 'rgba(26,27,30,0.95)' : 'rgba(255,255,255,0.95)', 
                    color: isDark ? '#d4a11e' : '#c17d11', 
                    padding: '12px 20px' 
                  }}
                >
                  {libraries.length} ta kutubxona
                </Badge>
              </Group>

              <Stack gap="lg">
                {libraries.map(lib => (
                  <Card 
                    key={lib.id} 
                    shadow="sm" 
                    padding="lg" 
                    radius="xl" 
                    style={{ background: isDark ? 'rgba(26,27,30,0.95)' : 'rgba(255,255,255,0.95)' }}
                  >
                    <Flex gap="lg" align="center" justify="space-between" wrap="wrap">
                      <Group gap="lg">
                        <ThemeIcon 
                          size={70} 
                          radius="xl" 
                          style={{ background: 'linear-gradient(180deg, #c17d11, #d4a11e)' }}
                        >
                          <IconBuildingLibrary size={35} />
                        </ThemeIcon>
                        <Box>
                          <Text fw={600} size="xl" mb={8} style={{ color: isDark ? 'white' : '#2D3748' }}>
                            {lib.name}
                          </Text>
                          {lib.location && (
                            <Group gap={8}>
                              <IconBook size={18} color={isDark ? '#d4a11e' : '#c17d11'} />
                              <Text size="sm" style={{ color: '#718096' }}>
                                {lib.location}
                              </Text>
                            </Group>
                          )}
                        </Box>
                      </Group>
                      <Group gap="md">
                        {lib.books > 0 && (
                          <Badge 
                            size="lg" 
                            variant="light" 
                            leftSection={<IconBook size={16} />} 
                            style={{ 
                              background: isDark ? 'rgba(212,161,30,0.15)' : 'rgba(193,125,17,0.15)', 
                              color: isDark ? '#d4a11e' : '#c17d11' 
                            }}
                          >
                            {lib.books} kitob
                          </Badge>
                        )}
                        <Button 
                          variant="light" 
                          size="sm" 
                          style={{ color: isDark ? '#d4a11e' : '#c17d11' }}
                        >
                          Ko'rish
                        </Button>
                      </Group>
                    </Flex>
                  </Card>
                ))}
              </Stack>
            </Box>
          )}

        </Container>
      </Box>
    </MantineProvider>
  );
};

export default DetailBook;