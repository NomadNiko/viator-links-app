import { DatePicker as MantineDatePicker } from "@mantine/dates";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { Box, Text } from "@mantine/core";
export type FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  label: string;
  testId?: string;
  minDate?: Date;
  maxDate?: Date;
} & Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue">;
export function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormDatePickerProps<TFieldValues, TName>) {
  const { label, testId, minDate, maxDate } = props;
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <Box>
          <Text size="sm" mb={5}>
            {label}
          </Text>
          <MantineDatePicker
            minDate={minDate}
            maxDate={maxDate}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            data-testid={testId}
          />
          {fieldState.error && (
            <Text color="red" size="xs" mt={5}>
              {fieldState.error.message}
            </Text>
          )}
        </Box>
      )}
    />
  );
}
