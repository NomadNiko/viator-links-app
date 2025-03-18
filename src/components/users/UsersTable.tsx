"use client";
import { User } from "@/services/api/types/user";
import { SortEnum } from "@/services/api/types/sort-type";
import { Table, Box, ScrollArea } from "@mantine/core";
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
  return (
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
          </tbody>
        </Table>
      </ScrollArea>
    </Box>
  );
}
export default UsersTable;
