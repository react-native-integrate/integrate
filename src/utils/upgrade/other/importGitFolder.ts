import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';
import color from 'picocolors';
import { Constants } from '../../../constants';
import {
  logMessage,
  logWarning,
  startSpinner,
  stopSpinner,
  updateSpinner,
} from '../../../prompter';
import { ImportGetter } from '../../../types/upgrade.types';
import { getProjectPath } from '../../getProjectPath';

export function importGitFolder(projectPath: string): ImportGetter | null {
  try {
    const gitFolderPath = path.join(projectPath, Constants.GIT_FOLDER_NAME);

    if (!fs.existsSync(gitFolderPath)) return null;
    const files = globSync(
      [projectPath, Constants.GIT_FOLDER_NAME, '**/*'].join('/'),
      { nodir: true }
    );

    return {
      id: 'gitFolder',
      title: 'Git Folder',
      value: `${files.length} files`,
      apply: () => setGitFolder(projectPath, files),
    };
  } catch (e) {
    return null;
  }
}

async function setGitFolder(oldProjectPath: string, files: string[]) {
  const shouldBackup = fs.existsSync(
    path.join(getProjectPath(), Constants.GIT_FOLDER_NAME)
  );
  if (shouldBackup) {
    fs.renameSync(
      path.join(getProjectPath(), Constants.GIT_FOLDER_NAME),
      path.join(getProjectPath(), Constants.GIT_FOLDER_NAME + '.backup')
    );
    logMessage(`backed up ${color.yellow(Constants.GIT_FOLDER_NAME)}`);
  }

  startSpinner(`copying ${color.yellow(Constants.GIT_FOLDER_NAME)} files`);
  let success = false;
  try {
    for (let i = 0; i < files.length; i++) {
      updateSpinner(
        `copying ${color.yellow('.git')} files (${i + 1}/${files.length})`
      );
      const file = files[i];
      const relativePath = path.relative(oldProjectPath, file);
      const destination = path.join(getProjectPath(), relativePath);
      // ensure dir exists
      await new Promise(r =>
        fs.mkdir(path.dirname(destination), { recursive: true }, r)
      );
      await new Promise((res, rej) => {
        fs.copyFile(file, destination, err => {
          if (err) rej(err);
          else res(null);
        });
      });
    }
    success = true;
  } finally {
    if (success) {
      stopSpinner(`copied ${color.yellow(files.length)} files`);

      if (shouldBackup) {
        startSpinner('cleaning up');
        await new Promise(r =>
          fs.rmdir(
            path.join(getProjectPath(), Constants.GIT_FOLDER_NAME + '.backup'),
            {
              recursive: true,
            },
            r
          )
        );
        stopSpinner('cleaned up');
      }

      logMessage(`imported ${color.yellow(Constants.GIT_FOLDER_NAME)}`);
    } else {
      stopSpinner(color.red('failed to copy files'));

      await new Promise(r =>
        fs.rmdir(
          path.join(getProjectPath(), Constants.GIT_FOLDER_NAME),
          {
            recursive: true,
          },
          r
        )
      );

      if (shouldBackup) {
        fs.renameSync(
          path.join(getProjectPath(), Constants.GIT_FOLDER_NAME + '.backup'),
          path.join(getProjectPath(), Constants.GIT_FOLDER_NAME)
        );

        logWarning(`restored ${color.yellow(Constants.GIT_FOLDER_NAME)}`);
      }

      logWarning('please copy .git folder manually');
    }
  }
}
