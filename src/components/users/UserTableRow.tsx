import { Avatar } from "@/components/mantine/data/Avatar";
import { User } from "@/services/api/types/user";
import { useTranslation } from "@/services/i18n/client";
import UserActions from "./UserActions";

interface UserTableRowProps {
  user: User;
}

function UserTableRow({ user }: UserTableRowProps) {
  const { t: tRoles } = useTranslation("admin-panel-roles");

  return (
    <>
      <td style={{ width: 60, textAlign: "left" }}>
        <Avatar
          alt={user?.firstName + " " + user?.lastName}
          src={user?.photo?.path}
          size="md"
        />
      </td>
      <td style={{ width: 200, textAlign: "left" }}>
        {user?.firstName} {user?.lastName}
      </td>
      <td style={{ width: 200, textAlign: "left" }}>{user?.email}</td>
      <td style={{ width: 100, textAlign: "left" }}>
        {tRoles(`role.${user?.role?.id}`)}
      </td>
      <td style={{ width: 375, textAlign: "center" }}>
        {user && <UserActions user={user} />}
      </td>
    </>
  );
}

export default UserTableRow;
