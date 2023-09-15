import {
  intro,
  log as promptLog,
  outro,
  spinner,
  confirm as promptConfirm,
  cancel,
  isCancel,
  note,
  text as promptText,
} from '@clack/prompts';
import color from 'picocolors';
import { ConfirmPromptArgs, TextPromptArgs } from './types/prompt.types';

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
export function logNote(msg: string, title: string): void {
  note(msg, title);
}
export function logIntro(): void {
  intro(color.inverse(' react-native-integrate '));
}
export function logOutro(): void {
  outro(color.cyan('completed integration check'));
}
const s = spinner();

export function startSpinner(msg: string): void {
  s.start(msg);
}
export function updateSpinner(msg: string): void {
  s.message(msg);
}
export function stopSpinner(msg: string): void {
  s.stop(msg);
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
  });
  if (isCancel(response)) {
    cancel('operation cancelled');
    process.abort();
  }
  return response;
}

export function summarize(code: string | null, maxLength = 128): string {
  if (!code) return 'null';
  const flatText = code.replace(/\n/g, '⏎');
  return color.yellow(
    flatText.substring(0, maxLength) +
      (flatText.length > maxLength ? '...' : '')
  );
}
