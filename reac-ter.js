/*
   tracks any property 'p' of any object 'obj' by allowing to add a setter/getter in instance
   of this class with same name 'p'
   method for tracking 'obj.p': addProperty(obj, p)
   interest of this class sits in its $watcher property which contains the very
   same properties 'p'. Each of those properties is an array which can contain function which
   are called upon calling the setter for property 'p'
   prototype of those functions: f(oldValue, newValue, key)
   it's up to the user to populate array $watcher[p]
   advanced features:
    - addProperty also accepts a key alias which will replace 'p' in the class
      instance. this is useful to avoid name clashes in different properties 'p'
    - if constructor sets argument 'useGetWatchers' to true, then a property '$getWatchers'
      will be attached to setter, works much the same way '$watchers' does except for prototype
      of attached functions: f(value, key)
    - deleteProperty can remove 'p' (or alias) from object of this class
 */
class ReacTer {
  constructor(useGetWatchers = false) {
    Object.defineProperty(this, "$watchers", {
      enumerable: false,
      configurable: false,
      writable: true,
      value: {},
    });
    if (useGetWatchers === true) {
      Object.defineProperty(this, "$getWatchers", {
        enumerable: false,
        configurable: false,
        writable: true,
        value: {},
      });
    }
  }
  addProperty(originalObject, keyString, aliasKeyString) {
    if (aliasKeyString === undefined) {
      aliasKeyString = keyString;
    }
    if (typeof originalObject !== "object" || this[aliasKeyString] !== undefined) {
      const errorMessage = `ReacTer: cannot add property '${aliasKeyString}'!`;
      throw errorMessage;
    }
    this.$watchers[aliasKeyString] = [];
    if (this.$getWatchers) {
      this.$getWatchers[aliasKeyString] = [];
    }
    Object.defineProperty(this, aliasKeyString, {
      enumerable: true,
      configurable: true,
      set(newValue) {
        const oldValue = originalObject[keyString];
        originalObject[keyString] = newValue;
        this.$watchers[aliasKeyString].forEach((f) => {
          if (typeof f === "function") {
            f(newValue, oldValue, aliasKeyString);
          }
        });
      },
      get() {
        if (this.$getWatchers) {
          this.$getWatchers[aliasKeyString].forEach((f) => {
            if (typeof f === "function") {
              f(originalObject[keyString], aliasKeyString);
            }
          });
        }
        return originalObject[keyString];
      },
    });
    this[aliasKeyString] = originalObject[keyString];
  }
  deleteProperty(keyStringOrAlias) {
    const result = this.hasOwnProperty(keyStringOrAlias);
    if (result) {
      delete this[keyStringOrAlias];
    }
    try {
      delete this.$watchers[keyStringOrAlias];
    } catch (e) {}
    try {
      delete this.$getWatchers[keyStringOrAlias];
    } catch (e) {}
    return result;
  }
}

module.exports = ReacTer;
