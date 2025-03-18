import {
  Paper as MantinePaper,
  PaperProps as MantinePaperProps,
} from "@mantine/core";
import { ReactNode } from "react";
export interface PaperProps extends Omit<MantinePaperProps, "children"> {
  elevation?: number;
  children?: ReactNode;
}
export function Paper({
  children,
  elevation = 1,
  shadow,
  ...props
}: PaperProps) {
  // Map MUI elevation to Mantine shadow
  const shadowMap: Record<number, string> = {
    0: "none",
    1: "xs",
    2: "sm",
    3: "md",
    4: "lg",
    5: "xl",
  };
  const mappedShadow = shadow || shadowMap[Math.min(elevation, 5)];
  return (
    <MantinePaper shadow={mappedShadow} p="md" {...props}>
      {children}
    </MantinePaper>
  );
}
