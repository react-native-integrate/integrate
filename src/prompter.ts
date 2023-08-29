import {
  intro,
  log as promptLog,
  outro,
  spinner,
  confirm as promptConfirm,
  cancel,
  isCancel,
  note,
} from '@clack/prompts';
import color from 'picocolors';

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
export function logWarning(msg: string): void {
  promptLog.warning(color.yellow(msg));
}
export function logInfo(msg: string): void {
  promptLog.info(msg);
}
export function logError(msg: string): void {
  promptLog.error(color.red(msg));
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
export async function confirm(msg: string): Promise<boolean> {
  const response = await promptConfirm({
    message: msg,
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
