"use client";
import { User } from "@/services/api/types/user";
import { SortEnum } from "@/services/api/types/sort-type";
import {
  Box,
  ScrollArea,
  Paper,
  useMantineTheme,
  Text,
  Center,
  Loader,
} from "@mantine/core";
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
  isLoading?: boolean;
}

function UsersTable({
  users,
  order,
  orderBy,
  handleRequestSort,
  isFetchingNextPage,
  isLoading,
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
              {isFetchingNextPage && (
                <tr>
                  <td colSpan={6} style={{ padding: 0 }}>
                    <Loader size="sm" style={{ width: "100%" }} />
                  </td>
                </tr>
              )}

              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <UserTableRow user={user} />
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: "center", padding: theme.spacing.lg }}
                  >
                    {isLoading ? (
                      <Center>
                        <Loader size="md" />
                      </Center>
                    ) : (
                      <Text>No users found</Text>
                    )}
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
