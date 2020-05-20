import { Dispatcher } from './messaging.js';

// cache dispatchers
const dispatchMap = new WeakMap();

const getDispatcher = (target) => {
  if (!dispatchMap.has(target)) {
    // naive unique number generator
    const randomId = Math.random().toString() + Date.now.toString();
    dispatchMap.set(target, Dispatcher(randomId));
  }
  return dispatchMap.get(target);
};


function createProxy(target, prefix = '', rootDispatcher) {
  if (typeof target !== 'object') {
    return {
      watch: () => {},
      value: target,
    };
  }
  const dispatcher = rootDispatcher || getDispatcher(target);
  /** @type ProxyHandler */
  const handler = {
    get: function (o, key) {
      return o[key];
    },
    set: function (o, key, value) {
      const path = prefix + '.' + key;
      o[key] = createProxy(value, prefix + '.' + key, dispatcher).value;
      dispatcher.emit(prefix + '.' + key, value);
      return true;
    },
    deleteProperty: function (o, key) {
      const path = prefix + '.' + key;
      delete o[key];
      dispatcher.emit(prefix + '.' + key, value);
      return true;
    },
    defineProperty: function (o, key, descriptor) {
      Object.defineProperty(o, key, descriptor);
      const path = prefix + '.' + key;
      dispatcher.emit(prefix + '.' + key, value);
      return true;
    },
  };
  const proxy = new Proxy(target, handler);
  Object.keys(target).forEach((key) => {
    target[key] = createProxy(
      target[key],
      prefix + '.' + key,
      dispatcher
    ).value;
    dispatcher.emit(prefix + '.' + key, target[key]);
  });
  return {
    watch: (path, callback) => dispatcher.on(path, callback),
    value: proxy,
  };
}

export function Observable(target = {}) {
  return createProxy(target);
}