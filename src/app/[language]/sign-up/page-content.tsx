"use client";
import { Button } from "@/components/mantine/core/Button";
import withPageRequiredGuest from "@/services/auth/with-page-required-guest";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import {
  useAuthLoginService,
  useAuthSignUpService,
} from "@/services/api/services/auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import useAuthTokens from "@/services/auth/use-auth-tokens";
import { Container } from "@mantine/core";
import { Stack, Box, Divider } from "@mantine/core";
import { Typography } from "@/components/mantine/core/Typography";
import { FormTextInput } from "@/components/mantine/form/TextInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "@/components/link";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import SocialAuth from "@/services/social-auth/social-auth";
import { isGoogleAuthEnabled } from "@/services/social-auth/google/google-config";

type TPolicy = {
  id: string;
  name: string;
};

type SignUpFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  policy: TPolicy[];
};

const useValidationSchema = () => {
  const { t } = useTranslation("sign-up");
  return yup.object().shape({
    firstName: yup
      .string()
      .required(t("sign-up:inputs.firstName.validation.required")),
    lastName: yup
      .string()
      .required(t("sign-up:inputs.lastName.validation.required")),
    email: yup
      .string()
      .email(t("sign-up:inputs.email.validation.invalid"))
      .required(t("sign-up:inputs.email.validation.required")),
    password: yup
      .string()
      .min(6, t("sign-up:inputs.password.validation.min"))
      .required(t("sign-up:inputs.password.validation.required")),
    policy: yup
      .array()
      .min(1, t("sign-up:inputs.policy.validation.required"))
      .required(),
  });
};

function FormActions() {
  const { t } = useTranslation("sign-up");
  const { isSubmitting } = useFormState();
  return (
    <Button type="submit" disabled={isSubmitting} data-testid="sign-up-submit">
      {t("sign-up:actions.submit")}
    </Button>
  );
}

function Form() {
  const { setUser } = useAuthActions();
  const { setTokensInfo } = useAuthTokens();
  const fetchAuthLogin = useAuthLoginService();
  const fetchAuthSignUp = useAuthSignUpService();
  const { t } = useTranslation("sign-up");
  const validationSchema = useValidationSchema();
  const methods = useForm<SignUpFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      policy: [],
    },
  });
  const { handleSubmit, setError } = methods;
  const onSubmit = handleSubmit(async (formData) => {
    const { data: dataSignUp, status: statusSignUp } =
      await fetchAuthSignUp(formData);
    if (statusSignUp === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(dataSignUp.errors) as Array<keyof SignUpFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(
              `sign-up:inputs.${key}.validation.server.${dataSignUp.errors[key]}`
            ),
          });
        }
      );
      return;
    }
    const { data: dataSignIn, status: statusSignIn } = await fetchAuthLogin({
      email: formData.email,
      password: formData.password,
    });
    if (statusSignIn === HTTP_CODES_ENUM.OK) {
      setTokensInfo({
        token: dataSignIn.token,
        refreshToken: dataSignIn.refreshToken,
        tokenExpires: dataSignIn.tokenExpires,
      });
      setUser(dataSignIn.user);
    }
  });

  return (
    <FormProvider {...methods}>
      <Container size="xs">
        <form onSubmit={onSubmit}>
          <Stack gap="md" mb="md" mt="md">
            <Typography variant="h6">{t("sign-up:title")}</Typography>
            <FormTextInput<SignUpFormData>
              name="firstName"
              label={t("sign-up:inputs.firstName.label")}
              type="text"
              autoFocus
              testId="first-name"
            />
            <FormTextInput<SignUpFormData>
              name="lastName"
              label={t("sign-up:inputs.lastName.label")}
              type="text"
              testId="last-name"
            />
            <FormTextInput<SignUpFormData>
              name="email"
              label={t("sign-up:inputs.email.label")}
              type="email"
              testId="email"
            />
            <FormTextInput<SignUpFormData>
              name="password"
              label={t("sign-up:inputs.password.label")}
              type="password"
              testId="password"
            />
            <Box>
              <FormActions />
              <Box ml="xs" style={{ display: "inline-block" }}>
                <Button
                  variant="outlined"
                  color="gray"
                  component={Link}
                  data-testid="login"
                  href="/sign-in"
                >
                  {t("sign-up:actions.accountAlreadyExists")}
                </Button>
              </Box>
            </Box>
            {[isGoogleAuthEnabled].some(Boolean) && (
              <>
                <Divider label={t("sign-up:or")} labelPosition="center" />
                <SocialAuth />
              </>
            )}
          </Stack>
        </form>
      </Container>
    </FormProvider>
  );
}

function SignUp() {
  return <Form />;
}

export default withPageRequiredGuest(SignUp);
