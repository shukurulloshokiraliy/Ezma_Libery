import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const BOOK_IMAGE = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';
const LIBRARY_IMAGE = 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
const BOOK_OPEN_IMAGE = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

export default function HomePage() {
  const [isDark, setIsDark] = useState(false);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) {
      setIsDark(saved === 'true');
    }
  }, []);

  useEffect(() => {
    const handleDarkModeChange = () => {
      const saved = localStorage.getItem('darkMode');
      if (saved) {
        setIsDark(saved === 'true');
      }
    };

    window.addEventListener('darkModeChange', handleDarkModeChange);
    return () => window.removeEventListener('darkModeChange', handleDarkModeChange);
  }, []);

  useEffect(() => {
    setBooks([
      { id: 1, name: "O'tkan kunlar", author: "Abdulla Qodiriy", publisher: "O'zbekiston", quantity_in_library: 15 },
      { id: 2, name: "Mehrobdan chayon", author: "Abdulla Qahhor", publisher: "Sharq", quantity_in_library: 12 },
      { id: 3, name: "Ufq", author: "Said Ahmad", publisher: "G'afur G'ulom", quantity_in_library: 8 },
      { id: 4, name: "Ikki eshik orasi", author: "O'tkir Hoshimov", publisher: "Sharq", quantity_in_library: 20 },
      { id: 5, name: "Sinchalak", author: "Abdulla Qahhor", publisher: "O'zbekiston", quantity_in_library: 10 },
      { id: 6, name: "Kecha va kunduz", author: "Cho'lpon", publisher: "G'afur G'ulom", quantity_in_library: 7 },
    ]);
  }, []);

  const scroll = (direction) => {
    const container = document.getElementById('booksContainer');
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div style={{ 
      background: isDark 
        ? 'linear-gradient(180deg, #1a1d29 0%, #2d1f3f 100%)'
        : 'linear-gradient(180deg, #c17d11 0%, #d4a11e 100%)',
      minHeight: '100vh',
      transition: 'background 0.5s ease'
    }}>

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
          zIndex: 1,
          transition: 'background 0.5s ease'
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
              maxWidth: '500px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              O'zbekistonning eng yirik kutubxona tarmog'i. Minglab kitoblar, zamonaviy muhit va professional xizmat. Bilim olish sayohatingizni biz bilan boshlang.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            height: '450px'
          }}>
            <div style={{
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
            }}>
              <img 
                src={BOOK_OPEN_IMAGE}
                alt="Book"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div style={{
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
            }}>
              <img 
                src={LIBRARY_IMAGE}
                alt="Library"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
        </div>
      </div>


      <div style={{ 
        backgroundColor: isDark ? 'rgba(26, 29, 41, 0.8)' : 'rgba(255, 255, 255, 0.15)',
        padding: '48px 0',
        backdropFilter: 'blur(10px)',
        transition: 'background-color 0.5s ease'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '0 48px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#ffffff',
            marginBottom: '24px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Kitoblar bir joyda – qidiruvni shu yerdan boshlang
          </h2>
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <input
              type="text"
              placeholder="Kitob nomi, muallif nomi"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '15px',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.95)',
                color: isDark ? '#ffffff' : '#1a1d29',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                transition: 'all 0.3s ease'
              }}
            />
            <button
              style={{
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
                gap: '8px',
                transition: 'all 0.3s',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <Search size={18} />
              Qidirish
            </button>
          </div>
        </div>
      </div>

      <div style={{ 
        padding: '64px 48px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '32px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Eng yangi kitoblar
        </h2>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => scroll('left')}
            style={{
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
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = isDark ? 'rgba(255, 212, 59, 0.3)' : 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = isDark ? 'rgba(255, 212, 59, 0.2)' : 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <div
            id="booksContainer"
            style={{
              display: 'flex',
              gap: '24px',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              paddingBottom: '8px'
            }}
          >
            {books.map((book) => (
              <div 
                key={book.id} 
                style={{ 
                  flexShrink: 0, 
                  width: '280px',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s',
                  backdropFilter: isDark ? 'blur(10px)' : 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = isDark ? '0 8px 24px rgba(255, 212, 59, 0.2)' : '0 8px 24px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isDark ? '0 4px 12px rgba(0, 0, 0, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.2)';
                }}
              >
                <div style={{ height: '250px', overflow: 'hidden' }}>
                  <img 
                    src={BOOK_IMAGE}
                    alt={book.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: isDark ? '#ffffff' : '#1a1d29',
                    marginBottom: '8px',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    {book.name}
                  </h3>
                  {book.author && (
                    <p style={{
                      fontSize: '13px',
                      color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#666',
                      marginBottom: '4px',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}>
                      <strong>Muallif:</strong> {book.author}
                    </p>
                  )}
                  {book.publisher && (
                    <p style={{
                      fontSize: '13px',
                      color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#666',
                      marginBottom: '12px',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}>
                      <strong>Nashriyot:</strong> {book.publisher}
                    </p>
                  )}
                  {book.quantity_in_library && (
                    <div style={{
                      padding: '8px 16px',
                      backgroundColor: isDark ? 'rgba(255, 212, 59, 0.2)' : '#e0f7ff',
                      color: isDark ? '#ffd43b' : '#0369a1',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      textAlign: 'center',
                      marginBottom: '12px',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}>
                      {book.quantity_in_library} TA KITOB MAVJUD
                    </div>
                  )}
                  <button
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: isDark ? '#ffd43b' : '#228be6',
                      color: isDark ? '#1a1d29' : '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = isDark ? '#ffdb5c' : '#1c7ed6';
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = isDark ? '#ffd43b' : '#228be6';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    Ko'rish
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            style={{
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
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = isDark ? 'rgba(255, 212, 59, 0.3)' : 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = isDark ? 'rgba(255, 212, 59, 0.2)' : 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}