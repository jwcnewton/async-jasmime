/*global expect, jasmine */
const jasmine_async = require("../src/jasmine_async");

describe("Test Async", () => {
    beforeEach(function() {
        jasmine.AsyncTestMatcher.install(this);
    });
    afterEach(function() {
        jasmine.AsyncTestMatcher.uninstall();
    });
    it("Throw async tests", async (done) => {
        await expect(async () => {
            throw TypeError("Jam")
        }).toThrowExceptionAsync(TypeError);
        done();
    });
    it("Throw async tests", () => {
        expect(true).toEqual(true);
    });
});