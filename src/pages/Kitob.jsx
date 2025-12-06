import React, { useState, useEffect } from 'react';
import {
  Container, Box, Text, Skeleton, Card, Image, Badge, Button,
  TextInput, SimpleGrid, Group, MantineProvider, Stack, Flex,
  Paper, Divider, Title, ThemeIcon, Modal, Textarea, NumberInput,
  Notification, PasswordInput
} from '@mantine/core';
import { 
  IconSearch, IconBook, IconUser, IconBuildingStore, IconArrowLeft,
  IconCalendar, IconLanguage, IconCategory, IconFileText, IconStar,
  IconBooks, IconCheck, IconMapPin, IconBookmark, IconDownload,
  IconPlus, IconEdit, IconTrash, IconLogout, IconX, IconLogin, IconLock
} from '@tabler/icons-react';

const BOOK_IMAGE = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';

const DetailBook = ({ bookId, onBack, isDark, isLoggedIn, onDelete, onUpdate }) => {
  const [book, setBook] = useState(null);
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, [bookId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://org-ave-jimmy-learners.trycloudflare.com/api/v1/books/book/${bookId}/`);
      if (!res.ok) throw new Error('Kitob topilmadi');
      const data = await res.json();
      setBook(data);
      setFormData(data);
      
      if (data.libraries?.length) {
        const libs = await Promise.all(
          data.libraries.map(id =>
            fetch(`https://org-ave-jimmy-learners.trycloudflare.com/api/v1/libraries/library/${id}/`)
              .then(r => r.json())
              .catch(() => null)
          )
        );
        setLibraries(libs.filter(Boolean));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isLoggedIn) {
      alert('Bu amal uchun tizimga kirish kerak!');
      return;
    }

    setDeleting(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`https://org-ave-jimmy-learners.trycloudflare.com/api/v1/books/book/${bookId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        onDelete && onDelete(bookId);
        onBack();
      } else {
        alert('Kitobni o\'chirishda xatolik yuz berdi');
      }
    } catch (e) {
      console.error(e);
      alert('Xatolik yuz berdi');
    } finally {
      setDeleting(false);
      setDeleteModal(false);
    }
  };

  const handleUpdate = async () => {
    if (!isLoggedIn) {
      alert('Bu amal uchun tizimga kirish kerak!');
      return;
    }

    if (!formData.name || !formData.author) {
      alert('Kitob nomi va muallif majburiy!');
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`https://org-ave-jimmy-learners.trycloudflare.com/api/v1/books/book/${bookId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          pages: formData.pages ? parseInt(formData.pages) : null,
          quantity_in_library: formData.quantity_in_library ? parseInt(formData.quantity_in_library) : 0
        })
      });

      if (res.ok) {
        const updatedBook = await res.json();
        setBook(updatedBook);
        setFormData(updatedBook);
        onUpdate && onUpdate(updatedBook);
        setEditModal(false);
        alert('Kitob muvaffaqiyatli yangilandi!');
      } else {
        const errorData = await res.json();
        alert(errorData.detail || 'Kitobni yangilashda xatolik yuz berdi');
      }
    } catch (e) {
      console.error(e);
      alert('Xatolik yuz berdi');
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !book) {
    return (
      <Box p={100} style={{ minHeight: '100vh', background: isDark ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(180deg, #c17d11 0%, #d4a11e 50%, #c17d11 100%)' }}>
        <Container size="xl">
          <Skeleton height={500} radius="xl" mb="xl" />
          <SimpleGrid cols={3} spacing="lg">
            <Skeleton height={150} radius="xl" />
            <Skeleton height={150} radius="xl" />
            <Skeleton height={150} radius="xl" />
          </SimpleGrid>
        </Container>
      </Box>
    );
  }

  return (
    <Box style={{ minHeight: '100vh', background: isDark ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(180deg, #c17d11 0%, #d4a11e 50%, #c17d11 100%)', padding: '40px 0' }}>
      <Container size="xl">
        <Flex justify="space-between" align="center" mb={30}>
          <Button leftSection={<IconArrowLeft size={18} />} onClick={onBack} variant="light" size="md" radius="md" style={{ background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', color: isDark ? '#d4a11e' : '#c17d11' }}>
            Orqaga
          </Button>
          
          {isLoggedIn && (
            <Group gap="sm">
              <Button leftSection={<IconEdit size={18} />} variant="light" onClick={() => setEditModal(true)} style={{ color: isDark ? '#d4a11e' : '#c17d11' }}>
                Tahrirlash
              </Button>
              <Button leftSection={<IconTrash size={18} />} color="red" variant="light" onClick={() => setDeleteModal(true)}>
                O'chirish
              </Button>
            </Group>
          )}
        </Flex>
        
        <Paper p={0} radius="xl" mb={30} style={{ background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', overflow: 'hidden', border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.3)'}` }}>
          <Flex direction={{ base: 'column', md: 'row' }}>
            <Box w={{ base: '100%', md: '40%' }} h={{ base: 350, md: 550 }} style={{ backgroundImage: `url(${book.image || BOOK_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
              <Box style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '40px 30px 20px' }}>
                <Group gap="xs">
                  {book.quantity_in_library > 0 && (
                    <Badge size="lg" leftSection={<IconCheck size={16} />} style={{ background: 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)' }}>
                      {book.quantity_in_library} ta mavjud
                    </Badge>
                  )}
                  {book.rating && (
                    <Badge size="lg" leftSection={<IconStar size={16} />} style={{ background: 'rgba(255, 215, 0, 0.9)', color: '#000' }}>
                      {book.rating}
                    </Badge>
                  )}
                </Group>
              </Box>
            </Box>
            
            <Stack gap="lg" p={40} style={{ flex: 1 }}>
              <Box>
                <Group gap={8} mb={10}>
                  <IconBook size={24} color={isDark ? '#d4a11e' : '#c17d11'} />
                  <Text size="sm" fw={500} style={{ color: isDark ? '#d4a11e' : '#c17d11', textTransform: 'uppercase' }}>
                    Kitob haqida
                  </Text>
                </Group>
                <Title order={1} size={38} mb={15} style={{ color: isDark ? 'white' : '#2D3748' }}>
                  {book.name}
                </Title>
                {book.description && (
                  <Text size="md" style={{ color: isDark ? '#cbd5e0' : '#718096', lineHeight: 1.7 }}>
                    {book.description}
                  </Text>
                )}
              </Box>
              
              <Divider color={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} />
              
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {book.author && (
                  <Group gap={12}>
                    <ThemeIcon size={40} radius="md" style={{ background: isDark ? 'rgba(212, 161, 30, 0.15)' : 'rgba(193, 125, 17, 0.15)' }}>
                      <IconUser size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                    </ThemeIcon>
                    <Box>
                      <Text size="xs" style={{ color: '#718096' }}>Muallif</Text>
                      <Text size="md" fw={600} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>{book.author}</Text>
                    </Box>
                  </Group>
                )}
                {book.publisher && (
                  <Group gap={12}>
                    <ThemeIcon size={40} radius="md" style={{ background: isDark ? 'rgba(212, 161, 30, 0.15)' : 'rgba(193, 125, 17, 0.15)' }}>
                      <IconBuildingStore size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                    </ThemeIcon>
                    <Box>
                      <Text size="xs" style={{ color: '#718096' }}>Nashriyot</Text>
                      <Text size="md" fw={600} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>{book.publisher}</Text>
                    </Box>
                  </Group>
                )}
                {book.published_date && (
                  <Group gap={12}>
                    <ThemeIcon size={40} radius="md" style={{ background: isDark ? 'rgba(212, 161, 30, 0.15)' : 'rgba(193, 125, 17, 0.15)' }}>
                      <IconCalendar size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                    </ThemeIcon>
                    <Box>
                      <Text size="xs" style={{ color: '#718096' }}>Nashr yili</Text>
                      <Text size="md" fw={600} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>{book.published_date}</Text>
                    </Box>
                  </Group>
                )}
                {book.pages && (
                  <Group gap={12}>
                    <ThemeIcon size={40} radius="md" style={{ background: isDark ? 'rgba(212, 161, 30, 0.15)' : 'rgba(193, 125, 17, 0.15)' }}>
                      <IconFileText size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                    </ThemeIcon>
                    <Box>
                      <Text size="xs" style={{ color: '#718096' }}>Sahifalar</Text>
                      <Text size="md" fw={600} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>{book.pages} sahifa</Text>
                    </Box>
                  </Group>
                )}
                {book.language && (
                  <Group gap={12}>
                    <ThemeIcon size={40} radius="md" style={{ background: isDark ? 'rgba(212, 161, 30, 0.15)' : 'rgba(193, 125, 17, 0.15)' }}>
                      <IconLanguage size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                    </ThemeIcon>
                    <Box>
                      <Text size="xs" style={{ color: '#718096' }}>Til</Text>
                      <Text size="md" fw={600} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>{book.language}</Text>
                    </Box>
                  </Group>
                )}
                {book.category && (
                  <Group gap={12}>
                    <ThemeIcon size={40} radius="md" style={{ background: isDark ? 'rgba(212, 161, 30, 0.15)' : 'rgba(193, 125, 17, 0.15)' }}>
                      <IconCategory size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                    </ThemeIcon>
                    <Box>
                      <Text size="xs" style={{ color: '#718096' }}>Kategoriya</Text>
                      <Text size="md" fw={600} style={{ color: isDark ? '#e2e8f0' : '#4A5568' }}>{book.category}</Text>
                    </Box>
                  </Group>
                )}
              </SimpleGrid>
              
              <Group gap="md" mt="md">
                <Button size="lg" flex={1} leftSection={<IconBookmark size={20} />} style={{ background: 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)' }}>
                  Saqlash
                </Button>
                <Button size="lg" flex={1} variant="light" leftSection={<IconDownload size={20} />} style={{ color: isDark ? '#d4a11e' : '#c17d11' }}>
                  Yuklab olish
                </Button>
              </Group>
            </Stack>
          </Flex>
        </Paper>

        {libraries.length > 0 && (
          <Box>
            <Title order={2} size={28} mb={20} style={{ color: 'white' }}>Mavjud kutubxonalar</Title>
            <Stack gap="lg">
              {libraries.map(lib => (
                <Card key={lib.id} p="lg" radius="xl" style={{ background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)' }}>
                  <Flex gap="lg" align="center" justify="space-between" wrap="wrap">
                    <Group gap="lg">
                      <ThemeIcon size={70} radius="xl" style={{ background: 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)' }}>
                        <IconBooks size={35} />
                      </ThemeIcon>
                      <Box>
                        <Text fw={600} size="xl" mb={4} style={{ color: isDark ? 'white' : '#2D3748' }}>{lib.name}</Text>
                        {lib.location && (
                          <Group gap={8}>
                            <IconMapPin size={18} color={isDark ? '#d4a11e' : '#c17d11'} />
                            <Text size="sm" style={{ color: '#718096' }}>{lib.location}</Text>
                          </Group>
                        )}
                      </Box>
                    </Group>
                    {lib.books > 0 && (
                      <Badge size="lg" variant="light" style={{ background: isDark ? 'rgba(212, 161, 30, 0.15)' : 'rgba(193, 125, 17, 0.15)', color: isDark ? '#d4a11e' : '#c17d11' }}>
                        {lib.books} kitob
                      </Badge>
                    )}
                  </Flex>
                </Card>
              ))}
            </Stack>
          </Box>
        )}
      </Container>

      <Modal opened={deleteModal} onClose={() => setDeleteModal(false)} title="Kitobni o'chirish" centered size="md">
        <Text mb="lg" size="md">
          Siz rostdan ham <strong>"{book.name}"</strong> kitobini o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="light" onClick={() => setDeleteModal(false)} disabled={deleting}>
            Bekor qilish
          </Button>
          <Button color="red" loading={deleting} onClick={handleDelete}>
            Ha, o'chirish
          </Button>
        </Group>
      </Modal>

      {/* Edit Modal */}
      <Modal opened={editModal} onClose={() => setEditModal(false)} title="Kitobni tahrirlash" size="lg" centered>
        <Stack gap="md">
          <TextInput
            label="Kitob nomi"
            placeholder="Kitob nomini kiriting"
            required
            value={formData.name || ''}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <TextInput
            label="Muallif"
            placeholder="Muallif nomini kiriting"
            required
            value={formData.author || ''}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
          />
          <Textarea
            label="Tavsif"
            placeholder="Kitob haqida qisqacha ma'lumot"
            rows={4}
            value={formData.description || ''}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <SimpleGrid cols={2} spacing="md">
            <TextInput
              label="Nashriyot"
              placeholder="Nashriyot nomi"
              value={formData.publisher || ''}
              onChange={(e) => setFormData({...formData, publisher: e.target.value})}
            />
            <TextInput
              label="Nashr yili"
              placeholder="2024"
              value={formData.published_date || ''}
              onChange={(e) => setFormData({...formData, published_date: e.target.value})}
            />
          </SimpleGrid>
          <SimpleGrid cols={2} spacing="md">
            <NumberInput
              label="Sahifalar soni"
              placeholder="300"
              min={1}
              value={formData.pages || ''}
              onChange={(val) => setFormData({...formData, pages: val})}
            />
            <NumberInput
              label="Nusxalar soni"
              placeholder="1"
              min={0}
              value={formData.quantity_in_library || 0}
              onChange={(val) => setFormData({...formData, quantity_in_library: val})}
            />
          </SimpleGrid>
          <SimpleGrid cols={2} spacing="md">
            <TextInput
              label="Til"
              placeholder="O'zbek"
              value={formData.language || ''}
              onChange={(e) => setFormData({...formData, language: e.target.value})}
            />
            <TextInput
              label="Kategoriya"
              placeholder="Adabiyot"
              value={formData.category || ''}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            />
          </SimpleGrid>
          <TextInput
            label="ISBN"
            placeholder="978-0-123456-78-9"
            value={formData.isbn || ''}
            onChange={(e) => setFormData({...formData, isbn: e.target.value})}
          />
          <TextInput
            label="Rasm URL"
            placeholder="https://example.com/image.jpg"
            value={formData.image || ''}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
          />
          
          <Group justify="flex-end" gap="sm" mt="md">
            <Button variant="light" onClick={() => setEditModal(false)} disabled={updating}>
              Bekor qilish
            </Button>
            <Button
              loading={updating}
              onClick={handleUpdate}
              style={{ background: 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)' }}
            >
              Saqlash
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
};

const AddBookModal = ({ opened, onClose, onAdd, isDark }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    author: '',
    publisher: '',
    quantity_in_library: 1
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.author) {
      alert('Kitob nomi va muallif majburiy!');
      return;
    }

    if (!formData.publisher) {
      alert('Nashriyot majburiy!');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Tizimga kirish kerak!');
        setLoading(false);
        return;
      }


      const payload = [
        {
          name: formData.name,
          author: formData.author,
          publisher: formData.publisher,
          quantity_in_library: parseInt(formData.quantity_in_library) || 1
        }
      ];

      console.log('Sending payload:', JSON.stringify(payload, null, 2));

      const res = await fetch('https://org-ave-jimmy-learners.trycloudflare.com/api/v1/books/add-books/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const responseData = await res.json();
        console.log('Response:', responseData);
    
        const newBook = Array.isArray(responseData) ? responseData[0] : responseData;
        onAdd(newBook);
        setFormData({
          name: '', 
          author: '', 
          publisher: '', 
          quantity_in_library: 1
        });
        onClose();
      } else {
        const errorData = await res.json();
        console.error('API Error:', errorData);
        alert(`Xatolik: ${errorData.detail || JSON.stringify(errorData)}`);
      }
    } catch (e) {
      console.error('Request Error:', e);
      alert('Xatolik yuz berdi: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="Bitta kitob qo'shish" 
      size="md" 
      centered
      styles={{
        title: { 
          fontSize: '20px', 
          fontWeight: 600,
          color: isDark ? 'white' : '#000'
        }
      }}
    >
      <Stack gap="lg">
        <Box>
          <Text size="sm" fw={500} mb={8}>
            <span style={{ color: 'red' }}>*</span> Kitob nomi
          </Text>
          <TextInput
            placeholder="Kitob nomi"
            size="md"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            styles={{
              input: {
                borderRadius: '8px'
              }
            }}
          />
        </Box>

        <Box>
          <Text size="sm" fw={500} mb={8}>
            <span style={{ color: 'red' }}>*</span> Muallif
          </Text>
          <TextInput
            placeholder="Muallif"
            size="md"
            value={formData.author}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            styles={{
              input: {
                borderRadius: '8px'
              }
            }}
          />
        </Box>

        <Box>
          <Text size="sm" fw={500} mb={8}>
            <span style={{ color: 'red' }}>*</span> Nashriyot
          </Text>
          <TextInput
            placeholder="Nashriyot"
            size="md"
            value={formData.publisher}
            onChange={(e) => setFormData({...formData, publisher: e.target.value})}
            styles={{
              input: {
                borderRadius: '8px'
              }
            }}
          />
        </Box>

        <Box>
          <Text size="sm" fw={500} mb={8}>
            <span style={{ color: 'red' }}>*</span> Kitoblar soni
          </Text>
          <NumberInput
            placeholder="1"
            size="md"
            min={1}
            value={formData.quantity_in_library}
            onChange={(val) => setFormData({...formData, quantity_in_library: val})}
            styles={{
              input: {
                borderRadius: '8px'
              }
            }}
          />
        </Box>
        
        <Group justify="flex-end" gap="md" mt="md">
          <Button 
            variant="light" 
            onClick={onClose} 
            disabled={loading}
            size="md"
            radius="md"
            style={{
              color: isDark ? '#fff' : '#000'
            }}
          >
            Bekor qilish
          </Button>
          <Button
            loading={loading}
            onClick={handleSubmit}
            size="md"
            radius="md"
            style={{ 
              background: '#1971c2',
              color: 'white'
            }}
          >
            Qo'shish
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

const Kitob = () => {
  const [isDark, setIsDark] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) setIsDark(saved === 'true');
    const handle = () => setIsDark(localStorage.getItem('darkMode') === 'true');
    window.addEventListener('darkModeChange', handle);
    return () => window.removeEventListener('darkModeChange', handle);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedLogin = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(!!(token || savedLogin === 'true'));

    const handleLoginChange = () => {
      const token = localStorage.getItem('authToken');
      const savedLogin = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(!!(token || savedLogin === 'true'));
    };

    window.addEventListener('loginStateChange', handleLoginChange);
    return () => window.removeEventListener('loginStateChange', handleLoginChange);
  }, []);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://org-ave-jimmy-learners.trycloudflare.com/api/v1/books/books/');
      if (!res.ok) throw new Error('Kitoblarni yuklashda xatolik');
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    window.dispatchEvent(new Event('loginStateChange'));
  };

  const handleAddBook = (newBook) => {
    setBooks([newBook, ...books]);
    setNotification({ type: 'success', message: 'Kitob muvaffaqiyatli qo\'shildi!' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateBook = (updatedBook) => {
    setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
    setNotification({ type: 'success', message: 'Kitob yangilandi!' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteBook = (bookId) => {
    setBooks(books.filter(b => b.id !== bookId));
    setNotification({ type: 'success', message: 'Kitob o\'chirildi!' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('loginStateChange'));
    setNotification({ type: 'success', message: 'Tizimdan chiqdingiz!' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddBookClick = () => {
    if (!isLoggedIn) {
      setNotification({ type: 'error', message: 'Kitob qo\'shish uchun tizimga kirish kerak!' });
      setTimeout(() => setNotification(null), 3000);
    } else {
      setAddModalOpened(true);
    }
  };

  const filteredBooks = books.filter(b => 
    b.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedBookId) {
    return (
      <MantineProvider>
        <DetailBook 
          bookId={selectedBookId} 
          onBack={() => setSelectedBookId(null)} 
          isDark={isDark}
          isLoggedIn={isLoggedIn}
          onDelete={handleDeleteBook}
          onUpdate={handleUpdateBook}
        />
      </MantineProvider>
    );
  }

  return (
    <MantineProvider>
      <Box style={{ minHeight: '100vh', background: isDark ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)', position: 'relative', overflow: 'hidden' }}>
        {notification && (
          <Box style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, maxWidth: '400px' }}>
            <Notification
              icon={notification.type === 'success' ? <IconCheck size={18} /> : <IconX size={18} />}
              color={notification.type === 'success' ? 'teal' : 'red'}
              title={notification.type === 'success' ? 'Muvaffaqiyat!' : 'Xatolik!'}
              onClose={() => setNotification(null)}
            >
              {notification.message}
            </Notification>
          </Box>
        )}

   
        <Box style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', filter: 'blur(40px)' }} />
        <Box style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)', filter: 'blur(60px)' }} />

        <Container size="xl" py={60} style={{ position: 'relative', zIndex: 1 }}>
         
          <Box mb={50}>
            <Flex justify="space-between" align="center" mb={20}>
              <Group align="center" gap="md">
                <Box style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
                  <IconBook size={32} color="white" stroke={2} />
                </Box>
                <Box>
                  <Text size="42px" fw={800} style={{ color: 'white', textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)', letterSpacing: '-0.5px' }}>
                    Kitoblar
                  </Text>
                  <Text size="md" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    {books.length} ta kitob mavjud
                  </Text>
                </Box>
              </Group>

              <Group gap="sm">
                <Button 
                  leftSection={<IconPlus size={18} />} 
                  onClick={handleAddBookClick} 
                  size="lg"
                  radius="md"
                  style={{ background: 'rgba(255, 255, 255, 0.95)', color: isDark ? '#d4a11e' : '#c17d11', fontWeight: 600 }}
                >
                  Kitob qo'shish
                </Button>
                {isLoggedIn && (
                  <Button 
                    leftSection={<IconLogout size={18} />} 
                    onClick={handleLogout} 
                    size="lg"
                    radius="md"
                    variant="light"
                    color="red"
                  >
                    Chiqish
                  </Button>
                )}
              </Group>
            </Flex>

    
            <Box style={{ background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '8px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)', border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}` }}>
              <Group gap={0} wrap="nowrap">
                <TextInput
                  placeholder="Kitob yoki muallif nomini kiriting..."
                  size="lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                 
                  styles={{ 
                    input: { 
                      border: 'none', 
                      backgroundColor: 'transparent', 
                      fontSize: '16px', 
                      padding: '12px 16px', 
                      color: isDark ? 'white' : '#2D3748' 
                    }, 
                    root: { flex: 1 } 
                  }}
                />
                <Button 
                  size="lg" 
                  radius="md" 
                  style={{ 
                    background: 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)', 
                    border: 'none', 
                    fontWeight: 600, 
                    padding: '0 32px', 
                    height: '52px' 
                  }}
                >
                  Qidirish
                </Button>
              </Group>
            </Box>
          </Box>

       
          {error && (
            <Box mb={30} p={20} style={{ background: 'rgba(255, 107, 107, 0.15)', borderRadius: '16px', border: '1px solid rgba(255, 107, 107, 0.3)' }}>
              <Text style={{ color: 'white', fontWeight: 500 }}>⚠️ Xatolik: {error}</Text>
            </Box>
          )}

       
          {loading ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xl">
              {[1,2,3,4,5,6,7,8].map(i => (
                <Card key={i} radius="xl" style={{ background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)' }}>
                  <Card.Section><Skeleton height={280} /></Card.Section>
                  <Box p="lg">
                    <Skeleton height={24} mb="md" />
                    <Skeleton height={16} mb="sm" width="70%" />
                    <Skeleton height={40} />
                  </Box>
                </Card>
              ))}
            </SimpleGrid>
          ) : filteredBooks.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xl">
              {filteredBooks.map(book => (
                <Card
                  key={book.id}
                  radius="xl"
                  style={{ 
                    background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
                    backdropFilter: 'blur(10px)', 
                    overflow: 'hidden', 
                    transition: 'all 0.3s ease', 
                    cursor: 'pointer',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
                  }}
                  onClick={() => setSelectedBookId(book.id)}
                  onMouseOver={(e) => { 
                    e.currentTarget.style.transform = 'translateY(-8px)'; 
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.2)'; 
                  }}
                  onMouseOut={(e) => { 
                    e.currentTarget.style.transform = 'translateY(0)'; 
                    e.currentTarget.style.boxShadow = 'none'; 
                  }}
                >
                  <Card.Section>
                    <Box style={{ position: 'relative' }}>
                      <Image 
                        src={book.image || BOOK_IMAGE} 
                        height={280} 
                        alt={book.name}
                        style={{ objectFit: 'cover' }}
                      />
                      {book.quantity_in_library > 0 && (
                        <Badge 
                          size="lg" 
                          style={{ 
                            position: 'absolute', 
                            top: '12px', 
                            right: '12px', 
                            background: 'rgba(193, 125, 17, 0.95)', 
                            color: 'white', 
                            fontWeight: 600, 
                            padding: '8px 16px' 
                          }}
                        >
                          {book.quantity_in_library} ta
                        </Badge>
                      )}
                    </Box>
                  </Card.Section>

                  <Box p={20}>
                    <Text 
                      fw={700} 
                      size="lg" 
                      mb="sm" 
                      lineClamp={2} 
                      style={{ 
                        color: isDark ? 'white' : '#2D3748', 
                        minHeight: '48px' 
                      }}
                    >
                      {book.name}
                    </Text>
                    {book.author && (
                      <Group gap="xs" mb="xs">
                        <IconUser size={16} color={isDark ? '#d4a11e' : '#c17d11'} />
                        <Text size="sm" style={{ color: '#718096' }}>{book.author}</Text>
                      </Group>
                    )}
                    {book.publisher && (
                      <Group gap="xs" mb="lg">
                        <IconBuildingStore size={16} color={isDark ? '#d4a11e' : '#c17d11'} />
                        <Text size="sm" style={{ color: '#718096' }} lineClamp={1}>{book.publisher}</Text>
                      </Group>
                    )}
                    <Button 
                      fullWidth 
                      size="md" 
                      radius="xl" 
                      style={{ 
                        background: 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)', 
                        border: 'none', 
                        fontWeight: 600 
                      }}
                    >
                      Batafsil
                    </Button>
                  </Box>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Box mt={60} p={60} style={{ background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', borderRadius: '24px', textAlign: 'center' }}>
              <IconBook size={64} color={isDark ? '#d4a11e' : '#c17d11'} stroke={1.5} style={{ margin: '0 auto 20px' }} />
              <Text size="xl" fw={600} mb="sm" style={{ color: isDark ? 'white' : '#2D3748' }}>
                Kitoblar topilmadi
              </Text>
              <Text size="md" style={{ color: '#718096' }}>
                {searchQuery ? `"${searchQuery}" bo'yicha natija yo'q` : 'Hozircha kitoblar mavjud emas'}
              </Text>
            </Box>
          )}
        </Container>
      </Box>

      <AddBookModal 
        opened={addModalOpened} 
        onClose={() => setAddModalOpened(false)} 
        onAdd={handleAddBook}
        isDark={isDark}
      />
    </MantineProvider>
  );
};

export default Kitob;