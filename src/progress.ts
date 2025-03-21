import { spinner } from '@clack/prompts';
import color from 'picocolors';

class Progress {
  spinner?: {
    start: (msg?: string) => void;
    stop: (msg?: string, code?: number) => void;
    message: (msg?: string) => void;
  };
  options: ProgressOptions = {
    title: '',
    step: 0,
    total: 1,
    stage: '',
  };
  isActive = false;

  setOptions(opts: Partial<ProgressOptions>) {
    Object.assign(this.options, opts);
    if (this.isActive) this.spinner?.message(this.drawMessage());
  }

  drawMessage() {
    const stepRate = !this.options.total
      ? 0
      : Math.min(1, Math.max(0, this.options.step / this.options.total));
    const barSize = 20;
    const scaledStep = Math.floor(stepRate * barSize);
    const completeBars = new Array(scaledStep).fill('\u2588').join('');
    const uncompleteBars = new Array(barSize - scaledStep)
      .fill('\u2588')
      .join('');
    const bar = `${color.cyan(completeBars)}${color.dim(color.gray(uncompleteBars))}`;

    return `${this.options.title} [${bar}] ${color.cyan(this.options.stage)}`;
  }

  display() {
    if (!this.isActive) {
      this.isActive = true;
      this.spinner = spinner();
      this.spinner.start(this.drawMessage());
    }
  }

  hide() {
    if (this.isActive) {
      this.isActive = false;
      this.spinner?.stop();
      process.stdout.moveCursor(0, -2); // up one line
      process.stdout.clearLine(1); // from cursor to end
    }
  }
}

export const progress = new Progress();

export type ProgressOptions = {
  title: string;
  step: number;
  total: number;
  stage: string;
};
