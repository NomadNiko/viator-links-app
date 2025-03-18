"use client";
import { ForwardedRef, forwardRef } from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { Box, Checkbox, Text } from "@mantine/core";
export type CheckboxBooleanInputProps = {
  label: string;
  type?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  testId?: string;
};
function CheckboxBooleanInputRaw(
  props: CheckboxBooleanInputProps & {
    name: string;
    value: boolean | null;
    onChange: (value: boolean) => void;
    onBlur: () => void;
  },
  ref?: ForwardedRef<HTMLDivElement | null>
) {
  const value = props.value ?? false;
  return (
    <Box ref={ref} data-testid={props.testId}>
      <Checkbox
        checked={value}
        onChange={(event) => props.onChange(event.currentTarget.checked)}
        onBlur={props.onBlur}
        name={props.name}
        label={props.label}
        disabled={props.disabled || props.readOnly}
        data-testid={`${props.testId}-checkbox`}
      />
      {!!props.error && (
        <Text
          color="red"
          size="sm"
          mt="xs"
          data-testid={`${props.testId}-error`}
        >
          {props.error}
        </Text>
      )}
    </Box>
  );
}
const CheckboxBooleanInput = forwardRef(CheckboxBooleanInputRaw) as never as (
  props: CheckboxBooleanInputProps & {
    name: string;
    value: boolean | null;
    onChange: (value: boolean) => void;
    onBlur: () => void;
  } & { ref?: ForwardedRef<HTMLDivElement | null> }
) => ReturnType<typeof CheckboxBooleanInputRaw>;
function FormCheckboxBooleanInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: CheckboxBooleanInputProps &
    Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue">
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <CheckboxBooleanInput
          {...field}
          label={props.label}
          autoFocus={props.autoFocus}
          type={props.type}
          error={fieldState.error?.message}
          disabled={props.disabled}
          readOnly={props.readOnly}
          testId={props.testId}
        />
      )}
    />
  );
}
export default FormCheckboxBooleanInput;
