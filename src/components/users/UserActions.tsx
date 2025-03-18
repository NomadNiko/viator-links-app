"use client";
import { useState } from "react";
import { User } from "@/services/api/types/user";
import useAuth from "@/services/auth/use-auth";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { useDeleteUsersService } from "@/services/api/services/users";
import { usersQueryKeys } from "@/app/[language]/admin-panel/users/queries/queries";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/services/i18n/client";
import {
  UserFilterType,
  UserSortType,
} from "@/app/[language]/admin-panel/users/user-filter-types";
import { SortEnum } from "@/services/api/types/sort-type";
import { Button } from "@/components/mantine/core/Button";
import { Group, Menu, ActionIcon } from "@mantine/core";
import { IconChevronDown, IconTrash } from "@tabler/icons-react";
import Link from "@/components/link";
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
  const handleDelete = async () => {
    const isConfirmed = await confirmDialog({
      title: tUsers("admin-panel-users:confirm.delete.title"),
      message: tUsers("admin-panel-users:confirm.delete.message"),
    });
    if (isConfirmed) {
      setMenuOpened(false);
      const searchParams = new URLSearchParams(window.location.search);
      const searchParamsFilter = searchParams.get("filter");
      const searchParamsSort = searchParams.get("sort");
      let filter: UserFilterType | undefined = undefined;
      let sort: UserSortType | undefined = {
        order: SortEnum.DESC,
        orderBy: "id",
      };
      if (searchParamsFilter) {
        filter = JSON.parse(searchParamsFilter);
      }
      if (searchParamsSort) {
        sort = JSON.parse(searchParamsSort);
      }
      type UsersQueryData = InfiniteData<{ nextPage: number; data: User[] }>;
      const previousData = queryClient.getQueryData<UsersQueryData>(
        usersQueryKeys.list().sub.by({ sort, filter }).key
      );
      await queryClient.cancelQueries({ queryKey: usersQueryKeys.list().key });
      if (previousData) {
        const newData = {
          ...previousData,
          pages: previousData.pages.map((page) => ({
            ...page,
            data: page.data.filter((item) => item.id !== user.id),
          })),
        };
        queryClient.setQueryData(
          usersQueryKeys.list().sub.by({ sort, filter }).key,
          newData
        );
      }
      await fetchUserDelete({
        id: user.id,
      });
    }
  };
  // If we can't delete, just show the edit button
  if (!canDelete) {
    return (
      <Button
        size="xs"
        component={Link}
        href={`/admin-panel/users/edit/${user.id}`}
      >
        {tUsers("admin-panel-users:actions.edit")}
      </Button>
    );
  }
  // Otherwise show a button with dropdown
  return (
    <Group gap="xs">
      <Button
        size="xs"
        component={Link}
        href={`/admin-panel/users/edit/${user.id}`}
      >
        {tUsers("admin-panel-users:actions.edit")}
      </Button>
      <Menu opened={menuOpened} onChange={setMenuOpened} position="bottom-end">
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
    </Group>
  );
}
export default UserActions;
