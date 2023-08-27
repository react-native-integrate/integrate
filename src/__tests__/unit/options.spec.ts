import { options } from '../../options';

// generate tests for options get and set method
describe('options get and set method', () => {
  it('should get and set the default value', () => {
    options.set({ test: true } as any);
    expect(options.get()).toEqual({ test: true });
  });
});
