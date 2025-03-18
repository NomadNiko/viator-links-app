import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { MultiSelect } from "@mantine/core";
type MultipleSelectExtendedInputProps<T extends object> = {
  label: string;
  error?: string;
  testId?: string;
  disabled?: boolean;
  options: T[];
  renderSelected: (option: T[]) => React.ReactNode;
  renderOption: (option: T) => React.ReactNode;
  keyExtractor: (option: T) => string;
  onEndReached?: () => void;
  placeholder?: string;
  searchable?: boolean;
};
function MultipleSelectExtendedInput<T extends object>(
  props: MultipleSelectExtendedInputProps<T> & {
    name: string;
    value: T[] | null;
    onChange: (value: T[]) => void;
    onBlur: () => void;
  }
) {
  // Convert options to format expected by Mantine MultiSelect
  const data = props.options.map((option) => ({
    value: props.keyExtractor(option),
    label: props.renderOption(option) as string,
    // Store original option for retrieval
    originalOption: option,
  }));
  // Convert value to format expected by Mantine MultiSelect
  const selectValue =
    props.value?.map((item) => props.keyExtractor(item)) || [];
  // Handle selection changes
  const handleChange = (selectedValues: string[]) => {
    const selectedOptions = selectedValues
      .map((val) =>
        props.options.find((opt) => props.keyExtractor(opt) === val)
      )
      .filter(Boolean) as T[];
    props.onChange(selectedOptions);
  };
  return (
    <MultiSelect
      label={props.label}
      data={data}
      value={selectValue}
      onChange={handleChange}
      onBlur={props.onBlur}
      error={props.error}
      disabled={props.disabled}
      searchable={props.searchable}
      placeholder={props.placeholder}
      data-testid={props.testId}
    />
  );
}
function FormMultipleSelectExtendedInput<
  TFieldValues extends FieldValues = FieldValues,
  T extends object = object,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue"> &
    MultipleSelectExtendedInputProps<T>
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <MultipleSelectExtendedInput<T>
          {...field}
          label={props.label}
          error={fieldState.error?.message}
          disabled={props.disabled}
          testId={props.testId}
          options={props.options}
          renderOption={props.renderOption}
          renderSelected={props.renderSelected}
          keyExtractor={props.keyExtractor}
          searchable={props.searchable}
          placeholder={props.placeholder}
          onEndReached={props.onEndReached}
        />
      )}
    />
  );
}
export default FormMultipleSelectExtendedInput;
