import { variables } from '../variables';
import { getPackageUpgradeConfig } from './packageUpgradeConfig';

export function handlePackageUpgradeInput(
  packageName: string,
  inputName: string
): boolean {
  const isUpgrade = variables.get('__UPGRADE__') == true;
  if (!isUpgrade) return false;

  // get from .upgrade folder
  const packageUpgradeConfig = getPackageUpgradeConfig(packageName);

  // check if input is defined
  if (!packageUpgradeConfig.inputs) return false;

  const inputValue = packageUpgradeConfig.inputs[inputName];

  // check if input has value
  if (!inputValue) return false;

  // set input value to variables
  variables.set(inputName, inputValue);
  return true;
}
