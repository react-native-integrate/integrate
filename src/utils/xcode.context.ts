import { XcodeProjectType } from 'xcode';

let xcodeProject: XcodeProjectType | undefined;

export const xcodeContext = {
  set(proj: XcodeProjectType): void {
    xcodeProject = proj;
  },
  clear(): void {
    xcodeProject = undefined;
  },
  get(): XcodeProjectType | undefined {
    return xcodeProject;
  },
};
