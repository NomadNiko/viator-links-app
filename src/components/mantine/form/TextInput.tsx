import { TextInput as MantineTextInput } from "@mantine/core";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
export type FormTextInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  label: string;
  type?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  testId?: string;
  autoComplete?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
} & Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue">;
export function FormTextInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormTextInputProps<TFieldValues, TName>) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <MantineTextInput
          {...field}
          label={props.label}
          type={props.type}
          autoFocus={props.autoFocus}
          error={fieldState.error?.message}
          disabled={props.disabled}
          data-testid={props.testId}
          autoComplete={props.autoComplete}
          size={props.size}
        />
      )}
    />
  );
}
