"use client";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import { Container } from "@mantine/core";
import { Stack, Box, Title } from "@mantine/core";
import { FormTextInput } from "@/components/mantine/form/TextInput";
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
import { FormSelect } from "@/components/mantine/form/Select";
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

  const { handleSubmit, setError } = methods;

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
            <FormTextInput<CreateFormData>
              name="email"
              testId="new-user-email"
              autoComplete="new-user-email"
              label={t("admin-panel-users-create:inputs.email.label")}
            />
            <FormTextInput<CreateFormData>
              name="password"
              type="password"
              testId="new-user-password"
              autoComplete="new-user-password"
              label={t("admin-panel-users-create:inputs.password.label")}
            />
            <FormTextInput<CreateFormData>
              name="passwordConfirmation"
              testId="new-user-password-confirmation"
              label={t(
                "admin-panel-users-create:inputs.passwordConfirmation.label"
              )}
              type="password"
            />
            <FormTextInput<CreateFormData>
              name="firstName"
              testId="first-name"
              label={t("admin-panel-users-create:inputs.firstName.label")}
            />
            <FormTextInput<CreateFormData>
              name="lastName"
              testId="last-name"
              label={t("admin-panel-users-create:inputs.lastName.label")}
            />
            <FormSelect<CreateFormData>
              name="role"
              testId="role"
              label={t("admin-panel-users-create:inputs.role.label")}
              options={roleOptions}
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
