"use client";
import { useTranslation } from "@/services/i18n/client";
import {
  Container,
  Anchor,
  Flex,
  Box,
  Stack,
  Title,
  Text,
} from "@mantine/core";
import { Trans } from "react-i18next/TransWithoutContext";

export default function HomeMantine() {
  const { t } = useTranslation("home");
  return (
    <Container size="md">
      <Flex direction="column" h="90vh" justify="space-between" pt="md">
        <Stack gap="md">
          <Title order={3} data-testid="home-title" mb="md">
            {t("title")}
          </Title>
          <Text>
            <Trans
              i18nKey={`description`}
              t={t}
              components={[
                <Anchor
                  key="1"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/brocoders/extensive-react-boilerplate/blob/main/docs/README.md"
                >
                  {}
                </Anchor>,
              ]}
            />
          </Text>
        </Stack>
        <Box ta="center" pb="md">
          <Anchor href="/privacy-policy">Privacy Policy</Anchor>
        </Box>
      </Flex>
    </Container>
  );
}
