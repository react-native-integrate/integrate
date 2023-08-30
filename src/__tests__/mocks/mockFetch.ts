import { mockIntegrateYml } from './mockIntegrateYml';

// @ts-ignore
global.fetch = jest.fn((url: string) =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => {
      if (url.endsWith('integrate.yml'))
        return Promise.resolve(mockIntegrateYml);
    },
    status: url.includes('fail') ? 404 : 200,
  })
);
