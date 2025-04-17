"use client";
import { useTranslation } from "@/services/i18n/client";
import {
  Container,
  Stack,
  Box,
  Title,
  Text,
  Space,
  createStyles,
} from "@mantine/core";
import { useEffect } from "react";
import { Trans } from "react-i18next/TransWithoutContext";

// Create custom styles to hide the "Powered by Viator" elements
const useStyles = createStyles(() => ({
  hidePoweredBy: {
    // This targets the specific div class that Viator uses
    '& div[class*="poweredByViator"]': {
      display: "none !important",
    },
  },
}));

export default function HomeMantine() {
  const { t } = useTranslation("home");
  const { classes } = useStyles();

  // Effect to load the Viator script
  useEffect(() => {
    // Create script element
    const script = document.createElement("script");
    script.src = "https://www.viator.com/orion/partner/widget.js";
    script.async = true;

    // Append to document
    document.body.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <Container size="xl" className={classes.hidePoweredBy}>
      <Stack gap="xl" py="xl">
        <Title order={2} data-testid="home-title">
          {t("title")}
        </Title>

        <Text>
          <Trans i18nKey={`description`} t={t} />
        </Text>

        <Space h="md" />

        {/* Viator Widget 1 */}
        <Box
          className="viator-widget-container"
          style={{ width: "100%" }}
          data-vi-partner-id="P00245916"
          data-vi-widget-ref="W-fb2f650c-8526-4f1d-a790-9e348f4e4852"
        />

        <Space h="md" />

        {/* Viator Widget 2 */}
        <Box
          className="viator-widget-container"
          style={{ width: "100%" }}
          data-vi-partner-id="P00245916"
          data-vi-widget-ref="W-80eaccfc-0796-46be-97c3-a436b63dccc0"
        />

        <Space h="md" />

        {/* Viator Widget 3 */}
        <Box
          className="viator-widget-container"
          style={{ width: "100%" }}
          data-vi-partner-id="P00245916"
          data-vi-widget-ref="W-4404ebb4-a70c-47b7-ac87-31d377f81e37"
        />

        <Space h="xl" />
      </Stack>
    </Container>
  );
}
