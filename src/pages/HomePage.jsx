import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Text,
  Skeleton,
  Card,
  Image,
  Badge,
  Button,
  TextInput,
  SimpleGrid
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://176.57.208.162:8000/api/v1/',
});

const BOOK_IMAGE = 'https://org-ave-jimmy-learners.trycloudflare.com/api/v1/books/search/book/?q=kitob-nomini-bervorasiz';

const HomePage = () => {
  const [isDark, setIsDark] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('books/books/');
      const booksData = Array.isArray(response.data) ? response.data : response.data.results || [];
      setBooks(booksData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.name?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query) ||
      book.publisher?.toLowerCase().includes(query)
    );
  });

  return (
    <Box py={60} px={20} bg={isDark ? 'dark.9' : 'gray.0'} minHeight="100vh">
      <Container size="xl">
      <Text 
  size="xl" fw={700} mb={30}
  c={isDark ? 'white' : 'dark'}
  variant="gradient"
  gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
>
  Kitoblar bir joyda
</Text>

        <Box mb={40}>
          <TextInput
            placeholder="Kitob nomi, muallif nomi"
            size="lg"
            radius="md"
            rightSection={<Button size="md" radius="md">Qidirish</Button>}
            rightSectionWidth={120}
            leftSection={<IconSearch size={20} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            styles={{
              input: {
                paddingRight: 130,
                backgroundColor: isDark ? '#1A1B1E' : 'white',
                color: isDark ? 'white' : 'black'
              }
            }}
          />
        </Box>

        {error && (
          <Box bg={isDark ? 'red.9' : 'red.1'} p="md" mb={20} style={{ borderRadius: '8px' }}>
            <Text c={isDark ? 'red.1' : 'red'}>Xatolik: {error}</Text>
          </Box>
        )}

        {loading ? (
          <SimpleGrid cols={4} spacing="lg" breakpoints={[{ maxWidth: 'md', cols: 2 }, { maxWidth: 'sm', cols: 1 }]}>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} shadow="sm" radius="md" bg={isDark ? 'dark.7' : 'white'}>
                <Card.Section>
                  <Skeleton height={250} />
                </Card.Section>
                <Box p="lg">
                  <Skeleton height={20} mb="sm" />
                  <Skeleton height={16} mb="md" width="70%" />
                  <Skeleton height={36} radius="xl" />
                </Box>
              </Card>
            ))}
          </SimpleGrid>
        ) : filteredBooks.length > 0 ? (
          <SimpleGrid cols={4} spacing="lg" breakpoints={[{ maxWidth: 'md', cols: 2 }, { maxWidth: 'sm', cols: 1 }]}>
            {filteredBooks.map((book) => (
              <Card key={book.id} shadow="sm" radius="md" bg={isDark ? 'dark.7' : 'white'}>
                <Card.Section>
                  <Image src={BOOK_IMAGE} height={250} alt={book.name} style={{ objectFit: 'cover' }} />
                </Card.Section>
                <Box p="lg">
                  <Text fw={600} size="sm" mb="xs" lineClamp={2} c={isDark ? 'gray.0' : 'dark'}>
                    {book.name}
                  </Text>
                  {book.author && <Text size="xs" c="dimmed" mb="md">{book.author}</Text>}
                  {book.publisher && <Text size="xs" c="dimmed" mb="md">{book.publisher}</Text>}
                  {book.quantity_in_library && (
                    <Badge size="lg" radius="xl" color="cyan" variant="light" fullWidth mb="md">
                      {book.quantity_in_library} TA KITOB MAVJUD
                    </Badge>
                  )}
                  <Button variant="light" color="blue" fullWidth size="sm">
                    Ko'rish
                  </Button>
                </Box>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <Text c="dimmed" ta="center" size="lg" mt={40}>
            {searchQuery ? `"${searchQuery}" bo'yicha kitoblar topilmadi` : 'Kitoblar topilmadi'}
          </Text>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
