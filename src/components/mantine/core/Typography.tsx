import {
  Text as MantineText,
  Title as MantineTitle,
  TextProps,
  TitleProps,
} from "@mantine/core";
import { ReactNode } from "react";
type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2";
interface BaseTypographyProps {
  variant?: TypographyVariant;
  children: ReactNode;
  gutterBottom?: boolean;
}
export function Typography({
  variant = "body1",
  children,
  gutterBottom,
  ...props
}: BaseTypographyProps & (TextProps | TitleProps)) {
  // Map MUI Typography variants to Mantine components and props
  const mb = gutterBottom ? "md" : undefined;
  if (variant?.startsWith("h")) {
    const order = Number(variant.charAt(1)) as 1 | 2 | 3 | 4 | 5 | 6;
    return (
      <MantineTitle order={order} mb={mb} {...(props as TitleProps)}>
        {children}
      </MantineTitle>
    );
  }
  const size =
    variant === "body1"
      ? "md"
      : variant === "body2"
        ? "sm"
        : variant === "subtitle1"
          ? "lg"
          : "md";
  return (
    <MantineText size={size} mb={mb} {...(props as TextProps)}>
      {children}
    </MantineText>
  );
}
// Export Text component from Mantine directly
export { MantineText as Text };
