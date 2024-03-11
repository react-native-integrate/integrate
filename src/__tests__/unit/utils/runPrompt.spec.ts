/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');

import path from 'path';
import { getProjectPath } from '../../../utils/getProjectPath';
import { getValidate, runPrompt } from '../../../utils/runPrompt';
import { variables } from '../../../variables';
import { mockPrompter } from '../../mocks/mockAll';

describe('getValidate', () => {
  it('should get success validation fn', () => {
    const fn = getValidate([
      {
        regex: '.*test.*',
        message: 'must contain test',
      },
    ]);
    expect(fn).not.toBeUndefined();
    if (!fn) return;

    expect(fn('random test random')).toBeUndefined();
  });
  it('should get failed validation fn', () => {
    const fn = getValidate([
      {
        regex: '.*test.*',
        message: 'must contain test',
      },
    ]);
    expect(fn).not.toBeUndefined();
    if (!fn) return;

    expect(fn('random')).toBe('must contain test');
  });
  it('should handle undefined', () => {
    const fn = getValidate(undefined);
    expect(fn).toBeUndefined();
  });
});

describe('runPrompt', () => {
  it('should handle upgrade when input value is in upgrade.json', async () => {
    variables.set('__UPGRADE__', true);
    mockFs.writeFileSync(
      path.join(
        getProjectPath(),
        '.upgrade',
        'packages',
        'test-package',
        'upgrade.json'
      ),
      JSON.stringify(
        {
          inputs: {
            testInput: 'testValue',
          },
        },
        null,
        2
      )
    );
    mockPrompter.text.mockReset();

    await runPrompt(
      {
        name: 'testInput',
        type: 'text',
        text: 'random',
      },
      'test-package'
    );
    expect(mockPrompter.text).not.toHaveBeenCalled();

    expect(variables.get('testInput')).toBe('testValue');
    variables.clear();
  });
});
