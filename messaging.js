/**
 * @typedef IDispatcher
 * @property {(name: string, callback: Function) => Function} on
 * @property {(name: string, value?: any) => void} emit
 */

/**
 * @type Record<string, IDispatcher>
 * @returns IDispatcher
 */
const pool = {};


/**
 * @param {string} namespace 
 * @returns IDispatcher
 */
export function Dispatcher(namespace = '') {
  const eventTarget = document.createElement('dispatcher');
  const result = pool[namespace] || {
    on: function (eventName, callback) {
      const trigger = (e) => callback(e.detail);
      eventTarget.addEventListener(eventName, trigger);
      return function () {
        eventTarget.removeEventListener(eventName, trigger);
      };
    },
    emit: function (eventName, value) {
      eventTarget.dispatchEvent(
        new CustomEvent(eventName, {
          detail: value,
        })
      );
    },
  };
  if (namespace) {
    pool[namespace] = result;
  }
  return result;
}
