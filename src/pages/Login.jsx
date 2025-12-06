import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Title,
  Text,
  Container,
  Box,
  Paper,
  Stack,
  MantineProvider,
  Checkbox,
  Group,
  Notification,
} from "@mantine/core";
import { IconUser, IconLock, IconCheck, IconX } from "@tabler/icons-react";

const LoginContent = () => {
  const [phone, setPhone] = useState(" +998 99 999 99 99");
  const [password, setPassword] = useState("123456");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleLogin = async () => {
   
    if (!phone || !password) {
      setNotification({
        type: 'error',
        message: 'Iltimos, barcha maydonlarni to\'ldiring!'
      });
      return;
    }

    setLoading(true);
    setNotification(null);

    try {
 
      const cleanPhone = phone.replace(/\s/g, '');
      
      console.log('Login attempt:', { phone: cleanPhone, password });

      const response = await fetch('https://org-ave-jimmy-learners.trycloudflare.com/api/v1/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          phone: cleanPhone,
          password: password
        })
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || `Server xatosi: ${response.status}`);
      }

     
      setNotification({
        type: 'success',
        message: 'Muvaffaqiyatli kirdingiz!'
      });

     
      if (data.token || data.access) {
        const token = data.token || data.access;
        localStorage.setItem('authToken', token);
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('userPhone', cleanPhone);
        }
      }

      if (data.user) {
        localStorage.setItem('userData', JSON.stringify(data.user));
      }

      setTimeout(() => {
        console.log('Redirecting to dashboard...');
    
      }, 2000);

    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login xatosi yuz berdi';
      
      if (error.message) {
        if (error.message.includes('401')) {
          errorMessage = 'Telefon raqam yoki parol noto\'g\'ri!';
        } else if (error.message.includes('400')) {
          errorMessage = 'Ma\'lumotlar noto\'g\'ri formatda!';
        } else if (error.message.includes('404')) {
          errorMessage = 'Login xizmati topilmadi!';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Serverga ulanib bo\'lmadi. Internetni tekshiring!';
        } else {
          errorMessage = error.message;
        }
      }

      setNotification({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #FF8C42 0%, #FF6B35 50%, #F4845F 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
 
      {notification && (
        <Box style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          maxWidth: '400px'
        }}>
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


      <Box
        style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
        }}
      />
      <Box
        style={{
          position: "absolute",
          bottom: "-150px",
          right: "-150px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.08)",
        }}
      />

      <Container size={1200} style={{ position: "relative", zIndex: 1 }}>
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "center",
          }}
        >
         
          <Box style={{ color: "white", position: "relative" }}>
            <Title
              order={1}
              fw={700}
              style={{
                fontSize: "56px",
                marginBottom: "40px",
                color: "white",
                textShadow: "0 2px 20px rgba(0,0,0,0.1)",
              }}
            >
              Welcome Back!
            </Title>

        
            <Box
              style={{
                position: "relative",
                width: "100%",
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
             
              <Box
                style={{
                  position: "relative",
                  width: "280px",
                  height: "360px",
                  background: "rgba(139, 69, 19, 0.3)",
                  borderRadius: "20px 20px 30px 30px",
                  padding: "20px",
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
                }}
              >
            
                <Box
                  style={{
                    position: "absolute",
                    top: "-30px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "120px",
                    height: "60px",
                    background: "#8B4513",
                    borderRadius: "30px 30px 0 0",
                  }}
                />

                <Box
                  style={{
                    background: "white",
                    height: "100%",
                    borderRadius: "15px",
                    padding: "30px 20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                 
                  <Box
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: "#8B4513",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconUser size={40} color="white" />
                  </Box>

           
                  {[1, 2, 3, 4].map((i) => (
                    <Box
                      key={i}
                      style={{
                        width: "100%",
                        height: "20px",
                        background: "#F5E6D3",
                        borderRadius: "5px",
                      }}
                    />
                  ))}
                </Box>

                <Box
                  style={{
                    position: "absolute",
                    bottom: "-20px",
                    right: "-40px",
                    width: "120px",
                    height: "120px",
                  }}
                >
                  <Box
                    style={{
                      width: "80px",
                      height: "80px",
                      border: "8px solid #8B4513",
                      borderRadius: "50%",
                      position: "relative",
                    }}
                  />
                  <Box
                    style={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      width: "50px",
                      height: "10px",
                      background: "#8B4513",
                      transform: "rotate(45deg)",
                      transformOrigin: "left center",
                      borderRadius: "5px",
                    }}
                  />
                </Box>
              </Box>

            
              <Box
                style={{
                  position: "absolute",
                  left: "-80px",
                  bottom: "0",
                  width: "140px",
                  height: "200px",
                }}
              >
              
                <Box
                  style={{
                    position: "absolute",
                    bottom: "0",
                    left: "30px",
                    width: "80px",
                    height: "100px",
                    background: "#F4A460",
                    borderRadius: "15px 15px 0 0",
                  }}
                />
       
                <Box
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "40px",
                    width: "60px",
                    height: "60px",
                    background: "#DEB887",
                    borderRadius: "50%",
                  }}
                />
         
                <Box
                  style={{
                    position: "absolute",
                    top: "80px",
                    right: "0",
                    width: "70px",
                    height: "15px",
                    background: "#DEB887",
                    borderRadius: "10px",
                    transform: "rotate(-20deg)",
                  }}
                />
              </Box>

        
              <Box
                style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "-60px",
                }}
              >
                <Box
                  style={{
                    width: "15px",
                    height: "60px",
                    background: "#6B8E23",
                    borderRadius: "10px",
                    position: "relative",
                  }}
                >
                  <Box
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "-10px",
                      width: "25px",
                      height: "25px",
                      background: "#8B4513",
                      borderRadius: "50% 0 50% 50%",
                      transform: "rotate(-45deg)",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Box>
            <Paper
              shadow="xl"
              p={45}
              radius="xl"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
              }}
            >
              <Box mb={30}>
                <Title
                  order={2}
                  fw={700}
                  style={{
                    fontSize: "32px",
                    color: "#FF6B35",
                    marginBottom: "10px",
                  }}
                >
                  Kirish
                </Title>
              </Box>

              <Stack gap="lg">
                <TextInput
                  leftSection={<IconUser size={18} color="#FF6B35" />}
                  placeholder="Telefon raqam ( +998 99 999 99 99)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  size="md"
                  radius="md"
                  required
                  styles={{
                    input: {
                      backgroundColor: "#FFF5F0",
                      border: "2px solid #FFE0D6",
                      color: "#333",
                      fontSize: "15px",
                      padding: "12px 12px 12px 40px",
                      "&:focus": {
                        borderColor: "#FF6B35",
                        backgroundColor: "white",
                      },
                      "&::placeholder": {
                        color: "#FF9B7F",
                      },
                    },
                  }}
                />

                <PasswordInput
                  leftSection={<IconLock size={18} color="#FF6B35" />}
                  placeholder="Parol (123456)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="md"
                  radius="md"
                  required
                  styles={{
                    input: {
                      backgroundColor: "#FFF5F0",
                      border: "2px solid #FFE0D6",
                      color: "#333",
                      fontSize: "15px",
                      padding: "12px 12px 12px 40px",
                      "&:focus": {
                        borderColor: "#FF6B35",
                        backgroundColor: "white",
                      },
                      "&::placeholder": {
                        color: "#FF9B7F",
                      },
                    },
                    visibilityToggle: {
                      color: "#FF6B35",
                    },
                  }}
                />

                <Group justify="space-between" mt="xs">
                  <Checkbox
                    label="Eslab qolish"
                    size="sm"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.currentTarget.checked)}
                    styles={{
                      label: { color: "#666", fontSize: "14px" },
                      input: {
                        "&:checked": {
                          backgroundColor: "#FF6B35",
                          borderColor: "#FF6B35",
                        },
                      },
                    }}
                  />
                  <Anchor
                    href="#"
                    size="sm"
                    fw={500}
                    style={{
                      color: "#FF6B35",
                      textDecoration: "none",
                    }}
                  >
                    Parolni unutdingizmi?
                  </Anchor>
                </Group>

                <Button
                  onClick={handleLogin}
                  fullWidth
                  size="lg"
                  radius="md"
                  mt="md"
                  loading={loading}
                  disabled={loading}
                  style={{
                    background: "linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)",
                    border: "none",
                    fontWeight: 600,
                    fontSize: "16px",
                    padding: "14px",
                    boxShadow: "0 4px 15px rgba(255, 107, 53, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 107, 53, 0.4)";
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 107, 53, 0.3)";
                  }}
                >
                  {loading ? 'Yuklanmoqda...' : 'Kirish'}
                </Button>

                <Text ta="center" mt={20} size="sm" style={{ color: "#666" }}>
                  yoki{" "}
                  <Anchor
                    href="#"
                    fw={600}
                    style={{
                      color: "#FF6B35",
                      textDecoration: "none",
                    }}
                  >
                    Ro'yxatdan o'tish
                  </Anchor>
                </Text>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

const Login = () => {
  return (
    <MantineProvider>
      <LoginContent />
    </MantineProvider>
  );
};

export default Login;