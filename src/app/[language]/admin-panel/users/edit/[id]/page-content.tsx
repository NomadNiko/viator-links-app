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
import { useEffect } from "react";
import Link from "@/components/link";
import FormAvatarInput from "@/components/form/avatar-input/form-avatar-input";
import { FileEntity } from "@/services/api/types/file-entity";
import useLeavePage from "@/services/leave-page/use-leave-page";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import {
  useGetUserService,
  usePatchUserService,
} from "@/services/api/services/users";
import { useParams } from "next/navigation";
import { Role, RoleEnum } from "@/services/api/types/role";
import { Button } from "@/components/mantine/core/Button";
import { useSnackbar } from "@/components/mantine/feedback/notification-service";
import RouteGuard from "@/services/auth/route-guard";
import useGlobalLoading from "@/services/loading/use-global-loading";

type EditUserFormData = {
  email: string;
  firstName: string;
  lastName: string;
  photo?: FileEntity;
  role: Role;
};

type ChangeUserPasswordFormData = {
  password: string;
  passwordConfirmation: string;
};

const useValidationEditUserSchema = () => {
  const { t } = useTranslation("admin-panel-users-edit");
  return yup.object().shape({
    email: yup
      .string()
      .email(t("admin-panel-users-edit:inputs.email.validation.invalid"))
      .required(
        t("admin-panel-users-edit:inputs.firstName.validation.required")
      ),
    firstName: yup
      .string()
      .required(
        t("admin-panel-users-edit:inputs.firstName.validation.required")
      ),
    lastName: yup
      .string()
      .required(
        t("admin-panel-users-edit:inputs.lastName.validation.required")
      ),
    role: yup
      .object()
      .shape({
        id: yup.mixed<string | number>().required(),
        name: yup.string(),
      })
      .required(t("admin-panel-users-edit:inputs.role.validation.required")),
  });
};

const useValidationChangePasswordSchema = () => {
  const { t } = useTranslation("admin-panel-users-edit");
  return yup.object().shape({
    password: yup
      .string()
      .min(6, t("admin-panel-users-edit:inputs.password.validation.min"))
      .required(
        t("admin-panel-users-edit:inputs.password.validation.required")
      ),
    passwordConfirmation: yup
      .string()
      .oneOf(
        [yup.ref("password")],
        t("admin-panel-users-edit:inputs.passwordConfirmation.validation.match")
      )
      .required(
        t(
          "admin-panel-users-edit:inputs.passwordConfirmation.validation.required"
        )
      ),
  });
};

function EditUserFormActions() {
  const { t } = useTranslation("admin-panel-users-edit");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);
  return (
    <Button type="submit" disabled={isSubmitting}>
      {t("admin-panel-users-edit:actions.submit")}
    </Button>
  );
}

function ChangePasswordUserFormActions() {
  const { t } = useTranslation("admin-panel-users-edit");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);
  return (
    <Button type="submit" disabled={isSubmitting}>
      {t("admin-panel-users-edit:actions.submit")}
    </Button>
  );
}

function FormEditUser() {
  const params = useParams<{ id: string }>();
  const userId = params.id;
  const fetchGetUser = useGetUserService();
  const fetchPatchUser = usePatchUserService();
  const { t } = useTranslation("admin-panel-users-edit");
  const validationSchema = useValidationEditUserSchema();
  const { enqueueSnackbar } = useSnackbar();
  const { setLoading } = useGlobalLoading();

  const methods = useForm<EditUserFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      role: undefined,
      photo: undefined,
    },
  });

  const { handleSubmit, setError, reset, control } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true);
    try {
      const isEmailDirty = methods.getFieldState("email").isDirty;
      const { data, status } = await fetchPatchUser({
        id: userId,
        data: {
          ...formData,
          email: isEmailDirty ? formData.email : undefined,
        },
      });
      if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        (Object.keys(data.errors) as Array<keyof EditUserFormData>).forEach(
          (key) => {
            setError(key, {
              type: "manual",
              message: t(
                `admin-panel-users-edit:inputs.${key}.validation.server.${data.errors[key]}`
              ),
            });
          }
        );
        return;
      }
      if (status === HTTP_CODES_ENUM.OK) {
        reset(formData);
        enqueueSnackbar(t("admin-panel-users-edit:alerts.user.success"), {
          variant: "success",
        });
      }
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    const getInitialDataForEdit = async () => {
      setLoading(true);
      try {
        const { status, data: user } = await fetchGetUser({ id: userId });
        if (status === HTTP_CODES_ENUM.OK) {
          reset({
            email: user?.email ?? "",
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            role: {
              id: Number(user?.role?.id),
            },
            photo: user?.photo,
          });
        }
      } finally {
        setLoading(false);
      }
    };
    getInitialDataForEdit();
  }, [userId, reset, fetchGetUser, setLoading]);

  const roleOptions = [
    {
      value: RoleEnum.ADMIN.toString(),
      label: t(`admin-panel-users-edit:inputs.role.options.${RoleEnum.ADMIN}`),
    },
    {
      value: RoleEnum.USER.toString(),
      label: t(`admin-panel-users-edit:inputs.role.options.${RoleEnum.USER}`),
    },
  ];

  return (
    <FormProvider {...methods}>
      <Container size="xs">
        <form onSubmit={onSubmit}>
          <Stack gap="md" mb="md" mt="md">
            <Title order={6}>{t("admin-panel-users-edit:title1")}</Title>
            <FormAvatarInput<EditUserFormData> name="photo" testId="photo" />
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label={t("admin-panel-users-edit:inputs.email.label")}
                  error={fieldState.error?.message}
                  data-testid="email"
                />
              )}
            />
            <Controller
              name="firstName"
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label={t("admin-panel-users-edit:inputs.firstName.label")}
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
                  label={t("admin-panel-users-edit:inputs.lastName.label")}
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
                  label={t("admin-panel-users-edit:inputs.role.label")}
                  data={roleOptions}
                  error={fieldState.error?.message}
                  data-testid="role"
                  value={field.value?.id.toString()}
                  onChange={(value) => field.onChange({ id: Number(value) })}
                />
              )}
            />
            <Box>
              <EditUserFormActions />
              <Box ml="xs" style={{ display: "inline-block" }}>
                <Button
                  variant="outlined"
                  color="gray"
                  component={Link}
                  href="/admin-panel/users"
                >
                  {t("admin-panel-users-edit:actions.cancel")}
                </Button>
              </Box>
            </Box>
          </Stack>
        </form>
      </Container>
    </FormProvider>
  );
}

function FormChangePasswordUser() {
  const params = useParams<{ id: string }>();
  const userId = params.id;
  const fetchPatchUser = usePatchUserService();
  const { t } = useTranslation("admin-panel-users-edit");
  const validationSchema = useValidationChangePasswordSchema();
  const { enqueueSnackbar } = useSnackbar();
  const { setLoading } = useGlobalLoading();

  const methods = useForm<ChangeUserPasswordFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const { handleSubmit, setError, reset, control } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true);
    try {
      const { data, status } = await fetchPatchUser({
        id: userId,
        data: formData,
      });
      if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
        (
          Object.keys(data.errors) as Array<keyof ChangeUserPasswordFormData>
        ).forEach((key) => {
          setError(key, {
            type: "manual",
            message: t(
              `admin-panel-users-edit:inputs.${key}.validation.server.${data.errors[key]}`
            ),
          });
        });
        return;
      }
      if (status === HTTP_CODES_ENUM.OK) {
        reset();
        enqueueSnackbar(t("admin-panel-users-edit:alerts.password.success"), {
          variant: "success",
        });
      }
    } finally {
      setLoading(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <Container size="xs">
        <form onSubmit={onSubmit}>
          <Stack gap="md" mb="md" mt="md">
            <Title order={6}>{t("admin-panel-users-edit:title2")}</Title>
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  type="password"
                  label={t("admin-panel-users-edit:inputs.password.label")}
                  error={fieldState.error?.message}
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
                    "admin-panel-users-edit:inputs.passwordConfirmation.label"
                  )}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Box>
              <ChangePasswordUserFormActions />
              <Box ml="xs" style={{ display: "inline-block" }}>
                <Button
                  variant="outlined"
                  color="gray"
                  component={Link}
                  href="/admin-panel/users"
                >
                  {t("admin-panel-users-edit:actions.cancel")}
                </Button>
              </Box>
            </Box>
          </Stack>
        </form>
      </Container>
    </FormProvider>
  );
}

function EditUser() {
  return (
    <RouteGuard roles={[RoleEnum.ADMIN]}>
      <FormEditUser />
      <FormChangePasswordUser />
    </RouteGuard>
  );
}

export default EditUser;
