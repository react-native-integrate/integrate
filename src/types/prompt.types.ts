export type TextPromptArgs = {
  defaultValue?: string;
  initialValue?: string;
  placeholder?: string;
  validate?: (value: string) => string | void;
};

export type ConfirmPromptArgs = {
  positive?: string;
  negative?: string;
  initialValue?: boolean;
};

export type MultiselectPromptArgs = {
  required?: boolean;
  options: MultiselectOption[];
  initialValues?: MultiselectOptionValue[];
};

export type MultiselectOption = {
  value: MultiselectOptionValue;
  label?: string;
  hint?: string;
};

export type MultiselectOptionValue = Readonly<string | boolean | number>;
