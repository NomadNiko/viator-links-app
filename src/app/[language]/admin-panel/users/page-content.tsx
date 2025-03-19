"use client";
import { RoleEnum } from "@/services/api/types/role";
import { useTranslation } from "@/services/i18n/client";
import { Container, Title } from "@mantine/core";
import { Grid, Group } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetUsersQuery } from "./queries/queries";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useRouter, useSearchParams } from "next/navigation";
import { SortEnum } from "@/services/api/types/sort-type";
import { User } from "@/services/api/types/user";
import { Button } from "@/components/mantine/core/Button";
import Link from "@/components/link";
import UsersTable from "@/components/users/UsersTable";
import RouteGuard from "@/services/auth/route-guard";
import useGlobalLoading from "@/services/loading/use-global-loading";

type UsersKeys = keyof User;

function Users() {
  const { t: tUsers } = useTranslation("admin-panel-users");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setLoading } = useGlobalLoading();

  // Initialize sorting state
  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: UsersKeys;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.DESC, orderBy: "id" };
  });

  // Handle sort column change
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: UsersKeys
  ) => {
    const isAsc = orderBy === property && order === SortEnum.ASC;
    const searchParams = new URLSearchParams(window.location.search);
    const newOrder = isAsc ? SortEnum.DESC : SortEnum.ASC;
    const newOrderBy = property;
    searchParams.set(
      "sort",
      JSON.stringify({ order: newOrder, orderBy: newOrderBy })
    );
    setSort({
      order: newOrder,
      orderBy: newOrderBy,
    });
    router.push(window.location.pathname + "?" + searchParams.toString());
  };

  // Fetch data
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } =
    useGetUsersQuery({ sort: { order, orderBy } });

  // Set global loading state based on query status
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  // Handle infinite scroll
  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Process users data
  const users = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as User[]) ?? ([] as User[]);
    return removeDuplicatesFromArrayObjects(result, "id");
  }, [data]);

  return (
    <RouteGuard roles={[RoleEnum.ADMIN]}>
      <Container size="md">
        <Grid pt="md">
          {/* Header with title and actions */}
          <Grid.Col span={12}>
            <Group justify="space-between">
              <Title order={3}>{tUsers("admin-panel-users:title")}</Title>
              <Group>
                <Button
                  component={Link}
                  href="/admin-panel/users/create"
                  color="green"
                >
                  {tUsers("admin-panel-users:actions.create")}
                </Button>
              </Group>
            </Group>
          </Grid.Col>
          {/* Users table */}
          <Grid.Col span={12} mb="sm">
            <UsersTable
              users={users}
              order={order}
              orderBy={orderBy}
              handleRequestSort={handleRequestSort}
              handleScroll={handleScroll}
              isFetchingNextPage={isFetchingNextPage}
            />
          </Grid.Col>
        </Grid>
      </Container>
    </RouteGuard>
  );
}

export default Users;
