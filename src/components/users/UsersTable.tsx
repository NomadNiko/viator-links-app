"use client";
import { User } from "@/services/api/types/user";
import { SortEnum } from "@/services/api/types/sort-type";
import { Box, ScrollArea, Paper, useMantineTheme } from "@mantine/core";
import { Table } from "@/components/mantine/data/Table"; // Import from custom component
import UserTableHeader from "./UserTableHeader";
import UserTableRow from "./UserTableRow";

interface UsersTableProps {
  users: User[];
  order: SortEnum;
  orderBy: keyof User;
  handleRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof User
  ) => void;
  handleScroll: () => void;
  isFetchingNextPage: boolean;
}

function UsersTable({
  users,
  order,
  orderBy,
  handleRequestSort,
  isFetchingNextPage,
}: UsersTableProps) {
  const theme = useMantineTheme();

  return (
    <Paper shadow="xs" p="md">
      <Box style={{ height: 500 }}>
        <ScrollArea style={{ height: "100%" }}>
          <Table striped highlightOnHover>
            <thead>
              <UserTableHeader
                orderBy={orderBy}
                order={order}
                handleRequestSort={handleRequestSort}
                isFetchingNextPage={isFetchingNextPage}
              />
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <UserTableRow user={user} />
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: "center", padding: theme.spacing.lg }}
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </ScrollArea>
      </Box>
    </Paper>
  );
}

export default UsersTable;
