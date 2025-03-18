"use client";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import { Container, Title } from "@mantine/core";
import { Grid, Group } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { useGetUsersQuery } from "./queries/queries";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import UserFilter from "./user-filter";
import { useRouter, useSearchParams } from "next/navigation";
import { UserFilterType } from "./user-filter-types";
import { SortEnum } from "@/services/api/types/sort-type";
import { User } from "@/services/api/types/user";
import { Button } from "@/components/mantine/core/Button";
import Link from "@/components/link";
import UsersTable from "@/components/users/UsersTable";

type UsersKeys = keyof User;

function Users() {
  const { t: tUsers } = useTranslation("admin-panel-users");
  const searchParams = useSearchParams();
  const router = useRouter();

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

  // Extract filter from URL
  const filter = useMemo(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter) as UserFilterType;
    }
    return undefined;
  }, [searchParams]);

  // Fetch data
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetUsersQuery({ filter, sort: { order, orderBy } });

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
    <Container size="md">
      {" "}
      {/* Changed from "xl" to "md" to make it about 1/3 smaller */}
      <Grid pt="md">
        {/* Header with title and actions */}
        <Grid.Col span={12}>
          <Group justify="space-between">
            <Title order={3}>{tUsers("admin-panel-users:title")}</Title>
            <Group>
              <UserFilter />
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
  );
}

export default withPageRequiredAuth(Users, { roles: [RoleEnum.ADMIN] });
