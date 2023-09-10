import { confirm, text } from '../prompter';
import { Prompt } from '../types/mod.types';
import { transformTextInObject, variables } from '../variables';

export async function runPrompt(prompt: Prompt): Promise<void> {
  prompt = transformTextInObject(prompt);
  switch (prompt.type) {
    case 'boolean':
      variables.set(prompt.name, await confirm(prompt.text));
      break;
    default:
      variables.set(prompt.name, await text(prompt.text));
      break;
  }
}
