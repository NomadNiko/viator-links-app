"use client";
import { useFileUploadService } from "@/services/api/services/files";
import { FileEntity } from "@/services/api/types/file-entity";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import {
  Box,
  Text,
  Paper,
  Button,
  Group,
  SimpleGrid,
  ActionIcon,
  Image as MantineImage,
  useMantineTheme,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

type MultipleImagePickerProps = {
  error?: string;
  onChange: (value: FileEntity[] | null) => void;
  onBlur: () => void;
  value?: FileEntity[];
  disabled?: boolean;
  testId?: string;
  label?: React.ReactNode;
};

function MultipleImagePicker(props: MultipleImagePickerProps) {
  const { onChange, value } = props;
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const fetchFileUpload = useFileUploadService();
  const theme = useMantineTheme();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsLoading(true);
      const { status, data } = await fetchFileUpload(acceptedFiles[0]);
      if (status === HTTP_CODES_ENUM.CREATED) {
        onChange([...(value ?? []), data.file]);
      }
      setIsLoading(false);
    },
    [fetchFileUpload, onChange, value]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 2, // 2MB
    disabled: isLoading || props.disabled,
  });

  const removeImageHandle =
    (id: FileEntity["id"]) =>
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      onChange(value?.filter((item) => item.id !== id) ?? []);
    };

  return (
    <Paper
      {...getRootProps()}
      p={theme.spacing.md}
      mt={theme.spacing.md}
      withBorder
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing.md,
        border: "1px dashed #ddd",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      {isDragActive && (
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text size="xl" fw="bold" color="white" ta="center">
            {t("common:formInputs.multipleImageInput.dropzoneText")}
          </Text>
        </Box>
      )}
      {props?.value?.length ? (
        <SimpleGrid cols={3} spacing="md" style={{ width: "100%" }}>
          {props.value.map((item) => (
            <Box key={item.id} style={{ position: "relative", height: 250 }}>
              <MantineImage
                src={item.path}
                alt={
                  t("common:formInputs.multipleImageInput.imageAlt") ||
                  "Uploaded image"
                }
                height={250}
                fit="cover"
              />
              <ActionIcon
                color="red"
                variant="filled"
                onClick={removeImageHandle(item.id)}
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  zIndex: 2,
                }}
              >
                <IconX size={18} />
              </ActionIcon>
            </Box>
          ))}
        </SimpleGrid>
      ) : null}
      <Group mt={theme.spacing.md}>
        <Button loading={isLoading} data-testid={props.testId}>
          {isLoading
            ? t("common:loading")
            : t("common:formInputs.multipleImageInput.selectFile")}
          <input {...getInputProps()} />
        </Button>
      </Group>
      <Text mt="xs" size="sm" color="dimmed">
        {t("common:formInputs.multipleImageInput.dragAndDrop")}
      </Text>
      {props.error && (
        <Text color="red" size="sm" mt="xs">
          {props.error}
        </Text>
      )}
    </Paper>
  );
}

function FormMultipleImagePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: Pick<ControllerProps<TFieldValues, TName>, "name" | "defaultValue"> & {
    disabled?: boolean;
    testId?: string;
    label?: React.ReactNode;
  }
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <MultipleImagePicker
          onChange={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          error={fieldState.error?.message}
          disabled={props.disabled}
          label={props.label}
          testId={props.testId}
        />
      )}
    />
  );
}

export default FormMultipleImagePicker;
