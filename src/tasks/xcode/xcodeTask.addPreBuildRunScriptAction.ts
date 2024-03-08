import fs from 'fs';
import path from 'path';
import { XcodeProjectType } from 'xcode';
import xml2js from 'xml2js';
import { Constants } from '../../constants';
import { logMessageGray, summarize } from '../../prompter';
import { XcodeAddPreBuildRunScriptAction } from '../../types/mod.types';
import {
  getIosProjectName,
  getIosProjectPath,
} from '../../utils/getIosProjectPath';
import { getModContent } from '../../utils/getModContent';

export async function applyAddPreBuildRunScriptAction(
  content: XcodeProjectType,
  action: XcodeAddPreBuildRunScriptAction,
  configPath: string,
  packageName: string
): Promise<XcodeProjectType> {
  let scriptContent = await getModContent(
    configPath,
    packageName,
    action.addPreBuildRunScriptAction
  );

  const projectName = getIosProjectName();
  const iosProjectPath = getIosProjectPath();
  const schemePath = path.join(
    iosProjectPath + '.xcodeproj',
    'xcshareddata',
    'xcschemes',
    `${projectName}.xcscheme`
  );
  let xmlData = fs.readFileSync(schemePath, 'utf8');

  const parser = new xml2js.Parser({
    preserveChildrenOrder: true,
  });
  const jObj = await parser.parseStringPromise(xmlData); // parser.parse(xmlData);
  // existing check
  const buildAction = jObj.Scheme.BuildAction;
  let preActions: any[] = buildAction[0].PreActions;
  if (!preActions) {
    buildAction[0].PreActions = [];
    preActions = buildAction[0].PreActions;
  }
  /* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return */
  if (
    preActions.some((x: any) =>
      x.ExecutionAction?.some((ea: any) =>
        ea.ActionContent?.some((ac: any) =>
          ac.$?.scriptText?.includes(scriptContent)
        )
      )
    )
  ) {
    /* eslint-enable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return */

    logMessageGray(
      `code already exists, skipped appending script: ${summarize(
        scriptContent
      )}`
    );
    return content;
  }

  if (!scriptContent.endsWith('\n')) scriptContent += '\n';
  const nativeTarget = content.getTarget(Constants.XCODE_APPLICATION_TYPE);
  preActions.push({
    ExecutionAction: [
      {
        $: {
          ActionType:
            'Xcode.IDEStandardExecutionActionsCore.ExecutionActionType.ShellScriptAction',
        },
        ActionContent: [
          {
            $: {
              title: 'Run Script',
              scriptText: scriptContent,
            },
            EnvironmentBuildable: [
              {
                BuildableReference: [
                  {
                    $: {
                      BuildableIdentifier: 'primary',
                      BlueprintIdentifier: nativeTarget.uuid,
                      BuildableName:
                        nativeTarget.target.productReference_comment,
                      BlueprintName: nativeTarget.target.name,
                      ReferencedContainer: `container:${projectName}.xcodeproj`,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  const builder = new xml2js.Builder({
    allowSurrogateChars: true,
    renderOpts: { pretty: true, indent: '   ', newline: '\n' },
  });
  xmlData = builder.buildObject(jObj);
  fs.writeFileSync(schemePath, xmlData);

  return content;
}
