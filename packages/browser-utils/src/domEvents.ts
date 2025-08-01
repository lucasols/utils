type RemoveListenerFn = () => void;

export function createDocumentEvtListener<K extends keyof DocumentEventMap>(
  type: K,
  listener: (e: DocumentEventMap[K]) => void,
  options?: AddEventListenerOptions,
): RemoveListenerFn {
  function cb(e: DocumentEventMap[K]) {
    listener(e);
  }

  document.addEventListener(type, cb, options);

  return () => document.removeEventListener(type, cb, options);
}

export function createElementEvtListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  type: K,
  listener: (e: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions,
): RemoveListenerFn {
  function cb(e: HTMLElementEventMap[K]) {
    listener(e);
  }

  element.addEventListener(type, cb, options);

  return () => element.removeEventListener(type, cb, options);
}

export function createWindowEvtListener<K extends keyof WindowEventMap>(
  type: K,
  listener: (e: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions,
): RemoveListenerFn {
  function cb(e: WindowEventMap[K]) {
    listener(e);
  }

  globalThis.addEventListener(type, cb, options);

  return () => globalThis.removeEventListener(type, cb, options);
}

export async function onElementTransitionsEnd(
  element: HTMLElement,
  cb: () => void,
) {
  const animations = element.getAnimations();

  if (animations.length) {
    await Promise.allSettled(animations.map((animation) => animation.finished));
  }

  cb();
}
