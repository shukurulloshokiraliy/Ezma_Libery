import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Checkbox,
  Group,
  Notification,
} from "@mantine/core";
import { IconUser, IconLock, IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => localStorage.getItem("darkMode") === "true");
  const [phone, setPhone] = useState("+998 99 999 99 99");
  const [password, setPassword] = useState("123456");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const handleDarkModeChange = () => {
      setIsDark(localStorage.getItem("darkMode") === "true");
    };

    window.addEventListener("darkModeChange", handleDarkModeChange);
    window.addEventListener("storage", handleDarkModeChange);

    return () => {
      window.removeEventListener("darkModeChange", handleDarkModeChange);
      window.removeEventListener("storage", handleDarkModeChange);
    };
  }, []);

  const theme = {
    light: {
      bg: "linear-gradient(135deg, #FF8C42 0%, #FF6B35 50%, #F4845F 100%)",
      paper: "rgba(255, 255, 255, 0.98)",
      text: "white",
      title: "#FF6B35",
      input: "#FFF5F0",
      border: "#FFE0D6",
      bookBg: "rgba(139, 69, 19, 0.3)",
      bookTop: "#8B4513",
      bookInner: "white",
      bookLine: "#F5E6D3",
    },
    dark: {
      bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      paper: "rgba(30, 30, 46, 0.98)",
      text: "#e0e0e0",
      title: "#64B5F6",
      input: "#2a2a3e",
      border: "#3a3a5e",
      bookBg: "rgba(100, 181, 246, 0.2)",
      bookTop: "#64B5F6",
      bookInner: "#2a2a3e",
      bookLine: "#3a3a5e",
    },
  };

  const t = isDark ? theme.dark : theme.light;

  const handleLogin = async () => {
    if (!phone || !password) {
      setNotification({ type: "error", message: "Iltimos, barcha maydonlarni to'ldiring!" });
      return;
    }

    setLoading(true);
    setNotification(null);

    try {
      const cleanPhone = phone.replace(/\s/g, "");
      const { data } = await axios.post(
        "https://org-ave-jimmy-learners.trycloudflare.com/api/v1/auth/login/",
        { phone: cleanPhone, password },
        { headers: { "Content-Type": "application/json" } }
      );

      setNotification({ type: "success", message: "Muvaffaqiyatli kirdingiz!" });

      const token = data.token || data.access;
      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("isLoggedIn", "true");
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("userPhone", cleanPhone);
        }
      }

      if (data.user) {
        localStorage.setItem("userData", JSON.stringify(data.user));
      }

     
      window.dispatchEvent(new Event('loginSuccess'));

      setTimeout(() => navigate("/kitob"), 1000);
    } catch (error) {
      let errorMessage = "Login xatosi yuz berdi";

      if (error.response) {
        const status = error.response.status;
        if (status === 401) errorMessage = "Telefon raqam yoki parol noto'g'ri!";
        else if (status === 400) errorMessage = "Ma'lumotlar noto'g'ri formatda!";
        else if (status === 404) errorMessage = "Login xizmati topilmadi!";
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Serverga ulanib bo'lmadi. Internetni tekshiring!";
      }

      setNotification({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: t.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
    >
      {notification && (
        <Box style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999, maxWidth: "400px" }}>
          <Notification
            icon={notification.type === "success" ? <IconCheck size={18} /> : <IconX size={18} />}
            color={notification.type === "success" ? "teal" : "red"}
            title={notification.type === "success" ? "Muvaffaqiyat!" : "Xatolik!"}
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
          background: isDark ? "rgba(100, 181, 246, 0.1)" : "rgba(255, 255, 255, 0.1)",
          transition: "all 0.3s ease",
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
          background: isDark ? "rgba(100, 181, 246, 0.08)" : "rgba(255, 255, 255, 0.08)",
          transition: "all 0.3s ease",
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
          <Box style={{ color: t.text }}>
            <Title
              order={1}
              fw={700}
              style={{
                fontSize: "56px",
                marginBottom: "40px",
                color: t.text,
                textShadow: "0 2px 20px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
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
                  background: t.bookBg,
                  borderRadius: "20px 20px 30px 30px",
                  padding: "20px",
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
                  transition: "all 0.3s ease",
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
                    background: t.bookTop,
                    borderRadius: "30px 30px 0 0",
                    transition: "all 0.3s ease",
                  }}
                />

                <Box
                  style={{
                    background: t.bookInner,
                    height: "100%",
                    borderRadius: "15px",
                    padding: "30px 20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "20px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Box
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: t.bookTop,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
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
                        background: t.bookLine,
                        borderRadius: "5px",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
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
                backgroundColor: t.paper,
                backdropFilter: "blur(10px)",
                border: `1px solid ${isDark ? "rgba(100, 181, 246, 0.3)" : "rgba(255, 255, 255, 0.5)"}`,
                transition: "all 0.3s ease",
              }}
            >
              <Box mb={30}>
                <Title
                  order={2}
                  fw={700}
                  style={{
                    fontSize: "32px",
                    color: t.title,
                    marginBottom: "10px",
                    transition: "all 0.3s ease",
                  }}
                >
                  Kirish
                </Title>
              </Box>

              <Stack gap="lg">
                <TextInput
                  leftSection={<IconUser size={18} color={t.title} />}
                  placeholder="Telefon raqam (+998 99 999 99 99)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  size="md"
                  radius="md"
                  required
                  styles={{
                    input: {
                      backgroundColor: t.input,
                      border: `2px solid ${t.border}`,
                      color: isDark ? "#e0e0e0" : "#333",
                      fontSize: "15px",
                      padding: "12px 12px 12px 40px",
                      transition: "all 0.3s ease",
                      "&:focus": {
                        borderColor: t.title,
                        backgroundColor: isDark ? "#3a3a5e" : "white",
                      },
                    },
                  }}
                />

                <PasswordInput
                  leftSection={<IconLock size={18} color={t.title} />}
                  placeholder="Parol (123456)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="md"
                  radius="md"
                  required
                  styles={{
                    input: {
                      backgroundColor: t.input,
                      border: `2px solid ${t.border}`,
                      color: isDark ? "#e0e0e0" : "#333",
                      fontSize: "15px",
                      padding: "12px 12px 12px 40px",
                      transition: "all 0.3s ease",
                      "&:focus": {
                        borderColor: t.title,
                        backgroundColor: isDark ? "#3a3a5e" : "white",
                      },
                    },
                    visibilityToggle: { color: t.title },
                  }}
                />

                <Group justify="space-between" mt="xs">
                  <Checkbox
                    label="Eslab qolish"
                    size="sm"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.currentTarget.checked)}
                    styles={{
                      label: { color: isDark ? "#b0b0b0" : "#666", fontSize: "14px" },
                      input: {
                        "&:checked": {
                          backgroundColor: t.title,
                          borderColor: t.title,
                        },
                      },
                    }}
                  />
                  <Anchor href="#" size="sm" fw={500} style={{ color: t.title, textDecoration: "none" }}>
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
                    background: isDark
                      ? "linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%)"
                      : "linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)",
                    border: "none",
                    fontWeight: 600,
                    fontSize: "16px",
                    padding: "14px",
                    boxShadow: isDark
                      ? "0 4px 15px rgba(100, 181, 246, 0.3)"
                      : "0 4px 15px rgba(255, 107, 53, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = isDark
                        ? "0 6px 20px rgba(100, 181, 246, 0.4)"
                        : "0 6px 20px rgba(255, 107, 53, 0.4)";
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = isDark
                      ? "0 4px 15px rgba(100, 181, 246, 0.3)"
                      : "0 4px 15px rgba(255, 107, 53, 0.3)";
                  }}
                >
                  {loading ? "Yuklanmoqda..." : "Kirish"}
                </Button>

                <Text ta="center" mt={20} size="sm" style={{ color: isDark ? "#b0b0b0" : "#666" }}>
                  yoki{" "}
                  <Anchor href="/sign" fw={600} style={{ color: t.title, textDecoration: "none" }}>
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

export default Login;