export function throttle<
  T extends (...args: any[]) => void,
  ThisType = unknown
>(
  func: (this: ThisType, ...args: Parameters<T>) => void,
  limit: number
): (this: ThisType, ...funcArgs: Parameters<T>) => void {
  let lastFunc: number;
  let lastRan: number;

  return function (this: ThisType, ...args: Parameters<T>) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = window.setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}
