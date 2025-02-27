require('../../mocks/mockAll');

import { findOrCreateBlock } from '../../../tasks/buildGradleTask';
import { applyContentModification } from '../../../utils/applyContentModification';

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
  it('should replace using script correctly', async () => {
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
        script: `
          await replace("google();")
        `,
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
