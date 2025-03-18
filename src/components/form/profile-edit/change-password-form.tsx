import { useForm, FormProvider } from "react-hook-form";
import { useAuthPatchMeService } from "@/services/api/services/auth";
import { Container, Stack, Title, Box } from "@mantine/core";
import { FormTextInput } from "@/components/mantine/form/TextInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "@/hooks/use-snackbar";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { FormActions } from "./form-actions";
export type EditProfileChangePasswordFormData = {
  oldPassword: string;
  password: string;
  passwordConfirmation: string;
};
const useValidationChangePasswordSchema = () => {
  const { t } = useTranslation("profile");
  return yup.object().shape({
    oldPassword: yup
      .string()
      .min(6, t("profile:inputs.password.validation.min"))
      .required(t("profile:inputs.password.validation.required")),
    password: yup
      .string()
      .min(6, t("profile:inputs.password.validation.min"))
      .required(t("profile:inputs.password.validation.required")),
    passwordConfirmation: yup
      .string()
      .oneOf(
        [yup.ref("password")],
        t("profile:inputs.passwordConfirmation.validation.match")
      )
      .required(t("profile:inputs.passwordConfirmation.validation.required")),
  });
};
export function ChangePasswordForm() {
  const fetchAuthPatchMe = useAuthPatchMeService();
  const { t } = useTranslation("profile");
  const validationSchema = useValidationChangePasswordSchema();
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm<EditProfileChangePasswordFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      passwordConfirmation: "",
    },
  });
  const { handleSubmit, setError, reset } = methods;
  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchAuthPatchMe({
      password: formData.password,
      oldPassword: formData.oldPassword,
    });
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      Object.keys(data.errors).forEach((key) => {
        setError(key as keyof EditProfileChangePasswordFormData, {
          type: "manual",
          message: t(
            `profile:inputs.${key}.validation.server.${data.errors[key]}`
          ),
        });
      });
      return;
    }
    if (status === HTTP_CODES_ENUM.OK) {
      reset();
      enqueueSnackbar(t("profile:alerts.password.success"), {
        variant: "success",
      });
    }
  });
  return (
    <FormProvider {...methods}>
      <Container size="xs">
        <form onSubmit={onSubmit}>
          <Stack gap="md" py="md">
            <Title order={5}>{t("profile:title3")}</Title>
            <FormTextInput<EditProfileChangePasswordFormData>
              name="oldPassword"
              label={t("profile:inputs.oldPassword.label")}
              type="password"
              testId="old-password"
            />
            <FormTextInput<EditProfileChangePasswordFormData>
              name="password"
              label={t("profile:inputs.password.label")}
              type="password"
              testId="new-password"
            />
            <FormTextInput<EditProfileChangePasswordFormData>
              name="passwordConfirmation"
              label={t("profile:inputs.passwordConfirmation.label")}
              type="password"
              testId="password-confirmation"
            />
            <Box>
              <FormActions
                submitLabel={t("profile:actions.submit")}
                cancelLabel={t("profile:actions.cancel")}
                testId="save-password"
                cancelTestId="cancel-edit-password"
                cancelHref="/profile"
              />
            </Box>
          </Stack>
        </form>
      </Container>
    </FormProvider>
  );
}
