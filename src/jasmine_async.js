(function (root, factory) {
    if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        var jasmineRequire = require('jasmine-core');
        module.exports = factory(root, function () {
            return jasmineRequire;
        });
    } else {
        // Browser globals
        window.AsyncCustomMatchers = factory(root, getJasmineRequireObj);
    }
}(typeof window !== 'undefined' ? window : global, function (global, getJasmineRequireObj) {
    getJasmineRequireObj().asyncTestMatcher = function (jRequire) {
        var asyncExcept = {};

        asyncExcept.ExpectationAdaptor = jRequire.AsyncExpectationAdaptor;
        asyncExcept.AsyncWrap = jRequire.wrapCompareAsync;
        asyncExcept.CustomMatchers = jRequire.AsyncMatchers;
        asyncExcept.AsyncCustomMatchers = jRequire.AsyncCustomMatchers(asyncExcept);
        return asyncExcept.AsyncCustomMatchers;
    };

    getJasmineRequireObj().AsyncCustomMatchers = function(exAsAsync) {
        function AsyncCustomMatchers() {
            var testTarget,
                defaultExept,
                defaultWrap,
                customExceptions = exAsAsync.CustomMatchers(),
                asyncWrap = exAsAsync.AsyncWrap,
                excpAdapt = exAsAsync.ExpectationAdaptor;
                
            this.install = function(t_) {
                testTarget = t_;
                jasmine.addMatchers(customExceptions);
                defaultExept = jasmine.Expectation;
                defaultWrap = jasmine.Expectation.prototype.wrapCompare;

                jasmine.Expectation = excpAdapt();
                jasmine.Expectation.prototype.wrapCompare = asyncWrap;
            };
            this.uninstall = () => {
                this.testTarget = null;
                jasmine.Expectation = defaultExept;
                jasmine.Expectation.prototype.wrapCompare = defaultWrap;
            };
        }

        return AsyncCustomMatchers;
    };

    getJasmineRequireObj().AsyncMatchers = function() {
        return {
            toThrowAnExceptionAsync: (util) => {
                return {
                    compare: async (actual, expected) => {
                        var output = {},
                            threwException = false,
                            result = {};
                            
                        try {
                            await actual;
                            return result;
                        } catch (err) {
                            threwException = true;
                            output = err;
                        }

                        result.pass = util.equals(output.constructor, expected);
                        if (result.pass) {
                            result.message = `Expected exception of type: ${expected.name}`;
                        } else if (!result.pass && threwException) {
                            result.message =
                                `Expected exception of type: ${expected.name} but got exception of type ${output.name}`;
                        } else {
                            result.message = "Expected function did not throw exception";
                        }
                        return result;
                    }

                }
            }
        }
    };

    getJasmineRequireObj().AsyncExpectationAdaptor = function () {
        function Expectation(options) {
            this.util = options.util || { buildFailureMessage: function () { } };
            this.customEqualityTesters = options.customEqualityTesters || [];
            this.actual = options.actual;
            this.addExpectationResult = options.addExpectationResult || function () { };
            this.isNot = options.isNot;

            var customMatchers = options.customMatchers || {};
            for (var matcherName in customMatchers) {
                this[matcherName] = Expectation.prototype.wrapCompare(matcherName, customMatchers[matcherName], options);
            }
        }
        Expectation.addCoreMatchers = function (matchers) {
            var prototype = Expectation.prototype;
            for (var matcherName in matchers) {
                var matcher = matchers[matcherName];
                prototype[matcherName] = prototype.wrapCompare(matcherName, matcher);
            }
        };

        Expectation.Factory = function (options) {
            options = options || {};
            var expect = new Expectation(options);
            options.isNot = true;
            expect.not = new Expectation(options);

            return expect;
        };

        return Expectation;
    };

    getJasmineRequireObj().wrapCompareAsync = function (name, matcherFactory, options) {
        return async function () {
            var args = Array.prototype.slice.call(arguments, 0),
                expected = args.slice(0),
                message = '',
                result = null;

            args.unshift(options.actual);

            var matcher = matcherFactory(options.util, options.customEqualityTesters),
                matcherCompare = matcher.compare;


            function defaultNegativeCompare() {
                var result = matcher.compare.apply(null, args);
                result.pass = !result.pass;
                return result;
            }

            if (options.isNot) {
                matcherCompare = matcher.negativeCompare || defaultNegativeCompare;
            }

            if (options.actual.constructor.name === "Promise")
                result = await matcherCompare.apply(null, args);
            else
                result = matcherCompare.apply(null, args);

            if (!result.pass) {
                if (!result.message) {
                    args.unshift(options.isNot);
                    args.unshift(name);
                    message = options.util.buildFailureMessage.apply(null, args);
                } else {
                    if (Object.prototype.toString.apply(result.message) === '[object Function]') {
                        message = result.message();
                    } else {
                        message = result.message;
                    }
                }
            }

            if (expected.length == 1) {
                expected = expected[0];
            }
            options.addExpectationResult(
                result.pass,
                {
                    matcherName: name,
                    passed: result.pass,
                    message: message,
                    actual: options.actual,
                    expected: expected
                }
            );
        };
    };

    var jRequire = getJasmineRequireObj();
    var AsyncTestMatcher = jRequire.asyncTestMatcher(jRequire);
    jasmine.AsyncTestMatcher = new AsyncTestMatcher(global);

    return AsyncTestMatcher;
}));