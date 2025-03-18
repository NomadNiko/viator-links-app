import { DatePickerInput } from "@mantine/dates";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { ForwardedRef, forwardRef } from "react";
type ValueDateType = Date | null | undefined;
type DatePickerFieldProps = {
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
const CustomDatePickerInput = forwardRef(
  (
    props: DatePickerFieldProps & {
      value: ValueDateType;
      onChange: (value: ValueDateType) => void;
      onBlur: () => void;
    },
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <DatePickerInput
        ref={ref}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        disabled={props.disabled}
        placeholder={props.placeholder}
        clearable={props.clearable}
        minDate={props.minDate}
        maxDate={props.maxDate}
        error={props.error}
        label={props.label}
        data-testid={props.testId}
      />
    );
  }
);
CustomDatePickerInput.displayName = "CustomDatePickerInput";
function FormDatePickerInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: DatePickerFieldProps &
    Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue">
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <CustomDatePickerInput
          {...field}
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
export default FormDatePickerInput;
