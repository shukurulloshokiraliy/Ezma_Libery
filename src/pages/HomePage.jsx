import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const BOOK_IMAGE = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';
const LIBRARY_IMAGE = 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
const BOOK_OPEN_IMAGE = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

export default function HomePage() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [books, setBooks] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) setIsDark(saved === 'true');
    
    const handleDarkModeChange = () => {
      setIsDark(localStorage.getItem('darkMode') === 'true');
    };
    window.addEventListener('darkModeChange', handleDarkModeChange);
    return () => window.removeEventListener('darkModeChange', handleDarkModeChange);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, libsRes] = await Promise.all([
          fetch('https://org-ave-jimmy-learners.trycloudflare.com/api/v1/books/books/'),
          fetch('https://org-ave-jimmy-learners.trycloudflare.com/api/v1/libraries/libraries/')
        ]);

        if (booksRes.ok) {
          const booksData = await booksRes.json();
          setBooks(Array.isArray(booksData) ? booksData : booksData.results || []);
        }

        if (libsRes.ok) {
          const libsData = await libsRes.json();
          setLibraries(Array.isArray(libsData) ? libsData : libsData.results || []);
        }
      } catch (err) {
        console.error('API xatosi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const scroll = (direction) => {
    const container = document.getElementById('booksContainer');
    if (container) {
      container.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/kitob?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const totalBooks = books.reduce((sum, book) => sum + (book.quantity_in_library || 0), 0);

  return (
    <div style={{ 
      background: isDark 
        ? 'linear-gradient(180deg, #1a1d29, #2d1f3f)'
        : 'linear-gradient(180deg, #c17d11, #d4a11e)',
      minHeight: '100vh'
    }}>
      {/* Hero Section */}
      <div style={{ 
        position: 'relative',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.4)',
          zIndex: 1
        }} />

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 48px',
          width: '100%',
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '80px',
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 24px 0',
              lineHeight: 1.1,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              SmartBook Library
            </h1>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.8,
              marginBottom: '32px',
              maxWidth: '500px'
            }}>
              O'zbekistonning eng yirik kutubxona tarmog'i. {books.length} ta kitob, {libraries.length} ta kutubxona.
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '32px', marginTop: '32px' }}>
              <div>
                <div style={{ fontSize: '36px', fontWeight: 700, color: '#ffd43b' }}>
                  {totalBooks}+
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                  Jami Ko'rishlar
                </div>
              </div>
              <div>
                <div style={{ fontSize: '36px', fontWeight: 700, color: '#ffd43b' }}>
                  {libraries.length}+
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                  Kutubxonalar
                </div>
              </div>
              <div>
                <div style={{ fontSize: '36px', fontWeight: 700, color: '#ffd43b' }}>
                  {books.length}+
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                  Kitoblar
                </div>
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            height: '450px'
          }}>
            <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)' }}>
              <img src={BOOK_OPEN_IMAGE} alt="Book" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)' }}>
              <img src={LIBRARY_IMAGE} alt="Library" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div style={{ 
        backgroundColor: isDark ? 'rgba(26, 29, 41, 0.8)' : 'rgba(255, 255, 255, 0.15)',
        padding: '48px 0',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#ffffff',
            marginBottom: '24px'
          }}>
            Kitoblar bir joyda – qidiruvni shu yerdan boshlang
          </h2>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <input
              type="text"
              placeholder="Kitob nomi, muallif nomi"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '15px',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.95)',
                color: isDark ? '#ffffff' : '#1a1d29'
              }}
            />
            <button onClick={handleSearch} style={{
              padding: '14px 32px',
              backgroundColor: isDark ? '#ffd43b' : '#1a1d29',
              color: isDark ? '#1a1d29' : '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Search size={18} />
              Qidirish
            </button>
          </div>
        </div>
      </div>

      {/* Books Section */}
      <div style={{ padding: '64px 48px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff' }}>
            Eng yangi kitoblar
          </h2>
          <button 
            onClick={() => navigate('/kitob')}
            style={{
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            Barcha kitoblar →
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'white' }}>
            Yuklanmoqda...
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <button onClick={() => scroll('left')} style={{
              position: 'absolute',
              left: '-60px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: isDark ? 'rgba(255, 212, 59, 0.2)' : 'rgba(255, 255, 255, 0.2)',
              color: isDark ? '#ffd43b' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ChevronLeft size={24} />
            </button>

            <div id="booksContainer" style={{
              display: 'flex',
              gap: '24px',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              paddingBottom: '8px'
            }}>
              {books.slice(0, 10).map((book) => (
                <div 
                  key={book.id} 
                  onClick={() => navigate(`/kitob/${book.id}`)}
                  style={{ 
                    flexShrink: 0, 
                    width: '280px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ height: '250px', overflow: 'hidden' }}>
                    <img 
                      src={book.image || BOOK_IMAGE} 
                      alt={book.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: isDark ? '#ffffff' : '#1a1d29',
                      marginBottom: '8px',
                      minHeight: '40px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {book.name}
                    </h3>
                    {book.author && (
                      <p style={{ 
                        fontSize: '13px', 
                        color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#666', 
                        marginBottom: '12px' 
                      }}>
                        {book.author}
                      </p>
                    )}
                    {book.quantity_in_library > 0 && (
                      <div style={{
                        padding: '6px 12px',
                        backgroundColor: isDark ? 'rgba(255, 212, 59, 0.2)' : '#e0f7ff',
                        color: isDark ? '#ffd43b' : '#0369a1',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        textAlign: 'center'
                      }}>
                        {book.quantity_in_library} ta mavjud
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => scroll('right')} style={{
              position: 'absolute',
              right: '-60px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: isDark ? 'rgba(255, 212, 59, 0.2)' : 'rgba(255, 255, 255, 0.2)',
              color: isDark ? '#ffd43b' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Libraries Section */}
      <div style={{ 
        padding: '64px 48px', 
        maxWidth: '1400px', 
        margin: '0 auto',
        background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)',
        borderRadius: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff' }}>
            Kutubxonalar ({libraries.length})
          </h2>
          <button 
            onClick={() => navigate('/kutubxona')}
            style={{
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            Barcha kutubxonalar →
          </button>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {libraries.slice(0, 6).map((lib) => (
            <div
              key={lib.id}
              onClick={() => navigate(`/kutubxona/${lib.id}`)}
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.95)',
                padding: '24px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'transparent'}`
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: isDark ? '#ffffff' : '#1a1d29',
                marginBottom: '8px'
              }}>
                {lib.name}
              </h3>
              {lib.location && (
                <p style={{ 
                  fontSize: '14px', 
                  color: isDark ? 'rgba(255,255,255,0.6)' : '#666',
                  marginBottom: '12px'
                }}>
                  📍 {lib.location}
                </p>
              )}
              {lib.books > 0 && (
                <div style={{
                  padding: '8px 16px',
                  background: isDark ? 'rgba(255, 212, 59, 0.15)' : 'rgba(193, 125, 17, 0.15)',
                  color: isDark ? '#ffd43b' : '#c17d11',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'inline-block'
                }}>
                  📚 {lib.books} kitob
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}