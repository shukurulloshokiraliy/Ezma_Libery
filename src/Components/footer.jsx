import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // localStorage dan dark mode holatini o'qish
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDark(savedMode === 'true');
    }

    // darkModeChange eventini tinglash
    const handleDarkModeChange = () => {
      const saved = localStorage.getItem('darkMode');
      setIsDark(saved === 'true');
    };

    window.addEventListener('darkModeChange', handleDarkModeChange);
    return () => window.removeEventListener('darkModeChange', handleDarkModeChange);
  }, []);

  return (
    <footer style={{ 
      background: isDark 
        ? "linear-gradient(180deg, #1a1d29 0%, #2d1f3f 50%, #1a1d29 100%)"
        : "linear-gradient(180deg, #c17d11 0%, #d4a11e 50%, #c17d11 100%)",
      padding: '64px 48px 32px',
      transition: 'background 0.3s',
      boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.15)'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '48px',
          marginBottom: '48px'
        }}>
          {/* Logo va tavsif */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '0.5px',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                EZMA
              </div>
            </div>
            <p style={{ 
              fontSize: '14px', 
              color: 'rgba(255, 255, 255, 0.85)', 
              maxWidth: '300px',
              lineHeight: '1.6',
              margin: 0,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              O'zbekistonning eng yirik kutubxona tarmog'i. Biz bilan kitob o'qishni boshlang!
            </p>
          </div>

          {/* Tezkor havolalar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              color: '#ffffff',
              margin: 0,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Tezkor havolalar
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Bosh sahifa', 'Kutubxonalar', 'Kitoblar', 'Tadbirlar', 'Biz haqimizda'].map((link, index) => (
                <a 
                  key={index}
                  href="#" 
                  style={{ 
                    fontSize: '14px', 
                    color: 'rgba(255, 255, 255, 0.75)', 
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.75)'}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Bog'lanish */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              color: '#ffffff',
              margin: 0,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Bog'lanish
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="rgba(255, 255, 255, 0.85)" />
                <span style={{ 
                  fontSize: '14px', 
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  +998 90 123 45 67
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="rgba(255, 255, 255, 0.85)" />
                <span style={{ 
                  fontSize: '14px', 
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  info@ezma.uz
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={16} color="rgba(255, 255, 255, 0.85)" style={{ marginTop: '2px' }} />
                <span style={{ 
                  fontSize: '14px', 
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  Toshkent shahri, Yunusobod tumani
                </span>
              </div>
            </div>
          </div>

          {/* Ijtimoiy tarmoqlar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              color: '#ffffff',
              margin: 0,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Ijtimoiy tarmoqlar
            </h3>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                { Icon: Facebook, href: '#' },
                { Icon: Instagram, href: '#' },
                { Icon: Youtube, href: '#' }
              ].map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Icon size={20} color="#ffffff" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.2)', 
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{ 
            fontSize: '14px', 
            color: 'rgba(255, 255, 255, 0.75)',
            margin: 0,
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            © 2024 EZMA. Barcha huquqlar himoyalangan
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a 
              href="#" 
              style={{ 
                fontSize: '14px', 
                color: 'rgba(255, 255, 255, 0.75)', 
                textDecoration: 'none',
                transition: 'color 0.2s',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.75)'}
            >
              Maxfiylik siyosati
            </a>
            <a 
              href="#" 
              style={{ 
                fontSize: '14px', 
                color: 'rgba(255, 255, 255, 0.75)', 
                textDecoration: 'none',
                transition: 'color 0.2s',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.75)'}
            >
              Foydalanish shartlari
            </a>
          </div>
        </div>


      </div>
    </footer>
  );
};

export default Footer;