import { Field, useForm } from "@/hooks/use_form";

export function useFormState() {
  return useForm({
    file: new Field<File | undefined>(undefined, true, (value) => {
      if (!value) {
        return "O arquivo é obrigatório.";
      }
    }),
    description: new Field("", true, (value) => {
      if (!value) {
        return "A descrição é obrigatória.";
      }
    }),
  });
}
