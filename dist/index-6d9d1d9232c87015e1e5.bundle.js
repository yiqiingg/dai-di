/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");


/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var createGameButton = document.getElementById("create-game");
var refreshInvitesButton = document.getElementById("refresh-invites");
var sendInvitesButton = document.getElementById("start-game");
var setPlayersDiv = document.getElementById("create");
var acceptInvitesDiv = document.getElementById("invitation");
var gameDiv = document.getElementById("game");
var gameStatus = document.getElementById("gameStatus");
var cardCombination = document.getElementById("combination");
var fetchGameButton = document.getElementById("fetch-game");
var newGameNavLink = document.getElementById("newGame");
var seeInvitesLink = document.getElementById("seeInvites");
fetchGameButton.addEventListener("click", function () {
  gameDiv.setAttribute("style", "display:block");
});

var cardStyle = function cardStyle(card) {
  if (card.getAttribute("class") === "cards clicked") {
    card.setAttribute("style", "border:0mm ");
    card.setAttribute("class", "cards");
  } else {
    card.setAttribute("style", "border:2px solid rgba(3, 123, 252) ");
    card.setAttribute("class", "cards clicked");
  }
};

var card1 = document.getElementById("card1");
var card2 = document.getElementById("card2");
var card3 = document.getElementById("card3");
var card4 = document.getElementById("card4");
var card5 = document.getElementById("card5");
var card6 = document.getElementById("card6");
var card7 = document.getElementById("card7");
var card8 = document.getElementById("card8");
var card9 = document.getElementById("card9");
var card10 = document.getElementById("card10");
var card11 = document.getElementById("card11");
var card12 = document.getElementById("card12");
var card13 = document.getElementById("card13");
card1.addEventListener("click", function () {
  cardStyle(card1);
});
card2.addEventListener("click", function () {
  cardStyle(card2);
});
card3.addEventListener("click", function () {
  cardStyle(card3);
});
card4.addEventListener("click", function () {
  cardStyle(card4);
});
card5.addEventListener("click", function () {
  cardStyle(card5);
});
card6.addEventListener("click", function () {
  cardStyle(card6);
});
card7.addEventListener("click", function () {
  cardStyle(card7);
});
card8.addEventListener("click", function () {
  cardStyle(card8);
});
card9.addEventListener("click", function () {
  cardStyle(card9);
});
card10.addEventListener("click", function () {
  cardStyle(card10);
});
card11.addEventListener("click", function () {
  cardStyle(card11);
});
card12.addEventListener("click", function () {
  cardStyle(card12);
});
card13.addEventListener("click", function () {
  cardStyle(card13);
});
var showCards = document.getElementById("showCards");
var refreshButton = document.getElementById("refresh");
var playCardsButton = document.getElementById("submit");
var skipButton = document.getElementById("skip");

var createGameHandler = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
    var users, player1Element, _loop, _i;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            setPlayersDiv.setAttribute("style", "display:block");
            createGameButton.setAttribute("style", "display:none");
            sendInvitesButton.setAttribute("style", "display:block");
            _context.next = 5;
            return axios.get("/create");

          case 5:
            users = _context.sent;
            console.log(users, "hi");
            player1Element = document.createElement("p");
            player1Element.innerHTML = "You are Player 1";
            setPlayersDiv.appendChild(player1Element);

            _loop = function _loop(_i) {
              var selectElement = document.createElement("select");
              setPlayersDiv.appendChild(selectElement);
              selectElement.setAttribute("id", "player".concat(_i + 2));
              var optionDefault = document.createElement("option");
              optionDefault.setAttribute("value", "");
              optionDefault.setAttribute("disabled", "");
              optionDefault.setAttribute("id", "Player".concat(_i + 2));
              optionDefault.setAttribute("selected", "");
              optionDefault.innerHTML = "Player".concat(_i + 2);
              selectElement.appendChild(optionDefault);
              users.data.forEach(function (user) {
                var option = document.createElement("option");
                option.setAttribute("value", user.id);
                option.innerHTML = user.name;
                selectElement.appendChild(option);
              });
            };

            for (_i = 0; _i < 3; _i++) {
              _loop(_i);
            }

          //on click will get all players name from db and create 4 drop downs

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function createGameHandler() {
    return _ref.apply(this, arguments);
  };
}();

var fetchInvitesHandler = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee2() {
    var invites, invitations;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            acceptInvitesDiv.setAttribute("styles", "display:block");
            _context2.next = 3;
            return axios.get("/invites");

          case 3:
            invites = _context2.sent;
            console.log(invites);
            invitations = invites.data;
            invitations.forEach(function (invite) {
              if (invite.gameState === "pending") {
                var inviteCard = document.createElement("div");
                var acceptInvite = document.createElement("button");
                acceptInvite.innerHTML = "Join Game";
                inviteCard.innerHTML = "You got a game invite. for game ".concat(invite.id);
                acceptInvite.setAttribute("id", invite.id);
                acceptInvite.setAttribute("class", "game-invite-button");
                acceptInvitesDiv.appendChild(inviteCard);
                inviteCard.appendChild(acceptInvite);
                acceptInvite.addEventListener("click", function () {
                  joinGame(invite.id);
                });
              }
            });

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetchInvitesHandler() {
    return _ref2.apply(this, arguments);
  };
}();

newGameNavLink.addEventListener("click", createGameHandler);
createGameButton.addEventListener("click", createGameHandler);

var selectedOption = function selectedOption(sel) {
  console.log(sel);

  for (i = 0; i < sel.length; i++) {
    if (sel.option[i] === true) {
      console.log(sel.option[i].value);
      return sel.option[i].value;
    }
  }

  sel.forEach(function (option) {
    if (option.selected) {
      console.log(option.value);
      return option.value;
    }
  });
};

var sendInvitesHandler = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee3() {
    var player2, player2Id, player3, player3Id, player4, player4Id, data, sendInvites;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            player2 = document.getElementById("player2");
            player2Id = player2.value;
            player3 = document.getElementById("player3");
            player3Id = player3.value;
            player4 = document.getElementById("player4");
            player4Id = player4.value;
            console.log(document.cookie.split("=")[1]);
            console.log(player2Id, player3Id, player4Id);
            data = {
              player2Id: player2Id,
              player3Id: player3Id,
              player4Id: player4Id
            };
            console.log(data);
            _context3.next = 12;
            return axios.post("/invite", data);

          case 12:
            sendInvites = _context3.sent;
            setPlayersDiv.setAttribute("style", "display:none");

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function sendInvitesHandler() {
    return _ref3.apply(this, arguments);
  };
}();

seeInvitesLink.addEventListener("click", fetchInvitesHandler);
sendInvitesButton.addEventListener("click", sendInvitesHandler);

var joinGame = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee4(gameId) {
    var initGame, playerCardsHTML;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            gameDiv.setAttribute("style", "display:block");
            acceptInvitesDiv.setAttribute("style", "display:none");
            _context4.next = 4;
            return axios.post("/init", {
              gameId: gameId
            });

          case 4:
            initGame = _context4.sent;
            console.log(initGame);
            console.log(initGame.data.gameData.gameState);

            if (initGame.data.gameData.gameState === "pending") {
              gameStatus.innerHTML = "Waiting for ".concat(initGame.data.waitingForNumOfPlayers, " players");
            }

            if (initGame.data.gameData.gameState === "In Progress") {
              gameStatus.innerHTML = "Sequence to play: Player1 -> Player2 -> Player3 -> Player4, starting with Player ".concat(initGame.data.startingIndex + 1, " who has 3 of diamonds.<br>You are Player ").concat(initGame.data.playerNumber + 1);
              playerCardsHTML = document.querySelectorAll(".cards");
              playerCardsHTML.forEach(function (card, index) {
                card.setAttribute("src", "".concat(initGame.data.playerCards[index].link));
              });
            }

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function joinGame(_x) {
    return _ref4.apply(this, arguments);
  };
}();

refreshInvitesButton.addEventListener("click", fetchInvitesHandler);

var showPlayerCards = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee5() {
    var cards, playerCardsHTML;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return axios.get("/cards");

          case 2:
            cards = _context5.sent;
            console.log(cards);
            playerCardsHTML = document.querySelectorAll(".cards");
            playerCardsHTML.forEach(function (card, index) {
              if (index < cards.data.length) {
                card.setAttribute("src", "".concat(cards.data[index].link));
              } else {
                card.setAttribute("style", "display:none");
              }
            });

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function showPlayerCards() {
    return _ref5.apply(this, arguments);
  };
}();

showCards.addEventListener("click", showPlayerCards);

var refreshGame = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee6() {
    var previousRound, startingIndex, playerNumber, gameMessage;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return axios.get("/refresh");

          case 2:
            previousRound = _context6.sent;
            console.log(previousRound);
            startingIndex = document.cookie.split("; ").find(function (row) {
              return row.startsWith("startingPlayer=");
            }).split("=")[1];
            playerNumber = document.cookie.split("; ").find(function (row) {
              return row.startsWith("playerNumber=");
            }).split("=")[1];
            gameMessage = "Sequence to play: Player1 -> Player2 -> Player3 -> Player4, starting with Player ".concat(Number(startingIndex) + 1, " who has 3 of diamonds.<br>You are Player ").concat(playerNumber);

            if (previousRound.data[0].playerId === null && previousRound.data[0].skipCounter === null) {
              gameMessage += "<br>It is Player ".concat(Number(startingIndex) + 1, "'s turn");
            } else if (previousRound.data[0].skipCounter === 3) {
              gameMessage += "<br>It is your turn. As all previous players have skipped, you can put down a new combination";
            } else if (previousRound.data.length === 2) {
              gameMessage += "The combination is ".concat(previousRound.data[0].cardsPlayed.length, " cards, ").concat(previousRound.data[0].player, " has played his turn, it is the next player's turn<br>Last Combination played is: ").concat(previousRound.data[0].cardsPlayed, " ");
            } else {
              gameMessage += "The combination is ".concat(previousRound.data[1].cardsPlayed.length, " cards, ").concat(previousRound.data[0].player, " has played his turn, it is the next player's turn<br>Last Combination played is: ").concat(previousRound.data[1].cardsPlayed, " ");
            }

            gameStatus.innerHTML = gameMessage;

            if (previousRound.data[previousRound.data.length - 1].winner) {
              cardCombination.innerHTML = "The game has ended, and ".concat(previousRound.data[0].player, " has won the game");
            }

          case 10:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function refreshGame() {
    return _ref6.apply(this, arguments);
  };
}();

refreshButton.addEventListener("click", refreshGame);
playCardsButton.addEventListener("click", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee7() {
  var cardsHTML, cardsPlayed, cardsRemaining, createRound;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          console.log("clicked");
          cardsHTML = document.querySelectorAll(".cards");
          cardsPlayed = [];
          cardsRemaining = [];
          console.log(cardsHTML);
          cardsHTML.forEach(function (card) {
            if (card.getAttribute("src")) {
              console.log(card.getAttribute("src"));
              var cardDescription = card.getAttribute("src").split("cards/")[1].split(".png")[0];
              var cardSuit = cardDescription.split("_")[2];
              var cardName = cardDescription.split("_")[0];
              var cardRank;

              switch (cardName) {
                case "ace":
                  cardRank = 1;
                  break;

                case "king":
                  cardRank = 13;
                  break;

                case "queen":
                  cardRank = 12;
                  break;

                case "jack":
                  cardRank = 11;
                  break;

                default:
                  cardRank = cardName;
              }

              if (card.getAttribute("class") === "cards clicked") {
                gameDiv.removeChild(card);
                console.log("played", card);
                cardsPlayed.push({
                  name: cardName,
                  rank: cardRank,
                  suit: cardSuit,
                  link: card.getAttribute("src")
                });
              } else if (card.getAttribute("class") === "cards" && card.getAttribute("src")) {
                console.log("remained", card);
                cardsRemaining.push({
                  name: cardName,
                  rank: cardRank,
                  suit: cardSuit,
                  link: card.getAttribute("src")
                });
              }
            }
          }); //potential validation for if combination is valid

          _context7.next = 8;
          return axios.post("/playRound", {
            cardsPlayed: cardsPlayed,
            cardsRemaining: cardsRemaining
          });

        case 8:
          createRound = _context7.sent;
          showPlayerCards();
          refreshGame();

          if (cardsRemaining.length == 0) {
            cardCombination.innerHTML = "Congrats you have won the game";
          }

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, _callee7);
})));
skipButton.addEventListener("click", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee8() {
  var skipRound;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return axios.get("/skip");

        case 2:
          skipRound = _context8.sent;

        case 3:
        case "end":
          return _context8.stop();
      }
    }
  }, _callee8);
})));
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcm9qZWN0My8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9yZWdlbmVyYXRvci9pbmRleC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0My8uL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdDMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcHJvamVjdDMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vcHJvamVjdDMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3Byb2plY3QzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcHJvamVjdDMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wcm9qZWN0My8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJjcmVhdGVHYW1lQnV0dG9uIiwiZG9jdW1lbnQiLCJyZWZyZXNoSW52aXRlc0J1dHRvbiIsInNlbmRJbnZpdGVzQnV0dG9uIiwic2V0UGxheWVyc0RpdiIsImFjY2VwdEludml0ZXNEaXYiLCJnYW1lRGl2IiwiZ2FtZVN0YXR1cyIsImNhcmRDb21iaW5hdGlvbiIsImZldGNoR2FtZUJ1dHRvbiIsIm5ld0dhbWVOYXZMaW5rIiwic2VlSW52aXRlc0xpbmsiLCJjYXJkU3R5bGUiLCJjYXJkIiwiY2FyZDEiLCJjYXJkMiIsImNhcmQzIiwiY2FyZDQiLCJjYXJkNSIsImNhcmQ2IiwiY2FyZDciLCJjYXJkOCIsImNhcmQ5IiwiY2FyZDEwIiwiY2FyZDExIiwiY2FyZDEyIiwiY2FyZDEzIiwic2hvd0NhcmRzIiwicmVmcmVzaEJ1dHRvbiIsInBsYXlDYXJkc0J1dHRvbiIsInNraXBCdXR0b24iLCJjcmVhdGVHYW1lSGFuZGxlciIsImF4aW9zIiwidXNlcnMiLCJjb25zb2xlIiwicGxheWVyMUVsZW1lbnQiLCJzZWxlY3RFbGVtZW50IiwiaSIsIm9wdGlvbkRlZmF1bHQiLCJvcHRpb24iLCJ1c2VyIiwiZmV0Y2hJbnZpdGVzSGFuZGxlciIsImludml0ZXMiLCJpbnZpdGF0aW9ucyIsImludml0ZSIsImludml0ZUNhcmQiLCJhY2NlcHRJbnZpdGUiLCJqb2luR2FtZSIsInNlbGVjdGVkT3B0aW9uIiwic2VsIiwic2VuZEludml0ZXNIYW5kbGVyIiwicGxheWVyMiIsInBsYXllcjJJZCIsInBsYXllcjMiLCJwbGF5ZXIzSWQiLCJwbGF5ZXI0IiwicGxheWVyNElkIiwiZGF0YSIsInNlbmRJbnZpdGVzIiwiZ2FtZUlkIiwiaW5pdEdhbWUiLCJwbGF5ZXJDYXJkc0hUTUwiLCJzaG93UGxheWVyQ2FyZHMiLCJjYXJkcyIsImluZGV4IiwicmVmcmVzaEdhbWUiLCJwcmV2aW91c1JvdW5kIiwic3RhcnRpbmdJbmRleCIsInJvdyIsInBsYXllck51bWJlciIsImdhbWVNZXNzYWdlIiwiTnVtYmVyIiwiY2FyZHNIVE1MIiwiY2FyZHNQbGF5ZWQiLCJjYXJkc1JlbWFpbmluZyIsImNhcmREZXNjcmlwdGlvbiIsImNhcmRTdWl0IiwiY2FyZE5hbWUiLCJjYXJkUmFuayIsIm5hbWUiLCJyYW5rIiwic3VpdCIsImxpbmsiLCJjcmVhdGVSb3VuZCIsInNraXBSb3VuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsZ0hBQStDOzs7Ozs7Ozs7OztBQ0EvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxLQUFLO0FBQ0wsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBLHdDQUF3QyxXQUFXO0FBQ25EO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFNBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DLGNBQWM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLGtCQUFrQjtBQUNuRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7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OUJsRSwyQkFBZSxDQUFmQTtBQUNEOztBQWhFdUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQTFDcUI7QUFrRUFDLFVBQVUsQ0FBVkEsOElBQXFDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBQ1hFLEtBQUssQ0FBTEEsSUFEVyxPQUNYQSxDQURXOztBQUFBO0FBQzdCb0QsbUJBRDZCLGlCQUM3QkE7O0FBRDZCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFyQ3RELEsiLCJmaWxlIjoiaW5kZXgtNmQ5ZDFkOTIzMmM4NzAxNWUxZTUuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVnZW5lcmF0b3ItcnVudGltZVwiKTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxudmFyIHJ1bnRpbWUgPSAoZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICBmdW5jdGlvbiBkZWZpbmUob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqW2tleV07XG4gIH1cbiAgdHJ5IHtcbiAgICAvLyBJRSA4IGhhcyBhIGJyb2tlbiBPYmplY3QuZGVmaW5lUHJvcGVydHkgdGhhdCBvbmx5IHdvcmtzIG9uIERPTSBvYmplY3RzLlxuICAgIGRlZmluZSh7fSwgXCJcIik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGRlZmluZSA9IGZ1bmN0aW9uKG9iaiwga2V5LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIG9ialtrZXldID0gdmFsdWU7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIGV4cG9ydHMud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gZGVmaW5lKFxuICAgIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLFxuICAgIHRvU3RyaW5nVGFnU3ltYm9sLFxuICAgIFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICApO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIGRlZmluZShwcm90b3R5cGUsIG1ldGhvZCwgZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBleHBvcnRzLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGRlZmluZShnZW5GdW4sIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvckZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IsIFByb21pc2VJbXBsKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIC8vIElmIGEgcmVqZWN0ZWQgUHJvbWlzZSB3YXMgeWllbGRlZCwgdGhyb3cgdGhlIHJlamVjdGlvbiBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgIHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2VJbXBsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG4gICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG4gICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG4gICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG4gICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG4gICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcbiAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgQXN5bmNJdGVyYXRvci5wcm90b3R5cGVbYXN5bmNJdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIGV4cG9ydHMuQXN5bmNJdGVyYXRvciA9IEFzeW5jSXRlcmF0b3I7XG5cbiAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2ZcbiAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG4gIGV4cG9ydHMuYXN5bmMgPSBmdW5jdGlvbihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCwgUHJvbWlzZUltcGwpIHtcbiAgICBpZiAoUHJvbWlzZUltcGwgPT09IHZvaWQgMCkgUHJvbWlzZUltcGwgPSBQcm9taXNlO1xuXG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpLFxuICAgICAgUHJvbWlzZUltcGxcbiAgICApO1xuXG4gICAgcmV0dXJuIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIC8vIE5vdGU6IFtcInJldHVyblwiXSBtdXN0IGJlIHVzZWQgZm9yIEVTMyBwYXJzaW5nIGNvbXBhdGliaWxpdHkuXG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvcltcInJldHVyblwiXSkge1xuICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoISBpbmZvKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXG4gICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcbiAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG4gICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG4gICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIGRlZmluZShHcCwgdG9TdHJpbmdUYWdTeW1ib2wsIFwiR2VuZXJhdG9yXCIpO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBleHBvcnRzLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGVcbiAgLy8gb3Igbm90LCByZXR1cm4gdGhlIHJ1bnRpbWUgb2JqZWN0IHNvIHRoYXQgd2UgY2FuIGRlY2xhcmUgdGhlIHZhcmlhYmxlXG4gIC8vIHJlZ2VuZXJhdG9yUnVudGltZSBpbiB0aGUgb3V0ZXIgc2NvcGUsIHdoaWNoIGFsbG93cyB0aGlzIG1vZHVsZSB0byBiZVxuICAvLyBpbmplY3RlZCBlYXNpbHkgYnkgYGJpbi9yZWdlbmVyYXRvciAtLWluY2x1ZGUtcnVudGltZSBzY3JpcHQuanNgLlxuICByZXR1cm4gZXhwb3J0cztcblxufShcbiAgLy8gSWYgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlLCB1c2UgbW9kdWxlLmV4cG9ydHNcbiAgLy8gYXMgdGhlIHJlZ2VuZXJhdG9yUnVudGltZSBuYW1lc3BhY2UuIE90aGVyd2lzZSBjcmVhdGUgYSBuZXcgZW1wdHlcbiAgLy8gb2JqZWN0LiBFaXRoZXIgd2F5LCB0aGUgcmVzdWx0aW5nIG9iamVjdCB3aWxsIGJlIHVzZWQgdG8gaW5pdGlhbGl6ZVxuICAvLyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIHZhcmlhYmxlIGF0IHRoZSB0b3Agb2YgdGhpcyBmaWxlLlxuICB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiID8gbW9kdWxlLmV4cG9ydHMgOiB7fVxuKSk7XG5cbnRyeSB7XG4gIHJlZ2VuZXJhdG9yUnVudGltZSA9IHJ1bnRpbWU7XG59IGNhdGNoIChhY2NpZGVudGFsU3RyaWN0TW9kZSkge1xuICAvLyBUaGlzIG1vZHVsZSBzaG91bGQgbm90IGJlIHJ1bm5pbmcgaW4gc3RyaWN0IG1vZGUsIHNvIHRoZSBhYm92ZVxuICAvLyBhc3NpZ25tZW50IHNob3VsZCBhbHdheXMgd29yayB1bmxlc3Mgc29tZXRoaW5nIGlzIG1pc2NvbmZpZ3VyZWQuIEp1c3RcbiAgLy8gaW4gY2FzZSBydW50aW1lLmpzIGFjY2lkZW50YWxseSBydW5zIGluIHN0cmljdCBtb2RlLCB3ZSBjYW4gZXNjYXBlXG4gIC8vIHN0cmljdCBtb2RlIHVzaW5nIGEgZ2xvYmFsIEZ1bmN0aW9uIGNhbGwuIFRoaXMgY291bGQgY29uY2VpdmFibHkgZmFpbFxuICAvLyBpZiBhIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IGZvcmJpZHMgdXNpbmcgRnVuY3Rpb24sIGJ1dCBpbiB0aGF0IGNhc2VcbiAgLy8gdGhlIHByb3BlciBzb2x1dGlvbiBpcyB0byBmaXggdGhlIGFjY2lkZW50YWwgc3RyaWN0IG1vZGUgcHJvYmxlbS4gSWZcbiAgLy8geW91J3ZlIG1pc2NvbmZpZ3VyZWQgeW91ciBidW5kbGVyIHRvIGZvcmNlIHN0cmljdCBtb2RlIGFuZCBhcHBsaWVkIGFcbiAgLy8gQ1NQIHRvIGZvcmJpZCBGdW5jdGlvbiwgYW5kIHlvdSdyZSBub3Qgd2lsbGluZyB0byBmaXggZWl0aGVyIG9mIHRob3NlXG4gIC8vIHByb2JsZW1zLCBwbGVhc2UgZGV0YWlsIHlvdXIgdW5pcXVlIHByZWRpY2FtZW50IGluIGEgR2l0SHViIGlzc3VlLlxuICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImNvbnN0IGNyZWF0ZUdhbWVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZS1nYW1lXCIpO1xuY29uc3QgcmVmcmVzaEludml0ZXNCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlZnJlc2gtaW52aXRlc1wiKTtcbmNvbnN0IHNlbmRJbnZpdGVzQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGFydC1nYW1lXCIpO1xuY29uc3Qgc2V0UGxheWVyc0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3JlYXRlXCIpO1xuY29uc3QgYWNjZXB0SW52aXRlc0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW52aXRhdGlvblwiKTtcbmNvbnN0IGdhbWVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVcIik7XG5jb25zdCBnYW1lU3RhdHVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lU3RhdHVzXCIpO1xuY29uc3QgY2FyZENvbWJpbmF0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21iaW5hdGlvblwiKTtcbmNvbnN0IGZldGNoR2FtZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmV0Y2gtZ2FtZVwiKTtcbmNvbnN0IG5ld0dhbWVOYXZMaW5rID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXdHYW1lXCIpO1xuY29uc3Qgc2VlSW52aXRlc0xpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlZUludml0ZXNcIik7XG5mZXRjaEdhbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgZ2FtZURpdi5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcImRpc3BsYXk6YmxvY2tcIik7XG59KTtcbmNvbnN0IGNhcmRTdHlsZSA9IChjYXJkKSA9PiB7XG4gIGlmIChjYXJkLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpID09PSBcImNhcmRzIGNsaWNrZWRcIikge1xuICAgIGNhcmQuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJib3JkZXI6MG1tIFwiKTtcbiAgICBjYXJkLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiY2FyZHNcIik7XG4gIH0gZWxzZSB7XG4gICAgY2FyZC5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcImJvcmRlcjoycHggc29saWQgcmdiYSgzLCAxMjMsIDI1MikgXCIpO1xuICAgIGNhcmQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJjYXJkcyBjbGlja2VkXCIpO1xuICB9XG59O1xuY29uc3QgY2FyZDEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcmQxXCIpO1xuY29uc3QgY2FyZDIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcmQyXCIpO1xuY29uc3QgY2FyZDMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcmQzXCIpO1xuY29uc3QgY2FyZDQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcmQ0XCIpO1xuY29uc3QgY2FyZDUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcmQ1XCIpO1xuY29uc3QgY2FyZDYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcmQ2XCIpO1xuY29uc3QgY2FyZDcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcmQ3XCIpO1xuY29uc3QgY2FyZDggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcmQ4XCIpO1xuY29uc3QgY2FyZDkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcmQ5XCIpO1xuY29uc3QgY2FyZDEwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJkMTBcIik7XG5jb25zdCBjYXJkMTEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcmQxMVwiKTtcbmNvbnN0IGNhcmQxMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FyZDEyXCIpO1xuY29uc3QgY2FyZDEzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJkMTNcIik7XG5jYXJkMS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBjYXJkU3R5bGUoY2FyZDEpO1xufSk7XG5jYXJkMi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBjYXJkU3R5bGUoY2FyZDIpO1xufSk7XG5jYXJkMy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBjYXJkU3R5bGUoY2FyZDMpO1xufSk7XG5jYXJkNC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBjYXJkU3R5bGUoY2FyZDQpO1xufSk7XG5jYXJkNS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBjYXJkU3R5bGUoY2FyZDUpO1xufSk7XG5jYXJkNi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBjYXJkU3R5bGUoY2FyZDYpO1xufSk7XG5jYXJkNy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBjYXJkU3R5bGUoY2FyZDcpO1xufSk7XG5jYXJkOC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBjYXJkU3R5bGUoY2FyZDgpO1xufSk7XG5jYXJkOS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBjYXJkU3R5bGUoY2FyZDkpO1xufSk7XG5jYXJkMTAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgY2FyZFN0eWxlKGNhcmQxMCk7XG59KTtcbmNhcmQxMS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBjYXJkU3R5bGUoY2FyZDExKTtcbn0pO1xuY2FyZDEyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGNhcmRTdHlsZShjYXJkMTIpO1xufSk7XG5jYXJkMTMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgY2FyZFN0eWxlKGNhcmQxMyk7XG59KTtcbmNvbnN0IHNob3dDYXJkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvd0NhcmRzXCIpO1xuY29uc3QgcmVmcmVzaEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVmcmVzaFwiKTtcbmNvbnN0IHBsYXlDYXJkc0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VibWl0XCIpO1xuY29uc3Qgc2tpcEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2tpcFwiKTtcblxuY29uc3QgY3JlYXRlR2FtZUhhbmRsZXIgPSBhc3luYyAoKSA9PiB7XG4gIHNldFBsYXllcnNEaXYuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJkaXNwbGF5OmJsb2NrXCIpO1xuICBjcmVhdGVHYW1lQnV0dG9uLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiZGlzcGxheTpub25lXCIpO1xuICBzZW5kSW52aXRlc0J1dHRvbi5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcImRpc3BsYXk6YmxvY2tcIik7XG4gIGNvbnN0IHVzZXJzID0gYXdhaXQgYXhpb3MuZ2V0KFwiL2NyZWF0ZVwiKTtcbiAgY29uc29sZS5sb2codXNlcnMsIFwiaGlcIik7XG4gIGNvbnN0IHBsYXllcjFFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gIHBsYXllcjFFbGVtZW50LmlubmVySFRNTCA9IFwiWW91IGFyZSBQbGF5ZXIgMVwiO1xuICBzZXRQbGF5ZXJzRGl2LmFwcGVuZENoaWxkKHBsYXllcjFFbGVtZW50KTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICBjb25zdCBzZWxlY3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcbiAgICBzZXRQbGF5ZXJzRGl2LmFwcGVuZENoaWxkKHNlbGVjdEVsZW1lbnQpO1xuICAgIHNlbGVjdEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiaWRcIiwgYHBsYXllciR7aSArIDJ9YCk7XG4gICAgY29uc3Qgb3B0aW9uRGVmYXVsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgb3B0aW9uRGVmYXVsdC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBcIlwiKTtcbiAgICBvcHRpb25EZWZhdWx0LnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuICAgIG9wdGlvbkRlZmF1bHQuc2V0QXR0cmlidXRlKFwiaWRcIiwgYFBsYXllciR7aSArIDJ9YCk7XG4gICAgb3B0aW9uRGVmYXVsdC5zZXRBdHRyaWJ1dGUoXCJzZWxlY3RlZFwiLCBcIlwiKTtcbiAgICBvcHRpb25EZWZhdWx0LmlubmVySFRNTCA9IGBQbGF5ZXIke2kgKyAyfWA7XG4gICAgc2VsZWN0RWxlbWVudC5hcHBlbmRDaGlsZChvcHRpb25EZWZhdWx0KTtcbiAgICB1c2Vycy5kYXRhLmZvckVhY2goKHVzZXIpID0+IHtcbiAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgICBvcHRpb24uc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgdXNlci5pZCk7XG4gICAgICBvcHRpb24uaW5uZXJIVE1MID0gdXNlci5uYW1lO1xuICAgICAgc2VsZWN0RWxlbWVudC5hcHBlbmRDaGlsZChvcHRpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgLy9vbiBjbGljayB3aWxsIGdldCBhbGwgcGxheWVycyBuYW1lIGZyb20gZGIgYW5kIGNyZWF0ZSA0IGRyb3AgZG93bnNcbn07XG5jb25zdCBmZXRjaEludml0ZXNIYW5kbGVyID0gYXN5bmMgKCkgPT4ge1xuICBhY2NlcHRJbnZpdGVzRGl2LnNldEF0dHJpYnV0ZShcInN0eWxlc1wiLCBcImRpc3BsYXk6YmxvY2tcIik7XG4gIGNvbnN0IGludml0ZXMgPSBhd2FpdCBheGlvcy5nZXQoXCIvaW52aXRlc1wiKTtcbiAgY29uc29sZS5sb2coaW52aXRlcyk7XG4gIGNvbnN0IGludml0YXRpb25zID0gaW52aXRlcy5kYXRhO1xuICBpbnZpdGF0aW9ucy5mb3JFYWNoKChpbnZpdGUpID0+IHtcbiAgICBpZiAoaW52aXRlLmdhbWVTdGF0ZSA9PT0gXCJwZW5kaW5nXCIpIHtcbiAgICAgIGNvbnN0IGludml0ZUNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgY29uc3QgYWNjZXB0SW52aXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgIGFjY2VwdEludml0ZS5pbm5lckhUTUwgPSBcIkpvaW4gR2FtZVwiO1xuICAgICAgaW52aXRlQ2FyZC5pbm5lckhUTUwgPSBgWW91IGdvdCBhIGdhbWUgaW52aXRlLiBmb3IgZ2FtZSAke2ludml0ZS5pZH1gO1xuICAgICAgYWNjZXB0SW52aXRlLnNldEF0dHJpYnV0ZShcImlkXCIsIGludml0ZS5pZCk7XG4gICAgICBhY2NlcHRJbnZpdGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJnYW1lLWludml0ZS1idXR0b25cIik7XG4gICAgICBhY2NlcHRJbnZpdGVzRGl2LmFwcGVuZENoaWxkKGludml0ZUNhcmQpO1xuICAgICAgaW52aXRlQ2FyZC5hcHBlbmRDaGlsZChhY2NlcHRJbnZpdGUpO1xuICAgICAgYWNjZXB0SW52aXRlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGpvaW5HYW1lKGludml0ZS5pZCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcbm5ld0dhbWVOYXZMaW5rLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjcmVhdGVHYW1lSGFuZGxlcik7XG5jcmVhdGVHYW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjcmVhdGVHYW1lSGFuZGxlcik7XG5jb25zdCBzZWxlY3RlZE9wdGlvbiA9IChzZWwpID0+IHtcbiAgY29uc29sZS5sb2coc2VsKTtcbiAgZm9yIChpID0gMDsgaSA8IHNlbC5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzZWwub3B0aW9uW2ldID09PSB0cnVlKSB7XG4gICAgICBjb25zb2xlLmxvZyhzZWwub3B0aW9uW2ldLnZhbHVlKTtcbiAgICAgIHJldHVybiBzZWwub3B0aW9uW2ldLnZhbHVlO1xuICAgIH1cbiAgfVxuICBzZWwuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgaWYgKG9wdGlvbi5zZWxlY3RlZCkge1xuICAgICAgY29uc29sZS5sb2cob3B0aW9uLnZhbHVlKTtcbiAgICAgIHJldHVybiBvcHRpb24udmFsdWU7XG4gICAgfVxuICB9KTtcbn07XG5jb25zdCBzZW5kSW52aXRlc0hhbmRsZXIgPSBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHBsYXllcjIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllcjJcIik7XG4gIGNvbnN0IHBsYXllcjJJZCA9IHBsYXllcjIudmFsdWU7XG4gIGNvbnN0IHBsYXllcjMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllcjNcIik7XG4gIGNvbnN0IHBsYXllcjNJZCA9IHBsYXllcjMudmFsdWU7XG4gIGNvbnN0IHBsYXllcjQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllcjRcIik7XG4gIGNvbnN0IHBsYXllcjRJZCA9IHBsYXllcjQudmFsdWU7XG4gIGNvbnNvbGUubG9nKGRvY3VtZW50LmNvb2tpZS5zcGxpdChcIj1cIilbMV0pO1xuICBjb25zb2xlLmxvZyhwbGF5ZXIySWQsIHBsYXllcjNJZCwgcGxheWVyNElkKTtcbiAgY29uc3QgZGF0YSA9IHtcbiAgICBwbGF5ZXIySWQsXG4gICAgcGxheWVyM0lkLFxuICAgIHBsYXllcjRJZCxcbiAgfTtcbiAgY29uc29sZS5sb2coZGF0YSk7XG4gIGNvbnN0IHNlbmRJbnZpdGVzID0gYXdhaXQgYXhpb3MucG9zdChcIi9pbnZpdGVcIiwgZGF0YSk7XG4gIHNldFBsYXllcnNEaXYuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJkaXNwbGF5Om5vbmVcIik7XG59O1xuc2VlSW52aXRlc0xpbmsuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZldGNoSW52aXRlc0hhbmRsZXIpO1xuc2VuZEludml0ZXNCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNlbmRJbnZpdGVzSGFuZGxlcik7XG5cbmNvbnN0IGpvaW5HYW1lID0gYXN5bmMgKGdhbWVJZCkgPT4ge1xuICBnYW1lRGl2LnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiZGlzcGxheTpibG9ja1wiKTtcbiAgYWNjZXB0SW52aXRlc0Rpdi5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcImRpc3BsYXk6bm9uZVwiKTtcbiAgY29uc3QgaW5pdEdhbWUgPSBhd2FpdCBheGlvcy5wb3N0KFwiL2luaXRcIiwgeyBnYW1lSWQgfSk7XG4gIGNvbnNvbGUubG9nKGluaXRHYW1lKTtcbiAgY29uc29sZS5sb2coaW5pdEdhbWUuZGF0YS5nYW1lRGF0YS5nYW1lU3RhdGUpO1xuICBpZiAoaW5pdEdhbWUuZGF0YS5nYW1lRGF0YS5nYW1lU3RhdGUgPT09IFwicGVuZGluZ1wiKSB7XG4gICAgZ2FtZVN0YXR1cy5pbm5lckhUTUwgPSBgV2FpdGluZyBmb3IgJHtpbml0R2FtZS5kYXRhLndhaXRpbmdGb3JOdW1PZlBsYXllcnN9IHBsYXllcnNgO1xuICB9XG4gIGlmIChpbml0R2FtZS5kYXRhLmdhbWVEYXRhLmdhbWVTdGF0ZSA9PT0gXCJJbiBQcm9ncmVzc1wiKSB7XG4gICAgZ2FtZVN0YXR1cy5pbm5lckhUTUwgPSBgU2VxdWVuY2UgdG8gcGxheTogUGxheWVyMSAtPiBQbGF5ZXIyIC0+IFBsYXllcjMgLT4gUGxheWVyNCwgc3RhcnRpbmcgd2l0aCBQbGF5ZXIgJHtcbiAgICAgIGluaXRHYW1lLmRhdGEuc3RhcnRpbmdJbmRleCArIDFcbiAgICB9IHdobyBoYXMgMyBvZiBkaWFtb25kcy48YnI+WW91IGFyZSBQbGF5ZXIgJHtcbiAgICAgIGluaXRHYW1lLmRhdGEucGxheWVyTnVtYmVyICsgMVxuICAgIH1gO1xuICAgIGNvbnN0IHBsYXllckNhcmRzSFRNTCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZHNcIik7XG4gICAgcGxheWVyQ2FyZHNIVE1MLmZvckVhY2goKGNhcmQsIGluZGV4KSA9PiB7XG4gICAgICBjYXJkLnNldEF0dHJpYnV0ZShcInNyY1wiLCBgJHtpbml0R2FtZS5kYXRhLnBsYXllckNhcmRzW2luZGV4XS5saW5rfWApO1xuICAgIH0pO1xuICB9XG59O1xuXG5yZWZyZXNoSW52aXRlc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZmV0Y2hJbnZpdGVzSGFuZGxlcik7XG5jb25zdCBzaG93UGxheWVyQ2FyZHMgPSBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGNhcmRzID0gYXdhaXQgYXhpb3MuZ2V0KFwiL2NhcmRzXCIpO1xuICBjb25zb2xlLmxvZyhjYXJkcyk7XG4gIGNvbnN0IHBsYXllckNhcmRzSFRNTCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZHNcIik7XG4gIHBsYXllckNhcmRzSFRNTC5mb3JFYWNoKChjYXJkLCBpbmRleCkgPT4ge1xuICAgIGlmIChpbmRleCA8IGNhcmRzLmRhdGEubGVuZ3RoKSB7XG4gICAgICBjYXJkLnNldEF0dHJpYnV0ZShcInNyY1wiLCBgJHtjYXJkcy5kYXRhW2luZGV4XS5saW5rfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYXJkLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiZGlzcGxheTpub25lXCIpO1xuICAgIH1cbiAgfSk7XG59O1xuc2hvd0NhcmRzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzaG93UGxheWVyQ2FyZHMpO1xuY29uc3QgcmVmcmVzaEdhbWUgPSBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHByZXZpb3VzUm91bmQgPSBhd2FpdCBheGlvcy5nZXQoXCIvcmVmcmVzaFwiKTtcbiAgY29uc29sZS5sb2cocHJldmlvdXNSb3VuZCk7XG4gIGNvbnN0IHN0YXJ0aW5nSW5kZXggPSBkb2N1bWVudC5jb29raWVcbiAgICAuc3BsaXQoXCI7IFwiKVxuICAgIC5maW5kKChyb3cpID0+IHJvdy5zdGFydHNXaXRoKFwic3RhcnRpbmdQbGF5ZXI9XCIpKVxuICAgIC5zcGxpdChcIj1cIilbMV07XG4gIGNvbnN0IHBsYXllck51bWJlciA9IGRvY3VtZW50LmNvb2tpZVxuICAgIC5zcGxpdChcIjsgXCIpXG4gICAgLmZpbmQoKHJvdykgPT4gcm93LnN0YXJ0c1dpdGgoXCJwbGF5ZXJOdW1iZXI9XCIpKVxuICAgIC5zcGxpdChcIj1cIilbMV07XG4gIGxldCBnYW1lTWVzc2FnZSA9IGBTZXF1ZW5jZSB0byBwbGF5OiBQbGF5ZXIxIC0+IFBsYXllcjIgLT4gUGxheWVyMyAtPiBQbGF5ZXI0LCBzdGFydGluZyB3aXRoIFBsYXllciAke1xuICAgIE51bWJlcihzdGFydGluZ0luZGV4KSArIDFcbiAgfSB3aG8gaGFzIDMgb2YgZGlhbW9uZHMuPGJyPllvdSBhcmUgUGxheWVyICR7cGxheWVyTnVtYmVyfWA7XG4gIGlmIChcbiAgICBwcmV2aW91c1JvdW5kLmRhdGFbMF0ucGxheWVySWQgPT09IG51bGwgJiZcbiAgICBwcmV2aW91c1JvdW5kLmRhdGFbMF0uc2tpcENvdW50ZXIgPT09IG51bGxcbiAgKSB7XG4gICAgZ2FtZU1lc3NhZ2UgKz0gYDxicj5JdCBpcyBQbGF5ZXIgJHtOdW1iZXIoc3RhcnRpbmdJbmRleCkgKyAxfSdzIHR1cm5gO1xuICB9IGVsc2UgaWYgKHByZXZpb3VzUm91bmQuZGF0YVswXS5za2lwQ291bnRlciA9PT0gMykge1xuICAgIGdhbWVNZXNzYWdlICs9IGA8YnI+SXQgaXMgeW91ciB0dXJuLiBBcyBhbGwgcHJldmlvdXMgcGxheWVycyBoYXZlIHNraXBwZWQsIHlvdSBjYW4gcHV0IGRvd24gYSBuZXcgY29tYmluYXRpb25gO1xuICB9IGVsc2UgaWYgKHByZXZpb3VzUm91bmQuZGF0YS5sZW5ndGggPT09IDIpIHtcbiAgICBnYW1lTWVzc2FnZSArPSBgVGhlIGNvbWJpbmF0aW9uIGlzICR7cHJldmlvdXNSb3VuZC5kYXRhWzBdLmNhcmRzUGxheWVkLmxlbmd0aH0gY2FyZHMsICR7cHJldmlvdXNSb3VuZC5kYXRhWzBdLnBsYXllcn0gaGFzIHBsYXllZCBoaXMgdHVybiwgaXQgaXMgdGhlIG5leHQgcGxheWVyJ3MgdHVybjxicj5MYXN0IENvbWJpbmF0aW9uIHBsYXllZCBpczogJHtwcmV2aW91c1JvdW5kLmRhdGFbMF0uY2FyZHNQbGF5ZWR9IGA7XG4gIH0gZWxzZSB7XG4gICAgZ2FtZU1lc3NhZ2UgKz0gYFRoZSBjb21iaW5hdGlvbiBpcyAke3ByZXZpb3VzUm91bmQuZGF0YVsxXS5jYXJkc1BsYXllZC5sZW5ndGh9IGNhcmRzLCAke3ByZXZpb3VzUm91bmQuZGF0YVswXS5wbGF5ZXJ9IGhhcyBwbGF5ZWQgaGlzIHR1cm4sIGl0IGlzIHRoZSBuZXh0IHBsYXllcidzIHR1cm48YnI+TGFzdCBDb21iaW5hdGlvbiBwbGF5ZWQgaXM6ICR7cHJldmlvdXNSb3VuZC5kYXRhWzFdLmNhcmRzUGxheWVkfSBgO1xuICB9XG4gIGdhbWVTdGF0dXMuaW5uZXJIVE1MID0gZ2FtZU1lc3NhZ2U7XG4gIGlmIChwcmV2aW91c1JvdW5kLmRhdGFbcHJldmlvdXNSb3VuZC5kYXRhLmxlbmd0aCAtIDFdLndpbm5lcikge1xuICAgIGNhcmRDb21iaW5hdGlvbi5pbm5lckhUTUwgPSBgVGhlIGdhbWUgaGFzIGVuZGVkLCBhbmQgJHtwcmV2aW91c1JvdW5kLmRhdGFbMF0ucGxheWVyfSBoYXMgd29uIHRoZSBnYW1lYDtcbiAgfVxufTtcbnJlZnJlc2hCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlZnJlc2hHYW1lKTtcbnBsYXlDYXJkc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuICBjb25zb2xlLmxvZyhcImNsaWNrZWRcIik7XG4gIGNvbnN0IGNhcmRzSFRNTCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZHNcIik7XG4gIGNvbnN0IGNhcmRzUGxheWVkID0gW107XG4gIGNvbnN0IGNhcmRzUmVtYWluaW5nID0gW107XG4gIGNvbnNvbGUubG9nKGNhcmRzSFRNTCk7XG4gIGNhcmRzSFRNTC5mb3JFYWNoKChjYXJkKSA9PiB7XG4gICAgaWYgKGNhcmQuZ2V0QXR0cmlidXRlKFwic3JjXCIpKSB7XG4gICAgICBjb25zb2xlLmxvZyhjYXJkLmdldEF0dHJpYnV0ZShcInNyY1wiKSk7XG4gICAgICBjb25zdCBjYXJkRGVzY3JpcHRpb24gPSBjYXJkXG4gICAgICAgIC5nZXRBdHRyaWJ1dGUoXCJzcmNcIilcbiAgICAgICAgLnNwbGl0KFwiY2FyZHMvXCIpWzFdXG4gICAgICAgIC5zcGxpdChcIi5wbmdcIilbMF07XG4gICAgICBjb25zdCBjYXJkU3VpdCA9IGNhcmREZXNjcmlwdGlvbi5zcGxpdChcIl9cIilbMl07XG4gICAgICBjb25zdCBjYXJkTmFtZSA9IGNhcmREZXNjcmlwdGlvbi5zcGxpdChcIl9cIilbMF07XG4gICAgICBsZXQgY2FyZFJhbms7XG4gICAgICBzd2l0Y2ggKGNhcmROYW1lKSB7XG4gICAgICAgIGNhc2UgXCJhY2VcIjpcbiAgICAgICAgICBjYXJkUmFuayA9IDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJraW5nXCI6XG4gICAgICAgICAgY2FyZFJhbmsgPSAxMztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInF1ZWVuXCI6XG4gICAgICAgICAgY2FyZFJhbmsgPSAxMjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImphY2tcIjpcbiAgICAgICAgICBjYXJkUmFuayA9IDExO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNhcmRSYW5rID0gY2FyZE5hbWU7XG4gICAgICB9XG4gICAgICBpZiAoY2FyZC5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSA9PT0gXCJjYXJkcyBjbGlja2VkXCIpIHtcbiAgICAgICAgZ2FtZURpdi5yZW1vdmVDaGlsZChjYXJkKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJwbGF5ZWRcIiwgY2FyZCk7XG4gICAgICAgIGNhcmRzUGxheWVkLnB1c2goe1xuICAgICAgICAgIG5hbWU6IGNhcmROYW1lLFxuICAgICAgICAgIHJhbms6IGNhcmRSYW5rLFxuICAgICAgICAgIHN1aXQ6IGNhcmRTdWl0LFxuICAgICAgICAgIGxpbms6IGNhcmQuZ2V0QXR0cmlidXRlKFwic3JjXCIpLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGNhcmQuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgPT09IFwiY2FyZHNcIiAmJlxuICAgICAgICBjYXJkLmdldEF0dHJpYnV0ZShcInNyY1wiKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVtYWluZWRcIiwgY2FyZCk7XG4gICAgICAgIGNhcmRzUmVtYWluaW5nLnB1c2goe1xuICAgICAgICAgIG5hbWU6IGNhcmROYW1lLFxuICAgICAgICAgIHJhbms6IGNhcmRSYW5rLFxuICAgICAgICAgIHN1aXQ6IGNhcmRTdWl0LFxuICAgICAgICAgIGxpbms6IGNhcmQuZ2V0QXR0cmlidXRlKFwic3JjXCIpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICAvL3BvdGVudGlhbCB2YWxpZGF0aW9uIGZvciBpZiBjb21iaW5hdGlvbiBpcyB2YWxpZFxuICBjb25zdCBjcmVhdGVSb3VuZCA9IGF3YWl0IGF4aW9zLnBvc3QoXCIvcGxheVJvdW5kXCIsIHtcbiAgICBjYXJkc1BsYXllZCxcbiAgICBjYXJkc1JlbWFpbmluZyxcbiAgfSk7XG4gIHNob3dQbGF5ZXJDYXJkcygpO1xuICByZWZyZXNoR2FtZSgpO1xuICBpZiAoY2FyZHNSZW1haW5pbmcubGVuZ3RoID09IDApIHtcbiAgICBjYXJkQ29tYmluYXRpb24uaW5uZXJIVE1MID0gXCJDb25ncmF0cyB5b3UgaGF2ZSB3b24gdGhlIGdhbWVcIjtcbiAgfVxufSk7XG5za2lwQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHNraXBSb3VuZCA9IGF3YWl0IGF4aW9zLmdldChcIi9za2lwXCIpO1xufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9