import { findOrCreateBlock } from '../../../tasks/buildGradleTask';
import { applyContentModification } from '../../../utils/applyContentModification';

require('../../mocks/mockAll');

describe('applyContentModification', () => {
  it('should replace without search correctly', async () => {
    let content = `
buildscript {
    ext {
        jcenter();
        jcenter();
    }
}
`;
    content = await applyContentModification({
      action: {
        block: 'buildscript.ext',
        replace: 'google();',
      },
      findOrCreateBlock,
      configPath: 'path/to/config',
      packageName: 'package-name',
      content,
      indentation: 4,
    });
    expect(content).toMatch(`
buildscript {
    ext {
        google();
    }
}
`);
  });
});
