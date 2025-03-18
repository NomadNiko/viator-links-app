import {
  Select as MantineSelect,
  SelectProps as MantineSelectProps,
} from "@mantine/core";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
export type SelectOption = {
  value: string;
  label: string;
};
export type FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<MantineSelectProps, "data"> & {
  options: SelectOption[];
  label: string;
  testId?: string;
} & Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue">;
export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormSelectProps<TFieldValues, TName>) {
  const { options, testId, ...rest } = props;
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <MantineSelect
          {...field}
          {...rest}
          data={options}
          error={fieldState.error?.message}
          data-testid={testId}
        />
      )}
    />
  );
}
