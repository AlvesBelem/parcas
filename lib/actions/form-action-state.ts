export type FormActionState = {
  ok: boolean;
  message: string;
};

const baseState: FormActionState = {
  ok: false,
  message: "",
};

export function getInitialFormState(): FormActionState {
  return { ...baseState };
}
