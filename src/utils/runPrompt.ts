import { confirm, multiselect, select, text } from '../prompter';
import { Prompt, ValidationType } from '../types/mod.types';
import { transformTextInObject, variables } from '../variables';
import {
  getLastInputValue,
  handlePackageUpgradeInput,
} from './getPackageUpgradeInput';
import { addPackageUpgradeInput } from './packageUpgradeConfig';

export async function runPrompt(
  prompt: Prompt,
  packageName: string
): Promise<void> {
  if (handlePackageUpgradeInput(packageName, prompt.name)) return;

  const lastInputValue = getLastInputValue(packageName, prompt.name);

  prompt = transformTextInObject(prompt);
  let inputValue: any;
  switch (prompt.type) {
    case 'boolean':
      if (lastInputValue != null) prompt.initialValue = lastInputValue;
      inputValue = await confirm(prompt.text, prompt);
      break;
    case 'multiselect':
      if (lastInputValue != null) prompt.initialValues = lastInputValue;
      inputValue = await multiselect(prompt.text, prompt);
      break;
    case 'select':
      if (lastInputValue != null) prompt.initialValue = lastInputValue;
      inputValue = await select(prompt.text, prompt);
      break;
    default:
      if (lastInputValue != null) prompt.initialValue = lastInputValue;
      inputValue = await text(prompt.text, {
        placeholder: prompt.placeholder,
        defaultValue: prompt.defaultValue,
        initialValue: prompt.initialValue,
        validate: getValidate(prompt.validate),
      });
      break;
  }
  variables.set(prompt.name, inputValue);
  addPackageUpgradeInput(packageName, prompt.name, inputValue);
}

export function getValidate(
  validate: ValidationType | ValidationType[] | undefined
): ((value: string) => string | Error | undefined) | undefined {
  if (!validate) return undefined;
  if (!Array.isArray(validate)) validate = [validate];
  const _validate = validate;
  return (value: string) => {
    for (const { flags, regex, message } of _validate) {
      if (!new RegExp(regex, flags).test(value)) return message;
    }
  };
}
