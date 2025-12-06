import React, { useState, useEffect } from 'react';
import {
  Container, Box, Text, Skeleton, Card, Image, Badge, Button,
  TextInput, SimpleGrid, Group, MantineProvider, Stack, Flex,
  Paper, Divider, Title, ThemeIcon
} from '@mantine/core';
import { 
  IconSearch, IconBook, IconUser, IconBuildingStore, IconArrowLeft,
  IconCalendar, IconLanguage, IconCategory, IconFileText, IconStar,
  IconBooks, IconCheck, IconMapPin, IconBookmark, IconDownload
} from '@tabler/icons-react';

const BOOK_IMAGE = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';

const DetailBook = ({ bookId, onBack, isDark }) => {
  const [book, setBook] = useState(null);
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://org-ave-jimmy-learners.trycloudflare.com/api/v1/books/books/${bookId}/`);
        const data = await res.json();
        setBook(data);
        if (data.libraries?.length) {
          const libs = await Promise.all(data.libraries.map(id =>
            fetch(`https://org-ave-jimmy-learners.trycloudflare.com/api/v1/libraries/libraries/${id}/`).then(r => r.json())
          ));
          setLibraries(libs);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookId]);

  if (loading || !book) return <Box p={100}><Skeleton height={400} /></Box>;

  return (
    <Box style={{ minHeight: '100vh', background: isDark ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(180deg, #c17d11 0%, #d4a11e 50%, #c17d11 100%)', padding: '40px 0' }}>
      <Container size="xl">
        <Button leftSection={<IconArrowLeft size={18} />} mb={30} onClick={onBack} style={{ background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', color: isDark ? '#d4a11e' : '#c17d11' }}>Orqaga</Button>
        
        <Paper p={0} radius="xl" mb={30} style={{ background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', overflow: 'hidden' }}>
          <Flex direction={{ base: 'column', md: 'row' }}>
            <Box w={{ base: '100%', md: '40%' }} h={{ base: 350, md: 550 }} style={{ backgroundImage: `url(${book.image || BOOK_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
              <Box style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '40px 30px 20px' }}>
                <Group gap="xs">
                  {book.quantity_in_library > 0 && <Badge size="lg" leftSection={<IconCheck size={16} />} style={{ background: 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)' }}>{book.quantity_in_library} ta</Badge>}
                  {book.rating && <Badge size="lg" leftSection={<IconStar size={16} />} style={{ background: 'rgba(255, 215, 0, 0.9)', color: '#000' }}>{book.rating}</Badge>}
                </Group>
              </Box>
            </Box>
            
            <Stack gap="lg" p={40} style={{ flex: 1 }}>
              <Box>
                <Group gap={8} mb={10}>
                  <IconBook size={24} color={isDark ? '#d4a11e' : '#c17d11'} />
                  <Text size="sm" fw={500} style={{ color: isDark ? '#d4a11e' : '#c17d11', textTransform: 'uppercase' }}>Kitob haqida</Text>
                </Group>
                <Title order={1} size={38} mb={15} style={{ color: isDark ? 'white' : '#2D3748' }}>{book.name}</Title>
                {book.description && <Text size="md" style={{ color: isDark ? '#cbd5e0' : '#718096' }}>{book.description}</Text>}
              </Box>
              
              <Divider color={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} />
              
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {book.author && (
                  <Group gap={12}>
                    <ThemeIcon size={40} radius="md" style={{ background: isDark ? 'rgba(212, 161, 30, 0.15)' : 'rgba(193, 125, 17, 0.15)' }}>
                      <IconUser size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                    </ThemeIcon>
                    <Box><Text size="xs" style={{ color: '#718096' }}>Muallif</Text><Text size="md" fw={600} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>{book.author}</Text></Box>
                  </Group>
                )}
                {book.publisher && (
                  <Group gap={12}>
                    <ThemeIcon size={40} radius="md" style={{ background: isDark ? 'rgba(212, 161, 30, 0.15)' : 'rgba(193, 125, 17, 0.15)' }}>
                      <IconBuildingStore size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                    </ThemeIcon>
                    <Box><Text size="xs" style={{ color: '#718096' }}>Nashriyot</Text><Text size="md" fw={600} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>{book.publisher}</Text></Box>
                  </Group>
                )}
                {book.published_date && (
                  <Group gap={12}>
                    <ThemeIcon size={40} radius="md" style={{ background: isDark ? 'rgba(212, 161, 30, 0.15)' : 'rgba(193, 125, 17, 0.15)' }}>
                      <IconCalendar size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                    </ThemeIcon>
                    <Box><Text size="xs" style={{ color: '#718096' }}>Nashr yili</Text><Text size="md" fw={600} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>{book.published_date}</Text></Box>
                  </Group>
                )}
                {book.pages && (
                  <Group gap={12}>
                    <ThemeIcon size={40} radius="md" style={{ background: isDark ? 'rgba(212, 161, 30, 0.15)' : 'rgba(193, 125, 17, 0.15)' }}>
                      <IconFileText size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                    </ThemeIcon>
                    <Box><Text size="xs" style={{ color: '#718096' }}>Sahifalar</Text><Text size="md" fw={600} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>{book.pages} sahifa</Text></Box>
                  </Group>
                )}
              </SimpleGrid>
              
              <Group gap="md" mt="md">
                <Button size="lg" flex={1} leftSection={<IconBookmark size={20} />} style={{ background: 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)' }}>Saqlash</Button>
                <Button size="lg" flex={1} variant="light" leftSection={<IconDownload size={20} />} style={{ color: isDark ? '#d4a11e' : '#c17d11' }}>Yuklab olish</Button>
              </Group>
            </Stack>
          </Flex>
        </Paper>

        {libraries.length > 0 && (
          <Stack gap="lg">
            {libraries.map(lib => (
              <Card key={lib.id} p="lg" radius="xl" style={{ background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', cursor: 'pointer' }}>
                <Flex gap="lg" align="center" justify="space-between" wrap="wrap">
                  <Group gap="lg">
                    <ThemeIcon size={70} radius="xl" style={{ background: 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)' }}>
                      <IconBooks size={35} />
                    </ThemeIcon>
                    <Box>
                      <Text fw={600} size="xl" style={{ color: isDark ? 'white' : '#2D3748' }}>{lib.name}</Text>
                      {lib.location && <Group gap={8}><IconMapPin size={18} color={isDark ? '#d4a11e' : '#c17d11'} /><Text size="sm" style={{ color: '#718096' }}>{lib.location}</Text></Group>}
                    </Box>
                  </Group>
                  <Badge size="lg" style={{ background: isDark ? 'rgba(212, 161, 30, 0.15)' : 'rgba(193, 125, 17, 0.15)', color: isDark ? '#d4a11e' : '#c17d11' }}>{lib.books} kitob</Badge>
                </Flex>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

const Kitob = () => {
  const [isDark, setIsDark] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookId, setSelectedBookId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) setIsDark(saved === 'true');
    const handle = () => setIsDark(localStorage.getItem('darkMode') === 'true');
    window.addEventListener('darkModeChange', handle);
    return () => window.removeEventListener('darkModeChange', handle);
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('https://org-ave-jimmy-learners.trycloudflare.com/api/v1/books/books/');
        const data = await res.json();
        setBooks(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || (b.author && b.author.toLowerCase().includes(searchQuery.toLowerCase())));

  if (selectedBookId) return <DetailBook bookId={selectedBookId} onBack={() => setSelectedBookId(null)} isDark={isDark} />;

  return (
    <MantineProvider>
      <Box style={{ minHeight: '100vh', background: isDark ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)', position: 'relative', overflow: 'hidden' }}>
        <Box style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', filter: 'blur(40px)' }} />
        <Box style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)', filter: 'blur(60px)' }} />

        <Container size="xl" py={60} style={{ position: 'relative', zIndex: 1 }}>
          <Box mb={50}>
            <Group align="center" gap="md" mb={15}>
              <Box style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
                <IconBook size={32} color="white" stroke={2} />
              </Box>
              <Box>
                <Text size="42px" fw={800} style={{ color: 'white', textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)', letterSpacing: '-0.5px' }}>Kutubxona</Text>
                <Text size="md" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Barcha kitoblar bir joyda</Text>
              </Box>
            </Group>

            <Box style={{ background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '8px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)', border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}` }}>
              <Group gap={0} wrap="nowrap">
                <TextInput
                  placeholder="Kitob yoki muallif nomini kiriting..."
                  size="lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftSection={<IconSearch size={20} color={isDark ? '#d4a11e' : '#c17d11'} />}
                  styles={{ input: { border: 'none', backgroundColor: 'transparent', fontSize: '16px', padding: '12px 16px', color: isDark ? 'white' : '#2D3748' }, root: { flex: 1 } }}
                />
                <Button size="lg" radius="md" style={{ background: 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)', border: 'none', fontWeight: 600, padding: '0 32px', height: '52px' }}>Qidirish</Button>
              </Group>
            </Box>
          </Box>

          {error && <Box mb={30} p={20} style={{ background: 'rgba(255, 107, 107, 0.15)', borderRadius: '16px' }}><Text style={{ color: 'white', fontWeight: 500 }}>⚠️ Xatolik: {error}</Text></Box>}

          {loading ? (
            <SimpleGrid cols={4} spacing="xl" breakpoints={[{ maxWidth: 'lg', cols: 3 }, { maxWidth: 'md', cols: 2 }, { maxWidth: 'sm', cols: 1 }]}>
              {[1,2,3,4,5,6,7,8].map(i => (
                <Card key={i} radius="xl" style={{ background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)' }}>
                  <Card.Section><Skeleton height={280} /></Card.Section>
                  <Box p="lg"><Skeleton height={24} mb="md" /><Skeleton height={16} mb="sm" width="70%" /><Skeleton height={40} /></Box>
                </Card>
              ))}
            </SimpleGrid>
          ) : filteredBooks.length > 0 ? (
            <SimpleGrid cols={4} spacing="xl" breakpoints={[{ maxWidth: 'lg', cols: 3 }, { maxWidth: 'md', cols: 2 }, { maxWidth: 'sm', cols: 1 }]}>
              {filteredBooks.map(book => (
                <Card
                  key={book.id}
                  radius="xl"
                  style={{ background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer' }}
                  onClick={() => setSelectedBookId(book.id)}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.2)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <Card.Section>
                    <Box style={{ position: 'relative' }}>
                      <Image src={book.image || BOOK_IMAGE} height={280} alt={book.name} />
                      {book.quantity_in_library && <Badge size="lg" style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(193, 125, 17, 0.95)', color: 'white', fontWeight: 600, padding: '8px 16px' }}>{book.quantity_in_library} ta</Badge>}
                    </Box>
                  </Card.Section>

                  <Box p={20}>
                    <Text fw={700} size="lg" mb="sm" lineClamp={2} style={{ color: isDark ? 'white' : '#2D3748', minHeight: '48px' }}>{book.name}</Text>
                    {book.author && <Group gap="xs" mb="xs"><IconUser size={16} color={isDark ? '#d4a11e' : '#c17d11'} /><Text size="sm" style={{ color: '#718096' }}>{book.author}</Text></Group>}
                    {book.publisher && <Group gap="xs" mb="lg"><IconBuildingStore size={16} color={isDark ? '#d4a11e' : '#d4a11e'} /><Text size="sm" style={{ color: '#718096' }}>{book.publisher}</Text></Group>}
                    <Button fullWidth size="md" radius="xl" style={{ background: 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)', border: 'none', fontWeight: 600 }}>Batafsil</Button>
                  </Box>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Box mt={60} p={60} style={{ background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', borderRadius: '24px', textAlign: 'center' }}>
              <IconBook size={64} color={isDark ? '#d4a11e' : '#c17d11'} stroke={1.5} style={{ margin: '0 auto 20px' }} />
              <Text size="xl" fw={600} mb="sm" style={{ color: isDark ? 'white' : '#2D3748' }}>Kitoblar topilmadi</Text>
              <Text size="md" style={{ color: '#718096' }}>{searchQuery ? `"${searchQuery}" bo'yicha natija yo'q` : 'Hozircha kitoblar mavjud emas'}</Text>
            </Box>
          )}
        </Container>
      </Box>
    </MantineProvider>
  );
};

export default Kitob;