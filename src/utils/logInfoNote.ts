import { progress } from '../progress';
import { logNote } from '../prompter';
import { TextOrTitleMessage } from '../types/mod.types';
import { getText } from '../variables';
import { waitInputToContinue } from './waitInputToContinue';

export async function logInfoNote(
  info: TextOrTitleMessage | undefined
): Promise<void> {
  if (info) {
    const isProgressActive = progress.isActive;
    if (isProgressActive) progress.hide();
    let message, title;
    if (typeof info == 'string') message = getText(info);
    else {
      message = getText(info.message);
      title = getText(info.title);
    }
    logNote(message, title);
    await waitInputToContinue();
    if (isProgressActive) progress.display();
  }
}
