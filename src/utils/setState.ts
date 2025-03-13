import { TaskState } from '../types/mod.types';
import { variables } from '../variables';

export function setState(name: string | undefined, state: TaskState): void {
  if (name) {
    if (state.state == 'done') {
      const currentState = variables.get<TaskState['state']>(name);
      if (currentState && currentState != 'progress') return;
    }
    variables.set(name, state.state);
    variables.set('reason.' + name, state.reason);
  }
}
