// src/components/users/UserCard.tsx
import { Card, Avatar, Text, Group, Stack, Badge } from "@mantine/core";
import { User } from "@/services/api/types/user";
import UserActions from "./UserActions";
import { useTranslation } from "@/services/i18n/client";

interface UserCardProps {
  user: User;
}

/**
 * Card component for displaying user information on mobile devices
 * Follows Single Responsibility Principle - only handles displaying a single user
 */
export function UserCard({ user }: UserCardProps) {
  const { t: tRoles } = useTranslation("admin-panel-roles");

  return (
    <Card shadow="sm" p="md" radius="md" withBorder mb="sm">
      <Group align="flex-start" wrap="nowrap">
        <Avatar
          src={user?.photo?.path}
          alt={`${user?.firstName} ${user?.lastName}`}
          size="lg"
          radius="xl"
        />
        <Stack gap="xs">
          <Text size="lg" fw={500}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text size="sm" c="dimmed">
            {user?.email}
          </Text>
          <Badge size="sm" w="fit-content">
            {tRoles(`role.${user?.role?.id}`)}
          </Badge>
        </Stack>
      </Group>

      <Group justify="flex-end" mt="md">
        <UserActions user={user} />
      </Group>
    </Card>
  );
}
