import { StringUtils } from "@/utils/string.utils";
import { ChangeEvent, ReactNode, useId, useMemo } from "react";

interface Props {
  id?: string;
  name?: string;
  value?: string;
  error?: ReactNode;
  label?: ReactNode;
  placeholder?: string;
  showAs?: "input" | "textarea";

  leftIcon?: ReactNode;
  rightIcon?: ReactNode;

  onInput?(value: string): void;
}

export function Input(props: Props) {
  const formId = useId();
  const showAs = props.showAs ?? "input";

  const commonProps = {
    id: formId,
    name: props.name,
    placeholder: props.placeholder,
    className: "w-full h-10 p-3 border rounded-lg",
  };

  const inputProps = {
    ...commonProps,
    value: props.value,
    onChange(e: ChangeEvent<HTMLInputElement>) {
      if (props.onInput) {
        props.onInput(e.target.value);
      }
    },
  };

  const textAreaProps = {
    ...commonProps,
    value: props.value,
    className: `${commonProps.className} min-h-40`,
    onChange(e: ChangeEvent<HTMLTextAreaElement>) {
      if (props.onInput) {
        props.onInput(e.target.value);
      }
    },
  };

  return (
    <div id={props.id}>
      <label htmlFor={formId} className="flex flex-col gap-1!">
        {props.label && <div className="text-sm ml-1">{props.label}</div>}

        {showAs === "input" ? (
          <input {...inputProps} />
        ) : (
          <textarea {...textAreaProps} />
        )}

        {props.error && (
          <div className="text-sm text-red-500 ml-1">{props.error}</div>
        )}
      </label>
    </div>
  );
}
