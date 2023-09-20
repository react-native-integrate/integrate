import { cancel } from '@clack/prompts';
import color from 'picocolors';

export function waitInputToContinue(
  message?: string,
  keys?: string
): Promise<string> {
  if (!process.stdin.isTTY) return Promise.resolve('');
  const _message = message || `${color.gray('│')}  continue?`;
  const _keys = keys || '';
  return new Promise(function (resolve, reject) {
    const caseSensitive =
      _keys.toLowerCase() !== _keys && _keys.toUpperCase() !== _keys;
    process.stdout.write(_message);

    function keyListener(buffer: Buffer) {
      let key = buffer.toString();

      process.stdout.clearLine(0); // clear current text
      process.stdout.cursorTo(0); // move cursor to beginning of line
      if (key.charCodeAt(0) === 3) {
        //   process.stdin.setRawMode(false);
        //   process.stdin.off('data', keyListener);
        //   process.stdin.pause();
        //   process.exit(0); // Exit process if you prefer.
        cancel('operation cancelled');
        reject('');
      }
      const index = caseSensitive
        ? _keys.indexOf(key)
        : _keys.toLowerCase().indexOf(key.toLowerCase());
      if (_keys && index < 0) {
        // process.stdout.write(key);
        // process.stdout.write('\n');
        // process.stdout.write(_message);
        return;
      }
      process.stdin.setRawMode(false);
      process.stdin.off('data', keyListener);
      process.stdin.pause();
      if (index >= 0) {
        key = _keys.charAt(index);
        // process.stdout.write(key);
      }
      // process.stdout.write('\n');
      resolve(key);
    }

    process.stdin.resume();
    process.stdin.setRawMode(true);
    process.stdin.on('data', keyListener);
  });
}
