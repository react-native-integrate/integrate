/* eslint-disable @typescript-eslint/no-unsafe-call */

require('../../mocks/mockAll');
import { appDelegateMod } from '../../../mods/appDelegateMod';
import { AppDelegateModType } from '../../../types/mod.types';
import { mockAppDelegateTemplate } from '../../mocks/mockAppDelegateTemplate';

describe('appDelegateMod', () => {
  it('should append text into didLaunchWithOptions', () => {
    let content = mockAppDelegateTemplate;
    const step: AppDelegateModType = {
      type: 'app_delegate',
      imports: ['<Firebase.h>'],
      method: 'didFinishLaunchingWithOptions',
      append: {
        text: '[FIRApp configure];',
      },
    };
    content = appDelegateMod({
      step,
      content,
      packageName: '@react-native-firebase/app',
    });
    content = appDelegateMod({
      step,
      content,
      packageName: '@react-native-firebase/app2',
    });
    console.log('content', content);
    // @ts-ignore
    expect(content).toContain(step.append.text);
  });
});
