import React, { useState, useEffect } from 'react';
import { AlertCircle, Book, Phone, Send, MapPin, User, Building, Check, Folder, Star, ArrowLeft } from 'lucide-react';

const API_URL = 'https://org-ave-jimmy-learners.trycloudflare.com/api/v1';

const DetailLibrary = () => {
  const [isDark, setIsDark] = useState(false);
  const [library, setLibrary] = useState(null);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBookIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const idFromQuery = params.get('id');
    if (idFromQuery) return idFromQuery;
    
    const pathParts = window.location.pathname.split('/');
    const idFromPath = pathParts[pathParts.length - 1];
    return idFromPath || '1';
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) setIsDark(savedMode === 'true');
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const bookId = getBookIdFromUrl();
        console.log('Kitob yuklanmoqda:', bookId);
        
        const bookRes = await fetch(`${API_URL}/books/book/${bookId}/`);
        if (!bookRes.ok) throw new Error('Kitob topilmadi');
        
        const bookData = await bookRes.json();
        console.log('Kitob ma\'lumotlari:', bookData);
        setBook(bookData);

        if (bookData.libraries && bookData.libraries.length > 0) {
          try {
            const libraryId = bookData.libraries[0];
            const libRes = await fetch(`${API_URL}/libraries/library/${libraryId}/`);
            if (libRes.ok) {
              const libData = await libRes.json();
              console.log('Kutubxona ma\'lumotlari:', libData);
              setLibrary(libData);
            }
          } catch (e) {
            console.log('Kutubxona yuklanmadi:', e);
          }
        }
      } catch (err) {
        console.error('Xatolik:', err);
        setError(err.message || 'Kitob topilmadi');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const bgColor = isDark ? '#1a1a1a' : '#f8f9fa';
  const cardBg = isDark ? '#2d2d2d' : 'white';
  const goldGradient = isDark ? '#2d2d2d' : 'linear-gradient(180deg, #c17d11 0%, #d4a11e 50%, #c17d11 100%)';
  const textColor = isDark ? '#e0e0e0' : '#1a1a1a';
  const textLight = isDark ? '#999' : '#666';
  const goldColor = isDark ? '#d4a11e' : '#c17d11';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: bgColor, padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ background: cardBg, borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ height: '300px', background: isDark ? '#404040' : '#e9ecef', borderRadius: '8px', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div style={{ minHeight: '100vh', background: bgColor, padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            background: '#fee', 
            border: '1px solid #fcc', 
            borderRadius: '12px', 
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertCircle size={24} color="#c00" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#c00', marginBottom: '8px' }}>Xatolik</div>
              <div style={{ color: '#900', fontSize: '14px' }}>{error || 'Kitob topilmadi'}</div>
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#c00',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Qayta yuklash
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: bgColor, padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          style={{
            background: cardBg,
            border: isDark ? '1px solid #404040' : '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '10px 20px',
            marginBottom: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: textColor,
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          <ArrowLeft size={18} />
          Orqaga
        </button>

        {/* Main Book Card */}
        <div style={{ 
          background: cardBg,
          border: isDark ? '1px solid #404040' : 'none',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '20px',
          boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 0 }}>
            {/* Image Section */}
            <div style={{
              height: '400px',
              backgroundImage: `url(${book.image || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                padding: '40px 20px 20px'
              }}>
                {book.rating && (
                  <div style={{
                    background: 'rgba(255,215,0,0.9)',
                    color: '#000',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 600,
                    fontSize: '14px'
                  }}>
                    <Star size={16} fill="#000" />
                    {book.rating}
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div style={{ padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Book size={18} color={goldColor} />
                <span style={{ fontSize: '12px', color: textLight, textTransform: 'uppercase', fontWeight: 500 }}>
                  Kitob haqida
                </span>
              </div>

              <h1 style={{ fontSize: '28px', fontWeight: 700, color: textColor, marginBottom: '16px' }}>
                {book.name}
              </h1>

              {book.description && (
                <p style={{ color: textLight, fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                  {book.description}
                </p>
              )}

              <div style={{ 
                height: '1px', 
                background: isDark ? '#404040' : '#e9ecef',
                margin: '20px 0'
              }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {book.author && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <User size={16} color={textLight} />
                    <span style={{ color: textColor, fontSize: '14px' }}>
                      <strong>Muallif:</strong> {book.author}
                    </span>
                  </div>
                )}

                {book.category && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Folder size={16} color={textLight} />
                    <span style={{ color: textColor, fontSize: '14px' }}>
                      <strong>Kategoriya:</strong> {book.category}
                    </span>
                  </div>
                )}

                {book.isbn && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Book size={16} color={textLight} />
                    <span style={{ color: textColor, fontSize: '14px' }}>
                      <strong>ISBN:</strong> {book.isbn}
                    </span>
                  </div>
                )}

                {book.published_year && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Book size={16} color={textLight} />
                    <span style={{ color: textColor, fontSize: '14px' }}>
                      <strong>Nashr yili:</strong> {book.published_year}
                    </span>
                  </div>
                )}
              </div>

              <div style={{
                marginTop: '24px',
                padding: '16px',
                background: isDark ? 'rgba(212,161,30,0.1)' : 'rgba(193,125,17,0.1)',
                borderRadius: '8px',
                border: `1px solid ${goldColor}20`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Check size={16} color={goldColor} />
                  <span style={{ fontWeight: 600, color: goldColor, fontSize: '14px' }}>Mavjud</span>
                </div>
                <p style={{ fontSize: '12px', color: textLight, margin: 0 }}>
                  Bu kitob kutubxonada mavjud
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Library Info */}
        {library && (
          <div style={{
            background: goldGradient,
            borderRadius: '12px',
            padding: '30px',
            color: isDark ? textColor : 'white',
            border: isDark ? '1px solid #404040' : 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Building size={20} color={isDark ? goldColor : 'white'} />
              <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: isDark ? textColor : 'white' }}>
                Kutubxona
              </h2>
            </div>

            <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: isDark ? textColor : 'white' }}>
              {library.name}
            </h3>

            {library.description && (
              <p style={{ color: isDark ? textLight : 'rgba(255,255,255,0.9)', marginBottom: '20px', lineHeight: 1.6 }}>
                {library.description}
              </p>
            )}

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginTop: '20px'
            }}>
              {library.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={18} color={isDark ? goldColor : 'rgba(255,255,255,0.9)'} />
                  <span style={{ fontSize: '14px', color: isDark ? textColor : 'rgba(255,255,255,0.9)' }}>
                    {library.phone}
                  </span>
                </div>
              )}

              {library.telegram && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Send size={18} color={isDark ? goldColor : 'rgba(255,255,255,0.9)'} />
                  <span style={{ fontSize: '14px', color: isDark ? textColor : 'rgba(255,255,255,0.9)' }}>
                    {library.telegram}
                  </span>
                </div>
              )}

              {library.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={18} color={isDark ? goldColor : 'rgba(255,255,255,0.9)'} />
                  <span style={{ fontSize: '14px', color: isDark ? textColor : 'rgba(255,255,255,0.9)' }}>
                    {library.location}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default DetailLibrary;