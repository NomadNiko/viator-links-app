"use client";
import { AppShell, Burger, Group, Container, Box } from "@mantine/core";
import { useState } from "react";
import { SwitchThemeButton } from "@/components/mantine/theme/SwitchThemeButton";
import Logo from "./logo";
import DesktopNavigation from "./desktop-navigation";
import MobileNavigation from "./mobile-navigation";
import AuthSection from "./auth-section";

const ResponsiveAppBar = ({ children }: { children: React.ReactNode }) => {
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: { base: 240, sm: 300 },
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Container size="xl" py="md">
          <Group justify="space-between">
            {/* Mobile Burger */}
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              hiddenFrom="md"
              size="sm"
            />
            {/* Desktop Logo */}
            <Logo />
            {/* Mobile Logo */}
            <Logo isMobile />
            {/* Desktop Navigation */}
            <DesktopNavigation onCloseMenu={() => setOpened(false)} />
            {/* Theme Switch Button */}
            <Box>
              <SwitchThemeButton />
            </Box>
            {/* Authentication Section */}
            <AuthSection />
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <MobileNavigation onCloseMenu={() => setOpened(false)} />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>

      {/* Overlay to allow clicking outside navbar to close it */}
      {opened && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.3)",
            zIndex: 5, // Lower than default Mantine navbar z-index
            cursor: "pointer",
          }}
          onClick={() => setOpened(false)}
        />
      )}
    </AppShell>
  );
};

export default ResponsiveAppBar;
