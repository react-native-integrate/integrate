/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockPrompter } = require('../mocks/mockAll');

import color from 'picocolors';
import {
  confirm,
  log,
  logError,
  logInfo,
  logIntro,
  logMessage,
  logMessageGray,
  logNote,
  logOutro,
  logSuccess,
  logWarning,
  startSpinner,
  stopSpinner,
  summarize,
  text,
  updateSpinner,
} from '../../prompter';

describe('prompter', () => {
  it('should log message', () => {
    mockPrompter.log.step.mockReset();
    log('test');

    expect(mockPrompter.log.step).toHaveBeenCalledWith(
      expect.stringContaining('test')
    );
  });
  it('should log success message', () => {
    mockPrompter.log.success.mockReset();
    logSuccess('test');

    expect(mockPrompter.log.success).toHaveBeenCalledWith(
      expect.stringContaining('test')
    );
  });
  it('should log bullet message', () => {
    mockPrompter.log.message.mockReset();
    logMessage('test');

    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('⦿ test')
    );
  });
  it('should log gray bullet message', () => {
    const spy = jest.spyOn(color, 'gray');
    mockPrompter.log.message.mockReset();
    logMessageGray('test');

    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('⦿ test')
    );
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
  it('should log warning message', () => {
    mockPrompter.log.warning.mockReset();
    logWarning('test');

    expect(mockPrompter.log.warning).toHaveBeenCalledWith(
      expect.stringContaining('test')
    );
  });
  it('should log warning message without color', () => {
    const spy = jest.spyOn(color, 'yellow');
    logWarning('test', true);

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
  it('should log info message', () => {
    mockPrompter.log.info.mockReset();
    logInfo('test');

    expect(mockPrompter.log.info).toHaveBeenCalledWith(
      expect.stringContaining('test')
    );
  });
  it('should log error message', () => {
    mockPrompter.log.error.mockReset();
    logError('test');

    expect(mockPrompter.log.error).toHaveBeenCalledWith(
      expect.stringContaining('test')
    );
  });
  it('should log error message without color', () => {
    const spy = jest.spyOn(color, 'red');
    logError('test', true);

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
  it('should log error message', () => {
    mockPrompter.note.mockReset();
    logNote('test1', 'test2');

    expect(mockPrompter.note).toHaveBeenCalledWith(
      expect.stringContaining('test1'),
      expect.stringContaining('test2')
    );
  });
  it('should log intro message', () => {
    mockPrompter.intro.mockReset();
    logIntro();

    expect(mockPrompter.intro).toHaveBeenCalled();
  });
  it('should log outro message', () => {
    mockPrompter.outro.mockReset();
    logOutro();

    expect(mockPrompter.outro).toHaveBeenCalled();
  });
  it('should start spinner', () => {
    const spinner = mockPrompter.spinner();
    spinner.start.mockReset();
    startSpinner('test');

    expect(spinner.start).toHaveBeenCalled();
  });
  it('should update spinner message', () => {
    const spinner = mockPrompter.spinner();
    spinner.message.mockReset();
    updateSpinner('test');

    expect(spinner.message).toHaveBeenCalled();
  });
  it('should stop spinner', () => {
    const spinner = mockPrompter.spinner();
    spinner.stop.mockReset();
    stopSpinner('test');

    expect(spinner.stop).toHaveBeenCalled();
  });
  it('should confirm', async () => {
    mockPrompter.confirm.mockReset();
    await confirm('test');

    expect(mockPrompter.confirm).toHaveBeenCalled();
  });
  it('should cancel confirm', async () => {
    mockPrompter.confirm.mockReset();
    mockPrompter.isCancel.mockImplementationOnce(() => true);

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-empty-function

    await expect(async () => {
      await confirm('test');
    }).rejects.toThrowError('program aborted');

    expect(mockPrompter.confirm).toHaveBeenCalled();
  });
  it('should cancel test', async () => {
    mockPrompter.text.mockReset();
    mockPrompter.isCancel.mockImplementationOnce(() => true);

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-empty-function

    await expect(async () => {
      await text('test');
    }).rejects.toThrowError('program aborted');

    expect(mockPrompter.text).toHaveBeenCalled();
  });
});

describe('summarize', () => {
  it('should shorten long text', () => {
    const text = 'a'.repeat(150);
    const shortText = 'a'.repeat(100) + '...';

    expect(summarize(text, 100)).toContain(shortText);
  });
  it('should colorize to yellow', () => {
    const spy = jest.spyOn(color, 'yellow');

    summarize('test');

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
  it('should flat new lines', () => {
    // @ts-ignore
    jest.spyOn(color, 'yellow').mockImplementationOnce(msg => msg);
    const summarized = summarize('test1\ntest2\ntest3');

    expect(summarized).toEqual('test1⏎test2⏎test3');
  });
  it('should support null', () => {
    // @ts-ignore
    jest.spyOn(color, 'yellow').mockImplementationOnce(msg => msg);
    const summarized = summarize(null);

    expect(summarized).toEqual('null');
  });
});
