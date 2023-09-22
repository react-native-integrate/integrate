import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import { logMessage, startSpinner, stopSpinner } from '../prompter';
import { getProjectPath } from './getProjectPath';

export async function waitForFile(filePath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // Check if the file already exists
    const relativePath = path.relative(getProjectPath(), filePath);
    if (fs.existsSync(filePath)) {
      logMessage(`file already exists at ${color.yellow(relativePath)}`);
      resolve(false);
      return;
    }

    // Create a watcher to monitor changes in the directory
    try {
      const onCancel = () => {
        stopSpinner(color.gray('user requested to skip this step'));
        watcher.close();
        reject(new Error('skip'));
      };

      startSpinner(
        `waiting you to manually place the file to ${color.yellow(
          relativePath
        )} (press [s] to skip)`,
        onCancel
      );
      const watcher = fs.watch(
        // Extract the directory path from the file path
        filePath.split('/').slice(0, -1).join('/'),
        { persistent: false }, // Set persistent as false to automatically close the watcher when no longer needed
        (event, filename) => {
          // Check if the file has been created
          if (event === 'rename' && filename === filePath.split('/').pop()) {
            // Stop watching

            stopSpinner(`file was placed to ${color.yellow(relativePath)}`);
            watcher.close();
            resolve(true);
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}
