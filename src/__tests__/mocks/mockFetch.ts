import { mockIntegrateWithDepsYml } from './mockIntegrateWithDepsYml';
import {
  mockIntegrateWithInvalidMinRNVersionYml,
  mockIntegrateWithInvalidMinVersionYml,
  mockIntegrateWithMinRNVersionYml,
  mockIntegrateWithMinVersionYml,
} from './mockIntegrateWithMinRNVersion';
import { mockIntegrateYml } from './mockIntegrateYml';

// @ts-ignore
global.fetch = jest.fn((url: string) =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => {
      if (url.includes('with-deps'))
        return Promise.resolve(mockIntegrateWithDepsYml);
      else if (url.includes('with-min-rn'))
        return Promise.resolve(mockIntegrateWithMinRNVersionYml);
      else if (url.includes('with-invalid-min-rn'))
        return Promise.resolve(mockIntegrateWithInvalidMinRNVersionYml);
      else if (url.includes('with-min-v'))
        return Promise.resolve(mockIntegrateWithMinVersionYml);
      else if (url.includes('with-invalid-min-v'))
        return Promise.resolve(mockIntegrateWithInvalidMinVersionYml);
      else if (url.endsWith('integrate.yml'))
        return Promise.resolve(mockIntegrateYml);
      else if (
        url.endsWith('/rn-diff-purge/release/1.0.0/RnDiffApp/package.json')
      )
        return Promise.resolve(
          JSON.stringify({
            name: 'test',
            dependencies: {
              'react-native': '1.0.0',
              'some-package': '1.0.0',
            },
            devDependencies: {
              'dev-package': '1.0.0',
            },
          })
        );
      else if (
        url.endsWith('/rn-diff-purge/release/1.2.3/RnDiffApp/package.json')
      )
        return Promise.resolve(
          JSON.stringify({
            name: 'test',
            dependencies: {
              'react-native': '1.2.3',
            },
          })
        );
    },
    status:
      url.includes('fail') || url.endsWith('react-native/integrate.yml')
        ? 404
        : 200,
  })
);
