import {
  Table as MantineTable,
  TableProps as MantineTableProps,
} from "@mantine/core";
import { ReactNode } from "react";
export interface TableProps extends MantineTableProps {
  size?: "small" | "medium";
  stickyHeader?: boolean;
}
export function Table({
  children,
  size = "medium",
  stickyHeader = false,
  ...props
}: TableProps) {
  return (
    <MantineTable
      withTableBorder
      withColumnBorders
      stickyHeader={stickyHeader}
      styles={{
        table: {
          fontSize:
            size === "small"
              ? "var(--mantine-font-size-xs)"
              : "var(--mantine-font-size-sm)",
        },
      }}
      {...props}
    >
      {children}
    </MantineTable>
  );
}
// Also export table subcomponents for consistency with MUI
export function TableHead(props: { children: ReactNode }) {
  return <thead>{props.children}</thead>;
}
export function TableBody(props: { children: ReactNode }) {
  return <tbody>{props.children}</tbody>;
}
export function TableRow(props: { children: ReactNode }) {
  return <tr>{props.children}</tr>;
}
export function TableCell(props: { children: ReactNode }) {
  return <td>{props.children}</td>;
}
export function TableHeaderCell(props: { children: ReactNode }) {
  return <th>{props.children}</th>;
}
