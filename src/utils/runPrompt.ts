import { confirm, multiselect, text } from '../prompter';
import { Prompt, ValidationType } from '../types/mod.types';
import { transformTextInObject, variables } from '../variables';

export async function runPrompt(prompt: Prompt): Promise<void> {
  prompt = transformTextInObject(prompt);
  switch (prompt.type) {
    case 'boolean':
      variables.set(prompt.name, await confirm(prompt.text, prompt));
      break;
    case 'multiselect':
      variables.set(prompt.name, await multiselect(prompt.text, prompt));
      break;
    default:
      variables.set(
        prompt.name,
        await text(prompt.text, {
          placeholder: prompt.placeholder,
          defaultValue: prompt.defaultValue,
          initialValue: prompt.initialValue,
          validate: getValidate(prompt.validate),
        })
      );
      break;
  }
}

export function getValidate(
  validate: ValidationType | ValidationType[] | undefined
): ((value: string) => string | void) | undefined {
  if (!validate) return undefined;
  if (!Array.isArray(validate)) validate = [validate];
  const _validate = validate;
  return (value: string) => {
    for (const { flags, regex, message } of _validate) {
      if (!new RegExp(regex, flags).test(value)) return message;
    }
  };
}
