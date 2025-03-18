import { TimeInput } from "@mantine/dates";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { ForwardedRef, forwardRef, ChangeEvent } from "react";
type ValueDateType = Date | null | undefined;
type TimePickerFieldProps = {
  disabled?: boolean;
  autoFocus?: boolean;
  label: string;
  testId?: string;
  error?: string;
  defaultValue?: ValueDateType;
  placeholder?: string;
  clearable?: boolean;
  format?: string;
  withSeconds?: boolean;
};
const CustomTimeInput = forwardRef(
  (
    props: TimePickerFieldProps & {
      value: ValueDateType;
      onChange: (value: ValueDateType) => void;
      onBlur: () => void;
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    // Convert Date to string for TimeInput
    const timeString =
      props.value instanceof Date ? props.value.toTimeString().slice(0, 8) : "";
    // Handle changes by converting the event to the correct format
    const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value;
      if (!value) {
        props.onChange(null);
        return;
      }
      const [hours, minutes, seconds] = value.split(":").map(Number);
      const date = new Date();
      date.setHours(hours || 0);
      date.setMinutes(minutes || 0);
      date.setSeconds(seconds || 0);
      props.onChange(date);
    };
    return (
      <TimeInput
        ref={ref}
        value={timeString}
        onChange={handleTimeChange}
        onBlur={props.onBlur}
        disabled={props.disabled}
        placeholder={props.placeholder}
        label={props.label}
        error={props.error}
        withSeconds={props.withSeconds}
        data-testid={props.testId}
      />
    );
  }
);
CustomTimeInput.displayName = "CustomTimeInput";
function FormTimePickerInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: TimePickerFieldProps &
    Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue">
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <CustomTimeInput
          {...field}
          defaultValue={props.defaultValue}
          autoFocus={props.autoFocus}
          label={props.label}
          disabled={props.disabled}
          testId={props.testId}
          placeholder={props.placeholder}
          clearable={props.clearable}
          withSeconds={props.format?.includes("s")}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
export default FormTimePickerInput;
