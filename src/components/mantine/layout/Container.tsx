import {
  Container as MantineContainer,
  ContainerProps as MantineContainerProps,
} from "@mantine/core";
export interface ContainerProps extends MantineContainerProps {
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}
export function Container({
  children,
  maxWidth = "lg",
  ...props
}: ContainerProps) {
  // Map MUI container sizes to Mantine sizes
  const sizeMap = {
    xs: "xs", // 576px
    sm: "sm", // 768px
    md: "md", // 992px
    lg: "lg", // 1200px
    xl: "xl", // 1400px
  };
  const size = sizeMap[maxWidth] || "lg";
  return (
    <MantineContainer size={size} {...props}>
      {children}
    </MantineContainer>
  );
}
