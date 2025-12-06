import React, { useState, useEffect } from 'react';
import { 
  Container, Box, Text, SimpleGrid, Paper, Group, Button,
  TextInput, Stack, Flex, Card, Badge, ActionIcon, Divider, Skeleton, MantineProvider, Title
} from '@mantine/core';
import { 
  IconSearch, IconMapPin, IconBook, IconPhone,
  IconBrandTelegram, IconArrowsSort, IconGrid3x3, IconList, IconCheck, IconArrowLeft, IconUser, IconCalendar
} from '@tabler/icons-react';

const BOOK_IMAGE = 'https://ezma-client.vercel.app/assets/library-CY0z204p.webp';

// Detail Component
const DetailLibrary = ({ libraryId, onBack, isDark }) => {
  const [library, setLibrary] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://org-ave-jimmy-learners.trycloudflare.com/api/v1/libraries/libraries/${libraryId}/`);
        const libData = await res.json();
        setLibrary(libData);
        
        const booksRes = await fetch(`https://org-ave-jimmy-learners.trycloudflare.com/api/v1/libraries/books/?library=${libraryId}`);
        const booksData = await booksRes.json();
        setBooks(Array.isArray(booksData) ? booksData : booksData.results || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    if (libraryId) fetchData();
  }, [libraryId]);

  if (loading) {
    return (
      <Box style={{ minHeight: '100vh', background: isDark ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)', padding: '40px 0' }}>
        <Container size="xl"><Skeleton height={300} radius="xl" mb="xl" /></Container>
      </Box>
    );
  }

  return (
    <Box style={{ minHeight: '100vh', background: isDark ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)', padding: '40px 0', position: 'relative' }}>
      <Container size="xl">
        <Button leftSection={<IconArrowLeft size={18} />} size="md" radius="md" mb={30} onClick={onBack} style={{ background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', color: isDark ? '#d4a11e' : '#c17d11' }}>Orqaga</Button>
        
        <Paper p={40} radius="xl" mb={40} style={{ background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
          <Flex gap={40} direction={{ base: 'column', md: 'row' }}>
            <Box w={{ base: '100%', md: 300 }} h={300} style={{ backgroundImage: `url(${BOOK_IMAGE})`, backgroundSize: 'cover', borderRadius: 20, position: 'relative' }}>
              {library?.books > 0 && <Badge size="lg" style={{ position: 'absolute', top: 15, right: 15, background: 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)' }}>Faol</Badge>}
            </Box>
            <Stack gap="md" style={{ flex: 1 }}>
              <Title order={1} size={42} style={{ color: isDark ? 'white' : '#2D3748' }}>{library?.name}</Title>
              <Group gap={20}><Group gap={8}><IconBook size={24} color={isDark ? '#d4a11e' : '#c17d11'} /><Text size="lg" fw={600} style={{ color: isDark ? '#d4a11e' : '#c17d11' }}>{library?.books || 0} Kitob</Text></Group></Group>
              <Divider />
              <Stack gap="sm">
                {library?.phone && <Group gap={12}><IconPhone size={20} color={isDark ? '#d4a11e' : '#c17d11'} /><Text size="md" style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>{library.phone}</Text></Group>}
                {library?.telegram && <Group gap={12}><IconBrandTelegram size={20} color={isDark ? '#d4a11e' : '#c17d11'} /><Text size="md" style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>{library.telegram}</Text></Group>}
                {library?.location && <Group gap={12}><IconMapPin size={20} color={isDark ? '#d4a11e' : '#c17d11'} /><Text size="md" style={{ color: isDark ? '#d4a11e' : '#c17d11', cursor: 'pointer' }}>{library.location}</Text></Group>}
              </Stack>
            </Stack>
          </Flex>
        </Paper>

        <Title order={2} size={32} mb={30} style={{ color: 'white' }}>Kitoblar ({books.length})</Title>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
          {books.map(book => (
            <Card key={book.id} padding="lg" radius="xl" style={{ background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
              <Card.Section><Box h={250} style={{ backgroundImage: book.image ? `url(${book.image})` : `url(${BOOK_IMAGE})`, backgroundSize: 'cover' }} /></Card.Section>
              <Stack gap="xs" mt="md">
                <Text fw={600} size="md" lineClamp={2} style={{ color: isDark ? 'white' : '#2D3748', minHeight: 44 }}>{book.title || book.name}</Text>
                {book.author && <Group gap={6}><IconUser size={16} color={isDark ? '#d4a11e' : '#c17d11'} /><Text size="sm" style={{ color: '#718096' }}>{book.author}</Text></Group>}
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

// Main Component
const Kutubxonalar = () => {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState('grid');
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLibraryId, setSelectedLibraryId] = useState(null);

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
        const res = await fetch('https://org-ave-jimmy-learners.trycloudflare.com/api/v1/libraries/libraries/');
        const data = await res.json();
        setLibraries(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchLibraries();
  }, []);

  const filtered = libraries.filter(lib => lib.name.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    return 0;
  });

  if (selectedLibraryId) {
    return <MantineProvider><DetailLibrary libraryId={selectedLibraryId} onBack={() => setSelectedLibraryId(null)} isDark={isDark} /></MantineProvider>;
  }

  return (
    <MantineProvider>
      <Box style={{ minHeight: '100vh', background: isDark ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)', padding: '40px 0' }}>
        <Container size="xl">
          <Text size="42px" fw={800} ta="center" mb={40} style={{ color: 'white' }}>Kutubxonalar</Text>
          
          <Flex gap={20} align="flex-start">
            <Box w={280}>
              <Paper p={20} radius="xl" style={{ background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
                <Stack gap="md">
                  <Group gap={8}><IconArrowsSort size={20} color={isDark ? '#d4a11e' : '#c17d11'} /><Text fw={600} size="sm" style={{ color: isDark ? 'white' : '#2D3748' }}>Saralash</Text></Group>
                  <Stack gap={8}>
                    {['name-asc', 'name-desc'].map(sort => (
                      <Button key={sort} fullWidth radius="md" onClick={() => setSortBy(sort)} style={{ background: sortBy === sort ? 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)' : isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent', color: sortBy === sort ? 'white' : isDark ? '#d4a11e' : '#c17d11' }}>
                        {sort === 'name-asc' ? 'Nomi (A‑Z)' : 'Nomi (Z‑A)'}
                      </Button>
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            </Box>

            <Box style={{ flex: 1 }}>
              <Stack gap="lg">
                <Flex gap="md">
                  <Box style={{ flex: 1, background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', borderRadius: 16, padding: 8 }}>
                    <TextInput placeholder="Qidirish..." leftSection={<IconSearch size={18} color={isDark ? '#d4a11e' : '#c17d11'} />} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} styles={{ input: { border: 'none', background: 'transparent', color: isDark ? 'white' : '#2D3748' } }} />
                  </Box>
                  <Group gap={8}>
                    {['grid', 'list'].map(mode => (
                      <ActionIcon key={mode} size={42} radius="md" onClick={() => setViewMode(mode)} style={{ background: viewMode === mode ? 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)' : isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', color: viewMode === mode ? 'white' : isDark ? '#d4a11e' : '#c17d11' }}>
                        {mode === 'grid' ? <IconGrid3x3 size={20} /> : <IconList size={20} />}
                      </ActionIcon>
                    ))}
                  </Group>
                </Flex>

                {loading ? (
                  <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                    {[1,2,3,4].map(i => <Skeleton key={i} height={300} radius="xl" />)}
                  </SimpleGrid>
                ) : (
                  <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                    {filtered.map(lib => (
                      <Card key={lib.id} padding="lg" radius="xl" onClick={() => setSelectedLibraryId(lib.id)} style={{ background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', cursor: 'pointer', transition: 'all 0.3s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <Card.Section><Box h={200} style={{ backgroundImage: `url(${BOOK_IMAGE})`, backgroundSize: 'cover', position: 'relative' }}>{lib.books > 0 && <Badge style={{ position: 'absolute', top: 10, right: 10, background: 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)' }}>Faol</Badge>}</Box></Card.Section>
                        <Stack gap="xs" mt="md">
                          <Text fw={600} size="lg" style={{ color: isDark ? 'white' : '#2D3748' }}>{lib.name}</Text>
                          <Group gap={6}><IconBook size={16} color={isDark ? '#d4a11e' : '#c17d11'} /><Text size="sm" style={{ color: '#718096' }}>{lib.books || 0} Kitob</Text></Group>
                          {lib.phone && <Group gap={6}><IconPhone size={16} color={isDark ? '#d4a11e' : '#c17d11'} /><Text size="sm" style={{ color: '#718096' }}>{lib.phone}</Text></Group>}
                        </Stack>
                      </Card>
                    ))}
                  </SimpleGrid>
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