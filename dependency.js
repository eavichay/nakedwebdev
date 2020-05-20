
/** @type Record<string, any> */
const factories = {};

/**
 * 
 * @param {string} name 
 * @param {any}} factory 
 */
export function define(name, factory) {
  if (factories[name]) {
    throw new Error('Cannot redefine ', + name);
  }
  factories[name] = factory;
}

function resolve(name) {
  if (name in factories) {
    return factories[name]();
  } else {
    throw new Error('Cannot resolve ', + name);
  }
}

/**
 * 
 * @param {function(new: any)} [BaseClass]
 * @return {typeof BaseClass}
 */
export function DependencyInjectionMixin(BaseClass = class {}) {
    return class extends BaseClass {
        constructor() {
            super();
            /**
             * @type Record<string, any>
             */
            this.injections = {};
            const dependencies = this.constructor.dependencies || [];
            dependencies.forEach(dependencyName => {
                this.injections[dependencyName] = resolve(dependencyName);
            });
        }
    }
}