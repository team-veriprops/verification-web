// components/form/fields/field-props.ts
import {
  UseFormRegister,
  FieldValues,
  FieldErrors,
  Control,
} from "react-hook-form";
import { FormField } from "@3rdparty/shared/dynamic-form/types/form";

export interface FieldProps<TFieldValues extends FieldValues = FieldValues> {
  field: FormField;
  register: UseFormRegister<TFieldValues>;
  control: Control<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  getColorClass?: (index: number) => string;
  className?: string;
}
