import { checkForUpdate } from '../../../utils/checkForUpdate';
import { logWarning } from '../../../prompter';
import { runCommand } from '../../../utils/runCommand';

// Mock dependencies
jest.mock('../../../prompter');
jest.mock('../../../utils/runCommand');
jest.mock('../../../../package.json', () => ({
  version: '1.0.0',
  name: 'react-native-integrate',
}));

describe('checkForUpdate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show warning when newer version is available', async () => {
    // Mock runCommand to return a newer version
    (runCommand as jest.Mock).mockResolvedValue({
      output: '1.1.0',
      exitCode: 0,
    });

    await checkForUpdate();

    expect(runCommand).toHaveBeenCalledWith(
      'npm view react-native-integrate version',
      { silent: true }
    );
    expect(logWarning).toHaveBeenCalledWith(
      expect.stringContaining('new version')
    );
  });

  it('should not show warning when current version is latest', async () => {
    // Mock runCommand to return same version
    (runCommand as jest.Mock).mockResolvedValue({
      output: '1.0.0',
      exitCode: 0,
    });

    await checkForUpdate();

    expect(runCommand).toHaveBeenCalledWith(
      'npm view react-native-integrate version',
      { silent: true }
    );
    expect(logWarning).not.toHaveBeenCalled();
  });

  it('should not show warning when npm command fails', async () => {
    // Mock runCommand to throw error
    (runCommand as jest.Mock).mockRejectedValue(new Error('npm error'));

    await checkForUpdate();

    expect(runCommand).toHaveBeenCalledWith(
      'npm view react-native-integrate version',
      { silent: true }
    );
    expect(logWarning).not.toHaveBeenCalled();
  });

  it('should not check for updates when version is not defined in package.json', async () => {
    // Mock package.json without version
    jest.resetModules();
    jest.mock('../../../../package.json', () => ({
      name: 'react-native-integrate',
    }));

    await checkForUpdate();

    expect(runCommand).not.toHaveBeenCalled();
    expect(logWarning).not.toHaveBeenCalled();
  });
});
