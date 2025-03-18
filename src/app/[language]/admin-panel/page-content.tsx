"use client";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import { Container, Stack, Title, Text } from "@mantine/core";

function AdminPanel() {
  const { t } = useTranslation("admin-panel-home");
  return (
    <Container size="md">
      <Stack gap="md" pt="md">
        <Title order={3} data-testid="home-title">
          {t("title")}
        </Title>
        <Text>{t("description")}</Text>
      </Stack>
    </Container>
  );
}

export default withPageRequiredAuth(AdminPanel, { roles: [RoleEnum.ADMIN] });
