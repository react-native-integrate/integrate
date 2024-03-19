import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';
import color from 'picocolors';
import { logMessage } from '../../../prompter';
import { ImportGetter } from '../../../types/upgrade.types';
import { getIosProjectName } from '../../getIosProjectPath';
import { getProjectPath } from '../../getProjectPath';

export function getIosAssets(projectPath: string): ImportGetter | null {
  try {
    const iosProjectName = getIosProjectName(projectPath);

    const imagesAssets = globSync(
      path.join(projectPath, 'ios', iosProjectName, 'Images.xcassets/**/*'),
      { nodir: true }
    );
    const launchScreen = globSync(
      path.join(projectPath, 'ios', iosProjectName, 'LaunchScreen.storyboard'),
      { nodir: true }
    );

    if (!imagesAssets.length && !launchScreen.length) return null;

    return {
      id: 'iosAssets',
      title: 'Ios Assets',
      value: 'Images.xcassets, LaunchScreen.storyboard',
      setter: () => setIosAssets(imagesAssets, launchScreen[0]),
    };
  } catch (e) {
    return null;
  }
}

async function setIosAssets(assets: string[], launchScreen: string) {
  const iosProjectName = getIosProjectName();
  const existingAssets = globSync(
    path.join(getProjectPath(), 'ios', iosProjectName, 'Images.xcassets/**/*'),
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
    const imagesPath = asset.substring(asset.indexOf('Images.xcassets/'));
    const newPath = path.join(
      getProjectPath(),
      'ios',
      iosProjectName,
      imagesPath
    );

    // ensure dir exists
    await new Promise(r =>
      fs.mkdir(path.dirname(newPath), { recursive: true }, r)
    );

    // copy file
    await new Promise(r => fs.copyFile(asset, newPath, r));
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
