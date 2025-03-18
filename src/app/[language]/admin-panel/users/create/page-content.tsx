"use client";
import {
  useForm,
  FormProvider,
  useFormState,
  Controller,
} from "react-hook-form";
import { Container } from "@mantine/core";
import { Stack, Box, Title, TextInput, Select } from "@mantine/core";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import Link from "@/components/link";
import FormAvatarInput from "@/components/form/avatar-input/form-avatar-input";
import { FileEntity } from "@/services/api/types/file-entity";
import useLeavePage from "@/services/leave-page/use-leave-page";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { usePostUserService } from "@/services/api/services/users";
import { useRouter } from "next/navigation";
import { Role, RoleEnum } from "@/services/api/types/role";
import { Button } from "@/components/mantine/core/Button";
import { useSnackbar } from "@/components/mantine/feedback/notification-service";

type CreateFormData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirmation: string;
  photo?: FileEntity;
  role: Role;
};

const useValidationSchema = () => {
  const { t } = useTranslation("admin-panel-users-create");
  return yup.object().shape({
    email: yup
      .string()
      .email(t("admin-panel-users-create:inputs.email.validation.invalid"))
      .required(
        t("admin-panel-users-create:inputs.firstName.validation.required")
      ),
    firstName: yup
      .string()
      .required(
        t("admin-panel-users-create:inputs.firstName.validation.required")
      ),
    lastName: yup
      .string()
      .required(
        t("admin-panel-users-create:inputs.lastName.validation.required")
      ),
    password: yup
      .string()
      .min(6, t("admin-panel-users-create:inputs.password.validation.min"))
      .required(
        t("admin-panel-users-create:inputs.password.validation.required")
      ),
    passwordConfirmation: yup
      .string()
      .oneOf(
        [yup.ref("password")],
        t(
          "admin-panel-users-create:inputs.passwordConfirmation.validation.match"
        )
      )
      .required(
        t(
          "admin-panel-users-create:inputs.passwordConfirmation.validation.required"
        )
      ),
    role: yup
      .object()
      .shape({
        id: yup.mixed<string | number>().required(),
        name: yup.string(),
      })
      .required(t("admin-panel-users-create:inputs.role.validation.required")),
  });
};

function CreateUserFormActions() {
  const { t } = useTranslation("admin-panel-users-create");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);
  return (
    <Button type="submit" disabled={isSubmitting}>
      {t("admin-panel-users-create:actions.submit")}
    </Button>
  );
}

function FormCreateUser() {
  const router = useRouter();
  const fetchPostUser = usePostUserService();
  const { t } = useTranslation("admin-panel-users-create");
  const validationSchema = useValidationSchema();
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm<CreateFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      passwordConfirmation: "",
      role: {
        id: RoleEnum.USER,
      },
      photo: undefined,
    },
  });
  const { handleSubmit, setError, control } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchPostUser(formData);
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof CreateFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(
              `admin-panel-users-create:inputs.${key}.validation.server.${data.errors[key]}`
            ),
          });
        }
      );
      return;
    }
    if (status === HTTP_CODES_ENUM.CREATED) {
      enqueueSnackbar(t("admin-panel-users-create:alerts.user.success"), {
        variant: "success",
      });
      router.push("/admin-panel/users");
    }
  });

  const roleOptions = [
    {
      value: RoleEnum.ADMIN.toString(),
      label: t(
        `admin-panel-users-create:inputs.role.options.${RoleEnum.ADMIN}`
      ),
    },
    {
      value: RoleEnum.USER.toString(),
      label: t(`admin-panel-users-create:inputs.role.options.${RoleEnum.USER}`),
    },
  ];

  return (
    <FormProvider {...methods}>
      <Container size="xs">
        <form onSubmit={onSubmit} autoComplete="create-new-user">
          <Stack gap="md" py="md">
            <Title order={6}>{t("admin-panel-users-create:title")}</Title>
            <FormAvatarInput<CreateFormData> name="photo" testId="photo" />

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label={t("admin-panel-users-create:inputs.email.label")}
                  error={fieldState.error?.message}
                  data-testid="new-user-email"
                  autoComplete="new-user-email"
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  type="password"
                  label={t("admin-panel-users-create:inputs.password.label")}
                  error={fieldState.error?.message}
                  data-testid="new-user-password"
                  autoComplete="new-user-password"
                />
              )}
            />

            <Controller
              name="passwordConfirmation"
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  type="password"
                  label={t(
                    "admin-panel-users-create:inputs.passwordConfirmation.label"
                  )}
                  error={fieldState.error?.message}
                  data-testid="new-user-password-confirmation"
                />
              )}
            />

            <Controller
              name="firstName"
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label={t("admin-panel-users-create:inputs.firstName.label")}
                  error={fieldState.error?.message}
                  data-testid="first-name"
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label={t("admin-panel-users-create:inputs.lastName.label")}
                  error={fieldState.error?.message}
                  data-testid="last-name"
                />
              )}
            />

            <Controller
              name="role"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  label={t("admin-panel-users-create:inputs.role.label")}
                  data={roleOptions}
                  error={fieldState.error?.message}
                  data-testid="role"
                  value={field.value?.id.toString()}
                  onChange={(value) => field.onChange({ id: Number(value) })}
                />
              )}
            />

            <Box>
              <CreateUserFormActions />
              <Button
                variant="outlined"
                color="gray"
                component={Link}
                href="/admin-panel/users"
                ml="xs"
              >
                {t("admin-panel-users-create:actions.cancel")}
              </Button>
            </Box>
          </Stack>
        </form>
      </Container>
    </FormProvider>
  );
}

function CreateUser() {
  return <FormCreateUser />;
}

export default withPageRequiredAuth(CreateUser);
