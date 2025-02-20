import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import {
  BlockContentType,
  ContentModifierType,
  PodFileTaskType,
} from '../types/mod.types';
import { applyContentModification } from '../utils/applyContentModification';
import {
  findClosingTagIndex,
  TagDefinitions,
} from '../utils/findClosingTagIndex';
import { getErrMessage } from '../utils/getErrMessage';
import { getProjectPath } from '../utils/getProjectPath';
import { satisfies } from '../utils/satisfies';
import { setState } from '../utils/setState';
import { stringSplice } from '../utils/stringSplice';
import { variables } from '../variables';

export async function podFileTask(args: {
  configPath: string;
  packageName: string;
  content: string;
  task: PodFileTaskType;
}): Promise<string> {
  let { content } = args;
  const { task, configPath, packageName } = args;

  for (const action of task.actions) {
    variables.set('CONTENT', content);
    if (action.when && !satisfies(variables.getStore(), action.when)) {
      setState(action.name, {
        state: 'skipped',
        reason: 'when',
        error: false,
      });
      continue;
    }

    setState(action.name, {
      state: 'progress',
      error: false,
    });
    try {
      if (action.staticLibrary) {
        content = await applyStaticLibraryModification(
          content,
          action.staticLibrary,
          configPath,
          packageName
        );
      }
      if (action.useFrameworks) {
        content = await applyUseFrameworksModification(
          content,
          action.useFrameworks,
          configPath,
          packageName
        );
      }
      if (action.disableFlipper) {
        content = await applyDisableFlipperModification(
          content,
          action.disableFlipper,
          configPath,
          packageName
        );
      }
      content = await applyContentModification({
        action,
        findOrCreateBlock,
        configPath,
        packageName,
        content,
        indentation: 2,
        buildComment: buildPodComment,
      });
      setState(action.name, {
        state: 'done',
        error: false,
      });
    } catch (e) {
      setState(action.name, {
        state: 'error',
        reason: getErrMessage(e),
        error: true,
      });
      throw e;
    }
  }
  return content;
}

async function applyStaticLibraryModification(
  content: string,
  staticLibrary: string | string[],
  configPath: string,
  packageName: string
) {
  const regExp = /\$static_libs.*?=.*?\[(.*?)]/s;
  const match = regExp.exec(content);
  const normalizedStaticLibrary = Array.isArray(staticLibrary)
    ? staticLibrary
    : [staticLibrary];
  let action: ContentModifierType;
  if (!match) {
    action = {
      block: 'target',
      prepend:
        '$static_libs = [\n' +
        normalizedStaticLibrary.map(x => `  '${x}'`).join(',\n') +
        '\n]',
    };
  } else {
    const existingLibs = match[1]
      .replace(/\n/g, '')
      .split(',')
      .map(x => x.trim().replace(/'/g, ''));
    for (const staticLib of normalizedStaticLibrary) {
      if (!existingLibs.includes(staticLib)) existingLibs.push(staticLib);
    }
    action = {
      block: 'target',
      search: {
        regex: regExp.source,
        flags: regExp.flags,
      },
      replace:
        '$static_libs = [\n' +
        existingLibs.map(x => `  '${x}'`).join(',\n') +
        '\n]',
    };
  }
  content = await applyContentModification({
    action,
    findOrCreateBlock,
    configPath,
    packageName,
    content,
    indentation: 2,
    buildComment: buildPodComment,
  });

  return content;
}
async function applyUseFrameworksModification(
  content: string,
  useFrameworks: 'static' | 'dynamic',
  configPath: string,
  packageName: string
) {
  let action: ContentModifierType;
  if (useFrameworks == 'static') {
    // should not change dynamic to static
    if (
      /:linkage => :dynamic/.test(content) ||
      /linkage = ['"]dynamic['"]/.test(content)
    ) {
      return content;
    }
    if (/linkage = /.test(content))
      action = {
        search: 'linkage = ',
        replace: "linkage = 'static'",
      };
    else
      action = {
        before: 'target',
        append: 'use_frameworks! :linkage => :static',
      };
  } else {
    if (/linkage = /.test(content))
      action = {
        search: 'linkage = ',
        replace: "linkage = 'dynamic'",
      };
    else
      action = {
        before: 'target',
        append: 'use_frameworks! :linkage => :dynamic',
      };
    if (!/\$static_libs.*?=.*?\[(.*?)]/s.test(content)) {
      content = await applyContentModification({
        action: {
          block: 'target',
          prepend: '$static_libs = []',
        },
        findOrCreateBlock,
        configPath,
        packageName,
        content,
        indentation: 2,
        buildComment: buildPodComment,
      });
    }
    content = await applyContentModification({
      action: {
        block: 'target.pre_install',
        ifNotPresent:
          'Pod::Installer::Xcode::TargetValidator.send(:define_method, :verify_no_static_framework_transitive_dependencies',
        prepend: `Pod::Installer::Xcode::TargetValidator.send(:define_method, :verify_no_static_framework_transitive_dependencies) {}
installer.pod_targets.each do |pod|
  if $static_libs.include?(pod.name)
    def pod.build_type;
      Pod::BuildType.static_library
    end
  end
end`,
      },
      findOrCreateBlock,
      configPath,
      packageName,
      content,
      indentation: 2,
      buildComment: buildPodComment,
    });
  }
  content = await applyContentModification({
    action: action,
    findOrCreateBlock,
    configPath,
    packageName,
    content,
    indentation: 2,
    buildComment: buildPodComment,
  });

  return content;
}

async function applyDisableFlipperModification(
  content: string,
  _disableFlipper: boolean,
  configPath: string,
  packageName: string
) {
  let action: ContentModifierType;
  {
    if (/flipper_config = /.test(content))
      action = {
        search: 'flipper_config = ',
        replace: 'flipper_config = FlipperConfiguration.disabled',
      };
    else
      action = {
        search: {
          regex: ':flipper_configuration =>.*?,',
          flags: 's',
        },
        replace: ':flipper_configuration => FlipperConfiguration.disabled,',
        exact: true,
      };
  }
  content = await applyContentModification({
    action: action,
    findOrCreateBlock,
    configPath,
    packageName,
    content,
    indentation: 2,
    buildComment: buildPodComment,
  });

  return content;
}

function buildPodComment(comment: string): string[] {
  return comment.split('\n').map(x => `# ${x}`);
}

function findOrCreateBlock(
  content: string,
  block: string
): {
  blockContent: BlockContentType;
  content: string;
} {
  let blockContent = {
    start: 0,
    end: content.length,
    match: content,
    space: '',
    justCreated: false,
  };

  const blockPath = block.split('.');
  let contentOffset = 0;
  for (let i = 0; i < blockPath.length; i++) {
    const matcherRegex = new RegExp(
      `^((\\s+)?)${blockPath[i]}.*?\\bdo\\b(\\s\\|.*?\\|)? ?`,
      'ms'
    );
    let blockStart = matcherRegex.exec(blockContent.match);

    const justCreated = !blockStart;
    if (!blockStart) {
      const blockName = blockPath[i];
      // create block in block
      const space = ' '.repeat(2 * i);
      const previousSpace = ' '.repeat(Math.max(0, 2 * (i - 1)));
      const newBlock = buildBlock(space, blockName);
      const codeToInsert = `
${newBlock}
${previousSpace}`;

      const contentLengthBeforeInsert = content.length;
      content = stringSplice(content, blockContent.end, 0, codeToInsert);
      if (codeToInsert.length && contentLengthBeforeInsert < content.length) {
        blockContent.match += codeToInsert;
        blockContent.end += codeToInsert.length;
        blockStart = matcherRegex.exec(blockContent.match);
      }
    }
    if (!blockStart) {
      throw new Error('block could not be inserted, something wrong?');
    }

    const blockEndIndex = findClosingTagIndex(
      content,
      contentOffset + blockStart.index + blockStart[0].length,
      TagDefinitions.POD
    );
    const blockBody = content.substring(
      contentOffset + blockStart.index + blockStart[0].length,
      blockEndIndex
    );
    blockContent = {
      start: contentOffset + blockStart.index + blockStart[0].length,
      end: blockEndIndex,
      match: blockBody,
      justCreated,
      space: ' '.repeat(2 * i),
    };
    contentOffset += blockStart.index + blockStart[0].length;
  }

  return {
    blockContent,
    content,
  };
}

function buildBlock(space: string, blockName: string) {
  if (blockName === 'target') {
    // name is not specified so cannot create, throw error
    throw new Error('target not found, something is wrong?');
  } else if (/target '.*?'/.test(blockName)) {
    // name is specified, create block
    return `${space}${blockName} do end`;
  } else if (podHooks.includes(blockName)) {
    return `${space}${blockName} do |installer| end`;
  } else {
    throw new Error('invalid block: ' + blockName);
  }
}

const podHooks = [
  'pre_install',
  'pre_integrate',
  'post_install',
  'post_integrate',
];

function getPodFilePath() {
  const projectPath = getProjectPath();

  const podFilePath = path.join(projectPath, 'ios', Constants.POD_FILE_NAME);
  if (!fs.existsSync(podFilePath))
    throw new Error(`Pod file not found at ${podFilePath}`);
  return podFilePath;
}

function readPodFileContent() {
  const podFilePath = getPodFilePath();
  return fs.readFileSync(podFilePath, 'utf-8');
}

function writePodFileContent(content: string): void {
  const podFilePath = getPodFilePath();
  return fs.writeFileSync(podFilePath, content, 'utf-8');
}

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: PodFileTaskType;
}): Promise<void> {
  let content = readPodFileContent();

  content = await podFileTask({
    ...args,
    content,
  });

  writePodFileContent(content);
}

export const summary = 'Podfile modification';
