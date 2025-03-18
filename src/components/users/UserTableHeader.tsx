// src/components/users/UserTableHeader.tsx
import { Loader } from "@mantine/core";
import { SortEnum } from "@/services/api/types/sort-type";
import { User } from "@/services/api/types/user";
import { useTranslation } from "@/services/i18n/client";
import TableSortCell from "./TableSortCell";

interface UserTableHeaderProps {
  orderBy: keyof User;
  order: SortEnum;
  handleRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof User
  ) => void;
  isFetchingNextPage: boolean;
}

function UserTableHeader({
  orderBy,
  order,
  handleRequestSort,
  isFetchingNextPage,
}: UserTableHeaderProps) {
  const { t: tUsers } = useTranslation("admin-panel-users");
  return (
    <>
      <tr>
        {/* Avatar column - fixed width, centered */}
        <th style={{ width: 50, textAlign: "center" }}></th>

        {/* ID column - fixed width, sortable, centered */}
        <TableSortCell<User>
          width={120}
          orderBy={orderBy}
          order={order}
          column="id"
          handleRequestSort={handleRequestSort}
        >
          {tUsers("admin-panel-users:table.column1")}
        </TableSortCell>

        {/* Name column - fixed width, left-aligned */}
        <th style={{ width: 200, textAlign: "left" }}>
          {tUsers("admin-panel-users:table.column2")}
        </th>

        {/* Email column - flexible width, sortable, left-aligned */}
        <TableSortCell<User>
          width={250} // Set explicit width for email column
          orderBy={orderBy}
          order={order}
          column="email"
          handleRequestSort={handleRequestSort}
        >
          {tUsers("admin-panel-users:table.column3")}
        </TableSortCell>

        {/* Role column - fixed width, centered */}
        <th style={{ width: 80, textAlign: "center" }}>
          {tUsers("admin-panel-users:table.column4")}
        </th>

        {/* Actions column - fixed width, centered */}
        <th style={{ width: 130, textAlign: "center" }}></th>
      </tr>

      {/* Loading indicator row */}
      {isFetchingNextPage && (
        <tr>
          <td colSpan={6} style={{ padding: 0 }}>
            <Loader size="sm" style={{ width: "100%" }} />
          </td>
        </tr>
      )}
    </>
  );
}

export default UserTableHeader;
