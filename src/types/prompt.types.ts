export type TextPromptArgs = {
  defaultValue?: string;
  initialValue?: string;
  placeholder?: string;
  validate?: (value: string) => string | Error | undefined;
};

export type ConfirmPromptArgs = {
  positive?: string;
  negative?: string;
  initialValue?: boolean;
};

export type MultiselectPromptArgs = {
  required?: boolean;
  options: SelectOption[];
  initialValues?: OptionValue[];
};

export type SelectPromptArgs = {
  options: SelectOption[];
  initialValue?: OptionValue;
  maxItems?: number;
};

export type SelectOption = {
  value: OptionValue;
  label?: string;
  hint?: string;
};

export type OptionValue = Readonly<string | boolean | number>;
