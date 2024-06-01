import fs from 'fs';
import { glob, globSync } from 'glob';
import path from 'path';
import color from 'picocolors';
import { logMessage } from '../../../prompter';
import { ImportGetter } from '../../../types/upgrade.types';
import { getProjectPath } from '../../getProjectPath';

export function importAndroidLaunchIcon(
  projectPath: string
): ImportGetter | null {
  try {
    const mipmaps = globSync(
      [projectPath, 'android/app/src/main/res/mipmap-*/*'].join('/'),
      { nodir: true }
    );
    const drawables = globSync(
      [projectPath, 'android/app/src/main/res/drawable*/*'].join('/'),
      { nodir: true }
    );
    // get launcher icon and launcher round icon name from AndroidManifest.xml
    const manifestPath = path.join(
      projectPath,
      'android/app/src/main/AndroidManifest.xml'
    );
    const manifest = fs.readFileSync(manifestPath, 'utf8');
    const iconMatch = manifest.match(/android:icon="(.*)"/);
    const icon = iconMatch?.[1];
    const roundIconMatch = manifest.match(/android:roundIcon="(.*)"/);
    const roundIcon = roundIconMatch?.[1];

    if (!icon) return null;
    return {
      id: 'androidLaunchIcon',
      title: 'Android Icons',
      value: icon,
      apply: () =>
        setAndroidLaunchIcon(projectPath, mipmaps, drawables, icon, roundIcon),
    };
  } catch (e) {
    return null;
  }
}

async function setAndroidLaunchIcon(
  oldProjectPath: string,
  mipmaps: string[],
  drawables: string[],
  icon: string,
  roundIcon: string | undefined
) {
  const existingMipmaps = await glob(
    path.join(getProjectPath(), 'android/app/src/main/res/mipmap-*/*')
  );
  // delete existing mipmaps
  for (const mipmap of existingMipmaps) {
    await new Promise(r => fs.unlink(mipmap, r));
  }
  logMessage('deleted existing mipmaps');

  // copy new mipmaps
  for (const mipmap of mipmaps) {
    // get path after android

    const relativePath = path.relative(
      path.join(oldProjectPath, 'android'),
      mipmap
    );
    const destination = path.join(getProjectPath(), 'android', relativePath);

    // ensure dir exists
    await new Promise(r =>
      fs.mkdir(path.dirname(destination), { recursive: true }, r)
    );

    // copy file
    await new Promise(r => fs.copyFile(mipmap, destination, r));
  }
  logMessage('copied mipmaps from old project');

  // copy new drawables
  for (const drawable of drawables) {
    // get path after android

    const relativePath = path.relative(
      path.join(oldProjectPath, 'android'),
      drawable
    );
    const destination = path.join(getProjectPath(), 'android', relativePath);

    // do not overwrite if exists
    if (fs.existsSync(destination)) continue;

    // ensure dir exists
    await new Promise(r =>
      fs.mkdir(path.dirname(destination), { recursive: true }, r)
    );

    // copy file
    await new Promise(r => fs.copyFile(drawable, destination, r));
  }
  logMessage('copied drawables from old project');

  // replace icon and round icon attributes in AndroidManifest.xml
  const manifestPath = path.join(
    getProjectPath(),
    'android/app/src/main/AndroidManifest.xml'
  );
  const manifest = fs.readFileSync(manifestPath, 'utf8');
  let newManifest = manifest.replace(
    /android:icon="(.*)"/,
    `android:icon="${icon}"`
  );
  logMessage(`set ${color.yellow('android:icon')} to ${color.yellow(icon)}`);

  if (roundIcon) {
    newManifest = newManifest.replace(
      /android:roundIcon="(.*)"/,
      `android:roundIcon="${roundIcon}"`
    );
    logMessage(
      `set ${color.yellow('android:roundIcon')} to ${color.yellow(roundIcon)}`
    );
  } else {
    newManifest = newManifest.replace(/\n\s+android:roundIcon="(.*)"/, '');
  }
  fs.writeFileSync(manifestPath, newManifest);
  return Promise.resolve();
}
