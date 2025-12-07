import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Text, Skeleton, Card, Image, Badge, Button,
  TextInput, SimpleGrid, Group, Stack, Flex, Modal, NumberInput,
  Notification, FileButton, Tabs
} from '@mantine/core';
import { 
  IconSearch, IconBook, IconUser, IconBuildingStore, IconPlus,
  IconCheck, IconX, IconUpload, IconFileSpreadsheet
} from '@tabler/icons-react';
import axios from 'axios';

const BOOK_IMAGE = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';

const AddBookModal = ({ opened, onClose, onAdd, isDark }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');
  const [excelFile, setExcelFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    author: '',
    publisher: '',
    quantity_in_library: 1
  });

  const handleManualSubmit = async () => {
    if (!formData.name || !formData.author || !formData.publisher) {
      alert('Kitob nomi, muallif va nashriyot majburiy!');
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

      const payload = [{
        name: formData.name,
        author: formData.author,
        publisher: formData.publisher,
        quantity_in_library: parseInt(formData.quantity_in_library) || 1
      }];

      const { data } = await axios.post(
        'https://org-ave-jimmy-learners.trycloudflare.com/api/v1/books/add-books/',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const newBook = Array.isArray(data) ? data[0] : data;
      onAdd(newBook);
      setFormData({ name: '', author: '', publisher: '', quantity_in_library: 1 });
      onClose();
    } catch (e) {
      alert(`Xatolik: ${e.response?.data?.detail || e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExcelUpload = async () => {
    if (!excelFile) {
      alert('Excel faylini tanlang!');
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

      const formDataExcel = new FormData();
      formDataExcel.append('file', excelFile);

      const { data } = await axios.post(
        'https://org-ave-jimmy-learners.trycloudflare.com/api/v1/books/upload-excel/',
        formDataExcel,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      onAdd(data.books);
      setExcelFile(null);
      onClose();
      alert(`${data.books?.length || 0} ta kitob muvaffaqiyatli qo'shildi!`);
    } catch (e) {
      alert(`Xatolik: ${e.response?.data?.detail || e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="Kitob qo'shish" 
      size="md" 
      centered
      styles={{
        content: {
          backgroundColor: isDark ? '#2a2a3e' : '#ffffff',
        },
        header: {
          backgroundColor: isDark ? '#2a2a3e' : '#ffffff',
        },
        title: {
          color: isDark ? '#e0e0e0' : '#000000',
          fontWeight: 600,
        }
      }}
    >
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="manual" leftSection={<IconPlus size={16} />}>
            Qo'lda qo'shish
          </Tabs.Tab>
          <Tabs.Tab value="excel" leftSection={<IconFileSpreadsheet size={16} />}>
            Excel yuklash
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="manual" pt="lg">
          <Stack gap="lg">
            <TextInput
              label={<span><span style={{ color: 'red' }}>*</span> Kitob nomi</span>}
              placeholder="Kitob nomi"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              styles={{
                input: {
                  backgroundColor: isDark ? '#1e1e2e' : '#f8f9fa',
                  color: isDark ? '#e0e0e0' : '#000000',
                  border: `1px solid ${isDark ? '#3a3a5e' : '#e0e0e0'}`,
                },
                label: { color: isDark ? '#e0e0e0' : '#000000' }
              }}
            />
            <TextInput
              label={<span><span style={{ color: 'red' }}>*</span> Muallif</span>}
              placeholder="Muallif"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              styles={{
                input: {
                  backgroundColor: isDark ? '#1e1e2e' : '#f8f9fa',
                  color: isDark ? '#e0e0e0' : '#000000',
                  border: `1px solid ${isDark ? '#3a3a5e' : '#e0e0e0'}`,
                },
                label: { color: isDark ? '#e0e0e0' : '#000000' }
              }}
            />
            <TextInput
              label={<span><span style={{ color: 'red' }}>*</span> Nashriyot</span>}
              placeholder="Nashriyot"
              value={formData.publisher}
              onChange={(e) => setFormData({...formData, publisher: e.target.value})}
              styles={{
                input: {
                  backgroundColor: isDark ? '#1e1e2e' : '#f8f9fa',
                  color: isDark ? '#e0e0e0' : '#000000',
                  border: `1px solid ${isDark ? '#3a3a5e' : '#e0e0e0'}`,
                },
                label: { color: isDark ? '#e0e0e0' : '#000000' }
              }}
            />
            <NumberInput
              label={<span><span style={{ color: 'red' }}>*</span> Nusxalar soni</span>}
              placeholder="1"
              min={1}
              value={formData.quantity_in_library}
              onChange={(val) => setFormData({...formData, quantity_in_library: val})}
              styles={{
                input: {
                  backgroundColor: isDark ? '#1e1e2e' : '#f8f9fa',
                  color: isDark ? '#e0e0e0' : '#000000',
                  border: `1px solid ${isDark ? '#3a3a5e' : '#e0e0e0'}`,
                },
                label: { color: isDark ? '#e0e0e0' : '#000000' }
              }}
            />
            <Group justify="flex-end" gap="md" mt="md">
              <Button variant="light" onClick={onClose} disabled={loading}>
                Bekor qilish
              </Button>
              <Button 
                loading={loading} 
                onClick={handleManualSubmit} 
                style={{ background: '#1971c2' }}
              >
                Qo'shish
              </Button>
            </Group>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="excel" pt="lg">
          <Stack gap="lg">
            <Box
              p="xl"
              style={{
                border: `2px dashed ${isDark ? '#3a3a5e' : '#e0e0e0'}`,
                borderRadius: '12px',
                textAlign: 'center',
                backgroundColor: isDark ? '#1e1e2e' : '#f8f9fa',
              }}
            >
              <IconFileSpreadsheet 
                size={48} 
                color={isDark ? '#64B5F6' : '#1971c2'} 
                style={{ margin: '0 auto 16px' }}
              />
              <Text size="lg" fw={600} mb="xs" style={{ color: isDark ? '#e0e0e0' : '#000000' }}>
                Excel faylini yuklang
              </Text>
              <Text size="sm" mb="lg" style={{ color: isDark ? '#a0a0a0' : '#666666' }}>
                .xlsx yoki .xls formatdagi fayllarni qo'llab-quvvatlaydi
              </Text>
              
              <FileButton onChange={setExcelFile} accept=".xlsx,.xls">
                {(props) => (
                  <Button 
                    {...props} 
                    leftSection={<IconUpload size={18} />}
                    variant="light"
                    size="md"
                  >
                    Fayl tanlash
                  </Button>
                )}
              </FileButton>

              {excelFile && (
                <Box mt="md" p="md" style={{
                  backgroundColor: isDark ? '#2a2a3e' : '#ffffff',
                  borderRadius: '8px',
                  border: `1px solid ${isDark ? '#3a3a5e' : '#e0e0e0'}`,
                }}>
                  <Group gap="xs">
                    <IconCheck size={18} color="green" />
                    <Text size="sm" style={{ color: isDark ? '#e0e0e0' : '#000000' }}>
                      {excelFile.name}
                    </Text>
                    <Text size="xs" style={{ color: isDark ? '#a0a0a0' : '#666666' }}>
                      ({(excelFile.size / 1024).toFixed(2)} KB)
                    </Text>
                  </Group>
                </Box>
              )}
            </Box>

            <Box 
              p="md" 
              style={{
                backgroundColor: isDark ? 'rgba(100, 181, 246, 0.1)' : 'rgba(25, 113, 194, 0.1)',
                borderRadius: '8px',
                border: `1px solid ${isDark ? 'rgba(100, 181, 246, 0.3)' : 'rgba(25, 113, 194, 0.3)'}`,
              }}
            >
              <Text size="sm" fw={500} mb="xs" style={{ color: isDark ? '#64B5F6' : '#1971c2' }}>
                📋 Excel fayl formati:
              </Text>
              <Text size="xs" style={{ color: isDark ? '#a0a0a0' : '#666666' }}>
                • name (Kitob nomi)<br/>
                • author (Muallif)<br/>
                • publisher (Nashriyot)<br/>
                • quantity_in_library (Nusxalar soni)
              </Text>
            </Box>

            <Group justify="flex-end" gap="md" mt="md">
              <Button variant="light" onClick={onClose} disabled={loading}>
                Bekor qilish
              </Button>
              <Button 
                loading={loading} 
                onClick={handleExcelUpload}
                disabled={!excelFile}
                style={{ background: '#1971c2' }}
              >
                Yuklash
              </Button>
            </Group>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
};

const Kitob = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const handleDarkModeChange = () => {
      setIsDark(localStorage.getItem('darkMode') === 'true');
    };

    window.addEventListener('darkModeChange', handleDarkModeChange);
    window.addEventListener('storage', handleDarkModeChange);

    return () => {
      window.removeEventListener('darkModeChange', handleDarkModeChange);
      window.removeEventListener('storage', handleDarkModeChange);
    };
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
    window.addEventListener('loginSuccess', handleLoginChange);
    window.addEventListener('storage', handleLoginChange);

    return () => {
      window.removeEventListener('loginStateChange', handleLoginChange);
      window.removeEventListener('loginSuccess', handleLoginChange);
      window.removeEventListener('storage', handleLoginChange);
    };
  }, []);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        'https://org-ave-jimmy-learners.trycloudflare.com/api/v1/books/books/'
      );
      setBooks(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = (newBook) => {
    if (Array.isArray(newBook)) {
      setBooks([...newBook, ...books]);
    } else {
      setBooks([newBook, ...books]);
    }
    setNotification({ type: 'success', message: 'Kitob muvaffaqiyatli qo\'shildi!' });
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

  return (
    <Box 
      style={{ 
        minHeight: '100vh', 
        background: isDark 
          ? 'linear-gradient(180deg, #1a1a2e, #16213e)' 
          : 'linear-gradient(180deg, #c17d11, #d4a11e, #c17d11)', 
        position: 'relative', 
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
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

      <Box style={{ 
        position: 'absolute', 
        top: '-100px', 
        right: '-100px', 
        width: '400px', 
        height: '400px', 
        borderRadius: '50%', 
        background: isDark ? 'rgba(100, 181, 246, 0.1)' : 'rgba(255, 255, 255, 0.1)', 
        filter: 'blur(40px)',
        transition: 'all 0.3s ease'
      }} />

      <Container size="xl" py={60} style={{ position: 'relative', zIndex: 1 }}>
        <Box mb={50}>
          <Flex justify="space-between" align="center" mb={20}>
            <Group align="center" gap="md">
              <Box style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '16px', 
                background: 'rgba(255, 255, 255, 0.2)', 
                backdropFilter: 'blur(10px)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <IconBook size={32} color="white" stroke={2} />
              </Box>
              <Box>
                <Text size="42px" fw={800} style={{ color: 'white', textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)' }}>
                  Kitoblar
                </Text>
                <Text size="md" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  {books.length} ta kitob mavjud
                </Text>
              </Box>
            </Group>

            <Button 
              leftSection={<IconPlus size={18} />} 
              onClick={handleAddBookClick} 
              size="lg"
              radius="md"
              style={{ 
                background: 'rgba(255, 255, 255, 0.95)', 
                color: isDark ? '#64B5F6' : '#c17d11', 
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }}
            >
              Kitob qo'shish
            </Button>
          </Flex>

          <Box style={{ 
            background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(10px)', 
            borderRadius: '20px', 
            padding: '8px',
            transition: 'all 0.3s ease'
          }}>
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
                  background: isDark 
                    ? 'linear-gradient(180deg, #64B5F6, #42A5F5)' 
                    : 'linear-gradient(180deg, #c17d11, #d4a11e)', 
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
          <Box mb={30} p={20} style={{ 
            background: 'rgba(255, 107, 107, 0.15)', 
            borderRadius: '16px', 
            border: '1px solid rgba(255, 107, 107, 0.3)' 
          }}>
            <Text style={{ color: 'white', fontWeight: 500 }}>⚠️ Xatolik: {error}</Text>
          </Box>
        )}

        {loading ? (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xl">
            {[1,2,3,4,5,6,7,8].map(i => (
              <Card 
                key={i} 
                radius="xl" 
                style={{ 
                  background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)' 
                }}
              >
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
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/kitob/${book.id}`)}
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
                          background: isDark ? 'rgba(100, 181, 246, 0.95)' : 'rgba(193, 125, 17, 0.95)', 
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
                      <IconUser size={16} color={isDark ? '#64B5F6' : '#c17d11'} />
                      <Text size="sm" style={{ color: '#718096' }}>{book.author}</Text>
                    </Group>
                  )}
                  {book.publisher && (
                    <Group gap="xs" mb="lg">
                      <IconBuildingStore size={16} color={isDark ? '#64B5F6' : '#c17d11'} />
                      <Text size="sm" style={{ color: '#718096' }} lineClamp={1}>{book.publisher}</Text>
                    </Group>
                  )}
                  <Button 
                    fullWidth 
                    size="md" 
                    radius="xl" 
                    style={{ 
                      background: isDark 
                        ? 'linear-gradient(180deg, #64B5F6, #42A5F5)' 
                        : 'linear-gradient(180deg, #c17d11, #d4a11e)', 
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
          <Box 
            mt={60} 
            p={60} 
            style={{ 
              background: isDark ? 'rgba(26, 27, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '24px', 
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <IconBook 
              size={64} 
              color={isDark ? '#64B5F6' : '#c17d11'} 
              stroke={1.5} 
              style={{ margin: '0 auto 20px' }} 
            />
            <Text size="xl" fw={600} mb="sm" style={{ color: isDark ? 'white' : '#2D3748' }}>
              Kitoblar topilmadi
            </Text>
            <Text size="md" style={{ color: '#718096' }}>
              {searchQuery ? `"${searchQuery}" bo'yicha natija yo'q` : 'Hozircha kitoblar mavjud emas'}
            </Text>
          </Box>
        )}
      </Container>

      <AddBookModal 
        opened={addModalOpened} 
        onClose={() => setAddModalOpened(false)} 
        onAdd={handleAddBook}
        isDark={isDark}
      />
    </Box>
  );
};

export default Kitob;