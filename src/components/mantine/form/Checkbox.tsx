import { Checkbox as MantineCheckbox, CheckboxProps } from "@mantine/core";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
export type FormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  label: string;
  testId?: string;
} & Omit<CheckboxProps, "checked" | "onChange"> &
  Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue">;
export function FormCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormCheckboxProps<TFieldValues, TName>) {
  const { label, testId, ...rest } = props;
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <MantineCheckbox
          checked={field.value}
          onChange={(event) => field.onChange(event.currentTarget.checked)}
          onBlur={field.onBlur}
          label={label}
          error={fieldState.error?.message}
          data-testid={testId}
          {...rest}
        />
      )}
    />
  );
}
