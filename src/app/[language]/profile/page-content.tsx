"use client";
import useAuth from "@/services/auth/use-auth";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { Container, Group, Stack, Box, Title } from "@mantine/core";
import { Avatar } from "@/components/mantine/data/Avatar";
import { Button } from "@mantine/core";
import Link from "@/components/link";
import { useTranslation } from "@/services/i18n/client";

function Profile() {
  const { user } = useAuth();
  const { t } = useTranslation("profile");
  return (
    <Container size="sm">
      <Group gap="md" py="md" align="flex-start">
        <Avatar
          size={160}
          radius="xl"
          alt={user?.firstName + " " + user?.lastName}
          data-testid="user-icon"
          src={user?.photo?.path}
        />
        <Stack gap="xs">
          <Title order={3} mb="md" data-testid="user-name">
            {user?.firstName} {user?.lastName}
          </Title>
          <Title order={5} mb="md" data-testid="user-email">
            {user?.email}
          </Title>
          <Box>
            <Button
              component={Link}
              href="/profile/edit"
              data-testid="edit-profile"
            >
              {t("profile:actions.edit")}
            </Button>
          </Box>
        </Stack>
      </Group>
    </Container>
  );
}

export default withPageRequiredAuth(Profile);
