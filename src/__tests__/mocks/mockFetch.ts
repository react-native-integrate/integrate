import { mockIntegrateWithDepsYml } from './mockIntegrateWithDepsYml';
import {
  mockIntegrateWithInvalidMinRNVersionYml,
  mockIntegrateWithMinRNVersionYml,
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
      else if (url.endsWith('integrate.yml'))
        return Promise.resolve(mockIntegrateYml);
    },
    status: url.includes('fail') ? 404 : 200,
  })
);
