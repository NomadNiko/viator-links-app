"use client";
import { ForwardedRef, forwardRef, ReactNode } from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { Radio, Stack, Text } from "@mantine/core";

type RadioInputProps<T> = {
  label: string;
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  testId?: string;
  keyValue: keyof T;
  options: T[];
  keyExtractor: (option: T) => string;
  renderOption: (option: T) => ReactNode;
};

function RadioInputRaw<T>(
  props: RadioInputProps<T> & {
    name: string;
    value: T | undefined | null;
    onChange: (value: T) => void;
    onBlur: () => void;
  },
  ref?: ForwardedRef<HTMLDivElement | null>
) {
  const value = props.value;

  return (
    <div ref={ref} data-testid={props.testId}>
      <Text fw={500} data-testid={`${props.testId}-label`}>
        {props.label}
      </Text>
      <Radio.Group
        value={value?.[props.keyValue]?.toString()}
        onChange={(val) => {
          const selectedOption = props.options.find(
            (option) => option[props.keyValue]?.toString() === val
          );
          if (selectedOption) {
            props.onChange(selectedOption);
          }
        }}
      >
        <Stack gap="xs" mt="xs">
          {props.options.map((option) => (
            <Radio
              key={props.keyExtractor(option)}
              value={option[props.keyValue]?.toString()}
              label={props.renderOption(option)}
              data-testid={`${props.testId}-${props.keyExtractor(option)}`}
              disabled={props.disabled}
            />
          ))}
        </Stack>
      </Radio.Group>
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
    </div>
  );
}

const RadioInput = forwardRef(RadioInputRaw) as never as <T>(
  props: RadioInputProps<T> & {
    name: string;
    value: T | undefined | null;
    onChange: (value: T) => void;
    onBlur: () => void;
  } & { ref?: ForwardedRef<HTMLDivElement | null> }
) => ReturnType<typeof RadioInputRaw>;

function FormRadioInput<
  TFieldValues extends FieldValues = FieldValues,
  T = unknown,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: RadioInputProps<T> &
    Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue">
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <RadioInput<T>
          {...field}
          label={props.label}
          autoFocus={props.autoFocus}
          error={fieldState.error?.message}
          disabled={props.disabled}
          readOnly={props.readOnly}
          testId={props.testId}
          options={props.options}
          keyValue={props.keyValue}
          keyExtractor={props.keyExtractor}
          renderOption={props.renderOption}
        />
      )}
    />
  );
}

export default FormRadioInput;
