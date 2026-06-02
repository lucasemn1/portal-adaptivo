/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";

export class Field<T = any> {
  constructor(
    public value: T,
    public required?: boolean,
    public validate?: (value: T) => string | undefined,
    public error?: string | string[],
  ) {}
}

export type FormContract = Record<string, Field<any>>;
type FieldValue<F> = F extends Field<infer V> ? V : never;

export function useForm<T extends FormContract>(initialData: T) {
  const [form, setForm] = useState<T>(initialData);

  const isInvalidForm = useMemo(
    () =>
      Object.values(form).some(
        (f) =>
          f.error ||
          (f.required &&
            (f.value === undefined || f.value === null || f.value === "")) ||
          (f.required && Array.isArray(f.value) && f.value.length === 0),
      ),
    [form],
  );

  function setValue<K extends keyof T>(fieldName: K, value: FieldValue<T[K]>) {
    setForm((prevValues) => {
      const currentField = prevValues[fieldName];
      return {
        ...prevValues,
        [fieldName]: {
          ...currentField,
          value: value,
          error: currentField.validate
            ? currentField.validate(value)
            : undefined,
        },
      };
    });
  }

  function setValues(fields: { [K in keyof T]?: FieldValue<T[K]> }) {
    setForm((prevValues) => {
      const newForm = { ...prevValues };

      Object.entries(fields).forEach(([key, value]) => {
        const fieldName = key as keyof T;
        const currentField = prevValues[fieldName];

        if (currentField) {
          newForm[fieldName] = {
            ...currentField,
            value: value,
            error: currentField.validate
              ? currentField.validate(value)
              : undefined,
          } as T[keyof T];
        }
      });

      return newForm;
    });
  }

  return { form, isInvalidForm, setValue, setValues };
}
