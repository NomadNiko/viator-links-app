"use client";
import { ForwardedRef, forwardRef } from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { MultiSelect, Text, Box } from "@mantine/core";
type MultipleSelectInputProps<T extends object> = {
  label: string;
  type?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  testId?: string;
  keyValue: keyof T;
  options: T[];
  renderValue: (option: T[]) => React.ReactNode;
  renderOption: (option: T) => React.ReactNode;
};
function MultipleSelectInputRaw<T extends object>(
  props: MultipleSelectInputProps<T> & {
    name: string;
    value: T[] | undefined | null;
    onChange: (value: T[]) => void;
    onBlur: () => void;
  },
  ref?: ForwardedRef<HTMLInputElement>
) {
  const data = props.options.map((option) => ({
    value: String(option[props.keyValue]),
    label: props.renderOption(option) as string,
  }));
  const value = props.value?.map((item) => String(item[props.keyValue])) || [];
  const handleChange = (selectedValues: string[]) => {
    const newValue = selectedValues
      .map((val) =>
        props.options.find((opt) => String(opt[props.keyValue]) === val)
      )
      .filter((opt): opt is T => opt !== undefined);
    props.onChange(newValue);
  };
  return (
    <Box>
      <MultiSelect
        ref={ref}
        data={data}
        value={value}
        onChange={handleChange}
        onBlur={props.onBlur}
        label={props.label}
        disabled={props.disabled}
        readOnly={props.readOnly}
        error={props.error}
        data-testid={props.testId}
      />
      {!!props.error && (
        <Text color="red" size="sm" data-testid={`${props.testId}-error`}>
          {props.error}
        </Text>
      )}
    </Box>
  );
}
const MultipleSelectInput = forwardRef(MultipleSelectInputRaw) as never as <
  T extends object,
>(
  props: MultipleSelectInputProps<T> & {
    name: string;
    value: T[] | undefined | null;
    onChange: (value: T[]) => void;
    onBlur: () => void;
  } & { ref?: ForwardedRef<HTMLInputElement> }
) => ReturnType<typeof MultipleSelectInputRaw>;
function FormMultipleSelectInput<
  TFieldValues extends FieldValues = FieldValues,
  T extends object = object,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: MultipleSelectInputProps<T> &
    Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue">
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <MultipleSelectInput<T>
          {...field}
          label={props.label}
          autoFocus={props.autoFocus}
          type={props.type}
          error={fieldState.error?.message}
          disabled={props.disabled}
          readOnly={props.readOnly}
          testId={props.testId}
          options={props.options}
          renderOption={props.renderOption}
          renderValue={props.renderValue}
          keyValue={props.keyValue}
        />
      )}
    />
  );
}
export default FormMultipleSelectInput;
