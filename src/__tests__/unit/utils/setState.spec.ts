/* eslint-disable @typescript-eslint/no-unsafe-call */

import { TaskState } from '../../../types/mod.types';
import { setState } from '../../../utils/setState';
import { variables } from '../../../variables';

describe('setState', () => {
  it('should set state to done if it is progress', () => {
    variables.clear();
    setState('test', {
      state: 'progress',
    });
    setState('test', {
      state: 'done',
    });
    expect(variables.get<TaskState['state']>('test')).toEqual('done');
  });
  it('should not set state to done if it is not progress', () => {
    variables.clear();
    setState('test', {
      state: 'skipped',
    });
    setState('test', {
      state: 'done',
    });
    expect(variables.get<TaskState['state']>('test')).toEqual('skipped');
  });
});
