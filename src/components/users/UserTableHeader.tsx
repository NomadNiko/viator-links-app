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
        <th style={{ width: 50, textAlign: "center" }}></th>
        <TableSortCell<User>
          width={120}
          orderBy={orderBy}
          order={order}
          column="id"
          handleRequestSort={handleRequestSort}
        >
          {tUsers("admin-panel-users:table.column1")}
        </TableSortCell>
        <th style={{ width: 200 }}>
          {tUsers("admin-panel-users:table.column2")}
        </th>
        <TableSortCell<User>
          orderBy={orderBy}
          order={order}
          column="email"
          handleRequestSort={handleRequestSort}
        >
          {tUsers("admin-panel-users:table.column3")}
        </TableSortCell>
        <th style={{ width: 80, textAlign: "center" }}>
          {tUsers("admin-panel-users:table.column4")}
        </th>
        <th style={{ width: 130, textAlign: "center" }}></th>
      </tr>
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
