const listeners = new Set();

export function subscribe(fn) {
  listeners.add(fn);
}

export function unsubscribe(fn) {
  listeners.delete(fn);
}

export function emit() {
  for (const fn of listeners) {
    fn();
  }
}