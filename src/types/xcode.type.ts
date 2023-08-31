export interface XcodeType {
  project(path: string): XcodeProjectType;
}

export interface XcodeProjectType {
  parseSync(): void;
  writeSync(): string;
  getTarget(type: string): Record<string, any>;
  getFirstProject(): Record<string, any>;

  findPBXGroupKey(criteria: { name?: string; path?: string }): string;

  addResourceFile(
    path: string,
    opt?: { target?: string; plugin?: string; variantGroup?: string },
    group?: string
  ): void;
  pbxCreateGroup(name: string, pathName?: string): void;
  removePbxGroup(name: string): void;
  getPBXGroupByKey(key: string): { children: { comment: string }[] };
}
