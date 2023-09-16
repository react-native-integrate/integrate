import { confirm, multiselect, text } from '../prompter';
import { Prompt } from '../types/mod.types';
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
      variables.set(prompt.name, await text(prompt.text, prompt));
      break;
  }
}
