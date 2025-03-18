import { Button } from "@/components/mantine/core/Button";
import { useFormState } from "react-hook-form";
import useLeavePage from "@/services/leave-page/use-leave-page";
import { Group } from "@mantine/core";
import Link from "@/components/link";
interface FormActionsProps {
  submitLabel: string;
  cancelLabel: string;
  testId: string;
  cancelTestId: string;
  cancelHref: string;
}
export function FormActions({
  submitLabel,
  cancelLabel,
  testId,
  cancelTestId,
  cancelHref,
}: FormActionsProps) {
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);
  return (
    <Group gap="md">
      <Button type="submit" disabled={isSubmitting} data-testid={testId}>
        {submitLabel}
      </Button>
      <Button
        variant="outline"
        color="gray"
        component={Link}
        href={cancelHref}
        data-testid={cancelTestId}
      >
        {cancelLabel}
      </Button>
    </Group>
  );
}
