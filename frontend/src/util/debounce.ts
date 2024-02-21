export function debounce<
  T extends (...args: any[]) => void,
  ThisType = unknown,
>(
  func: (this: ThisType, ...args: Parameters<T>) => void,
  wait: number,
): (this: ThisType, ...funcArgs: Parameters<T>) => void {
  let timeoutId: number | undefined;

  return function (this: ThisType, ...args: Parameters<T>) {
    const context = this;
    const later = () => {
      timeoutId = undefined;
      func.apply(context, args);
    };

    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(later, wait);
  };
}
