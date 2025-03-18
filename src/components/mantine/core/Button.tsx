import {
  Button as MantineButton,
  ButtonProps as MantineButtonProps,
  createPolymorphicComponent,
} from "@mantine/core";
import {
  forwardRef,
  ComponentPropsWithRef,
  MouseEvent,
  ReactNode,
} from "react";
import Link from "@/components/link";

// Define props for our button component
export interface ButtonProps extends Omit<MantineButtonProps, "type"> {
  type?: ComponentPropsWithRef<"button">["type"];
  href?: string;
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  autoFocus?: boolean;
}

// Create the base button component
const _Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ type, href, children, ...rest }, ref) => {
    // If href is provided, use Link component
    if (href) {
      return (
        <MantineButton<typeof Link> component={Link} href={href} {...rest}>
          {children}
        </MantineButton>
      );
    }

    // Regular button
    return (
      <MantineButton ref={ref} type={type} {...rest}>
        {children}
      </MantineButton>
    );
  }
);

_Button.displayName = "Button";

// Export a polymorphic component
export const Button = createPolymorphicComponent<"button", ButtonProps>(
  _Button
);
