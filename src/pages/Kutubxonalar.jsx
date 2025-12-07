import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Box, Text, SimpleGrid, Paper, Group, Button,
  TextInput, Stack, Flex, Card, Badge, ActionIcon, Skeleton, MantineProvider
} from '@mantine/core';
import { 
  IconSearch, IconMapPin, IconBook, IconPhone,
  IconArrowsSort, IconGrid3x3, IconList, IconBrandTelegram,
  IconWorld, IconBrandInstagram, IconBrandFacebook
} from '@tabler/icons-react';

const BOOK_IMAGE = 'https://ezma-client.vercel.app/assets/library-CY0z204p.webp';
const API_URL = 'https://org-ave-jimmy-learners.trycloudflare.com/api/v1';

const Kutubxonalar = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState('grid');
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) setIsDark(saved === 'true');
    const handleChange = () => setIsDark(localStorage.getItem('darkMode') === 'true');
    window.addEventListener('darkModeChange', handleChange);
    return () => window.removeEventListener('darkModeChange', handleChange);
  }, []);

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const [libRes, booksRes] = await Promise.all([
          fetch(`${API_URL}/libraries/libraries/`),
          fetch(`${API_URL}/books/books/`)
        ]);
        
        const libData = await libRes.json();
        const booksData = await booksRes.json();
        
        const librariesArray = Array.isArray(libData) ? libData : libData.results || [];
        const booksArray = Array.isArray(booksData) ? booksData : booksData.results || [];
        
        const librariesWithCount = librariesArray.map(lib => {
          const bookCount = booksArray.filter(book => 
            book.libraries && book.libraries.includes(lib.id)
          ).length;
          
          return {
            ...lib,
            books: bookCount
          };
        });
        
        setLibraries(librariesWithCount);
      } catch (err) {
        console.error('Xatolik:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLibraries();
  }, []);

  const filtered = libraries
    .filter(lib => 
      lib.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lib.location && lib.location.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'books-desc') return (b.books || 0) - (a.books || 0);
      if (sortBy === 'books-asc') return (a.books || 0) - (b.books || 0);
      return 0;
    });

  const GridView = () => (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
      {filtered.map(lib => (
        <Card 
          key={lib.id} 
          padding="xl" 
          radius="xl" 
          onClick={() => navigate(`/kutubxona/${lib.id}`)}
          style={{ 
            background: isDark ? 'rgba(26,27,30,0.95)' : 'rgba(255,255,255,0.95)', 
            cursor: 'pointer', 
            transition: 'all 0.3s',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }} 
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
          }} 
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }}
        >
          <Card.Section>
            <Box 
              h={250} 
              style={{ 
                backgroundImage: `url(${lib.image || BOOK_IMAGE})`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative' 
              }}
            >
              {lib.books > 0 && (
                <Badge 
                  size="lg"
                  style={{ 
                    position: 'absolute', 
                    top: 15, 
                    right: 15, 
                    background: 'linear-gradient(180deg, #10b981, #059669)',
                    fontSize: 13,
                    fontWeight: 700,
                    padding: '8px 14px'
                  }}
                >
                  Faol
                </Badge>
              )}
            </Box>
          </Card.Section>
          <Stack gap="md" mt="lg">
            <Text fw={700} size="xl" lineClamp={2} style={{ color: isDark ? 'white' : '#2D3748', minHeight: 56 }}>
              {lib.name}
            </Text>
            
            <Stack gap="sm">
              <Group gap={10}>
                <IconBook size={20} color="#3b82f6" />
                <Text size="md" fw={600} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>
                  {lib.books || 0} Kitob
                </Text>
              </Group>
              
              {lib.phone && (
                <Group gap={10}>
                  <IconPhone size={20} color="#3b82f6" />
                  <Text size="sm" style={{ color: isDark ? '#cbd5e0' : '#718096' }}>
                    {lib.phone}
                  </Text>
                </Group>
              )}
              
              {lib.telegram && (
                <Group gap={10}>
                  <IconBrandTelegram size={20} color="#3b82f6" />
                  <Text size="sm" style={{ color: isDark ? '#cbd5e0' : '#718096' }}>
                    {lib.telegram}
                  </Text>
                </Group>
              )}
              
              {lib.location && (
                <Group gap={10}>
                  <IconMapPin size={20} color="#3b82f6" />
                  <Text size="sm" lineClamp={2} style={{ color: '#3b82f6', fontWeight: 500 }}>
                    Google Maps
                  </Text>
                </Group>
              )}
            </Stack>
            
            {(lib.website || lib.instagram || lib.facebook || lib.email) && (
              <Group gap={6} mt="xs">
                {lib.website && (
                  <Badge 
                    leftSection={<IconWorld size={12} />} 
                    size="sm"
                    style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}
                  >
                    Web
                  </Badge>
                )}
                {lib.instagram && (
                  <Badge 
                    leftSection={<IconBrandInstagram size={12} />} 
                    size="sm"
                    style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}
                  >
                    Instagram
                  </Badge>
                )}
                {lib.facebook && (
                  <Badge 
                    leftSection={<IconBrandFacebook size={12} />} 
                    size="sm"
                    style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}
                  >
                    Facebook
                  </Badge>
                )}
              </Group>
            )}
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );

  const ListView = () => (
    <Stack gap="lg">
      {filtered.map(lib => (
        <Card
          key={lib.id}
          padding="xl"
          radius="xl"
          onClick={() => navigate(`/kutubxona/${lib.id}`)}
          style={{
            background: isDark ? 'rgba(26,27,30,0.95)' : 'rgba(255,255,255,0.95)',
            cursor: 'pointer',
            transition: 'all 0.3s',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateX(8px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }}
        >
          <Flex gap="xl" align="center" wrap="wrap">
            <Box
              w={160}
              h={160}
              style={{
                backgroundImage: `url(${lib.image || BOOK_IMAGE})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 16,
                flexShrink: 0,
                position: 'relative'
              }}
            >
              {lib.books > 0 && (
                <Badge
                  size="lg"
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'linear-gradient(180deg, #10b981, #059669)',
                    fontSize: 12,
                    fontWeight: 700
                  }}
                >
                  Faol
                </Badge>
              )}
            </Box>
            
            <Stack gap="md" style={{ flex: 1, minWidth: 300 }}>
              <Text fw={700} size="28px" style={{ color: isDark ? 'white' : '#2D3748' }}>
                {lib.name}
              </Text>
              
              <Group gap="xl" wrap="wrap">
                <Group gap={10}>
                  <IconBook size={22} color="#3b82f6" />
                  <Text size="md" fw={600} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>
                    {lib.books || 0} Kitob
                  </Text>
                </Group>
                {lib.phone && (
                  <Group gap={10}>
                    <IconPhone size={22} color="#3b82f6" />
                    <Text size="md" style={{ color: isDark ? '#cbd5e0' : '#718096' }}>
                      {lib.phone}
                    </Text>
                  </Group>
                )}
                {lib.telegram && (
                  <Group gap={10}>
                    <IconBrandTelegram size={22} color="#3b82f6" />
                    <Text size="md" style={{ color: isDark ? '#cbd5e0' : '#718096' }}>
                      {lib.telegram}
                    </Text>
                  </Group>
                )}
              </Group>
              
              {lib.location && (
                <Group gap={10}>
                  <IconMapPin size={22} color="#3b82f6" />
                  <Text size="md" fw={500} style={{ color: '#3b82f6' }}>
                    Google Maps
                  </Text>
                </Group>
              )}
              
              {(lib.website || lib.instagram || lib.facebook || lib.email) && (
                <Group gap={8} mt={4}>
                  {lib.website && (
                    <Badge 
                      leftSection={<IconWorld size={14} />} 
                      size="md"
                      style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)', padding: '8px 12px' }}
                    >
                      Website
                    </Badge>
                  )}
                  {lib.instagram && (
                    <Badge 
                      leftSection={<IconBrandInstagram size={14} />} 
                      size="md"
                      style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)', padding: '8px 12px' }}
                    >
                      Instagram
                    </Badge>
                  )}
                  {lib.facebook && (
                    <Badge 
                      leftSection={<IconBrandFacebook size={14} />} 
                      size="md"
                      style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)', padding: '8px 12px' }}
                    >
                      Facebook
                    </Badge>
                  )}
                </Group>
              )}
            </Stack>
          </Flex>
        </Card>
      ))}
    </Stack>
  );

  return (
    <MantineProvider>
      <Box style={{ 
        minHeight: '100vh', 
        background: isDark ? 'linear-gradient(180deg, #1a1a2e, #16213e)' : 'linear-gradient(180deg, #c17d11, #d4a11e)', 
        padding: '40px 0' 
      }}>
        <Container size="xl">
          <Text size="42px" fw={800} ta="center" mb={40} style={{ color: 'white' }}>
            Kutubxonalar
          </Text>
          
          <Flex gap={20} align="flex-start" direction={{ base: 'column', md: 'row' }}>
            <Box w={{ base: '100%', md: 280 }}>
              <Paper 
                p={20} 
                radius="xl" 
                style={{ 
                  background: isDark ? 'rgba(26,27,30,0.95)' : 'rgba(255,255,255,0.95)', 
                  backdropFilter: 'blur(10px)',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : 'none'
                }}
              >
                <Stack gap="md">
                  <Group gap={8}>
                    <IconArrowsSort size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                    <Text fw={600} size="sm" style={{ color: isDark ? 'white' : '#2D3748' }}>
                      Saralash
                    </Text>
                  </Group>
                  <Stack gap={8}>
                    {[
                      { value: 'name-asc', label: 'Nomi (A‑Z)' },
                      { value: 'name-desc', label: 'Nomi (Z‑A)' },
                      { value: 'books-desc', label: 'Ko\'p kitobli' },
                      { value: 'books-asc', label: 'Kam kitobli' }
                    ].map(sort => (
                      <Button 
                        key={sort.value} 
                        fullWidth 
                        radius="md" 
                        onClick={() => setSortBy(sort.value)} 
                        style={{ 
                          background: sortBy === sort.value 
                            ? 'linear-gradient(180deg, #c17d11, #d4a11e)' 
                            : isDark ? 'rgba(255,255,255,0.05)' : 'transparent', 
                          color: sortBy === sort.value ? 'white' : isDark ? '#d4a11e' : '#c17d11',
                          border: sortBy !== sort.value && !isDark ? '1px solid #e0e0e0' : 'none'
                        }}
                      >
                        {sort.label}
                      </Button>
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            </Box>

            <Box style={{ flex: 1 }}>
              <Stack gap="lg">
                <Flex gap="md">
                  <Box style={{ 
                    flex: 1, 
                    background: isDark ? 'rgba(26,27,30,0.95)' : 'rgba(255,255,255,0.95)', 
                    borderRadius: 16, 
                    padding: 8,
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : 'none'
                  }}>
                    <TextInput 
                      placeholder="Kutubxona nomi yoki manzil..." 
                      leftSection={<IconSearch size={18} color={isDark ? '#d4a11e' : '#c17d11'} />} 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      styles={{ 
                        input: { 
                          border: 'none', 
                          background: 'transparent', 
                          color: isDark ? 'white' : '#2D3748' 
                        } 
                      }} 
                    />
                  </Box>
                  <Group gap={8}>
                    {['grid', 'list'].map(mode => (
                      <ActionIcon 
                        key={mode} 
                        size={42} 
                        radius="md" 
                        onClick={() => setViewMode(mode)} 
                        style={{ 
                          background: viewMode === mode 
                            ? 'linear-gradient(180deg, #c17d11, #d4a11e)' 
                            : isDark ? 'rgba(26,27,30,0.95)' : 'rgba(255,255,255,0.95)', 
                          color: viewMode === mode ? 'white' : isDark ? '#d4a11e' : '#c17d11',
                          border: isDark ? '1px solid rgba(255,255,255,0.08)' : 'none'
                        }}
                      >
                        {mode === 'grid' ? <IconGrid3x3 size={20} /> : <IconList size={20} />}
                      </ActionIcon>
                    ))}
                  </Group>
                </Flex>

                {loading ? (
                  <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                    {[1,2,3,4,5,6].map(i => <Skeleton key={i} height={300} radius="xl" />)}
                  </SimpleGrid>
                ) : filtered.length === 0 ? (
                  <Paper p={40} radius="xl" style={{ 
                    background: isDark ? 'rgba(26,27,30,0.95)' : 'rgba(255,255,255,0.95)', 
                    textAlign: 'center',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : 'none'
                  }}>
                    <Text size="lg" style={{ color: isDark ? '#cbd5e0' : '#718096' }}>
                      Kutubxonalar topilmadi
                    </Text>
                  </Paper>
                ) : (
                  viewMode === 'grid' ? <GridView /> : <ListView />
                )}
              </Stack>
            </Box>
          </Flex>
        </Container>
      </Box>
    </MantineProvider>
  );
};

export default Kutubxonalar;