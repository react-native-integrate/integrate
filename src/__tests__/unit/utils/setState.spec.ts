/* eslint-disable @typescript-eslint/no-unsafe-call */

import { TaskState } from '../../../types/mod.types';
import { setState } from '../../../utils/setState';
import { variables } from '../../../variables';

describe('setState', () => {
  it('should not set state to done if it is not progress', () => {
    variables.clear();
    variables.set('test', {
      state: 'skipped',
    } as TaskState);
    setState('test', {
      state: 'done',
      error: false,
    });
    expect(variables.get<TaskState>('test')).toEqual({
      state: 'skipped',
    });
  });
});
