import { Grid as MantineGrid, SimpleGrid } from "@mantine/core";
import { ReactNode } from "react";
// Simple Grid components that provide functionality similar to MUI
// but follow Mantine's patterns
// Grid container component
export function Grid({
  children,
  spacing = 2,
  ...props
}: {
  children: ReactNode;
  spacing?: number;
  [key: string]: unknown;
}) {
  const gutter = spacing * 8; // Convert to pixel spacing
  return (
    <MantineGrid gutter={gutter} {...props}>
      {children}
    </MantineGrid>
  );
}
// Grid item component
export function GridItem({
  children,
  xs,
  sm,
  md,
  lg,
  xl,
  ...props
}: {
  children: ReactNode;
  xs?: number | "auto";
  sm?: number | "auto";
  md?: number | "auto";
  lg?: number | "auto";
  xl?: number | "auto";
  [key: string]: unknown;
}) {
  // Determine the most specific span value provided
  let span = xs;
  if (sm !== undefined) span = sm;
  if (md !== undefined) span = md;
  if (lg !== undefined) span = lg;
  if (xl !== undefined) span = xl;
  // Convert 'auto' to Mantine's auto span
  const finalSpan = span === "auto" ? "auto" : span;
  return (
    <MantineGrid.Col span={finalSpan} {...props}>
      {children}
    </MantineGrid.Col>
  );
}
// Simplified equal-width grid similar to MUI's Grid container with multiple items
export function SimpleGridLayout({
  children,
  spacing = 2,
  columns = 12,
  ...props
}: {
  children: ReactNode;
  spacing?: number;
  columns?: number;
  [key: string]: unknown;
}) {
  return (
    <SimpleGrid cols={columns} spacing={spacing * 8} {...props}>
      {children}
    </SimpleGrid>
  );
}
