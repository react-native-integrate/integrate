import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';
import color from 'picocolors';
import { logMessage } from '../../../prompter';
import { ImportGetter } from '../../../types/upgrade.types';
import { getIosProjectName } from '../../getIosProjectPath';
import { getProjectPath } from '../../getProjectPath';

export function importIosAssets(projectPath: string): ImportGetter | null {
  try {
    const iosProjectName = getIosProjectName(projectPath);

    const imagesAssets = globSync(
      [projectPath, 'ios', iosProjectName, 'Images.xcassets/**/*'].join('/'),
      { nodir: true }
    );
    const launchScreen = globSync(
      [projectPath, 'ios', iosProjectName, 'LaunchScreen.storyboard'].join('/'),
      { nodir: true }
    );

    if (!imagesAssets.length && !launchScreen.length) return null;

    return {
      id: 'iosAssets',
      title: 'Ios Assets',
      value: 'Images.xcassets, LaunchScreen.storyboard',
      apply: () =>
        setIosAssets(
          projectPath,
          iosProjectName,
          imagesAssets,
          launchScreen[0]
        ),
    };
  } catch (_e) {
    return null;
  }
}

async function setIosAssets(
  oldProjectPath: string,
  oldIosProjectName: string,
  assets: string[],
  launchScreen: string
) {
  const iosProjectName = getIosProjectName();
  const existingAssets = globSync(
    [getProjectPath(), 'ios', iosProjectName, 'Images.xcassets/**/*'].join('/'),
    { nodir: true }
  );
  // delete existing image assets
  for (const asset of existingAssets) {
    await new Promise(r => fs.unlink(asset, r));
  }
  logMessage('deleted existing images');

  // copy new assets
  for (const asset of assets) {
    // get path after ios
    const relativePath = path.relative(
      path.join(oldProjectPath, 'ios', oldIosProjectName),
      asset
    );
    const destination = path.join(
      path.join(getProjectPath(), 'ios', oldIosProjectName),
      relativePath
    );

    // ensure dir exists
    await new Promise(r =>
      fs.mkdir(path.dirname(destination), { recursive: true }, r)
    );

    // copy file
    await new Promise(r => fs.copyFile(asset, destination, r));
  }
  logMessage(`copied ${color.yellow('Images.xcassets')} from old project`);

  if (launchScreen) {
    const newPath = path.join(
      getProjectPath(),
      'ios',
      iosProjectName,
      'LaunchScreen.storyboard'
    );
    await new Promise(r => fs.copyFile(launchScreen, newPath, r));
    logMessage(
      `copied ${color.yellow('LaunchScreen.storyboard')} from old project`
    );
  }
}
