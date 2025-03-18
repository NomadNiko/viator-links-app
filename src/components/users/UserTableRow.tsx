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
      <td style={{ width: 50 }}>
        <Avatar
          alt={user?.firstName + " " + user?.lastName}
          src={user?.photo?.path}
          size="md"
        />
      </td>
      <td style={{ width: 100 }}>{user?.id}</td>
      <td style={{ width: 200 }}>
        {user?.firstName} {user?.lastName}
      </td>
      <td>{user?.email}</td>
      <td style={{ width: 80 }}>{tRoles(`role.${user?.role?.id}`)}</td>
      <td style={{ width: 130 }}>{user && <UserActions user={user} />}</td>
    </>
  );
}
export default UserTableRow;
