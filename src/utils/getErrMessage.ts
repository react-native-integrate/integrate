export function getErrMessage(e: unknown, type?: string): string {
  const shapeMessage = (msg: string) => {
    switch (type) {
      case 'validation':
        return msg.split(',')[0];
      default:
        return msg;
    }
  };
  return e instanceof Error ? shapeMessage(e.message) : 'An error occurred';
}
