import { eventBus } from './messaging.js';

const tagged = new WeakSet();

export function createState(target = {}, bus = eventBus(), prefix = '') {
  if (typeof target === 'object' && target !== null && !tagged.has(target)) {
    const p = new Proxy(target, {
      get: (t, k) => t[k],
      set: (t, key, value) => {
        const path = prefix ? prefix + '.' + key : key;
        if (t[key] !== value) {
          const newValue = createState(value, bus, path);
          if (tagged.has(value)) {
            t[key] = newValue.state;
          } else {
            t[key] = newValue;
          }
          bus.emit('change', {
            key: path,
            value,
          });
          bus.emit(path, value);
        }
        return true;
      },
    });
    tagged.add(target);
    Object.keys(target).forEach((key) => {
      const path = prefix ? prefix + '.' + key : key;
      let upgraded = createState(target[key], bus, path);
      if (tagged.has(target[key])) {
        upgraded = upgraded.state;
      }
      target[key] = upgraded;
      bus.emit(path, upgraded);
      bus.emit('change', { key: path, value: upgraded });
    });
    return {
      state: p,
      on: bus.on.bind(bus),
    };
  }
  return target;
}
