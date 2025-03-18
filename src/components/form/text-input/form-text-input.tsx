"use client";
import { TextInput, PasswordInput } from "@mantine/core";
import { ChangeEvent, forwardRef } from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
type TextInputProps = {
  label: string;
  type?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  testId?: string;
  autoComplete?: string;
  multiline?: boolean;
  minRows?: number;
  maxRows?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  placeholder?: string;
};
type CustomInputProps = TextInputProps & {
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement> | string) => void;
  onBlur: () => void;
};
const CustomTextInput = forwardRef<HTMLInputElement, CustomInputProps>(
  function CustomTextInput(props, ref) {
    // For PasswordInput, we need to convert string to event handler
    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
      props.onChange(event);
    };
    if (props.type === "password") {
      return (
        <PasswordInput
          ref={ref}
          name={props.name}
          size={props.size}
          value={props.value}
          onChange={handlePasswordChange}
          onBlur={props.onBlur}
          label={props.label}
          autoFocus={props.autoFocus}
          placeholder={props.placeholder}
          error={props.error}
          data-testid={props.testId}
          disabled={props.disabled}
          readOnly={props.readOnly}
          autoComplete={props.autoComplete}
        />
      );
    }
    return (
      <TextInput
        ref={ref}
        name={props.name}
        size={props.size}
        value={props.value}
        onChange={handlePasswordChange}
        onBlur={props.onBlur}
        label={props.label}
        autoFocus={props.autoFocus}
        type={props.type}
        placeholder={props.placeholder}
        error={props.error}
        data-testid={props.testId}
        disabled={props.disabled}
        readOnly={props.readOnly}
        autoComplete={props.autoComplete}
      />
    );
  }
);
function FormTextInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue"> &
    TextInputProps
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <CustomTextInput
          {...field}
          label={props.label}
          autoFocus={props.autoFocus}
          type={props.type}
          error={fieldState.error?.message}
          disabled={props.disabled}
          readOnly={props.readOnly}
          testId={props.testId}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete}
          size={props.size}
        />
      )}
    />
  );
}
export default FormTextInput;
