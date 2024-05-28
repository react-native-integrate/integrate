import fs from 'fs';
import color from 'picocolors';
import xcode from 'xcode';
import { Constants } from '../../../constants';
import { logMessage } from '../../../prompter';
import '../../../tasks/xcode/xcodeTask.helpers';
import { ImportGetter } from '../../../types/upgrade.types';
import { getPbxProjectPath } from '../../getIosProjectPath';

export function importIosDevelopmentTeam(
  projectPath: string
): ImportGetter | null {
  try {
    const pbxFilePath = getPbxProjectPath(projectPath);
    const proj = xcode.project(pbxFilePath);
    proj.parseSync();
    const nativeTarget = proj.getTarget(Constants.XCODE_APPLICATION_TYPE);
    const developmentTeam = proj.getBuildProperty(
      'DEVELOPMENT_TEAM',
      'Release',
      nativeTarget.target.name
    );

    if (!developmentTeam) return null;

    return {
      id: 'iosDevelopmentTeam',
      title: 'Ios Development Team',
      value: developmentTeam,
      apply: () => setIosProjectVersion(developmentTeam),
    };
  } catch (e) {
    return null;
  }
}

async function setIosProjectVersion(newDevelopmentTeam: string) {
  const pbxFilePath = getPbxProjectPath();
  const proj = xcode.project(pbxFilePath);
  proj.parseSync();
  const nativeTarget = proj.getTarget(Constants.XCODE_APPLICATION_TYPE);
  proj.updateBuildPropertyByTarget(
    'DEVELOPMENT_TEAM',
    newDevelopmentTeam,
    'Debug',
    nativeTarget.target
  );
  proj.updateBuildPropertyByTarget(
    'DEVELOPMENT_TEAM',
    newDevelopmentTeam,
    'Release',
    nativeTarget.target
  );
  logMessage(
    `set ${color.yellow('DEVELOPMENT_TEAM')} to ${color.yellow(newDevelopmentTeam)}`
  );

  fs.writeFileSync(pbxFilePath, proj.writeSync(), 'utf-8');

  return Promise.resolve();
}
