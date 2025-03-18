"use client";
import { Button } from "@/components/mantine/core/Button";
import withPageRequiredGuest from "@/services/auth/with-page-required-guest";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import { useAuthForgotPasswordService } from "@/services/api/services/auth";
import { Container } from "@/components/mantine/layout/Container";
import { Stack } from "@mantine/core";
import { Typography } from "@/components/mantine/core/Typography";
import { FormTextInput } from "@/components/mantine/form/TextInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/components/mantine/feedback/notification-service";

type ForgotPasswordFormData = {
  email: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("forgot-password");
  return yup.object().shape({
    email: yup
      .string()
      .email(t("forgot-password:inputs.email.validation.invalid"))
      .required(t("forgot-password:inputs.email.validation.required")),
  });
};

function FormActions() {
  const { t } = useTranslation("forgot-password");
  const { isSubmitting } = useFormState();
  return (
    <Button type="submit" disabled={isSubmitting} data-testid="send-email">
      {t("forgot-password:actions.submit")}
    </Button>
  );
}

function Form() {
  const { enqueueSnackbar } = useSnackbar();
  const fetchAuthForgotPassword = useAuthForgotPasswordService();
  const { t } = useTranslation("forgot-password");
  const validationSchema = useValidationSchema();

  const methods = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchAuthForgotPassword(formData);
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof ForgotPasswordFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(
              `forgot-password:inputs.${key}.validation.server.${data.errors[key]}`
            ),
          });
        }
      );
      return;
    }
    if (status === HTTP_CODES_ENUM.NO_CONTENT) {
      enqueueSnackbar(t("forgot-password:alerts.success"), {
        variant: "success",
      });
    }
  });

  return (
    <FormProvider {...methods}>
      <Container size="xs">
        <form onSubmit={onSubmit}>
          <Stack gap="md" mb="md" mt="lg">
            <Typography variant="h6">{t("forgot-password:title")}</Typography>
            <FormTextInput<ForgotPasswordFormData>
              name="email"
              label={t("forgot-password:inputs.email.label")}
              type="email"
              testId="email"
            />
            <FormActions />
          </Stack>
        </form>
      </Container>
    </FormProvider>
  );
}

function ForgotPassword() {
  return <Form />;
}

export default withPageRequiredGuest(ForgotPassword);
