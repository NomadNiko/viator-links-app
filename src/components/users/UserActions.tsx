// src/components/users/UserActions.tsx
"use client";
import { useState } from "react";
import { User } from "@/services/api/types/user";
import useAuth from "@/services/auth/use-auth";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { useDeleteUsersService } from "@/services/api/services/users";
import { usersQueryKeys } from "@/app/[language]/admin-panel/users/queries/queries";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/services/i18n/client";
import { Button, Group, Menu, ActionIcon, Text } from "@mantine/core";
import {
  IconChevronDown,
  IconTrash,
  IconEdit,
  IconLock,
} from "@tabler/icons-react";
import Link from "@/components/link";
import { useResponsive } from "@/services/responsive/use-responsive";

interface UserActionsProps {
  user: User;
}

function UserActions({ user }: UserActionsProps) {
  const [menuOpened, setMenuOpened] = useState(false);
  const { user: authUser } = useAuth();
  const { confirmDialog } = useConfirmDialog();
  const fetchUserDelete = useDeleteUsersService();
  const queryClient = useQueryClient();
  const canDelete = user.id !== authUser?.id;
  const { t: tUsers } = useTranslation("admin-panel-users");
  const { isMobile } = useResponsive();

  const handleDelete = async () => {
    const isConfirmed = await confirmDialog({
      title: tUsers("admin-panel-users:confirm.delete.title"),
      message: tUsers("admin-panel-users:confirm.delete.message"),
    });

    if (isConfirmed) {
      setMenuOpened(false);

      // Define the type for user query data
      type UsersQueryData = InfiniteData<{ nextPage: number; data: User[] }>;

      // Get the base query key for users
      const baseQueryKey = usersQueryKeys.list().key;

      // Cancel any in-flight queries
      await queryClient.cancelQueries({ queryKey: baseQueryKey });

      // Update all matching queries in the cache regardless of filters or sorting
      // This approach ensures consistency across all views of user data
      queryClient.setQueriesData(
        { queryKey: [baseQueryKey[0]] },
        (oldData: UsersQueryData | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.filter((item) => item.id !== user.id),
            })),
          };
        }
      );

      // Perform the actual delete operation
      await fetchUserDelete({
        id: user.id,
      });

      // Instead of invalidating queries, we've already updated the cache
      // This avoids unnecessary refetching while maintaining data consistency
    }
  };

  // Mobile view with all actions as buttons
  if (isMobile) {
    return (
      <Group gap="xs" wrap="nowrap">
        <Button
          size="xs"
          variant="light"
          component={Link}
          href={`/admin-panel/users/edit/${user.id}`}
        >
          <Group gap={4} align="center" wrap="nowrap">
            <IconEdit size={14} />
            <Text size="xs">{tUsers("admin-panel-users:actions.edit")}</Text>
          </Group>
        </Button>
        <Button
          size="xs"
          variant="light"
          component={Link}
          href={`/admin-panel/users/edit-password/${user.id}`}
        >
          <Group gap={4} align="center" wrap="nowrap">
            <IconLock size={14} />
            <Text size="xs">
              {tUsers("admin-panel-users:actions.changePassword")}
            </Text>
          </Group>
        </Button>
        {canDelete && (
          <Button size="xs" variant="light" color="red" onClick={handleDelete}>
            <Group gap={4} align="center" wrap="nowrap">
              <IconTrash size={14} />
              <Text size="xs">
                {tUsers("admin-panel-users:actions.delete")}
              </Text>
            </Group>
          </Button>
        )}
      </Group>
    );
  }

  // Desktop view with dropdown
  return (
    <Group gap="xs">
      <Button
        size="xs"
        component={Link}
        href={`/admin-panel/users/edit/${user.id}`}
      >
        {tUsers("admin-panel-users:actions.edit")}
      </Button>
      <Button
        size="xs"
        variant="light"
        component={Link}
        href={`/admin-panel/users/edit-password/${user.id}`}
      >
        {tUsers("admin-panel-users:actions.changePassword")}
      </Button>
      {canDelete && (
        <Menu
          opened={menuOpened}
          onChange={setMenuOpened}
          position="bottom-end"
        >
          <Menu.Target>
            <ActionIcon variant="light" size="lg">
              <IconChevronDown size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={14} />}
              onClick={handleDelete}
            >
              {tUsers("admin-panel-users:actions.delete")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
  );
}

export default UserActions;
