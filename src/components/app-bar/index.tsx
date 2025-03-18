"use client";
import { AppShell, Burger, Group, Container, Box } from "@mantine/core";
import { useState } from "react";
import { SwitchThemeButton } from "@/components/mantine/theme/SwitchThemeButton";
import Logo from "./logo";
import DesktopNavigation from "./desktop-navigation";
import MobileNavigation from "./mobile-navigation";
import AuthSection from "./auth-section";
const ResponsiveAppBar = () => {
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
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
        <MobileNavigation />
      </AppShell.Navbar>
      <AppShell.Main pt={60}></AppShell.Main>
    </AppShell>
  );
};
export default ResponsiveAppBar;
