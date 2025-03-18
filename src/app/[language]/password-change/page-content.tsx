"use client";
import { Button } from "@/components/mantine/core/Button";
import withPageRequiredGuest from "@/services/auth/with-page-required-guest";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import { useAuthResetPasswordService } from "@/services/api/services/auth";
import { Container } from "@/components/mantine/layout/Container";
import { Stack, Alert } from "@mantine/core";
import { Typography } from "@/components/mantine/core/Typography";
import { FormTextInput } from "@/components/mantine/form/TextInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "@/hooks/use-snackbar";
import { useRouter } from "next/navigation";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { useEffect, useMemo, useState } from "react";
import { IconAlertCircle } from "@tabler/icons-react";

type PasswordChangeFormData = {
  password: string;
  passwordConfirmation: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("password-change");
  return yup.object().shape({
    password: yup
      .string()
      .min(6, t("password-change:inputs.password.validation.min"))
      .required(t("password-change:inputs.password.validation.required")),
    passwordConfirmation: yup
      .string()
      .oneOf(
        [yup.ref("password")],
        t("password-change:inputs.passwordConfirmation.validation.match")
      )
      .required(
        t("password-change:inputs.passwordConfirmation.validation.required")
      ),
  });
};

function FormActions() {
  const { t } = useTranslation("password-change");
  const { isSubmitting } = useFormState();
  return (
    <Button type="submit" disabled={isSubmitting} data-testid="set-password">
      {t("password-change:actions.submit")}
    </Button>
  );
}

function ExpiresAlert() {
  const { t } = useTranslation("password-change");
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const expires = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get("expires"));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);
      if (expires < now) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expires]);

  const isExpired = expires < currentTime;

  return isExpired ? (
    <Alert
      icon={<IconAlertCircle size={16} />}
      title={t("password-change:alerts.expired")}
      color="red"
      data-testid="reset-link-expired-alert"
    >
      {t("password-change:alerts.expired")}
    </Alert>
  ) : null;
}

function Form() {
  const { enqueueSnackbar } = useSnackbar();
  const fetchAuthResetPassword = useAuthResetPasswordService();
  const { t } = useTranslation("password-change");
  const validationSchema = useValidationSchema();
  const router = useRouter();

  const methods = useForm<PasswordChangeFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const params = new URLSearchParams(window.location.search);
    const hash = params.get("hash");
    if (!hash) return;

    const { data, status } = await fetchAuthResetPassword({
      password: formData.password,
      hash,
    });

    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof PasswordChangeFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(
              `password-change:inputs.${key}.validation.server.${data.errors[key]}`
            ),
          });
        }
      );
      return;
    }

    if (status === HTTP_CODES_ENUM.NO_CONTENT) {
      enqueueSnackbar(t("password-change:alerts.success"), {
        variant: "success",
      });
      router.replace("/sign-in");
    }
  });

  return (
    <FormProvider {...methods}>
      <Container size="xs">
        <form onSubmit={onSubmit}>
          <Stack gap="md" mb="md" mt="lg">
            <Typography variant="h6">{t("password-change:title")}</Typography>
            <ExpiresAlert />
            <FormTextInput<PasswordChangeFormData>
              name="password"
              label={t("password-change:inputs.password.label")}
              type="password"
              testId="password"
            />
            <FormTextInput<PasswordChangeFormData>
              name="passwordConfirmation"
              label={t("password-change:inputs.passwordConfirmation.label")}
              type="password"
              testId="password-confirmation"
            />
            <FormActions />
          </Stack>
        </form>
      </Container>
    </FormProvider>
  );
}

function PasswordChange() {
  return <Form />;
}

export default withPageRequiredGuest(PasswordChange);
