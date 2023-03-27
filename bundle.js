/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 757:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(666);


/***/ }),

/***/ 226:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "static/a5e2a5e0b54a910c7b45170a978e14ae.png";

/***/ }),

/***/ 666:
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
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

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
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
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
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
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
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

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
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),

/***/ 338:
/***/ ((module) => {

"use strict";
module.exports = "@binding(0) @group(0) var mySampler: sampler;\n@binding(1) @group(0) var myTexture: texture_2d<f32>;\n\n@fragment\nfn main(@location(0) fragUV: vec2<f32>) -> @location(0) vec4<f32> {\n  return textureSample(myTexture, mySampler, fragUV);\n}\n";

/***/ }),

/***/ 850:
/***/ ((module) => {

"use strict";
module.exports = "struct VSOut {\n    @builtin(position) Position: vec4<f32>,\n    @location(0) uv: vec2<f32>,\n};\n\n@vertex\nfn main(@location(0) inPos: vec3<f32>,\n        @location(1) inUV: vec2<f32>) -> VSOut {\n    var vsOut: VSOut;\n    //vsOut.Position = uniforms.modelViewProjectionMatrix * vec4<f32>(inPos, 1.0);\n    vsOut.Position = vec4<f32>(inPos, 1.0);\n    vsOut.uv = inUV;\n    return vsOut;\n}";

/***/ }),

/***/ 827:
/***/ ((module) => {

"use strict";
module.exports = "@binding(0) @group(0) var mySampler: sampler;\n@binding(1) @group(0) var myTexture: texture_2d<f32>;\n\nstruct Uniforms {\n  deltaTime : f32,\n  darkenRate : f32,\n};\n@binding(2) @group(0) var<uniform> uniforms : Uniforms;\n\n// Integate current to target_val using a damped approach. Rate of 0.99 means we'd reach\n// 99% of the way to target_val in 1 second.\nfn integrateDamped(current: vec3<f32>, target_val: vec3<f32>, rate: f32, deltaTime: f32) -> vec3<f32> {\n    let ratio = 1.0 - pow(1.0 - rate, deltaTime);\n    return mix(current, target_val, ratio);\n}\n\n@fragment\nfn main(@location(0) fragUV: vec2<f32>) -> @location(0) vec4<f32> {\n  let current4 : vec4<f32> = textureSample(myTexture, mySampler, fragUV);\n\n  var current = current4.rgb;\n  if (any(current > vec3<f32>(0.1))) {\n    let rate = uniforms.darkenRate; //0.999;\n    let target_val = vec3<f32>(0.0);\n    current = integrateDamped(current, target_val, rate, uniforms.deltaTime);    \n  } else {\n    current = vec3<f32>(0.0);\n  }\n\n  return vec4<f32>(current, current4.a);\n}\n";

/***/ }),

/***/ 989:
/***/ ((module) => {

"use strict";
module.exports = "@fragment\nfn main(@location(0) inColor: vec3<f32>) -> @location(0) vec4<f32> {\n    return vec4<f32>(inColor, 1.0);\n}\n";

/***/ }),

/***/ 362:
/***/ ((module) => {

"use strict";
module.exports = "struct Uniforms {\n  modelViewProjectionMatrix : mat4x4<f32>,\n};\n@binding(0) @group(0) var<uniform> uniforms : Uniforms;\n\nstruct VSOut {\n    @builtin(position) Position: vec4<f32>,\n    @location(0) color: vec3<f32>,\n};\n\n@vertex\nfn main(@location(0) inPos: vec3<f32>,\n        @location(1) inColor: vec3<f32>) -> VSOut {\n    var vsOut: VSOut;\n    vsOut.Position = uniforms.modelViewProjectionMatrix * vec4<f32>(inPos, 1.0);\n    //vsOut.Position = vec4<f32>(inPos, 1.0);\n    vsOut.color = inColor;\n    return vsOut;\n}";

/***/ }),

/***/ 374:
/***/ ((module) => {

"use strict";
module.exports = "@binding(0) @group(0) var mySampler: sampler;\n@binding(1) @group(0) var myTexture: texture_2d<f32>;\n\nstruct Uniforms {\n  dir : vec2<f32>,\n  resolution: f32,\n  radius: f32,\n};\n@binding(2) @group(0) var<uniform> uniforms : Uniforms;\n\n@fragment\nfn main(@location(0) fragUV: vec2<f32>) -> @location(0) vec4<f32> {\n    // the amount to blur, i.e. how far off center to sample from \n    // 1.0 -> blur by one pixel\n    // 2.0 -> blur by two pixels, eUV.\n    let blur = uniforms.radius / uniforms.resolution; \n\n    // the direction of our blur\n    // (1.0, 0.0) -> x-axis blur\n    // (0.0, 1.0) -> y-axis blur\n    let hstep = uniforms.dir.x * blur;\n    let vstep = uniforms.dir.y * blur;\n\n    // Apply blurring, using a 9-tap filter with predefined gaussian weights\n    var sum = vec4<f32>(0.0);\n\n    sum = sum + textureSample(myTexture, mySampler, vec2<f32>(fragUV.x - 4.0 * hstep, fragUV.y - 4.0 * vstep)) * 0.0162162162;\n    sum = sum + textureSample(myTexture, mySampler, vec2<f32>(fragUV.x - 3.0 * hstep, fragUV.y - 3.0 * vstep)) * 0.0540540541;\n    sum = sum + textureSample(myTexture, mySampler, vec2<f32>(fragUV.x - 2.0 * hstep, fragUV.y - 2.0 * vstep)) * 0.1216216216;\n    sum = sum + textureSample(myTexture, mySampler, vec2<f32>(fragUV.x - 1.0 * hstep, fragUV.y - 1.0 * vstep)) * 0.1945945946;\n    \n    sum = sum + textureSample(myTexture, mySampler, vec2<f32>(fragUV.x, fragUV.y)) * 0.2270270270;\n\n    sum = sum + textureSample(myTexture, mySampler, vec2<f32>(fragUV.x + 1.0 * hstep, fragUV.y + 1.0 * vstep)) * 0.1945945946;\n    sum = sum + textureSample(myTexture, mySampler, vec2<f32>(fragUV.x + 2.0 * hstep, fragUV.y + 2.0 * vstep)) * 0.1216216216;\n    sum = sum + textureSample(myTexture, mySampler, vec2<f32>(fragUV.x + 3.0 * hstep, fragUV.y + 3.0 * vstep)) * 0.0540540541;\n    sum = sum + textureSample(myTexture, mySampler, vec2<f32>(fragUV.x + 4.0 * hstep, fragUV.y + 4.0 * vstep)) * 0.0162162162;\n\n    return vec4<f32>(sum.rgb, 1.0);\n}\n";

/***/ }),

/***/ 619:
/***/ ((module) => {

"use strict";
module.exports = "@binding(0) @group(0) var sampler0: sampler;\n@binding(1) @group(0) var texture0: texture_2d<f32>;\n@binding(2) @group(0) var sampler1: sampler;\n@binding(3) @group(0) var texture1: texture_2d<f32>;\n\n@fragment\nfn main(@location(0) fragUV: vec2<f32>) -> @location(0) vec4<f32> {\n  let c0 = textureSample(texture0, sampler0, fragUV);\n  let c1 = textureSample(texture1, sampler1, fragUV);\n  return max(c0, c1);\n}\n";

/***/ }),

/***/ 595:
/***/ ((module) => {

"use strict";
module.exports = "@binding(0) @group(0) var sampler0: sampler;\n@binding(1) @group(0) var texture0: texture_2d<f32>;\n@binding(2) @group(0) var sampler1: sampler;\n@binding(3) @group(0) var texture1: texture_2d<f32>;\n\n@fragment\nfn main(@location(0) fragUV: vec2<f32>) -> @location(0) vec4<f32> {\n  let c0 = textureSample(texture0, sampler0, fragUV);\n  let c1 = textureSample(texture1, sampler1, fragUV);\n  let overlayAlpha = 0.4; // TODO: uniform var\n  let result = vec4<f32>(mix(c0.rgb, c1.rgb, overlayAlpha), 1.0);\n  return result;\n}\n";

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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js




function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
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
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function classCallCheck_classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(757);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);
;// CONCATENATED MODULE: ./node_modules/gl-matrix/esm/common.js
/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
var RANDOM = Math.random;
/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Float32ArrayConstructor | ArrayConstructor} type Array type, such as Float32Array or Array
 */

function setMatrixArrayType(type) {
  ARRAY_TYPE = type;
}
var degree = Math.PI / 180;
/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */

function toRadian(a) {
  return a * degree;
}
/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */

function equals(a, b) {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};
;// CONCATENATED MODULE: ./node_modules/gl-matrix/esm/vec3.js

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create() {
  var out = new ARRAY_TYPE(3);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {ReadonlyVec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */

function clone(a) {
  var out = new glMatrix.ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Calculates the length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate length of
 * @returns {Number} length of a
 */

function vec3_length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */

function fromValues(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the source vector
 * @returns {vec3} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */

function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to ceil
 * @returns {vec3} out
 */

function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}
/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to floor
 * @returns {vec3} out
 */

function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}
/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}
/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}
/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to round
 * @returns {vec3} out
 */

function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}
/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */

function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} distance between a and b
 */

function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.hypot(x, y, z);
}
/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}
/**
 * Calculates the squared length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}
/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to negate
 * @returns {vec3} out
 */

function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to invert
 * @returns {vec3} out
 */

function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */

function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function hermite(out, a, b, c, d, t) {
  var factorTimes2 = t * t;
  var factor1 = factorTimes2 * (2 * t - 3) + 1;
  var factor2 = factorTimes2 * (t - 2) + t;
  var factor3 = factorTimes2 * (t - 1);
  var factor4 = factorTimes2 * (3 - 2 * t);
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function bezier(out, a, b, c, d, t) {
  var inverseFactor = 1 - t;
  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
  var factorTimes2 = t * t;
  var factor1 = inverseFactorTimesTwo * inverseFactor;
  var factor2 = 3 * t * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * inverseFactor;
  var factor4 = factorTimes2 * t;
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */

function random(out, scale) {
  scale = scale || 1.0;
  var r = glMatrix.RANDOM() * 2.0 * Math.PI;
  var z = glMatrix.RANDOM() * 2.0 - 1.0;
  var zScale = Math.sqrt(1.0 - z * z) * scale;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale;
  return out;
}
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec3} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */

function transformMat3(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
/**
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyQuat} q quaternion to transform with
 * @returns {vec3} out
 */

function transformQuat(out, a, q) {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3];
  var x = a[0],
      y = a[1],
      z = a[2]; // var qvec = [qx, qy, qz];
  // var uv = vec3.cross([], qvec, a);

  var uvx = qy * z - qz * y,
      uvy = qz * x - qx * z,
      uvz = qx * y - qy * x; // var uuv = vec3.cross([], qvec, uv);

  var uuvx = qy * uvz - qz * uvy,
      uuvy = qz * uvx - qx * uvz,
      uuvz = qx * uvy - qy * uvx; // vec3.scale(uv, uv, 2 * w);

  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2; // vec3.scale(uuv, uuv, 2);

  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2; // return vec3.add(out, a, vec3.add(out, uv, uuv));

  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateX(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateY(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateZ(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
  r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
  r[2] = p[2]; //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Get the angle between two 3D vectors
 * @param {ReadonlyVec3} a The first operand
 * @param {ReadonlyVec3} b The second operand
 * @returns {Number} The angle in radians
 */

function angle(a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2],
      bx = b[0],
      by = b[1],
      bz = b[2],
      mag1 = Math.sqrt(ax * ax + ay * ay + az * az),
      mag2 = Math.sqrt(bx * bx + by * by + bz * bz),
      mag = mag1 * mag2,
      cosine = mag && dot(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
/**
 * Set the components of a vec3 to zero
 *
 * @param {vec3} out the receiving vector
 * @returns {vec3} out
 */

function zero(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  out[2] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str(a) {
  return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
}
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function vec3_equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2];
  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));
}
/**
 * Alias for {@link vec3.subtract}
 * @function
 */

var sub = subtract;
/**
 * Alias for {@link vec3.multiply}
 * @function
 */

var mul = (/* unused pure expression or super */ null && (multiply));
/**
 * Alias for {@link vec3.divide}
 * @function
 */

var div = (/* unused pure expression or super */ null && (divide));
/**
 * Alias for {@link vec3.distance}
 * @function
 */

var dist = distance;
/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */

var sqrDist = (/* unused pure expression or super */ null && (squaredDistance));
/**
 * Alias for {@link vec3.length}
 * @function
 */

var len = (/* unused pure expression or super */ null && (vec3_length));
/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */

var sqrLen = (/* unused pure expression or super */ null && (squaredLength));
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach = function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
}();
;// CONCATENATED MODULE: ./src/render_helpers.ts


var Mesh = function Mesh() {
  _classCallCheck(this, Mesh);
}; // Returns normalized vector that is orthogonal to the vector from a to b in XY plane

function orthoNormal(a, b) {
  var temp = create();
  var n = create();
  var up = fromValues(0, 0, 1);
  cross(n, sub(temp, a, b), up);
  return normalize(n, n);
}
function linesToMesh(lines, lineWidth) {
  var vertices = new Array();
  var indices = new Array();
  var colors = new Array();
  lines.forEach(function (line, i) {
    var p1 = line.p1;
    var p2 = line.p2; // Compute orthogonal vector to line to create a thin quad
    // Do this in 3D for cross product, then store result as 2D vector

    var n = orthoNormal(p1, p2); // Scale to line width

    n = scale(n, n, lineWidth); // Compute 4 quad vertices

    var p1u = create();
    var p1d = create();
    var p2u = create();
    var p2d = create();
    add(p1u, p1, n);
    sub(p1d, p1, n);
    add(p2u, p2, n);
    sub(p2d, p2, n); // Now create two triangles out of the 4 corners of our line
    // p1u (0) --------------- p2u (3)
    //  |                       |
    // p1d (1) --------------- p2d (2)

    vertices.push(p1u[0], p1u[1], p1u[2], p1d[0], p1d[1], p1u[2], p2d[0], p2d[1], p1u[2], p2u[0], p2u[1], p1u[2]); // Add 6 indices (2x3 triangles), indexing 4 verts above

    var off = i * 4;
    indices.push(off + 0, off + 1, off + 2, off + 2, off + 3, off + 0); // Set vertex colors

    var allWhite = true;

    if (allWhite) {
      colors.push(1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0);
    } else {
      colors.push(1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0);
    }
  });
  return {
    vertices: new Float32Array(vertices),
    colors: new Float32Array(colors),
    indices: new Uint16Array(indices)
  };
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js


function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
// EXTERNAL MODULE: ./src/shaders/draw_lines.vert.wgsl
var draw_lines_vert = __webpack_require__(362);
// EXTERNAL MODULE: ./src/shaders/draw_lines.frag.wgsl
var draw_lines_frag = __webpack_require__(989);
;// CONCATENATED MODULE: ./src/pipeline.ts


var Pipeline = /*#__PURE__*/function () {
  function Pipeline(canvas, device) {
    classCallCheck_classCallCheck(this, Pipeline);

    this.canvas = canvas;
    this.device = device;
    this.queue = device.queue;
  }

  _createClass(Pipeline, [{
    key: "createBuffer",
    value: function createBuffer(arr, usage) {
      // 📏 Align to 4 bytes (thanks @chrimsonite)
      var desc = {
        size: arr.byteLength + 3 & ~3,
        usage: usage,
        mappedAtCreation: true
      };
      var buffer = this.device.createBuffer(desc);
      var writeArray = arr instanceof Uint16Array ? new Uint16Array(buffer.getMappedRange()) : new Float32Array(buffer.getMappedRange());
      writeArray.set(arr);
      buffer.unmap();
      return buffer;
    }
  }]);

  return Pipeline;
}();
;
;// CONCATENATED MODULE: ./node_modules/gl-matrix/esm/mat4.js

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function mat4_create() {
  var out = new ARRAY_TYPE(16);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */

function mat4_clone(a) {
  var out = new glMatrix.ARRAY_TYPE(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function mat4_copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */

function mat4_fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  var out = new glMatrix.ARRAY_TYPE(16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */

function mat4_set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a12 = a[6],
        a13 = a[7];
    var a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }

  return out;
}
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function invert(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function adjoint(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
  out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
  out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
  out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
  out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
  out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
  return out;
}
/**
 * Calculates the determinant of a mat4
 *
 * @param {ReadonlyMat4} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant(a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function mat4_multiply(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]; // Cache only the current line of the second matrix

  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {mat4} out
 */

function translate(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {ReadonlyVec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/

function mat4_scale(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function rotate(out, a, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;

  if (len < EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11]; // Construct the elements of the rotation matrix

  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  return out;
}
/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function mat4_rotateX(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function mat4_rotateY(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function mat4_rotateZ(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */

function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Scaling vector
 * @returns {mat4} out
 */

function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function fromRotation(out, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;

  if (len < glMatrix.EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c; // Perform rotation-specific matrix multiplication

  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromXRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromYRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = c;
  out[1] = 0;
  out[2] = -s;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromZRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */

function fromRotationTranslation(out, q, v) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 from a dual quat.
 *
 * @param {mat4} out Matrix
 * @param {ReadonlyQuat2} a Dual Quaternion
 * @returns {mat4} mat4 receiving operation result
 */

function fromQuat2(out, a) {
  var translation = new glMatrix.ARRAY_TYPE(3);
  var bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3],
      ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7];
  var magnitude = bx * bx + by * by + bz * bz + bw * bw; //Only scale if it makes sense

  if (magnitude > 0) {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
  } else {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  }

  fromRotationTranslation(out, a, translation);
  return out;
}
/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getScaling(out, mat) {
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}
/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */

function getRotation(out, mat) {
  var scaling = new glMatrix.ARRAY_TYPE(3);
  getScaling(scaling, mat);
  var is1 = 1 / scaling[0];
  var is2 = 1 / scaling[1];
  var is3 = 1 / scaling[2];
  var sm11 = mat[0] * is1;
  var sm12 = mat[1] * is2;
  var sm13 = mat[2] * is3;
  var sm21 = mat[4] * is1;
  var sm22 = mat[5] * is2;
  var sm23 = mat[6] * is3;
  var sm31 = mat[8] * is1;
  var sm32 = mat[9] * is2;
  var sm33 = mat[10] * is3;
  var trace = sm11 + sm22 + sm33;
  var S = 0;

  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (sm23 - sm32) / S;
    out[1] = (sm31 - sm13) / S;
    out[2] = (sm12 - sm21) / S;
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
    out[3] = (sm23 - sm32) / S;
    out[0] = 0.25 * S;
    out[1] = (sm12 + sm21) / S;
    out[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
    out[3] = (sm31 - sm13) / S;
    out[0] = (sm12 + sm21) / S;
    out[1] = 0.25 * S;
    out[2] = (sm23 + sm32) / S;
  } else {
    S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
    out[3] = (sm12 - sm21) / S;
    out[0] = (sm31 + sm13) / S;
    out[1] = (sm23 + sm32) / S;
    out[2] = 0.25 * S;
  }

  return out;
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @returns {mat4} out
 */

function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @param {ReadonlyVec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */

function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  var ox = o[0];
  var oy = o[1];
  var oz = o[2];
  var out0 = (1 - (yy + zz)) * sx;
  var out1 = (xy + wz) * sx;
  var out2 = (xz - wy) * sx;
  var out4 = (xy - wz) * sy;
  var out5 = (1 - (xx + zz)) * sy;
  var out6 = (yz + wx) * sy;
  var out8 = (xz + wy) * sz;
  var out9 = (yz - wx) * sz;
  var out10 = (1 - (xx + yy)) * sz;
  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = 0;
  out[4] = out4;
  out[5] = out5;
  out[6] = out6;
  out[7] = 0;
  out[8] = out8;
  out[9] = out9;
  out[10] = out10;
  out[11] = 0;
  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
  out[15] = 1;
  return out;
}
/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyQuat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */

function fromQuat(out, q) {
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */

function frustum(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
}
/**
 * Generates a perspective projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspectiveNO(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }

  return out;
}
/**
 * Alias for {@link mat4.perspectiveNO}
 * @function
 */

var perspective = (/* unused pure expression or super */ null && (perspectiveNO));
/**
 * Generates a perspective projection matrix suitable for WebGPU with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
 * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspectiveZO(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = far * nf;
    out[14] = far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -near;
  }

  return out;
}
/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function perspectiveFromFieldOfView(out, fov, near, far) {
  var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
  var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
  var xScale = 2.0 / (leftTan + rightTan);
  var yScale = 2.0 / (upTan + downTan);
  out[0] = xScale;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  out[4] = 0.0;
  out[5] = yScale;
  out[6] = 0.0;
  out[7] = 0.0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = (upTan - downTan) * yScale * 0.5;
  out[10] = far / (near - far);
  out[11] = -1.0;
  out[12] = 0.0;
  out[13] = 0.0;
  out[14] = far * near / (near - far);
  out[15] = 0.0;
  return out;
}
/**
 * Generates a orthogonal projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function orthoNO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
/**
 * Alias for {@link mat4.orthoNO}
 * @function
 */

var ortho = orthoNO;
/**
 * Generates a orthogonal projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
 * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function orthoZO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = near * nf;
  out[15] = 1;
  return out;
}
/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */

function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];

  if (Math.abs(eyex - centerx) < glMatrix.EPSILON && Math.abs(eyey - centery) < glMatrix.EPSILON && Math.abs(eyez - centerz) < glMatrix.EPSILON) {
    return identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.hypot(x0, x1, x2);

  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.hypot(y0, y1, y2);

  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}
/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */

function targetTo(out, eye, target, up) {
  var eyex = eye[0],
      eyey = eye[1],
      eyez = eye[2],
      upx = up[0],
      upy = up[1],
      upz = up[2];
  var z0 = eyex - target[0],
      z1 = eyey - target[1],
      z2 = eyez - target[2];
  var len = z0 * z0 + z1 * z1 + z2 * z2;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }

  var x0 = upy * z2 - upz * z1,
      x1 = upz * z0 - upx * z2,
      x2 = upx * z1 - upy * z0;
  len = x0 * x0 + x1 * x1 + x2 * x2;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}
/**
 * Returns a string representation of a mat4
 *
 * @param {ReadonlyMat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function mat4_str(a) {
  return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
}
/**
 * Returns Frobenius norm of a mat4
 *
 * @param {ReadonlyMat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
}
/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function mat4_add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function mat4_subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */

function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}
/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */

function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  out[6] = a[6] + b[6] * scale;
  out[7] = a[7] + b[7] * scale;
  out[8] = a[8] + b[8] * scale;
  out[9] = a[9] + b[9] * scale;
  out[10] = a[10] + b[10] * scale;
  out[11] = a[11] + b[11] * scale;
  out[12] = a[12] + b[12] * scale;
  out[13] = a[13] + b[13] * scale;
  out[14] = a[14] + b[14] * scale;
  out[15] = a[15] + b[15] * scale;
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function mat4_exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function mat4_equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7];
  var a8 = a[8],
      a9 = a[9],
      a10 = a[10],
      a11 = a[11];
  var a12 = a[12],
      a13 = a[13],
      a14 = a[14],
      a15 = a[15];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  var b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7];
  var b8 = b[8],
      b9 = b[9],
      b10 = b[10],
      b11 = b[11];
  var b12 = b[12],
      b13 = b[13],
      b14 = b[14],
      b15 = b[15];
  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));
}
/**
 * Alias for {@link mat4.multiply}
 * @function
 */

var mat4_mul = (/* unused pure expression or super */ null && (mat4_multiply));
/**
 * Alias for {@link mat4.subtract}
 * @function
 */

var mat4_sub = (/* unused pure expression or super */ null && (mat4_subtract));
;// CONCATENATED MODULE: ./src/draw_lines_pipeline.ts






function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }





var DrawLinesPipeline = /*#__PURE__*/function (_Pipeline) {
  _inherits(DrawLinesPipeline, _Pipeline);

  var _super = _createSuper(DrawLinesPipeline);

  function DrawLinesPipeline(canvas, device) {
    var _this;

    classCallCheck_classCallCheck(this, DrawLinesPipeline);

    _this = _super.call(this, canvas, device);

    _this.init();

    return _this;
  }

  _createClass(DrawLinesPipeline, [{
    key: "init",
    value: function init() {
      var device = this.device;
      var vertModule = device.createShaderModule({
        code: draw_lines_vert
      });
      var fragModule = device.createShaderModule({
        code: draw_lines_frag
      }); // 🔣 Input Assembly

      var positionAttribDesc = {
        shaderLocation: 0,
        // @location(0)
        offset: 0,
        format: 'float32x3'
      };
      var colorAttribDesc = {
        shaderLocation: 1,
        // @location(1)
        offset: 0,
        format: 'float32x3'
      };
      var positionBufferDesc = {
        attributes: [positionAttribDesc],
        arrayStride: 4 * 3,
        // sizeof(float) * 3
        stepMode: 'vertex'
      };
      var colorBufferDesc = {
        attributes: [colorAttribDesc],
        arrayStride: 4 * 3,
        // sizeof(float) * 3
        stepMode: 'vertex'
      };
      var vertex = {
        module: vertModule,
        entryPoint: 'main',
        buffers: [positionBufferDesc, colorBufferDesc]
      }; // Color/Blend State

      var colorState = {
        format: 'bgra8unorm'
      };
      var fragment = {
        module: fragModule,
        entryPoint: 'main',
        targets: [colorState]
      }; // Rasterization

      var primitive = {
        frontFace: 'cw',
        cullMode: 'none',
        topology: 'triangle-list'
      };
      var pipelineDesc = {
        layout: 'auto',
        vertex: vertex,
        fragment: fragment,
        primitive: primitive
      };
      this.pipeline = device.createRenderPipeline(pipelineDesc); // Uniform buffer layout

      var uniformBufferSize = 4 * 16; // 4x4 matrix

      this.uniformBuffer = device.createBuffer({
        size: uniformBufferSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      });
      this.uniformBindGroup = device.createBindGroup({
        layout: this.pipeline.getBindGroupLayout(0),
        entries: [{
          binding: 0,
          resource: {
            buffer: this.uniformBuffer
          }
        }]
      });
    }
  }, {
    key: "encodeCommands",
    value: function encodeCommands(mesh, targetTextureView) {
      var clear = false;
      var colorAttachment = {
        view: targetTextureView,
        clearValue: {
          r: 0.1,
          g: 0.1,
          b: 0.1,
          a: 1
        },
        loadOp: clear ? 'clear' : 'load',
        storeOp: 'store'
      };
      var renderPassDesc = {
        colorAttachments: [colorAttachment]
      };
      var commandEncoder = this.device.createCommandEncoder(); // 🖌️ Encode drawing commands

      var passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
      passEncoder.setPipeline(this.pipeline);
      passEncoder.setViewport(0, 0, this.canvas.width, this.canvas.height, 0, 1);
      passEncoder.setScissorRect(0, 0, this.canvas.width, this.canvas.height); // Orthographic projection

      var mvp = mat4_create();
      var halfW = this.canvas.width / 2;
      var halfH = this.canvas.height / 2;
      var flipY = -1;
      ortho(mvp, -halfW, halfW, -halfH * flipY, halfH * flipY, -1, 1);
      mvp = mvp;
      this.queue.writeBuffer(this.uniformBuffer, 0, mvp.buffer, mvp.byteOffset, mvp.byteLength);
      passEncoder.setBindGroup(0, this.uniformBindGroup); // Create buffers dynamically every frame

      var positionBuffer = this.createBuffer(mesh.vertices, GPUBufferUsage.VERTEX);
      var colorBuffer = this.createBuffer(mesh.colors, GPUBufferUsage.VERTEX);
      var indexBuffer = this.createBuffer(mesh.indices, GPUBufferUsage.INDEX);
      passEncoder.setVertexBuffer(0, positionBuffer);
      passEncoder.setVertexBuffer(1, colorBuffer);
      passEncoder.setIndexBuffer(indexBuffer, 'uint16');
      passEncoder.drawIndexed(mesh.indices.length, 1);
      passEncoder.end();
      return commandEncoder.finish();
    }
  }]);

  return DrawLinesPipeline;
}(Pipeline);
// EXTERNAL MODULE: ./src/shaders/copy_texture.vert.wgsl
var copy_texture_vert = __webpack_require__(850);
// EXTERNAL MODULE: ./src/shaders/copy_texture.frag.wgsl
var copy_texture_frag = __webpack_require__(338);
;// CONCATENATED MODULE: ./src/copy_texture_pipeline.ts






function copy_texture_pipeline_createSuper(Derived) { var hasNativeReflectConstruct = copy_texture_pipeline_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function copy_texture_pipeline_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }




var CopyTexturePipeline = /*#__PURE__*/function (_Pipeline) {
  _inherits(CopyTexturePipeline, _Pipeline);

  var _super = copy_texture_pipeline_createSuper(CopyTexturePipeline);

  function CopyTexturePipeline(canvas, device) {
    var _this;

    classCallCheck_classCallCheck(this, CopyTexturePipeline);

    _this = _super.call(this, canvas, device);

    _this.init();

    return _this;
  }

  _createClass(CopyTexturePipeline, [{
    key: "init",
    value: function init() {
      this.pipeline = this.device.createRenderPipeline( // GPURenderPipelineDescription
      {
        layout: 'auto',
        // GPUVertexState
        vertex: {
          module: this.device.createShaderModule({
            code: copy_texture_vert
          }),
          entryPoint: 'main',
          buffers: [// Two buffers, one positions, one for uvs
          // Position buffer
          {
            arrayStride: 4 * 3,
            // sizeof(float) * 3
            attributes: [// GPUVertexAttribute
            {
              shaderLocation: 0,
              // @location(0)
              offset: 0,
              format: 'float32x3'
            }]
          }, // UV buffer
          {
            arrayStride: 4 * 2,
            // sizeof(float) * 2
            attributes: [// GPUVertexAttribute
            {
              // uv
              shaderLocation: 1,
              // @location(1)
              offset: 0,
              format: 'float32x2'
            }]
          }]
        },
        // GPUFragmentState
        fragment: {
          module: this.device.createShaderModule({
            code: copy_texture_frag
          }),
          entryPoint: 'main',
          targets: [// GPUColorTargetState
          {
            format: 'bgra8unorm'
          }]
        },
        // GPUPrimitiveState (probably not needed)
        primitive: {
          frontFace: 'cw',
          topology: 'triangle-list',
          cullMode: 'none'
        }
      });
      var sampler = this.device.createSampler({
        magFilter: 'nearest',
        minFilter: 'nearest'
      });
      this.uniformBindGroupDescriptor = {
        layout: this.pipeline.getBindGroupLayout(0),
        entries: [{
          binding: 0,
          resource: sampler
        }, {
          binding: 1,
          resource: undefined // Is set dynamically during encodeCommands

        }]
      };
    }
  }, {
    key: "encodeCommands",
    value: function encodeCommands(sourceTextureView, targetTextureView) {
      var flipY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      // Attachment is the canvas texture view
      var colorAttachment = {
        view: targetTextureView,
        loadValue: {
          r: 0.1,
          g: 0.1,
          b: 0.1,
          a: 1
        },
        storeOp: 'store'
      };
      var renderPassDesc = {
        colorAttachments: [colorAttachment]
      };
      var commandEncoder = this.device.createCommandEncoder(); // 🖌️ Encode drawing commands

      var passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
      passEncoder.setPipeline(this.pipeline);
      passEncoder.setViewport(0, 0, this.canvas.width, this.canvas.height, 0, 1);
      passEncoder.setScissorRect(0, 0, this.canvas.width, this.canvas.height); // Set which texture to copy from

      this.uniformBindGroupDescriptor.entries[1].resource = sourceTextureView;
      var uniformBindGroup = this.device.createBindGroup(this.uniformBindGroupDescriptor);
      passEncoder.setBindGroup(0, uniformBindGroup); // Create buffers dynamically every frame
      // Full screen quad

      var hw = 1; // this.canvas.width / 2;

      var hh = 1; //this.canvas.height / 2;

      var bottomLeft = [-hw, -hh, 0];
      var bottomRight = [hw, -hh, 0];
      var topRight = [hw, hh, 0];
      var topLeft = [-hw, hh, 0];

      if (flipY) {
        var _ref = [topLeft, bottomLeft];
        bottomLeft = _ref[0];
        topLeft = _ref[1];
        var _ref2 = [topRight, bottomRight];
        bottomRight = _ref2[0];
        topRight = _ref2[1];
      }

      var vertices = [bottomLeft, bottomRight, topRight, topRight, topLeft, bottomLeft].flat();
      var bottomLeftUV = [0, 0];
      var bottomRightUV = [1, 0];
      var topRightUV = [1, 1];
      var topLeftUV = [0, 1];
      var uvs = [bottomLeftUV, bottomRightUV, topRightUV, topRightUV, topLeftUV, bottomLeftUV].flat();
      var positionBuffer = this.createBuffer(new Float32Array(vertices), GPUBufferUsage.VERTEX);
      var uvBuffer = this.createBuffer(new Float32Array(uvs), GPUBufferUsage.VERTEX);
      passEncoder.setVertexBuffer(0, positionBuffer);
      passEncoder.setVertexBuffer(1, uvBuffer);
      passEncoder.draw(vertices.length / 3, 1, 0, 0);
      passEncoder.end(); // this.queue.submit([commandEncoder.finish()]);

      return commandEncoder.finish();
    }
  }]);

  return CopyTexturePipeline;
}(Pipeline);
// EXTERNAL MODULE: ./src/shaders/darken_texture.frag.wgsl
var darken_texture_frag = __webpack_require__(827);
;// CONCATENATED MODULE: ./src/darken_texture_pipeline.ts






function darken_texture_pipeline_createSuper(Derived) { var hasNativeReflectConstruct = darken_texture_pipeline_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function darken_texture_pipeline_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }




var DarkenTexturePipeline = /*#__PURE__*/function (_Pipeline) {
  _inherits(DarkenTexturePipeline, _Pipeline);

  var _super = darken_texture_pipeline_createSuper(DarkenTexturePipeline);

  function DarkenTexturePipeline(canvas, device) {
    var _this;

    classCallCheck_classCallCheck(this, DarkenTexturePipeline);

    _this = _super.call(this, canvas, device);

    _this.init();

    return _this;
  }

  _createClass(DarkenTexturePipeline, [{
    key: "init",
    value: function init() {
      this.pipeline = this.device.createRenderPipeline( // GPURenderPipelineDescription
      {
        layout: 'auto',
        // GPUVertexState
        vertex: {
          module: this.device.createShaderModule({
            code: copy_texture_vert
          }),
          entryPoint: 'main',
          buffers: [// Two buffers, one positions, one for uvs
          // Position buffer
          {
            arrayStride: 4 * 3,
            // sizeof(float) * 3
            attributes: [// GPUVertexAttribute
            {
              shaderLocation: 0,
              // @location(0)
              offset: 0,
              format: 'float32x3'
            }]
          }, // UV buffer
          {
            arrayStride: 4 * 2,
            // sizeof(float) * 2
            attributes: [// GPUVertexAttribute
            {
              // uv
              shaderLocation: 1,
              // @location(1)
              offset: 0,
              format: 'float32x2'
            }]
          }]
        },
        // GPUFragmentState
        fragment: {
          module: this.device.createShaderModule({
            code: darken_texture_frag
          }),
          entryPoint: 'main',
          targets: [// GPUColorTargetState
          {
            format: 'bgra8unorm'
          }]
        },
        // GPUPrimitiveState (probably not needed)
        primitive: {
          frontFace: 'cw',
          topology: 'triangle-list',
          cullMode: 'none'
        }
      });
      var sampler = this.device.createSampler({
        magFilter: 'nearest',
        minFilter: 'nearest'
      }); // Uniform buffer layout

      var uniformBufferSize = 4 // deltaTime : f32;
      + 4; // darkenRate : f32;

      this.uniformBuffer = this.device.createBuffer({
        size: uniformBufferSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      });
      this.uniformBindGroupDescriptor = {
        layout: this.pipeline.getBindGroupLayout(0),
        entries: [{
          binding: 0,
          resource: sampler
        }, {
          binding: 1,
          resource: undefined // Is set dynamically during encodeCommands

        }, {
          binding: 2,
          resource: {
            buffer: this.uniformBuffer
          }
        }]
      };
    }
  }, {
    key: "encodeCommands",
    value: function encodeCommands(sourceTextureView, targetTextureView, flipY, deltaTime, darkenRate) {
      // Attachment is the canvas texture view
      var colorAttachment = {
        view: targetTextureView,
        clearValue: {
          r: 0.1,
          g: 0.1,
          b: 0.1,
          a: 1
        },
        loadOp: 'clear',
        storeOp: 'store'
      };
      var renderPassDesc = {
        colorAttachments: [colorAttachment]
      };
      var commandEncoder = this.device.createCommandEncoder(); // 🖌️ Encode drawing commands

      var passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
      passEncoder.setPipeline(this.pipeline);
      passEncoder.setViewport(0, 0, this.canvas.width, this.canvas.height, 0, 1);
      passEncoder.setScissorRect(0, 0, this.canvas.width, this.canvas.height); // Set which texture to copy from

      this.uniformBindGroupDescriptor.entries[1].resource = sourceTextureView;
      var uniformBindGroup = this.device.createBindGroup(this.uniformBindGroupDescriptor);
      var uniforms = Float32Array.from([deltaTime, darkenRate]);
      this.queue.writeBuffer(this.uniformBuffer, 0, uniforms.buffer, uniforms.byteOffset, uniforms.byteLength);
      passEncoder.setBindGroup(0, uniformBindGroup); // Create buffers dynamically every frame
      // Full screen quad

      var hw = 1; // this.canvas.width / 2;

      var hh = 1; //this.canvas.height / 2;

      var bottomLeft = [-hw, -hh, 0];
      var bottomRight = [hw, -hh, 0];
      var topRight = [hw, hh, 0];
      var topLeft = [-hw, hh, 0];

      if (flipY) {
        var _ref = [topLeft, bottomLeft];
        bottomLeft = _ref[0];
        topLeft = _ref[1];
        var _ref2 = [topRight, bottomRight];
        bottomRight = _ref2[0];
        topRight = _ref2[1];
      }

      var vertices = [bottomLeft, bottomRight, topRight, topRight, topLeft, bottomLeft].flat();
      var bottomLeftUV = [0, 0];
      var bottomRightUV = [1, 0];
      var topRightUV = [1, 1];
      var topLeftUV = [0, 1];
      var uvs = [bottomLeftUV, bottomRightUV, topRightUV, topRightUV, topLeftUV, bottomLeftUV].flat();
      var positionBuffer = this.createBuffer(new Float32Array(vertices), GPUBufferUsage.VERTEX);
      var uvBuffer = this.createBuffer(new Float32Array(uvs), GPUBufferUsage.VERTEX);
      passEncoder.setVertexBuffer(0, positionBuffer);
      passEncoder.setVertexBuffer(1, uvBuffer);
      passEncoder.draw(vertices.length / 3, 1, 0, 0);
      passEncoder.end();
      return commandEncoder.finish();
    }
  }]);

  return DarkenTexturePipeline;
}(Pipeline);
// EXTERNAL MODULE: ./src/shaders/glow_texture.frag.wgsl
var glow_texture_frag = __webpack_require__(374);
;// CONCATENATED MODULE: ./src/glow_texture.ts






function glow_texture_createSuper(Derived) { var hasNativeReflectConstruct = glow_texture_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function glow_texture_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }




var GlowTexturePipeline = /*#__PURE__*/function (_Pipeline) {
  _inherits(GlowTexturePipeline, _Pipeline);

  var _super = glow_texture_createSuper(GlowTexturePipeline);

  function GlowTexturePipeline(canvas, device) {
    var _this;

    classCallCheck_classCallCheck(this, GlowTexturePipeline);

    _this = _super.call(this, canvas, device);

    _this.init();

    return _this;
  }

  _createClass(GlowTexturePipeline, [{
    key: "init",
    value: function init() {
      this.pipeline = this.device.createRenderPipeline( // GPURenderPipelineDescription
      {
        layout: 'auto',
        // GPUVertexState
        vertex: {
          module: this.device.createShaderModule({
            code: copy_texture_vert
          }),
          entryPoint: 'main',
          buffers: [// Two buffers, one positions, one for uvs
          // Position buffer
          {
            arrayStride: 4 * 3,
            // sizeof(float) * 3
            attributes: [// GPUVertexAttribute
            {
              shaderLocation: 0,
              // @location(0)
              offset: 0,
              format: 'float32x3'
            }]
          }, // UV buffer
          {
            arrayStride: 4 * 2,
            // sizeof(float) * 2
            attributes: [// GPUVertexAttribute
            {
              // uv
              shaderLocation: 1,
              // @location(1)
              offset: 0,
              format: 'float32x2'
            }]
          }]
        },
        // GPUFragmentState
        fragment: {
          module: this.device.createShaderModule({
            code: glow_texture_frag
          }),
          entryPoint: 'main',
          targets: [// GPUColorTargetState
          {
            format: 'bgra8unorm'
          }]
        },
        // GPUPrimitiveState (probably not needed)
        primitive: {
          frontFace: 'cw',
          topology: 'triangle-list',
          cullMode: 'none'
        }
      });
      var sampler = this.device.createSampler({
        magFilter: 'nearest',
        minFilter: 'nearest'
      }); // Uniform buffer layout

      var uniformBufferSize = 4 * 2 // dir : vec2<f32>;
      + 4 // resolution: f32;
      + 4; // radius: f32;

      this.uniformBuffer = this.device.createBuffer({
        size: uniformBufferSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      });
      this.uniformBindGroupDescriptor = {
        layout: this.pipeline.getBindGroupLayout(0),
        entries: [{
          binding: 0,
          resource: sampler
        }, {
          binding: 1,
          resource: undefined // Is set dynamically during encodeCommands

        }, {
          binding: 2,
          resource: {
            buffer: this.uniformBuffer
          }
        }]
      };
    }
  }, {
    key: "encodeCommands",
    value: function encodeCommands(sourceTextureView, scratchTextureView, targetTextureView, flipY, glowRadius) {
      return [this.doEncodeCommands(sourceTextureView, scratchTextureView, flipY, glowRadius, [1.0, 0.0]), this.doEncodeCommands(scratchTextureView, targetTextureView, flipY, glowRadius, [0.0, 1.0])];
    }
  }, {
    key: "doEncodeCommands",
    value: function doEncodeCommands(sourceTextureView, targetTextureView, flipY, glowRadius, dir) {
      // Attachment is the canvas texture view
      var colorAttachment = {
        view: targetTextureView,
        clearValue: {
          r: 0.1,
          g: 0.1,
          b: 0.1,
          a: 1
        },
        loadOp: 'clear',
        storeOp: 'store'
      };
      var renderPassDesc = {
        colorAttachments: [colorAttachment]
      };
      var commandEncoder = this.device.createCommandEncoder(); // 🖌️ Encode drawing commands

      var passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
      passEncoder.setPipeline(this.pipeline);
      passEncoder.setViewport(0, 0, this.canvas.width, this.canvas.height, 0, 1);
      passEncoder.setScissorRect(0, 0, this.canvas.width, this.canvas.height); // Set which texture to copy from

      this.uniformBindGroupDescriptor.entries[1].resource = sourceTextureView;
      var uniformBindGroup = this.device.createBindGroup(this.uniformBindGroupDescriptor);
      var uniforms = Float32Array.from([1.0, 0.0, // dir : vec2<f32>;
      this.canvas.width, // resolution: f32;
      glowRadius // radius: f32;
      ]);
      this.queue.writeBuffer(this.uniformBuffer, 0, uniforms.buffer, uniforms.byteOffset, uniforms.byteLength);
      passEncoder.setBindGroup(0, uniformBindGroup); // Create buffers dynamically every frame
      // Full screen quad

      var hw = 1; // this.canvas.width / 2;

      var hh = 1; //this.canvas.height / 2;

      var bottomLeft = [-hw, -hh, 0];
      var bottomRight = [hw, -hh, 0];
      var topRight = [hw, hh, 0];
      var topLeft = [-hw, hh, 0];

      if (flipY) {
        var _ref = [topLeft, bottomLeft];
        bottomLeft = _ref[0];
        topLeft = _ref[1];
        var _ref2 = [topRight, bottomRight];
        bottomRight = _ref2[0];
        topRight = _ref2[1];
      }

      var vertices = [bottomLeft, bottomRight, topRight, topRight, topLeft, bottomLeft].flat();
      var bottomLeftUV = [0, 0];
      var bottomRightUV = [1, 0];
      var topRightUV = [1, 1];
      var topLeftUV = [0, 1];
      var uvs = [bottomLeftUV, bottomRightUV, topRightUV, topRightUV, topLeftUV, bottomLeftUV].flat();
      var positionBuffer = this.createBuffer(new Float32Array(vertices), GPUBufferUsage.VERTEX);
      var uvBuffer = this.createBuffer(new Float32Array(uvs), GPUBufferUsage.VERTEX);
      passEncoder.setVertexBuffer(0, positionBuffer);
      passEncoder.setVertexBuffer(1, uvBuffer);
      passEncoder.draw(vertices.length / 3, 1, 0, 0);
      passEncoder.end();
      return commandEncoder.finish();
    }
  }]);

  return GlowTexturePipeline;
}(Pipeline);
;// CONCATENATED MODULE: ./src/combine_textures_pipeline.ts






function combine_textures_pipeline_createSuper(Derived) { var hasNativeReflectConstruct = combine_textures_pipeline_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function combine_textures_pipeline_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var CombineTexturesPipeline = /*#__PURE__*/function (_Pipeline) {
  _inherits(CombineTexturesPipeline, _Pipeline);

  var _super = combine_textures_pipeline_createSuper(CombineTexturesPipeline);

  function CombineTexturesPipeline(canvas, device, fragShaderCode) {
    var _this;

    classCallCheck_classCallCheck(this, CombineTexturesPipeline);

    _this = _super.call(this, canvas, device);

    _this.init(fragShaderCode);

    return _this;
  }

  _createClass(CombineTexturesPipeline, [{
    key: "init",
    value: function init(fragShaderCode) {
      this.pipeline = this.device.createRenderPipeline( // GPURenderPipelineDescription
      {
        layout: 'auto',
        // GPUVertexState
        vertex: {
          module: this.device.createShaderModule({
            code: copy_texture_vert
          }),
          entryPoint: 'main',
          buffers: [// Two buffers, one positions, one for uvs
          // Position buffer
          {
            arrayStride: 4 * 3,
            // sizeof(float) * 3
            attributes: [// GPUVertexAttribute
            {
              shaderLocation: 0,
              // @location(0)
              offset: 0,
              format: 'float32x3'
            }]
          }, // UV buffer
          {
            arrayStride: 4 * 2,
            // sizeof(float) * 2
            attributes: [// GPUVertexAttribute
            {
              // uv
              shaderLocation: 1,
              // @location(1)
              offset: 0,
              format: 'float32x2'
            }]
          }]
        },
        // GPUFragmentState
        fragment: {
          module: this.device.createShaderModule({
            code: fragShaderCode
          }),
          entryPoint: 'main',
          targets: [// GPUColorTargetState
          {
            format: 'bgra8unorm'
          }]
        },
        // GPUPrimitiveState (probably not needed)
        primitive: {
          frontFace: 'cw',
          topology: 'triangle-list',
          cullMode: 'none'
        }
      });
      var sampler0 = this.device.createSampler({
        magFilter: 'nearest',
        minFilter: 'nearest'
      });
      var sampler1 = this.device.createSampler({
        magFilter: 'nearest',
        minFilter: 'nearest'
      });
      this.uniformBindGroupDescriptor = {
        layout: this.pipeline.getBindGroupLayout(0),
        entries: [{
          binding: 0,
          resource: sampler0
        }, {
          binding: 1,
          resource: undefined // Is set dynamically during encodeCommands

        }, {
          binding: 2,
          resource: sampler1
        }, {
          binding: 3,
          resource: undefined // Is set dynamically during encodeCommands

        }]
      };
    }
  }, {
    key: "encodeCommands",
    value: function encodeCommands(sourceTextureView1, sourceTextureView2, targetTextureView, flipY) {
      // Attachment is the canvas texture view
      var colorAttachment = {
        view: targetTextureView,
        clearValue: {
          r: 0.1,
          g: 0.1,
          b: 0.1,
          a: 1
        },
        loadOp: 'clear',
        storeOp: 'store'
      };
      var renderPassDesc = {
        colorAttachments: [colorAttachment]
      };
      var commandEncoder = this.device.createCommandEncoder(); // 🖌️ Encode drawing commands

      var passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
      passEncoder.setPipeline(this.pipeline);
      passEncoder.setViewport(0, 0, this.canvas.width, this.canvas.height, 0, 1);
      passEncoder.setScissorRect(0, 0, this.canvas.width, this.canvas.height); // Set which textures to combine

      this.uniformBindGroupDescriptor.entries[1].resource = sourceTextureView1;
      this.uniformBindGroupDescriptor.entries[3].resource = sourceTextureView2;
      var uniformBindGroup = this.device.createBindGroup(this.uniformBindGroupDescriptor); // const uniforms = Float32Array.from([deltaTime]);
      // this.queue.writeBuffer(this.uniformBuffer, 0, uniforms.buffer, uniforms.byteOffset, uniforms.byteLength);

      passEncoder.setBindGroup(0, uniformBindGroup); // Create buffers dynamically every frame
      // Full screen quad

      var hw = 1; // this.canvas.width / 2;

      var hh = 1; //this.canvas.height / 2;

      var bottomLeft = [-hw, -hh, 0];
      var bottomRight = [hw, -hh, 0];
      var topRight = [hw, hh, 0];
      var topLeft = [-hw, hh, 0];

      if (flipY) {
        var _ref = [topLeft, bottomLeft];
        bottomLeft = _ref[0];
        topLeft = _ref[1];
        var _ref2 = [topRight, bottomRight];
        bottomRight = _ref2[0];
        topRight = _ref2[1];
      }

      var vertices = [bottomLeft, bottomRight, topRight, topRight, topLeft, bottomLeft].flat();
      var bottomLeftUV = [0, 0];
      var bottomRightUV = [1, 0];
      var topRightUV = [1, 1];
      var topLeftUV = [0, 1];
      var uvs = [bottomLeftUV, bottomRightUV, topRightUV, topRightUV, topLeftUV, bottomLeftUV].flat();
      var positionBuffer = this.createBuffer(new Float32Array(vertices), GPUBufferUsage.VERTEX);
      var uvBuffer = this.createBuffer(new Float32Array(uvs), GPUBufferUsage.VERTEX);
      passEncoder.setVertexBuffer(0, positionBuffer);
      passEncoder.setVertexBuffer(1, uvBuffer);
      passEncoder.draw(vertices.length / 3, 1, 0, 0);
      passEncoder.end();
      return commandEncoder.finish();
    }
  }]);

  return CombineTexturesPipeline;
}(Pipeline);
// EXTERNAL MODULE: ./src/shaders/max_textures.frag.wgsl
var max_textures_frag = __webpack_require__(619);
// EXTERNAL MODULE: ./src/shaders/overlay_texture.frag.wgsl
var overlay_texture_frag = __webpack_require__(595);
;// CONCATENATED MODULE: ./src/renderer.ts













 // Tweakable HTML element vars

var glowEnabled = true;
var glowRadius = 1.2;
var darkenRate = 0.999;
function windowOnLoad() {
  document.getElementById('glow_enabled').addEventListener('change', function () {
    glowEnabled = !glowEnabled;
  });

  document.getElementById('glow_radius').oninput = function () {
    var input = document.getElementById('glow_radius');
    console.log('glow_radius:', input.value);
    glowRadius = +input.value;
  };

  document.getElementById('darken_rate').oninput = function () {
    var input = document.getElementById('darken_rate');
    console.log('darken_rate:', input.value);
    darkenRate = +input.value;
  };
}

var Renderer = /*#__PURE__*/function () {
  // ⚙️ API Data Structures
  // 🎞️ Frame Backings
  // Textures
  function Renderer(canvas) {
    classCallCheck_classCallCheck(this, Renderer);

    _defineProperty(this, "linesTextureViews", new Array());

    _defineProperty(this, "currLineTextureIdx", 0);

    this.canvas = canvas;
  }

  _createClass(Renderer, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator( /*#__PURE__*/regenerator_default().mark(function _callee() {
        return regenerator_default().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.initializeAPI();

              case 2:
                if (!_context.sent) {
                  _context.next = 5;
                  break;
                }

                _context.next = 5;
                return this.onResize();

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "initializeAPI",
    value: function () {
      var _initializeAPI = _asyncToGenerator( /*#__PURE__*/regenerator_default().mark(function _callee2() {
        var entry;
        return regenerator_default().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                entry = navigator.gpu;

                if (entry) {
                  _context2.next = 5;
                  break;
                }

                console.log("WebGPU may not be supported in your browser");
                return _context2.abrupt("return", false);

              case 5:
                _context2.next = 7;
                return entry.requestAdapter();

              case 7:
                this.adapter = _context2.sent;
                _context2.next = 10;
                return this.adapter.requestDevice();

              case 10:
                this.device = _context2.sent;
                this.queue = this.device.queue;
                this.drawLinesPipeline = new DrawLinesPipeline(this.canvas, this.device);
                this.copyTexturePipeline = new CopyTexturePipeline(this.canvas, this.device);
                this.darkenTexturePipeline = new DarkenTexturePipeline(this.canvas, this.device);
                this.glowTexturePipeline = new GlowTexturePipeline(this.canvas, this.device);
                this.combineLinesAndGlowPipline = new CombineTexturesPipeline(this.canvas, this.device, max_textures_frag);
                this.overlayTexturePipeline = new CombineTexturesPipeline(this.canvas, this.device, overlay_texture_frag);
                _context2.next = 24;
                break;

              case 20:
                _context2.prev = 20;
                _context2.t0 = _context2["catch"](0);
                console.error(_context2.t0);
                return _context2.abrupt("return", false);

              case 24:
                return _context2.abrupt("return", true);

              case 25:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 20]]);
      }));

      function initializeAPI() {
        return _initializeAPI.apply(this, arguments);
      }

      return initializeAPI;
    }()
  }, {
    key: "loadTextureFile",
    value: function () {
      var _loadTextureFile = _asyncToGenerator( /*#__PURE__*/regenerator_default().mark(function _callee3(imgSrc) {
        var img, imageBitmap, texture;
        return regenerator_default().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                img = document.createElement('img');
                img.src = imgSrc;
                _context3.next = 4;
                return img.decode();

              case 4:
                _context3.next = 6;
                return createImageBitmap(img);

              case 6:
                imageBitmap = _context3.sent;
                texture = this.device.createTexture({
                  size: [imageBitmap.width, imageBitmap.height, 1],
                  format: 'rgba8unorm',
                  usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
                });
                this.queue.copyExternalImageToTexture({
                  source: imageBitmap
                }, {
                  texture: texture
                }, [imageBitmap.width, imageBitmap.height]);
                return _context3.abrupt("return", texture);

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function loadTextureFile(_x) {
        return _loadTextureFile.apply(this, arguments);
      }

      return loadTextureFile;
    }()
  }, {
    key: "onResize",
    value: function () {
      var _onResize = _asyncToGenerator( /*#__PURE__*/regenerator_default().mark(function _callee4() {
        var canvasConfig, textureDesc;
        return regenerator_default().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!this.context) {
                  this.context = this.canvas.getContext('webgpu');
                  canvasConfig = {
                    device: this.device,
                    format: 'bgra8unorm',
                    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
                  };
                  this.context.configure(canvasConfig);
                }

                textureDesc = {
                  size: [this.canvas.width, this.canvas.height, 1],
                  dimension: '2d',
                  format: 'bgra8unorm',
                  usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING // Texture binding required to be used as a render target

                }; // Create two textures to ping-pong between

                this.linesTextureViews.push(this.device.createTexture(textureDesc).createView());
                this.linesTextureViews.push(this.device.createTexture(textureDesc).createView());
                this.linesTextureViews.push(this.device.createTexture(textureDesc).createView());
                this.linesTextureViews.push(this.device.createTexture(textureDesc).createView());
                this.scratchTextureView = this.device.createTexture(textureDesc).createView();
                this.glowTextureView = this.device.createTexture(textureDesc).createView();
                _context4.next = 10;
                return this.loadTextureFile(__webpack_require__(226));

              case 10:
                this.overlayTextureView = _context4.sent.createView();

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function onResize() {
        return _onResize.apply(this, arguments);
      }

      return onResize;
    }() // Called once per frame

  }, {
    key: "render",
    value: function render(dt, lines) {
      // ⏭ Acquire next image from context
      var colorTexture = this.context.getCurrentTexture();
      var colorTextureView = colorTexture.createView();
      var mesh = linesToMesh(lines, 1);
      var meshThick = linesToMesh(lines, 2);
      this.currLineTextureIdx = (this.currLineTextureIdx + 1) % 2;
      var nextLineTextureIdx = (this.currLineTextureIdx + 1) % 2;
      var firstLineTextureView = this.linesTextureViews[this.currLineTextureIdx];
      var nextLineTextureView = this.linesTextureViews[(this.currLineTextureIdx + 1) % 2];
      var firstThickLineTextureView = this.linesTextureViews[this.currLineTextureIdx + 2];
      var nextThickLineTextureView = this.linesTextureViews[nextLineTextureIdx + 2];
      var commandBuffers = Array(); // Draw lines

      commandBuffers.push(this.drawLinesPipeline.encodeCommands(mesh, firstLineTextureView)); // Darken

      commandBuffers.push(this.darkenTexturePipeline.encodeCommands(firstLineTextureView, nextLineTextureView, true, dt, darkenRate));

      if (glowEnabled) {
        // Draw thick lines
        commandBuffers.push(this.drawLinesPipeline.encodeCommands(meshThick, firstThickLineTextureView)); // Darken thick lines

        commandBuffers.push(this.darkenTexturePipeline.encodeCommands(firstThickLineTextureView, nextThickLineTextureView, true, dt, darkenRate)); // Glow

        commandBuffers.push.apply(commandBuffers, _toConsumableArray(this.glowTexturePipeline.encodeCommands(firstThickLineTextureView, this.scratchTextureView, this.glowTextureView, true, glowRadius))); // Combine lines and glow to scratch

        commandBuffers.push(this.combineLinesAndGlowPipline.encodeCommands(nextLineTextureView, this.glowTextureView, this.scratchTextureView, false));
      } else {
        // Copy to scratch
        commandBuffers.push(this.copyTexturePipeline.encodeCommands(nextLineTextureView, this.scratchTextureView));
      } // Apply overlay on top of scratch to canvas


      commandBuffers.push(this.overlayTexturePipeline.encodeCommands(this.scratchTextureView, this.overlayTextureView, colorTextureView, true));
      this.queue.submit(commandBuffers);
    }
  }]);

  return Renderer;
}();


;// CONCATENATED MODULE: ./src/game_object.ts





var Line = function Line(p1x, p1y, p2x, p2y) {
  classCallCheck_classCallCheck(this, Line);

  this.p1 = fromValues(p1x, p1y, 0);
  this.p2 = fromValues(p2x, p2y, 0);
};
var RenderData = function RenderData() {
  _classCallCheck(this, RenderData);
};
var zeroVec3 = [0, 0, 0];
function Scale(s, lines) {
  lines.forEach(function (line) {
    scale(line.p1, line.p1, s);
    scale(line.p2, line.p2, s);
  });
  return lines;
}
function Offset(x, y, lines) {
  lines.forEach(function (line) {
    line.p1[0] += x;
    line.p1[1] += y;
    line.p2[0] += x;
    line.p2[1] += y;
  });
  return lines;
}
var GameObject = /*#__PURE__*/function () {
  function GameObject() {
    classCallCheck_classCallCheck(this, GameObject);

    _defineProperty(this, "position", create());

    _defineProperty(this, "rotation", 0);

    _defineProperty(this, "dead", false);
  }

  _createClass(GameObject, [{
    key: "PositionVec",
    value: function PositionVec() {
      return _toConsumableArray(this.position);
    }
  }, {
    key: "ForwardVec",
    value: function ForwardVec() {
      var fwd = [1, 0, 0];
      return rotateZ(fwd, fwd, zeroVec3, this.rotation);
    }
  }, {
    key: "MoveForward",
    value: function MoveForward(offset) {
      var fwd = this.ForwardVec();
      scale(fwd, fwd, offset);
      add(this.position, this.position, fwd);
    }
  }, {
    key: "Move",
    value: function Move(offset) {
      add(this.position, this.position, offset);
    }
  }, {
    key: "TurnLeft",
    value: function TurnLeft(rads) {
      this.rotation += rads;
    }
  }, {
    key: "TurnRight",
    value: function TurnRight(rads) {
      this.rotation -= rads;
    }
  }, {
    key: "Lines",
    value: function Lines() {
      var _this = this;

      var lines = this.renderData.lines;
      return lines.map(function (line, i) {
        var t = mat4_create();
        fromTranslation(t, _this.position);
        rotate(t, t, _this.rotation, fromValues(0, 0, 1));
        var newLine = new Line();
        transformMat4(newLine.p1, line.p1, t);
        transformMat4(newLine.p2, line.p2, t);
        return newLine;
      });
    }
  }, {
    key: "Extents",
    value: // Cached extents, computed lazily
    function Extents() {
      if (this.extents) {
        return this.extents;
      }

      var left = 0;
      var right = 0;
      var up = 0;
      var down = 0;
      var lines = this.renderData.lines;
      lines.forEach(function (line) {
        left = Math.min(left, line.p1[0]);
        left = Math.min(left, line.p2[0]);
        right = Math.max(right, line.p1[0]);
        right = Math.max(right, line.p2[0]);
        down = Math.min(down, line.p1[1]);
        down = Math.min(down, line.p2[1]);
        up = Math.max(up, line.p1[1]);
        up = Math.max(up, line.p2[1]);
      });
      this.extents = fromValues(right - left, down - up, 0);
      return this.extents;
    }
  }, {
    key: "Radius",
    value: function Radius() {
      var e = this.Extents();
      return Math.max(e[0], e[1]) / 2;
    }
  }]);

  return GameObject;
}();
;// CONCATENATED MODULE: ./src/ship.ts









function ship_createSuper(Derived) { var hasNativeReflectConstruct = ship_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function ship_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var Ship = /*#__PURE__*/function (_GameObject) {
  _inherits(Ship, _GameObject);

  var _super = ship_createSuper(Ship);

  function Ship() {
    var _this;

    classCallCheck_classCallCheck(this, Ship);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "maxSpeed", 9.0);

    _defineProperty(_assertThisInitialized(_this), "accelRate", 1);

    _defineProperty(_assertThisInitialized(_this), "breakRate", 4);

    _defineProperty(_assertThisInitialized(_this), "speed", 0);

    _defineProperty(_assertThisInitialized(_this), "velocity", create());

    _defineProperty(_assertThisInitialized(_this), "accelerate", false);

    _this.renderData = {
      lines: Scale(10, Offset(-1, 0, [new Line(0, 0, -1, 1), new Line(-1, 1, 3, 0), new Line(3, 0, -1, -1), new Line(-1, -1, 0, 0)])),
      color: Float32Array.from([1.0, 1.0, 1.0])
    };
    _this.rotation = Math.PI / 2;
    return _this;
  }

  _createClass(Ship, [{
    key: "Accelerate",
    value: function Accelerate() {
      // Initial speed boost on accelerate
      if (!this.accelerate) {
        this.speed = 0.5;
      }

      this.accelerate = true;
    }
  }, {
    key: "Decelerate",
    value: function Decelerate() {
      this.accelerate = false;
    }
  }, {
    key: "Update",
    value: function Update(dt) {
      if (this.accelerate) {
        this.speed += this.accelRate * dt;
        this.speed = Math.min(this.speed, this.maxSpeed);
      } else {
        this.speed = 0;
      }

      if (this.speed > 0) {
        var newVelocity = this.ForwardVec();
        scale(newVelocity, newVelocity, this.speed);
        add(this.velocity, this.velocity, newVelocity); // Clamp to max speed

        if (vec3_length(this.velocity) > this.maxSpeed) {
          normalize(this.velocity, this.velocity);
          scale(this.velocity, this.velocity, this.maxSpeed);
        }
      } else {
        // When speed hits 0, bring velocity to 0
        var _newVelocity = create();

        negate(_newVelocity, this.velocity);
        scale(_newVelocity, _newVelocity, this.breakRate * dt);

        var oldVelocity = _toConsumableArray(this.velocity);

        add(this.velocity, this.velocity, _newVelocity); // Detect undershoot and clamp to 0

        if (dot(oldVelocity, _newVelocity) < 0) {
          _newVelocity = [0, 0, 0];
        }
      }

      this.Move(this.velocity);
    }
  }]);

  return Ship;
}(GameObject);
;// CONCATENATED MODULE: ./src/missile.ts








function missile_createSuper(Derived) { var hasNativeReflectConstruct = missile_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function missile_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var Missile = /*#__PURE__*/function (_GameObject) {
  _inherits(Missile, _GameObject);

  var _super = missile_createSuper(Missile);

  function Missile(pos, dir) {
    var _this;

    classCallCheck_classCallCheck(this, Missile);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "moveSpeed", 10);

    _defineProperty(_assertThisInitialized(_this), "maxAge", 1.0);

    _defineProperty(_assertThisInitialized(_this), "age", 0);

    _defineProperty(_assertThisInitialized(_this), "size", 5);

    _this.renderData = {
      lines: Scale(_this.size, Offset(-0.5, -0.5, [new Line(0, 0, 1, 0), new Line(1, 0, 1, 1), new Line(1, 1, 0, 1), new Line(0, 1, 0, 0)])),
      color: Float32Array.from([1.0, 1.0, 1.0])
    };
    _this.rotation = 0;
    _this.position = pos;
    _this.dir = dir;
    return _this;
  }

  _createClass(Missile, [{
    key: "Update",
    value: function Update(dt) {
      this.age += dt;

      if (this.age > this.maxAge) {
        this.dead = true;
      }

      this.rotation += 100 * dt;
      var off = create();
      scale(off, this.dir, this.moveSpeed);
      this.Move(off);
    }
  }]);

  return Missile;
}(GameObject);
;// CONCATENATED MODULE: ./src/asteroid.ts








function asteroid_createSuper(Derived) { var hasNativeReflectConstruct = asteroid_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function asteroid_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }



var Asteroid = /*#__PURE__*/function (_GameObject) {
  _inherits(Asteroid, _GameObject);

  var _super = asteroid_createSuper(Asteroid);

  function Asteroid(pos, moveDir, size) {
    var _this;

    classCallCheck_classCallCheck(this, Asteroid);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "moveDir", create());

    _defineProperty(_assertThisInitialized(_this), "moveSpeed", 10.0);

    _defineProperty(_assertThisInitialized(_this), "maxTurnSpeed", 1);

    _defineProperty(_assertThisInitialized(_this), "maxSize", 4);

    _this.position = pos;
    _this.size = size;
    _this.renderData = {
      lines: Scale(_this.size * 15, Offset(-0.5, -0.5, [new Line(0, 0, 1, 0), new Line(1, 0, 1, 1), new Line(1, 1, 0, 1), new Line(0, 1, 0, 0)])),
      color: Float32Array.from([1.0, 1.0, 1.0])
    };
    _this.rotation = Math.random() * 2 * Math.PI;

    if (moveDir) {
      _this.moveDir = moveDir;
    } else {
      // Set random move direction
      rotateZ(_this.moveDir, [1, 0, 0], [0, 0, 0], Math.random() * 2 * Math.PI);
    }

    return _this;
  }

  _createClass(Asteroid, [{
    key: "Size",
    value: function Size() {
      return this.size;
    }
  }, {
    key: "Update",
    value: function Update(dt) {
      var offset = create();
      scale(offset, this.moveDir, this.moveSpeed * dt);
      this.Move(this.moveDir);
      var turnSpeed = this.maxTurnSpeed * (this.maxSize / this.size);
      this.rotation += turnSpeed * dt;
    }
  }]);

  return Asteroid;
}(GameObject);
;// CONCATENATED MODULE: ./src/game.ts










 // Tweakable HTML element vars

var invincible = false;
function game_windowOnLoad() {
  document.getElementById('invincible').addEventListener('change', function () {
    invincible = !invincible;
  });
}

function screenWrap(gameObj, canvas) {
  var halfW = canvas.width / 2;
  var halfH = canvas.height / 2;

  if (gameObj.position[0] < -halfW) {
    gameObj.position[0] = halfW;
  } else if (gameObj.position[0] > halfW) {
    gameObj.position[0] = -halfW;
  }

  if (gameObj.position[1] < -halfH) {
    gameObj.position[1] = halfH;
  } else if (gameObj.position[1] > halfH) {
    gameObj.position[1] = -halfH;
  }
}

function rand(max) {
  return Math.random() * max;
}

function rotatedZ(v, rads) {
  var result = create();
  return rotateZ(result, v, [0, 0, 0], rads);
}

var Game = /*#__PURE__*/function () {
  function Game(canvas) {
    classCallCheck_classCallCheck(this, Game);

    _defineProperty(this, "ships", new Array(new Ship()));

    _defineProperty(this, "asteroids", new Array());

    _defineProperty(this, "missiles", new Array());

    _defineProperty(this, "elapsedTime", 0);

    _defineProperty(this, "lastFireTime", 0);

    _defineProperty(this, "lastShipAliveTime", 0);

    _defineProperty(this, "lastAsteroidsAliveTime", 0);

    _defineProperty(this, "keysPressed", {});

    canvas.width = canvas.height = 640;
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
  }

  _createClass(Game, [{
    key: "run",
    value: function () {
      var _run = _asyncToGenerator( /*#__PURE__*/regenerator_default().mark(function _callee() {
        var _this = this;

        var updateLoop;
        return regenerator_default().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.init();
                _context.next = 3;
                return this.renderer.init();

              case 3:
                updateLoop = function updateLoop(timeStampMs) {
                  // Compute delta time in seconds
                  var dt = (timeStampMs - _this.lastTimeStampMs) / 1000;
                  _this.lastTimeStampMs = timeStampMs;

                  _this.update(dt);

                  _this.render(dt);

                  requestAnimationFrame(updateLoop);
                }; // Start the update loop


                this.lastTimeStampMs = performance.now();
                updateLoop(this.lastTimeStampMs);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function run() {
        return _run.apply(this, arguments);
      }

      return run;
    }()
  }, {
    key: "init",
    value: function init() {}
  }, {
    key: "spawnLevelAsteroids",
    value: function spawnLevelAsteroids() {
      var spread = 250;

      for (var i = 0; i < 5; ++i) {
        var pos = rotatedZ([1, 0, 0], 2 * Math.PI / 5 * i);
        scale(pos, pos, spread);
        var moveDir = rotatedZ([1, 0, 0], rand(2) * Math.PI);
        var size = 4;
        this.asteroids.push(new Asteroid(pos, moveDir, size));
      }
    }
  }, {
    key: "update",
    value: function update(dt) {
      var _this2 = this;

      this.elapsedTime += dt; // Respawn ship

      if (this.ships.length == 0) {
        if (this.elapsedTime - this.lastShipAliveTime > 3) {
          this.ships.push(new Ship());
        }
      } else {
        this.lastShipAliveTime = this.elapsedTime;
      } // Respawn asteroids


      if (this.asteroids.length == 0) {
        if (this.elapsedTime - this.lastAsteroidsAliveTime > 3) {
          this.spawnLevelAsteroids();
        }
      } else {
        this.lastAsteroidsAliveTime = this.elapsedTime;
      }

      this.ships.forEach(function (ship) {
        // TODO: move turning physics into Ship
        var turnRate = 5;

        if ("ArrowLeft" in _this2.keysPressed) {
          ship.TurnLeft(turnRate * dt);
        }

        if ("ArrowRight" in _this2.keysPressed) {
          ship.TurnRight(turnRate * dt);
        }

        if ("ArrowUp" in _this2.keysPressed) {
          ship.Accelerate();
        } else {
          ship.Decelerate();
        }

        var fireInterval = 0.1;

        if ("Space" in _this2.keysPressed) {
          if (_this2.elapsedTime - _this2.lastFireTime > fireInterval) {
            var pos = ship.PositionVec();
            var dir = ship.ForwardVec();
            scaleAndAdd(pos, pos, dir, ship.Radius() - 5);

            _this2.missiles.push(new Missile(pos, dir));

            _this2.lastFireTime = _this2.elapsedTime;
          }
        }
      }); // Collision detection

      this.asteroids.forEach(function (a) {
        if (a.dead) return; // Asteroids - Missiles

        _this2.missiles.forEach(function (m) {
          if (m.dead) return;
          var d = dist(m.position, a.position);

          if (d < m.Radius() + a.Radius()) {
            m.dead = true;
            a.dead = true;

            if (a.Size() > 1) {
              var babies = Game.spawnBabyAsteroids(a);
              babies.forEach(function (b) {
                return _this2.asteroids.push(b);
              });
            }
          }
        }); // Asteroids - Ship


        _this2.ships.forEach(function (ship) {
          if (ship.dead) return;
          var d = dist(a.position, ship.position);

          if (d < ship.Radius() + a.Radius()) {
            if (!invincible) {
              ship.dead = true;
            }

            a.dead = true;

            if (a.Size() > 1) {
              var babies = Game.spawnBabyAsteroids(a);
              babies.forEach(function (b) {
                return _this2.asteroids.push(b);
              });
            }
          }
        });
      });
      var canvas = this.canvas;

      function updateGameObjects(objects) {
        objects.forEach(function (o, i) {
          o.Update(dt);
          screenWrap(o, canvas);
        }); // Remove dead objects

        return objects.filter(function (o) {
          return !o.dead;
        });
      }

      ;
      this.ships = updateGameObjects(this.ships);
      this.asteroids = updateGameObjects(this.asteroids);
      this.missiles = updateGameObjects(this.missiles);
    }
  }, {
    key: "render",
    value: function render(dt) {
      // Render
      var lines = new Array();
      this.ships.forEach(function (ship) {
        lines.push.apply(lines, _toConsumableArray(ship.Lines()));
      });
      this.asteroids.forEach(function (a) {
        lines.push.apply(lines, _toConsumableArray(a.Lines()));
      });
      this.missiles.forEach(function (m) {
        lines.push.apply(lines, _toConsumableArray(m.Lines()));
      });
      this.renderer.render(dt, lines);
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(event) {
      this.keysPressed[event.code] = true;
    }
  }, {
    key: "onKeyUp",
    value: function onKeyUp(event) {
      delete this.keysPressed[event.code];
    }
  }], [{
    key: "spawnBabyAsteroids",
    value: function spawnBabyAsteroids(parent) {
      var numChildSpawns = 3;
      var randDir = rotatedZ([1, 0, 0], rand(2 * Math.PI));
      var result = new Array();

      for (var i = 0; i < numChildSpawns; ++i) {
        var moveDir = rotatedZ(randDir, 2 * Math.PI / numChildSpawns * i);
        result.push(new Asteroid(parent.PositionVec(), moveDir, parent.Size() - 1));
      }

      return result;
    }
  }]);

  return Game;
}();


;// CONCATENATED MODULE: ./src/main.ts



var canvas = document.getElementById('gfx');
var game = new Game(canvas);
window.addEventListener("keydown", function (event) {
  game.onKeyDown(event);
}, true);
window.addEventListener("keyup", function (event) {
  game.onKeyUp(event);
}, true);

window.onload = function () {
  windowOnLoad();
  game_windowOnLoad();
};

game.run();
})();

/******/ })()
;