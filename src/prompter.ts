import {
  cancel,
  confirm as promptConfirm,
  intro,
  isCancel,
  log as promptLog,
  multiselect as promptMultiselect,
  note,
  outro,
  select as promptSelect,
  spinner,
  text as promptText,
} from '@clack/prompts';
import color from 'picocolors';
import {
  ConfirmPromptArgs,
  MultiselectPromptArgs,
  OptionValue,
  SelectPromptArgs,
  TextPromptArgs,
} from './types/prompt.types';
import { listenForKeys } from './utils/waitInputToContinue';

export function log(msg: string): void {
  promptLog.step(msg);
}

export function logSuccess(msg: string): void {
  promptLog.success(msg);
}

export function logMessage(msg: string): void {
  promptLog.message('⦿ ' + msg);
}

export function logMessageGray(msg: string): void {
  promptLog.message(color.gray('⦿ ' + msg));
}

export function logWarning(msg: string, noColor?: boolean): void {
  promptLog.warning(noColor ? msg : color.yellow(msg));
}

export function logInfo(msg: string): void {
  promptLog.info(msg);
}

export function logError(msg: string, noColor?: boolean): void {
  promptLog.error(noColor ? msg : color.red(msg));
}

export function logNote(msg: string, title?: string): void {
  note(msg, title);
}

export function logIntro(msg?: string): void {
  intro(color.inverse(` ${msg || 'react-native-integrate'} `));
}

export function logOutro(msg?: string): void {
  outro(color.cyan(msg || 'completed integration check'));
}

const s = spinner();
let releaseListener: undefined | (() => void);

export function startSpinner(
  msg: string,
  onCancel?: (key: string) => void
): void {
  s.start(msg);
  if (onCancel) releaseListener = listenForKeys('s', onCancel);
}

export function updateSpinner(msg: string): void {
  s.message(msg);
}

export function stopSpinner(msg: string): void {
  s.stop(msg);
  if (releaseListener) {
    releaseListener();
    releaseListener = undefined;
  }
}

export async function multiselect(
  msg: string,
  args: MultiselectPromptArgs
): Promise<OptionValue[]> {
  const response = await promptMultiselect({
    message: msg,
    required: args.required,
    options: args.options.map(x => ({
      value: x.value,
      label: x.label || x.value.toString(),
      hint: x.hint,
    })),
    initialValues: args.initialValues,
  });
  if (isCancel(response)) {
    cancel('operation cancelled');
    process.abort();
  }
  // @ts-ignore
  return response;
}

export async function select(
  msg: string,
  args: SelectPromptArgs
): Promise<OptionValue> {
  const response = await promptSelect({
    message: msg,
    options: args.options.map(x => ({
      value: x.value,
      label: x.label || x.value.toString(),
      hint: x.hint,
    })),
    initialValue: args.initialValue,
    maxItems: args.maxItems,
  });
  if (isCancel(response)) {
    cancel('operation cancelled');
    process.abort();
  }
  // @ts-ignore
  return response;
}

export async function confirm(
  msg: string,
  args: ConfirmPromptArgs = {}
): Promise<boolean> {
  const response = await promptConfirm({
    message: msg,
    active: args.positive || 'yes',
    inactive: args.negative || 'no',
    initialValue: args.initialValue,
  });
  if (isCancel(response)) {
    cancel('operation cancelled');
    process.abort();
  }
  return response;
}

export async function text(
  msg: string,
  args: TextPromptArgs = {}
): Promise<string> {
  const response = await promptText({
    message: msg,
    defaultValue: args.defaultValue,
    initialValue: args.initialValue,
    placeholder: args.placeholder,
    validate: args.validate,
  });
  if (isCancel(response)) {
    cancel('operation cancelled');
    process.abort();
  }
  return response;
}

export function summarize(code: string | null, maxLength = 128): string {
  if (code == null) return 'null';
  const flatText = code.replace(/\n/g, '⏎');
  return color.yellow(
    flatText.substring(0, maxLength) +
      (flatText.length > maxLength ? '...' : '')
  );
}

export function getLastLine(code: string | null, maxLength = 128): string {
  if (code == null) return 'null';
  const lines = code
    .replace(/\r/g, '')
    .split('\n')
    .filter(x => x.trim().length);
  if (!lines.length) return '';
  const flatText = lines[lines.length - 1];
  return (
    flatText.substring(0, maxLength) +
    (flatText.length > maxLength ? '...' : '')
  );
}
