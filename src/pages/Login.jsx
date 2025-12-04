import React, { useState, useEffect } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Grid,
  Title,
  Text,
  Container,
  Box,
  Image,
  Paper,
  Stack,
  MantineProvider,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

const LoginContent = ({ isDark }) => {
  return (
    <Grid mih="100vh">
      {/* Left image section */}
      <Grid.Col
        span={{ base: 0, md: 6 }}
        style={{
          backgroundColor: isDark ? "#1A1B1E" : "#00AEEF",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          src="https://ezma-client.vercel.app/assets/login-img-DdFMbwye.svg"
          width={450}
          alt="login"
        />
      </Grid.Col>

      {/* Right content */}
      <Grid.Col
        span={{ base: 12, md: 6 }}
        p={20}
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Container size={420} pos="relative">
          <Anchor
            href="/"
            underline="never"
            mb="lg"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              color: isDark ? "#ccc" : "#555",
            }}
          >
            <IconArrowLeft size={18} />
            Orqaga
          </Anchor>

          <Title order={2} fw={800} ta="center" mb={10} c={isDark ? "white" : "black"}>
            Tizimga kirish
          </Title>
          <Text size="sm" ta="center" mb={30} c="dimmed">
            Platformadan to'liq foydalanish uchun tizimga kiring
          </Text>

          <Paper withBorder shadow="md" radius="md" p="md" bg={isDark ? "#2C2E33" : "white"}>
            <Stack>
              <TextInput
                placeholder="+998 __ ___ __ __"
                label="Telefon raqam"
                size="md"
                styles={{
                  input: { backgroundColor: isDark ? "#1A1B1E" : "#fff", color: isDark ? "#fff" : "#000" },
                  label: { color: isDark ? "#fff" : "#000" },
                }}
              />

              <Box pos="relative">
                <PasswordInput
                  placeholder="Iltimos parolni kiriting"
                  label="Parol"
                  size="md"
                  styles={{
                    input: { backgroundColor: isDark ? "#1A1B1E" : "#fff", color: isDark ? "#fff" : "#000" },
                    label: { color: isDark ? "#fff" : "#000" },
                  }}
                />
                <Anchor
                  href="/forgot-password"
                  size="xs"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    fontSize: 12,
                    transform: "translateY(-100%)",
                    color: isDark ? "#aaa" : "#555",
                  }}
                >
                  Parolni unutdingizmi?
                </Anchor>
              </Box>

              <Button fullWidth size="md" radius="md" color="blue">
                Tizimga kirish
              </Button>
            </Stack>
          </Paper>

          <Text ta="center" mt="md" size="sm" c="dimmed">
            Hisobingiz yo'qmi?{" "}
            <Anchor href="/register" size="sm" fw={600}>
              Ro'yxatdan o'ting
            </Anchor>
          </Text>
        </Container>
      </Grid.Col>
    </Grid>
  );
};

const Login = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Local storage dan o'qish
    const saved = localStorage.getItem("darkMode");
    if (saved) setIsDark(saved === "true");

    // Event listener
    const handler = () => {
      const val = localStorage.getItem("darkMode");
      setIsDark(val === "true");
    };
    window.addEventListener("darkModeChange", handler);
    return () => window.removeEventListener("darkModeChange", handler);
  }, []);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: isDark ? "dark" : "light" }}
    >
      <LoginContent isDark={isDark} />
    </MantineProvider>
  );
};

export default Login;
