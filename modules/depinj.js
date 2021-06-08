const registry = {};

/**
 * 
 * @param {string} key 
 * @param {function} value factory function
 */
export function define(key, value) {
  registry[key] = value;
}

function provide(target, key) {
  const factory = registry[key];
  if (factory) {
    target[key] = factory();
  }
}

export function depInj(Base) {
  return class extends Base {
    constructor(...args) {
      super(...args);
      const inject = this.constructor.inject || []; // access to static property "inject";
      inject.forEach(key => {
        provide(this.dependencies = {}, key);
      });
    }
  }
}