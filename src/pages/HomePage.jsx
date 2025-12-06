import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowLeft, User, Calendar, FileText, Globe, Tag, Hash, Bookmark, Download, Building, Star } from 'lucide-react';

const BOOK_IMAGE = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';
const LIBRARY_IMAGE = 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
const BOOK_OPEN_IMAGE = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

// DetailBook komponenti
const DetailBook = ({ bookId, onBack, isDark }) => {
  const [book, setBook] = useState(null);
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookId) {
      setError('Kitob ID topilmadi');
      setLoading(false);
      return;
    }

    const loadBookData = async () => {
      setLoading(true);
      setError(null);

      try {
        const cleanBookId = String(bookId).replace(/[^0-9]/g, '');
        
        const bookResponse = await fetch(
          `https://org-ave-jimmy-learners.trycloudflare.com/api/v1/books/book/${cleanBookId}/`
        );

        if (!bookResponse.ok) {
          throw new Error(`Kitob topilmadi: ${bookResponse.status}`);
        }

        const bookData = await bookResponse.json();
        setBook(bookData);

        if (bookData.libraries?.length > 0) {
          const libraryPromises = bookData.libraries.map(async (libId) => {
            try {
              const res = await fetch(
                `https://org-ave-jimmy-learners.trycloudflare.com/api/v1/libraries/library/${libId}/`
              );
              return res.ok ? await res.json() : null;
            } catch {
              return null;
            }
          });

          const libs = await Promise.all(libraryPromises);
          setLibraries(libs.filter(Boolean));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBookData();
  }, [bookId]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: isDark 
          ? 'linear-gradient(180deg, #1a1a2e, #16213e)' 
          : 'linear-gradient(180deg, #c17d11, #d4a11e)',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', fontSize: '20px' }}>Yuklanmoqda...</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div style={{
        minHeight: '100vh',
        background: isDark 
          ? 'linear-gradient(180deg, #1a1a2e, #16213e)' 
          : 'linear-gradient(180deg, #c17d11, #d4a11e)',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button
            onClick={onBack}
            style={{
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}
          >
            <ArrowLeft size={18} />
            Orqaga
          </button>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'white'
          }}>
            <h2 style={{ marginBottom: '20px' }}>Xatolik yuz berdi</h2>
            <p>{error || 'Kitob topilmadi'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark 
        ? 'linear-gradient(180deg, #1a1a2e, #16213e)' 
        : 'linear-gradient(180deg, #c17d11, #d4a11e)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            padding: '12px 24px',
            background: isDark ? 'rgba(255,212,59,0.2)' : 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '30px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          <ArrowLeft size={18} />
          Orqaga
        </button>

        <div style={{
          background: isDark ? 'rgba(26,27,30,0.95)' : 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 0 }}>
            <div style={{
              backgroundImage: `url(${book.image || BOOK_IMAGE})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '500px'
            }} />
            
            <div style={{ padding: '40px' }}>
              <h1 style={{
                fontSize: '36px',
                fontWeight: 700,
                color: isDark ? 'white' : '#2D3748',
                marginBottom: '20px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                {book.name}
              </h1>

              {book.description && (
                <p style={{
                  fontSize: '15px',
                  color: isDark ? '#cbd5e0' : '#718096',
                  lineHeight: 1.7,
                  marginBottom: '30px',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  {book.description}
                </p>
              )}

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '30px'
              }}>
                {book.author && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      background: isDark ? 'rgba(212,161,30,0.15)' : 'rgba(193,125,17,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <User size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#718096' }}>Muallif</div>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: isDark ? '#e2e8f0' : '#4A5568'
                      }}>
                        {book.author}
                      </div>
                    </div>
                  </div>
                )}

                {book.pages && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      background: isDark ? 'rgba(212,161,30,0.15)' : 'rgba(193,125,17,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FileText size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#718096' }}>Sahifalar</div>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: isDark ? '#e2e8f0' : '#4A5568'
                      }}>
                        {book.pages} sahifa
                      </div>
                    </div>
                  </div>
                )}

                {book.language && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      background: isDark ? 'rgba(212,161,30,0.15)' : 'rgba(193,125,17,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Globe size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#718096' }}>Til</div>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: isDark ? '#e2e8f0' : '#4A5568'
                      }}>
                        {book.language}
                      </div>
                    </div>
                  </div>
                )}

                {book.category && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      background: isDark ? 'rgba(212,161,30,0.15)' : 'rgba(193,125,17,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Tag size={20} color={isDark ? '#d4a11e' : '#c17d11'} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#718096' }}>Kategoriya</div>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: isDark ? '#e2e8f0' : '#4A5568'
                      }}>
                        {book.category}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{
                  flex: 1,
                  padding: '14px',
                  background: 'linear-gradient(180deg, #c17d11, #d4a11e)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <Bookmark size={18} />
                  Saqlash
                </button>
                <button style={{
                  flex: 1,
                  padding: '14px',
                  background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  border: 'none',
                  borderRadius: '8px',
                  color: isDark ? 'white' : '#2D3748',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <Download size={18} />
                  Yuklab olish
                </button>
              </div>
            </div>
          </div>
        </div>

        {libraries.length > 0 && (
          <div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 700,
              color: 'white',
              marginBottom: '24px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Mavjud kutubxonalar ({libraries.length})
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {libraries.map(lib => (
                <div
                  key={lib.id}
                  style={{
                    background: isDark ? 'rgba(26,27,30,0.95)' : 'rgba(255,255,255,0.95)',
                    padding: '24px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                  }}
                >
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: '12px',
                    background: 'linear-gradient(180deg, #c17d11, #d4a11e)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Building size={30} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: isDark ? 'white' : '#2D3748',
                      marginBottom: '4px'
                    }}>
                      {lib.name}
                    </h3>
                    {lib.location && (
                      <p style={{ fontSize: '14px', color: '#718096' }}>
                        {lib.location}
                      </p>
                    )}
                  </div>
                  {lib.books > 0 && (
                    <div style={{
                      padding: '8px 16px',
                      background: isDark ? 'rgba(212,161,30,0.15)' : 'rgba(193,125,17,0.15)',
                      color: isDark ? '#d4a11e' : '#c17d11',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 600
                    }}>
                      {lib.books} kitob
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// HomePage komponenti
export default function HomePage() {
  const [isDark, setIsDark] = useState(false);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookId, setSelectedBookId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) setIsDark(saved === 'true');
  }, []);

  useEffect(() => {
    const handleDarkModeChange = () => {
      const saved = localStorage.getItem('darkMode');
      if (saved) setIsDark(saved === 'true');
    };
    window.addEventListener('darkModeChange', handleDarkModeChange);
    return () => window.removeEventListener('darkModeChange', handleDarkModeChange);
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://org-ave-jimmy-learners.trycloudflare.com/api/v1/books/');
        if (response.ok) {
          const data = await response.json();
          setBooks(data);
        } else {
          setBooks([
            { id: 1, name: "O'tkan kunlar", author: "Abdulla Qodiriy", publisher: "O'zbekiston", quantity_in_library: 15 },
            { id: 2, name: "Mehrobdan chayon", author: "Abdulla Qahhor", publisher: "Sharq", quantity_in_library: 12 },
            { id: 3, name: "Ufq", author: "Said Ahmad", publisher: "G'afur G'ulom", quantity_in_library: 8 },
            { id: 4, name: "Ikki eshik orasi", author: "O'tkir Hoshimov", publisher: "Sharq", quantity_in_library: 20 },
            { id: 5, name: "Sinchalak", author: "Abdulla Qahhor", publisher: "O'zbekiston", quantity_in_library: 10 },
            { id: 6, name: "Kecha va kunduz", author: "Cho'lpon", publisher: "G'afur G'ulom", quantity_in_library: 7 },
          ]);
        }
      } catch {
        setBooks([
          { id: 1, name: "O'tkan kunlar", author: "Abdulla Qodiriy", publisher: "O'zbekiston", quantity_in_library: 15 },
          { id: 2, name: "Mehrobdan chayon", author: "Abdulla Qahhor", publisher: "Sharq", quantity_in_library: 12 },
        ]);
      }
    };
    fetchBooks();
  }, []);

  const scroll = (direction) => {
    const container = document.getElementById('booksContainer');
    if (container) {
      container.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  if (selectedBookId) {
    return <DetailBook bookId={selectedBookId} onBack={() => setSelectedBookId(null)} isDark={isDark} />;
  }

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
              maxWidth: '500px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              O'zbekistonning eng yirik kutubxona tarmog'i. Minglab kitoblar, zamonaviy muhit va professional xizmat.
            </p>
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
            marginBottom: '24px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Kitoblar bir joyda – qidiruvni shu yerdan boshlang
          </h2>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', maxWidth: '600px', margin: '0 auto' }}>
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
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            />
            <button style={{
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
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              <Search size={18} />
              Qidirish
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '64px 48px', maxWidth: '1400px', margin: '0 auto' }}>
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
            {books.map((book) => (
              <div key={book.id} style={{ 
                flexShrink: 0, 
                width: '280px',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s'
              }}>
                <div style={{ height: '250px', overflow: 'hidden' }}>
                  <img src={book.image || BOOK_IMAGE} alt={book.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: isDark ? '#ffffff' : '#1a1d29',
                    marginBottom: '8px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    {book.name}
                  </h3>
                  {book.author && (
                    <p style={{ fontSize: '13px', color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#666', marginBottom: '4px' }}>
                      <strong>Muallif:</strong> {book.author}
                    </p>
                  )}
                  {book.quantity_in_library > 0 && (
                    <div style={{
                      padding: '8px 16px',
                      backgroundColor: isDark ? 'rgba(255, 212, 59, 0.2)' : '#e0f7ff',
                      color: isDark ? '#ffd43b' : '#0369a1',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      textAlign: 'center',
                      marginBottom: '12px'
                    }}>
                      {book.quantity_in_library} TA MAVJUD
                    </div>
                  )}
                  <button onClick={() => setSelectedBookId(book.id)} style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: isDark ? '#ffd43b' : '#228be6',
                    color: isDark ? '#1a1d29' : '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}>
                    Ko'rish
                  </button>
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
      </div>
    </div>
  );
}