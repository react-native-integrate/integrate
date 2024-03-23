export function parseArgs(argString: string) {
  const parsedArgs = [];
  if (argString) {
    let arg = '',
      quotes = false;
    for (let i = 0; i < argString.length; i++) {
      if (argString[i] == '"' && (i == 0 || argString[i - 1] != '\\')) {
        if (quotes) {
          if (arg) parsedArgs.push(arg);
          arg = '';
          quotes = false;
        } else quotes = true;
      } else if (argString[i] == ' ' && !quotes) {
        if (arg) parsedArgs.push(arg);
        arg = '';
      } else if (argString[i] == '\\' && (i == 0 || argString[i - 1] != '\\')) {
        // noinspection UnnecessaryContinueJS
        continue;
      } else arg += argString[i];
    }
    if (arg) parsedArgs.push(arg);
  }
  return parsedArgs;
}
