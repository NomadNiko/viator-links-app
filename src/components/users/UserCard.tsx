import {
  Card,
  Text,
  Group,
  Stack,
  Badge,
  Box,
  useMantineColorScheme,
} from "@mantine/core";
import { Avatar } from "@/components/mantine/data/Avatar";
import { User } from "@/services/api/types/user";
import UserActions from "./UserActions";
import { useTranslation } from "@/services/i18n/client";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const { t: tRoles } = useTranslation("admin-panel-roles");
  const { colorScheme } = useMantineColorScheme();

  // Use the correct colorScheme from hook
  const shadowColor =
    colorScheme === "dark"
      ? "rgba(114, 180, 255, 0.4)" // Light blue for dark mode
      : "rgba(0, 100, 255, 0.4)"; // Darker blue for light mode

  return (
    <Card shadow="sm" p="md" radius="md" withBorder mb="sm">
      <Group align="flex-start" wrap="nowrap">
        <Box p="xs">
          <Avatar
            src={user?.photo?.path}
            alt={`${user?.firstName} ${user?.lastName}`}
            size="lg"
            radius="xl"
            style={{
              margin: "2px",
              boxShadow: `0 0 10px ${shadowColor}`,
            }}
          />
        </Box>
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
