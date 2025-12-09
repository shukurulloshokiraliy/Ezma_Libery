import React, { useState, useEffect } from 'react';
import { AlertCircle, User, Building, Book, MapPin, Globe, Instagram, Facebook, Send } from 'lucide-react';

const API_URL = 'https://org-ave-jimmy-learners.trycloudflare.com/api/v1';

const DetailBook = () => {
  const [isDark, setIsDark] = useState(false);
  const [book, setBook] = useState(null);
  const [bookLibraries, setBookLibraries] = useState([]);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Avval barcha kitoblarni olish
        console.log('Barcha kitoblar yuklanmoqda...');
        const booksRes = await fetch(`${API_URL}/books/books/`);
        
        if (!booksRes.ok) {
          throw new Error(`Kitoblar yuklanmadi (Status: ${booksRes.status})`);
        }
        
        const booksData = await booksRes.json();
        console.log('Barcha kitoblar:', booksData);
        
        const books = booksData.results || booksData || [];
        
        if (books.length === 0) {
          throw new Error('Hech qanday kitob topilmadi');
        }
        
        // URL'dan ID olish yoki birinchi kitobni tanlash
        const urlParams = new URLSearchParams(window.location.search);
        let bookId = urlParams.get('id');
        
        let selectedBook = null;
        
        if (bookId) {
          selectedBook = books.find(b => b.id.toString() === bookId.toString());
          if (!selectedBook) {
            console.log(`ID ${bookId} topilmadi, birinchi kitob tanlanadi`);
            selectedBook = books[0];
          }
        } else {
          selectedBook = books[0];
        }
        
        console.log('Tanlangan kitob:', selectedBook);
        setBook(selectedBook);
        
        // Boshqa kitoblarni ko'rsatish
        const otherBooks = books.filter(b => b.id !== selectedBook.id).slice(0, 4);
        setRelatedBooks(otherBooks);
        console.log('Boshqa kitoblar:', otherBooks);
        
        // Kutubxonalarni yuklash
        if (selectedBook.libraries && selectedBook.libraries.length > 0) {
          console.log('Kutubxonalar yuklanmoqda:', selectedBook.libraries);
          
          const libraryPromises = selectedBook.libraries.map(async (libId) => {
            try {
              const res = await fetch(`${API_URL}/libraries/library/${libId}/`);
              if (!res.ok) return null;
              const data = await res.json();
              console.log(`Kutubxona ${libId}:`, data);
              return data;
            } catch (err) {
              console.error(`Kutubxona ${libId} xato:`, err);
              return null;
            }
          });
          
          const libraries = await Promise.all(libraryPromises);
          const validLibraries = libraries.filter(lib => lib !== null);
          console.log('Yuklangan kutubxonalar:', validLibraries);
          setBookLibraries(validLibraries);
        } else {
          console.log('Bu kitobda kutubxonalar yo\'q');
        }
      } catch (err) {
        console.error('Xatolik:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const bgColor = isDark ? '#1a1a1a' : '#f8f9fa';
  const cardBg = isDark ? '#2d2d2d' : 'linear-gradient(180deg, #c17d11 0%, #d4a11e 50%, #c17d11 100%)';
  const textColor = isDark ? '#e0e0e0' : 'white';
  const textSecondary = isDark ? '#999' : 'rgba(255,255,255,0.9)';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: bgColor, padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            background: cardBg, 
            padding: '40px', 
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              <div style={{ 
                width: '160px', 
                height: '220px', 
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
                animation: 'pulse 2s infinite'
              }} />
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ 
                  height: '40px', 
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  width: '60%',
                  animation: 'pulse 2s infinite'
                }} />
                <div style={{ 
                  height: '30px', 
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  width: '100px',
                  animation: 'pulse 2s infinite'
                }} />
              </div>
            </div>
          </div>
          <p style={{ textAlign: 'center', color: '#999' }}>Ma'lumotlar yuklanmoqda...</p>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: bgColor, padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            background: '#fee',
            border: '1px solid #fcc',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <AlertCircle size={24} color="#c00" />
              <div>
                <h3 style={{ margin: '0 0 8px 0', color: '#c00' }}>Xatolik yuz berdi</h3>
                <p style={{ margin: '0 0 8px 0' }}>{error}</p>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>
                  Console'ni tekshiring (F12) - batafsil ma'lumot uchun
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  style={{
                    background: '#c00',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Qayta yuklash
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ minHeight: '100vh', background: bgColor, padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            background: '#ffc',
            border: '1px solid #fc0',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 8px 0' }}>Ma'lumot topilmadi</h3>
            <p style={{ margin: 0 }}>Kitob ma'lumotlari topilmadi.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: bgColor, padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Kitob kartochkasi */}
        <div style={{ 
          background: cardBg, 
          padding: '40px', 
          borderRadius: '12px',
          marginBottom: '20px',
          border: isDark ? '1px solid #404040' : 'none'
        }}>
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ width: '160px', flexShrink: 0 }}>
              <img 
                src={book.image || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400'}
                alt={book.name}
                style={{
                  width: '100%',
                  height: '220px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '300px' }}>
              <h1 style={{ 
                fontSize: '28px', 
                marginBottom: '12px', 
                color: textColor,
                fontWeight: 600 
              }}>
                {book.name}
              </h1>
              <div style={{ 
                display: 'inline-block',
                background: isDark ? '#e3f2fd' : 'rgba(255,255,255,0.3)',
                color: isDark ? '#1976d2' : 'white',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '14px',
                marginBottom: '24px'
              }}>
                #ID: {book.id}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <User size={18} color={isDark ? textSecondary : 'rgba(255,255,255,0.9)'} />
                  <div>
                    <div style={{ fontSize: '14px', color: isDark ? textSecondary : 'rgba(255,255,255,0.8)' }}>
                      Muallif:
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: textColor }}>
                      {book.author || 'Noma\'lum'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Building size={18} color={isDark ? textSecondary : 'rgba(255,255,255,0.9)'} />
                  <div>
                    <div style={{ fontSize: '14px', color: isDark ? textSecondary : 'rgba(255,255,255,0.8)' }}>
                      Nashriyotchi:
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: textColor }}>
                      {book.publisher || 'Noma\'lum'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Book size={18} color={isDark ? textSecondary : 'rgba(255,255,255,0.9)'} />
                  <div>
                    <div style={{ fontSize: '14px', color: isDark ? textSecondary : 'rgba(255,255,255,0.8)' }}>
                      Kutubxonalar soni:
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: textColor }}>
                      {bookLibraries.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kutubxonalar */}
        {bookLibraries.length > 0 ? (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px', color: isDark ? '#e7dfdf' : '#0d0d0d' }}>
              Kutubxonalar
            </h2>

            <div style={{ 
              background: cardBg,
              padding: '24px',
              borderRadius: '12px',
              border: isDark ? '1px solid #404040' : '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: isDark ? '#404040' : '#e0e0e0',
                    flexShrink: 0
                  }}>
                    <img 
                      src={bookLibraries[0].image || "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=100"}
                      alt={bookLibraries[0].name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                      <MapPin size={18} color={textSecondary} />
                      <span style={{ fontSize: '16px', fontWeight: 500, color: textColor }}>
                        {bookLibraries[0].name}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}>
                    <Globe size={18} color="#00bcd4" />
                    <span style={{ fontSize: '14px', color: '#00bcd4' }}>Manzil</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}>
                    <Instagram size={18} color="#00bcd4" />
                    <span style={{ fontSize: '14px', color: '#00bcd4' }}>Instagram</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}>
                    <Facebook size={18} color="#00bcd4" />
                    <span style={{ fontSize: '14px', color: '#00bcd4' }}>Facebook</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}>
                    <Send size={18} color="#00bcd4" />
                    <span style={{ fontSize: '14px', color: '#00bcd4' }}>Telegram</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '30px' }}>
            <div style={{ 
              background: '#e3f2fd',
              padding: '20px',
              borderRadius: '8px'
            }}>
              <h2 style={{ fontSize: '20px', color: '#0d0d0d', margin: 0 }}>
                Bu kitob hozircha hech qaysi kutubxonada yo'q
              </h2>
            </div>
          </div>
        )}

        {/* Barcha kitoblar */}
        {relatedBooks.length > 0 && (
          <div>
            <h2 style={{ fontSize: '20px', marginBottom: '16px', color: isDark ? '#e7dfdf' : '#0d0d0d' }}>
              Barcha kitoblar
            </h2>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {relatedBooks.map(b => (
                <div 
                  key={b.id}
                  style={{ 
                    background: cardBg,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    border: isDark ? '1px solid #404040' : 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ 
                    width: '100%', 
                    height: '200px',
                    background: isDark ? '#404040' : '#e0e0e0'
                  }}>
                    <img 
                      src={b.image || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400'}
                      alt={b.name}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }}
                    />
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ 
                      fontSize: '16px',
                      fontWeight: 600,
                      marginBottom: '8px',
                      color: textColor,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {b.name}
                    </h3>
                    <p style={{ fontSize: '12px', marginBottom: '4px', color: textSecondary }}>
                      Muallif: <span style={{ fontWeight: 500 }}>{b.author || 'Noma\'lum'}</span>
                    </p>
                    <p style={{ fontSize: '12px', marginBottom: '12px', color: textSecondary }}>
                      Nashriyot: <span style={{ fontWeight: 500 }}>{b.publisher || 'Noma\'lum'}</span>
                    </p>
                    <button style={{ 
                      width: '100%',
                      padding: '8px',
                      background: '#e3f2fd',
                      color: '#1976d2',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}>
                      {b.quantity_in_library || 1} TA KITOB MAVJUD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailBook;