"use client";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import { Container } from "@/components/mantine/layout/Container";
import { Stack } from "@mantine/core";
import { Typography } from "@/components/mantine/core/Typography";

function AdminPanel() {
  const { t } = useTranslation("admin-panel-home");
  return (
    <Container size="md">
      <Stack gap="md" pt="md">
        <Typography variant="h3" data-testid="home-title">
          {t("title")}
        </Typography>
        <Typography>{t("description")}</Typography>
      </Stack>
    </Container>
  );
}

export default withPageRequiredAuth(AdminPanel, { roles: [RoleEnum.ADMIN] });
