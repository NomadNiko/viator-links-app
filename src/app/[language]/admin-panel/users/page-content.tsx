"use client";
import { RoleEnum } from "@/services/api/types/role";
import { useTranslation } from "@/services/i18n/client";
import { Container, Title, Grid, Group, Button, Box } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetUsersQuery } from "./queries/queries";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useRouter, useSearchParams } from "next/navigation";
import { SortEnum } from "@/services/api/types/sort-type";
import { User } from "@/services/api/types/user";
import Link from "@/components/link";
import UsersTable from "@/components/users/UsersTable";
import RouteGuard from "@/services/auth/route-guard";
import useGlobalLoading from "@/services/loading/use-global-loading";
import { useResponsive } from "@/services/responsive/use-responsive";
import { UserCards } from "@/components/users/UserCards";
import { MobileSortControls } from "@/components/users/MobileSortControls";

type UsersKeys = keyof User;

function Users() {
  const { t: tUsers } = useTranslation("admin-panel-users");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setLoading } = useGlobalLoading();
  const { isMobile } = useResponsive();

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
  const handleRequestSort = useCallback(
    (property: UsersKeys) => {
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
    },
    [orderBy, order, router]
  );

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

          {/* Responsive sorting controls for mobile */}
          {isMobile && (
            <Grid.Col span={12} pb="xs">
              <MobileSortControls
                orderBy={orderBy}
                order={order}
                onSort={handleRequestSort}
              />
            </Grid.Col>
          )}

          {/* Users list - responsive between table and cards */}
          <Grid.Col span={12} mb="sm">
            {isMobile ? (
              <Box>
                <UserCards
                  users={users}
                  handleScroll={handleScroll}
                  isFetchingNextPage={isFetchingNextPage}
                  isLoading={isLoading}
                />
              </Box>
            ) : (
              <UsersTable
                users={users}
                order={order}
                orderBy={orderBy}
                handleRequestSort={(event, property) =>
                  handleRequestSort(property)
                }
                handleScroll={handleScroll}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
              />
            )}
          </Grid.Col>
        </Grid>
      </Container>
    </RouteGuard>
  );
}

export default Users;
