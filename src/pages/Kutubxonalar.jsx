import React, { useState, useEffect } from 'react';
import { 
  Container, Box, Text, SimpleGrid, Paper, Group, Button,
  TextInput, Stack, Flex, Card, Badge, ActionIcon, Divider, Skeleton
} from '@mantine/core';
import { 
  IconSearch, IconMapPin, IconBook, IconPhone,
  IconBrandTelegram, IconArrowsSort, IconGrid3x3, IconList, IconCheck
} from '@tabler/icons-react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://org-ave-jimmy-learners.trycloudflare.com/api/v1/',
});

const BOOK_IMAGE = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';

const Kutubxonalar = () => {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState('grid');
  const [onlyWithBooks, setOnlyWithBooks] = useState(false);
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) setIsDark(saved === 'true');
    const handleDarkModeChange = () => setIsDark(localStorage.getItem('darkMode') === 'true');
    window.addEventListener('darkModeChange', handleDarkModeChange);
    return () => window.removeEventListener('darkModeChange', handleDarkModeChange);
  }, []);

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        setLoading(true);
        const res = await api.get('libraries/libraries/');
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setLibraries(data);
      } catch (err) {
        setError(err.message || 'Xatolik');
      } finally {
        setLoading(false);
      }
    };
    fetchLibraries();
  }, []);

  const filtered = libraries
    .filter(lib => lib.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!onlyWithBooks || (lib.books && lib.books > 0)))
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'books-asc') return (a.books || 0) - (b.books || 0);
      if (sortBy === 'books-desc') return (b.books || 0) - (a.books || 0);
      return 0;
    });

  const bgColor = isDark ? '#1a1b1e' : '#f5f5f5';
  const cardBg = isDark ? '#25262b' : 'white';
  const textColor = isDark ? 'white' : '#333';
  const dimText = isDark ? 'gray.4' : 'dimmed';

  return (
    <Box bg={bgColor} mih="100vh" py={40}>
      <Container size="xl">
        <Text size="32px" fw={700} ta="center" mb={40} c={textColor}>
          Kutubxonalar ro'yxati
        </Text>

        <Flex gap={20} align="flex-start">
          <Box w={280} style={{ flexShrink: 0 }}>
            <Paper p={20} radius="md" bg={cardBg}>
              <Stack spacing="md">
                <Group spacing={8}>
                  <IconArrowsSort size={20} color="#0ea5e9" />
                  <Text fw={600} size="sm">Saralash</Text>
                </Group>
                <Stack spacing="8px">
                  <Button variant={sortBy === 'name-asc' ? 'filled' : 'light'} fullWidth radius="md" color="cyan" onClick={() => setSortBy('name-asc')}>
                    Nomi (A‑Z)
                  </Button>
                  <Button variant={sortBy === 'name-desc' ? 'filled' : 'light'} fullWidth radius="md" color="cyan" onClick={() => setSortBy('name-desc')}>
                    Nomi (Z‑A)
                  </Button>
                  <Button variant={sortBy === 'books-desc' ? 'filled' : 'light'} fullWidth radius="md" color="cyan" onClick={() => setSortBy('books-desc')}>
                    Kitoblar (kam→ko‘p)
                  </Button>
                  <Button variant={sortBy === 'books-asc' ? 'filled' : 'light'} fullWidth radius="md" color="cyan" onClick={() => setSortBy('books-asc')}>
                    Kitoblar (ko‘p→kam)
                  </Button>
                </Stack>
                <Divider />
                <Button variant={onlyWithBooks ? 'filled' : 'light'} fullWidth radius="md" color="cyan" onClick={() => setOnlyWithBooks(!onlyWithBooks)} rightSection={onlyWithBooks ? <IconCheck size={16} /> : null}>
                  Faqat kitoblari mavjud
                </Button>
              </Stack>
            </Paper>
          </Box>

          <Box style={{ flex: 1 }}>
            <Stack spacing="lg">
              <Flex gap="md">
                <TextInput
                  placeholder="Qidirish (nom bo‘yicha)..."
                  size="md"
                  radius="md"
                  leftSection={<IconSearch size={18} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: 1, backgroundColor: cardBg, color: textColor }}
                />
                <Group spacing={8}>
                  <ActionIcon size={42} variant={viewMode === 'grid' ? 'filled' : 'light'} color="cyan" onClick={() => setViewMode('grid')} radius="md">
                    <IconGrid3x3 size={20} />
                  </ActionIcon>
                  <ActionIcon size={42} variant={viewMode === 'list' ? 'filled' : 'light'} color="cyan" onClick={() => setViewMode('list')} radius="md">
                    <IconList size={20} />
                  </ActionIcon>
                </Group>
              </Flex>

              {error && <Text c="red" ta="center">Xatolik: {error}</Text>}

              {loading ? (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                  {[1,2,3,4].map(i => (
                    <Card key={i} shadow="sm" padding="lg" radius="md" bg={cardBg}>
                      <Skeleton height={180} mb="md" />
                      <Skeleton height={20} width="60%" mb="sm" />
                      <Skeleton height={16} width="40%" />
                    </Card>
                  ))}
                </SimpleGrid>
              ) : viewMode === 'grid' ? (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                  {filtered.map(lib => (
                    <Card key={lib.id} shadow="sm" padding="lg" radius="md" bg={cardBg}>
                      <Card.Section>
                        <Box h={200} style={{ backgroundImage: `url(${BOOK_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                          {lib.books > 0 && <Badge color="green" variant="filled" style={{ position: 'absolute', top: 10, right: 10 }}>Faol</Badge>}
                        </Box>
                      </Card.Section>
                      <Stack spacing="xs" mt="md">
                        <Text fw={600} size="lg" c={textColor}>{lib.name}</Text>
                        <Group spacing={6}><IconBook size={16} color="#0ea5e9" /><Text size="sm" c={dimText}>{lib.books || 0} Kitob</Text></Group>
                        {lib.phone && <Group spacing={6}><IconPhone size={16} color="#0ea5e9" /><Text size="sm" c={dimText}>{lib.phone}</Text></Group>}
                        {lib.telegram && <Group spacing={6}><IconBrandTelegram size={16} color="#0ea5e9" /><Text size="sm" c={dimText}>{lib.telegram}</Text></Group>}
                        {lib.location && <Group spacing={6}><IconMapPin size={16} color="#0ea5e9" /><Text size="sm" c="#0ea5e9" style={{ cursor: 'pointer' }}>{lib.location}</Text></Group>}
                      </Stack>
                    </Card>
                  ))}
                </SimpleGrid>
              ) : (
                <Stack spacing="md">
                  {filtered.map(lib => (
                    <Card key={lib.id} shadow="sm" padding="lg" radius="md" bg={cardBg}>
                      <Flex gap="lg" align="center">
                        <Box w={150} h={100} style={{ backgroundImage: `url(${BOOK_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 8, flexShrink: 0 }} />
                        <Box style={{ flex: 1 }}>
                          <Flex justify="space-between" align="start">
                            <Box>
                              <Text fw={600} size="lg" mb={8} c={textColor}>{lib.name}</Text>
                              <Group spacing={20}>
                                <Group spacing={6}><IconBook size={16} color="#0ea5e9" /><Text size="sm" c={dimText}>{lib.books || 0} Kitob</Text></Group>
                                {lib.phone && <Group spacing={6}><IconPhone size={16} color="#0ea5e9" /><Text size="sm" c={dimText}>{lib.phone}</Text></Group>}
                                {lib.telegram && <Group spacing={6}><IconBrandTelegram size={16} color="#0ea5e9" /><Text size="sm" c={dimText}>{lib.telegram}</Text></Group>}
                                {lib.location && <Group spacing={6}><IconMapPin size={16} color="#0ea5e9" /><Text size="sm" c="#0ea5e9" style={{ cursor: 'pointer' }}>{lib.location}</Text></Group>}
                              </Group>
                            </Box>
                            {lib.books > 0 && <Badge color="green" variant="filled">Faol</Badge>}
                          </Flex>
                        </Box>
                      </Flex>
                    </Card>
                  ))}
                </Stack>
              )}

              {!loading && filtered.length === 0 && (
                <Paper p={60} radius="md" ta="center" bg={cardBg}>
                  <Text size="lg" c={dimText}>Hech qanday kutubxona topilmadi</Text>
                </Paper>
              )}
            </Stack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Kutubxonalar;
