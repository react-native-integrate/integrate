import { MultiselectPromptArgs } from '../../types/prompt.types';

const mockPrompterSpinner = {
  start: jest.fn(),
  stop: jest.fn(),
  message: jest.fn(),
};
export const mockPrompter = {
  intro: jest.fn(),
  log: {
    step: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
    message: jest.fn(),
  },
  outro: jest.fn(),
  spinner: (): any => mockPrompterSpinner,
  confirm: jest.fn(() => true),
  multiselect: jest.fn(({ options }: MultiselectPromptArgs) =>
    options.map(x => x.value)
  ),
  select: jest.fn(({ options }: MultiselectPromptArgs) => options[0].value),
  text: jest.fn(() => 'test'),
  cancel: jest.fn(),
  isCancel: jest.fn(() => false),
  note: jest.fn(),
};

jest.mock('@clack/prompts', () => mockPrompter);
