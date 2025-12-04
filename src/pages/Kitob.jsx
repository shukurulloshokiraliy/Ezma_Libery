import React, { useState, useEffect } from 'react';
import { Container, Box, Text, Skeleton, Card, Image, useMantineColorScheme, Badge, Button, Group, ActionIcon } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://176.57.208.162:8000/api/v1/',
});

const BOOK_IMAGE = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';

const Kitob = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('books/books/');
      console.log('API Response:', response.data);
      
      const booksData = Array.isArray(response.data) ? response.data : response.data.results || [];
      setBooks(booksData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    const container = document.getElementById('booksContainer');
    const scrollAmount = 300;
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box py={60} bg={isDark ? 'dark.9' : 'gray.0'}>
      <Container size="xl">
        {/* Title */}
        <Text size="xl" fw={700} mb={40}>
          Eng yangi kitoblar
        </Text>

        {/* Error handling */}
        {error && (
          <Box bg="red.1" p="md" mb={20} style={{ borderRadius: '8px' }}>
            <Text c="red">Xatolik: {error}</Text>
          </Box>
        )}

        {/* Slider Container */}
        <Box style={{ position: 'relative' }}>
          {/* Left Button */}
          <ActionIcon
            onClick={() => scroll('left')}
            style={{
              position: 'absolute',
              left: -50,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
            }}
            size="lg"
            radius="xl"
            variant="light"
            color="blue"
          >
            <IconChevronLeft size={20} />
          </ActionIcon>


          {/* Books Slider */}
          <Box
            id="booksContainer"
            style={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            sx={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            {loading ? (
              // Loading skeleton
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Box
                    key={i}
                    style={{
                      flexShrink: 0,
                      width: '280px',
                    }}
                  >
                    <Card
                      shadow="sm"
                      radius="md"
                      withBorder={false}
                      bg={isDark ? 'dark.7' : 'white'}
                    >
                      <Card.Section>
                        <Skeleton height={250} />
                      </Card.Section>
                      <Box p="lg">
                        <Skeleton height={20} mb="sm" />
                        <Skeleton height={16} mb="md" width="70%" />
                        <Skeleton height={36} radius="xl" />
                      </Box>
                    </Card>
                  </Box>
                ))}
              </>
            ) : books.length > 0 ? (
              // Books
              books.map((book) => (
                <Box
                  key={book.id}
                  style={{
                    flexShrink: 0,
                    width: '280px',
                  }}
                >
                  <Card
                    shadow="sm"
                    radius="md"
                    withBorder={false}
                    style={{ overflow: 'hidden', height: '100%' }}
                    bg={isDark ? 'dark.7' : 'white'}
                  >
                    {/* Book Image */}
                    <Card.Section>
                      <Image
                        src={BOOK_IMAGE}
                        height={250}
                        alt={book.name}
                        style={{ objectFit: 'cover' }}
                      />
                    </Card.Section>

                    {/* Book Info */}
                    <Box p="lg">
                      {/* Title */}
                      <Text fw={600} size="sm" mb="xs" lineClamp={2}>
                        {book.name}
                      </Text>

                      {/* Author */}
                      {book.author && (
                        <Text size="xs" c="dimmed" mb="md">
                          {book.author}
                        </Text>
                      )}

                      {/* Publisher */}
                      {book.publisher && (
                        <Text size="xs" c="dimmed" mb="md">
                          {book.publisher}
                        </Text>
                      )}

                      {/* Quantity Badge */}
                      {book.quantity_in_library && (
                        <Badge
                          size="lg"
                          radius="xl"
                          color="cyan"
                          variant="light"
                          fullWidth
                          mb="md"
                        >
                          {book.quantity_in_library} TA KITOB MAVJUD
                        </Badge>
                      )}


                      {/* View Button */}
                      <Button
                        variant="light"
                        color="blue"
                        fullWidth
                        size="sm"
                      >
                        Ko'rish
                      </Button>
                    </Box>
                  </Card>
                </Box>
              ))
            ) : (
              <Text c="dimmed">Kitoblar topilmadi</Text>
            )}
          </Box>

          {/* Right Button */}
          <ActionIcon
            onClick={() => scroll('right')}
            style={{
              position: 'absolute',
              right: -50,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
            }}
            size="lg"
            radius="xl"
            variant="light"
            color="blue"
          >
            <IconChevronRight size={20} />
          </ActionIcon>
        </Box>
      </Container>
    </Box>
  );
};

export default Kitob;
