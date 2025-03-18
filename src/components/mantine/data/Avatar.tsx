import {
  Avatar as MantineAvatar,
  AvatarProps as MantineAvatarProps,
} from "@mantine/core";
import { ReactNode } from "react";
export interface AvatarProps extends Omit<MantineAvatarProps, "src"> {
  alt?: string;
  src?: string;
  children?: ReactNode;
  variant?: "circular" | "rounded" | "square";
}
export function Avatar({
  alt,
  src,
  children,
  variant = "circular",
  ...props
}: AvatarProps) {
  // Map MUI variants to Mantine
  const radius =
    variant === "circular" ? "50%" : variant === "rounded" ? "md" : 0;
  return (
    <MantineAvatar src={src} alt={alt} radius={radius} {...props}>
      {children}
    </MantineAvatar>
  );
}
