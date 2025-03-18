"use client";
import { FormSelect } from "@/components/mantine/form/Select";
import { RoleEnum } from "@/services/api/types/role";
import { useTranslation } from "@/services/i18n/client";
import { Button } from "@/components/mantine/core/Button";
import { Popover, Paper, Stack } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { UserFilterType } from "./user-filter-types";

type UserFilterFormData = UserFilterType;

function UserFilter() {
  const { t } = useTranslation("admin-panel-users");
  const router = useRouter();
  const searchParams = useSearchParams();
  const methods = useForm<UserFilterFormData>({
    defaultValues: {
      roles: [],
    },
  });
  const { handleSubmit, reset } = methods;
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const filter = searchParams.get("filter");
    if (filter) {
      setOpened(false);
      const filterParsed = JSON.parse(filter);
      reset(filterParsed);
    }
  }, [searchParams, reset]);

  const roleOptions = [
    {
      value: RoleEnum.ADMIN.toString(),
      label: t(
        `admin-panel-users:filter.inputs.role.options.${RoleEnum.ADMIN}`
      ),
    },
    {
      value: RoleEnum.USER.toString(),
      label: t(`admin-panel-users:filter.inputs.role.options.${RoleEnum.USER}`),
    },
  ];

  return (
    <FormProvider {...methods}>
      <Popover
        opened={opened}
        onClose={() => setOpened(false)}
        position="bottom-start"
      >
        <Popover.Target>
          <Button onClick={() => setOpened((prev) => !prev)}>
            {t("admin-panel-users:filter.actions.filter")}
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Paper p="md" style={{ minWidth: 300 }}>
            <form
              onSubmit={handleSubmit((data) => {
                const searchParams = new URLSearchParams(
                  window.location.search
                );
                searchParams.set("filter", JSON.stringify(data));
                router.push(
                  window.location.pathname + "?" + searchParams.toString()
                );
              })}
            >
              <Stack gap="md">
                <FormSelect
                  name="roles"
                  testId="roles"
                  label={t("admin-panel-users:filter.inputs.role.label")}
                  options={roleOptions}
                />
                <Button type="submit">
                  {t("admin-panel-users:filter.actions.apply")}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Popover.Dropdown>
      </Popover>
    </FormProvider>
  );
}

export default UserFilter;
