import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Text, 
  SimpleGrid, 
  Paper, 
  Group, 
  Button,
  TextInput,
  Stack,
  Flex,
  Card,
  Badge,
  ActionIcon,
  Divider
} from '@mantine/core';
import { 
  IconSearch, 
  IconMapPin,
  IconBook, 
  IconPhone,
  IconBrandTelegram,
  IconArrowsSort,
  IconGrid3x3,
  IconList,
  IconCheck
} from '@tabler/icons-react';

const Kutubxonalar = () => {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState('grid');
  const [onlyWithBooks, setOnlyWithBooks] = useState(false);

  const kutubxonalar = [
    { id: 1, name: "Abbosov", books: 45, phone: "+998999999999", telegram: "@telegram.org", location: "Google Maps", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=300&fit=crop" },
    { id: 2, name: "aziz", books: 0, phone: "+998901864670", telegram: "@ASN", location: "Google Maps", image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=300&fit=crop" },
    { id: 3, name: "Azizbek", books: 0, phone: "+998990127331", telegram: "@@in_crease", location: "Google Maps", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=300&fit=crop" },
    { id: 4, name: "Bakhtiyor", books: 120, phone: "+998901234567", telegram: "@bakhtiyor", location: "Google Maps", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop" },
    { id: 5, name: "Dilshod", books: 89, phone: "+998909876543", telegram: "@dilshod_library", location: "Google Maps", image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop" },
    { id: 6, name: "Farrux", books: 0, phone: "+998905551234", telegram: "@farrux", location: "Google Maps", image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=300&fit=crop" }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) setIsDark(saved === 'true');

    const handleDarkModeChange = () => {
      setIsDark(localStorage.getItem('darkMode') === 'true');
    };
    window.addEventListener('darkModeChange', handleDarkModeChange);
    return () => window.removeEventListener('darkModeChange', handleDarkModeChange);
  }, []);

  const sortedKutubxonalar = [...kutubxonalar]
    .filter(k => {
      const matchesSearch = k.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBooks = !onlyWithBooks || k.books > 0;
      return matchesSearch && matchesBooks;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'books-asc') return a.books - b.books;
      if (sortBy === 'books-desc') return b.books - a.books;
      return 0;
    });

  const bgColor = isDark ? '#1a1b1e' : '#f5f5f5';
  const cardBg = isDark ? '#25262b' : 'white';
  const textColor = isDark ? 'white' : '#333';
  const dimTextColor = isDark ? 'gray.4' : 'dimmed';

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

                <Stack spacing={8}>
                  <Button variant={sortBy === 'name-asc' ? 'filled' : 'light'} fullWidth justify="flex-start" onClick={() => setSortBy('name-asc')} radius="md" color="cyan">Nomi (A-Z)</Button>
                  <Button variant={sortBy === 'name-desc' ? 'filled' : 'light'} fullWidth justify="flex-start" onClick={() => setSortBy('name-desc')} radius="md" color="cyan">Nomi (Z-A)</Button>
                  <Button variant={sortBy === 'books-desc' ? 'filled' : 'light'} fullWidth justify="flex-start" onClick={() => setSortBy('books-desc')} radius="md" color="cyan">Kitoblar soni (kamdan ko'p)</Button>
                  <Button variant={sortBy === 'books-asc' ? 'filled' : 'light'} fullWidth justify="flex-start" onClick={() => setSortBy('books-asc')} radius="md" color="cyan">Kitoblar soni (ko'p dan kam)</Button>
                </Stack>

                <Divider />

                <Button variant={onlyWithBooks ? 'filled' : 'light'} fullWidth justify="space-between" onClick={() => setOnlyWithBooks(!onlyWithBooks)} radius="md" color="cyan" rightSection={onlyWithBooks ? <IconCheck size={16} /> : null}>
                  Faqat kitoblari mavjudlar
                </Button>
              </Stack>
            </Paper>
          </Box>

          <Box style={{ flex: 1 }}>
            <Stack spacing="lg">
              <Flex gap="md">
                <TextInput
                  placeholder="Qidirish (nomi bo'yicha)..."
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

              {viewMode === 'grid' ? (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                  {sortedKutubxonalar.map((k) => (
                    <Card key={k.id} shadow="sm" padding="lg" radius="md" bg={cardBg}>
                      <Card.Section>
                        <Box
                          h={200}
                          style={{
                            backgroundImage: `url(${k.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative'
                          }}
                        >
                          {k.books > 0 && <Badge color="green" variant="filled" style={{ position: 'absolute', top: 10, right: 10 }}>Faol</Badge>}
                        </Box>
                      </Card.Section>

                      <Stack spacing="xs" mt="md">
                        <Text fw={600} size="lg" c={textColor}>{k.name}</Text>
                        <Group spacing={6}><IconBook size={16} color="#0ea5e9" /><Text size="sm" c={dimTextColor}>{k.books} Kitob</Text></Group>
                        <Group spacing={6}><IconPhone size={16} color="#0ea5e9" /><Text size="sm" c={dimTextColor}>{k.phone}</Text></Group>
                        <Group spacing={6}><IconBrandTelegram size={16} color="#0ea5e9" /><Text size="sm" c={dimTextColor}>{k.telegram}</Text></Group>
                        <Group spacing={6}><IconMapPin size={16} color="#0ea5e9" /><Text size="sm" c="#0ea5e9" style={{ cursor: 'pointer' }}>{k.location}</Text></Group>
                      </Stack>
                    </Card>
                  ))}
                </SimpleGrid>
              ) : (
                <Stack spacing="md">
                  {sortedKutubxonalar.map((k) => (
                    <Card key={k.id} shadow="sm" padding="lg" radius="md" bg={cardBg}>
                      <Flex gap="lg" align="center">
                        <Box w={150} h={100} style={{ backgroundImage: `url(${k.image})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 8, flexShrink: 0 }} />
                        <Box style={{ flex: 1 }}>
                          <Flex justify="space-between" align="start">
                            <Box>
                              <Text fw={600} size="lg" mb={8} c={textColor}>{k.name}</Text>
                              <Group spacing={20}>
                                <Group spacing={6}><IconBook size={16} color="#0ea5e9" /><Text size="sm" c={dimTextColor}>{k.books} Kitob</Text></Group>
                                <Group spacing={6}><IconPhone size={16} color="#0ea5e9" /><Text size="sm" c={dimTextColor}>{k.phone}</Text></Group>
                                <Group spacing={6}><IconBrandTelegram size={16} color="#0ea5e9" /><Text size="sm" c={dimTextColor}>{k.telegram}</Text></Group>
                                <Group spacing={6}><IconMapPin size={16} color="#0ea5e9" /><Text size="sm" c="#0ea5e9" style={{ cursor: 'pointer' }}>{k.location}</Text></Group>
                              </Group>
                            </Box>
                            {k.books > 0 && <Badge color="green" variant="filled">Faol</Badge>}
                          </Flex>
                        </Box>
                      </Flex>
                    </Card>
                  ))}
                </Stack>
              )}

              {sortedKutubxonalar.length === 0 && (
                <Paper p={60} radius="md" ta="center" bg={cardBg}>
                  <Text size="lg" c={dimTextColor}>Hech qanday kutubxona topilmadi</Text>
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
