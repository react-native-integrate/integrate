import color from 'picocolors';
import semver from 'semver/preload';
import { logWarning } from '../prompter';
import { PackageJsonType } from '../types/mod.types';
import { runCommand } from './runCommand';

export async function checkForUpdate(): Promise<void> {
  try {
    const {
      version: currentVersion,
      name,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
    }: PackageJsonType = require('../../package.json');

    if (!currentVersion) return;

    let { output: latestVersion } = await runCommand(
      `npm view ${name} version`,
      { silent: true }
    );
    latestVersion = latestVersion.trim();

    if (semver.gt(latestVersion, currentVersion)) {
      logWarning(
        'A new version is available! ' +
          `Current: ${color.gray(currentVersion)} | Latest: ${color.green(latestVersion)}\n` +
          `${color.yellow('Run')} ${color.blue(`npm install -g ${name}@latest`)} to update.`
      );
    }
  } catch (_error) {
    /* empty */
  }
}
