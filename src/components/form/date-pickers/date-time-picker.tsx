import { DateTimePicker } from "@mantine/dates";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { forwardRef } from "react";
type ValueDateType = Date | null | undefined;
type DateTimePickerFieldProps = {
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  autoFocus?: boolean;
  label: string;
  testId?: string;
  error?: string;
  defaultValue?: ValueDateType;
  placeholder?: string;
  clearable?: boolean;
};
const CustomDateTimePicker = forwardRef(
  (
    props: DateTimePickerFieldProps & {
      value: ValueDateType;
      onChange: (value: ValueDateType) => void;
      onBlur: () => void;
    }
  ) => {
    return (
      <DateTimePicker
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        disabled={props.disabled}
        placeholder={props.placeholder}
        clearable={props.clearable}
        minDate={props.minDate}
        maxDate={props.maxDate}
        label={props.label}
        error={props.error}
        data-testid={props.testId}
      />
    );
  }
);
CustomDateTimePicker.displayName = "CustomDateTimePicker";
function FormDateTimePickerInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: DateTimePickerFieldProps &
    Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue">
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <CustomDateTimePicker
          {...field}
          defaultValue={props.defaultValue}
          autoFocus={props.autoFocus}
          label={props.label}
          disabled={props.disabled}
          testId={props.testId}
          minDate={props.minDate}
          maxDate={props.maxDate}
          placeholder={props.placeholder}
          clearable={props.clearable}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
export default FormDateTimePickerInput;
