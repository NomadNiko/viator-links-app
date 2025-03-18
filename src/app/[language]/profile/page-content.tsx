"use client";
import useAuth from "@/services/auth/use-auth";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { Container } from "@/components/mantine/layout/Container";
import { Group, Stack, Box } from "@mantine/core";
import { Typography } from "@/components/mantine/core/Typography";
import { Avatar } from "@/components/mantine/data/Avatar";
import { Button } from "@/components/mantine/core/Button";
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
          <Typography variant="h3" gutterBottom data-testid="user-name">
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="h5" gutterBottom data-testid="user-email">
            {user?.email}
          </Typography>
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
