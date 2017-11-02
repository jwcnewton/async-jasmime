describe("jasmine-asyncSpecs", () => {
    describe("toThrowAnExceptionAsync", () => {
        beforeEach(() => {
            jasmine.AsyncTestMatcher.install();
        });
        afterEach(() => {
            jasmine.AsyncTestMatcher.uninstall();
        });
        it("Correctly evaluates test if expected throws actual", async (done) => {
            // Act
            await expect(resolves_type_error()).toThrowAnExceptionAsync(TypeError);
            done();
        });

        it("Throws exception if actual is not a promise", async (done) => {
            // Arrange
            var result;

            try {
                // Act
                await expect(resolves_type_error).toThrowAnExceptionAsync(TypeError);
            } catch (err) {
                result = err;
            } 
            //Assert
            await expect(result.message).toEqualAsync("Test assertion threw unexpected exception: Passed in method is not a promise");
            done();
        });

        it("Throws exception if expected is null", async (done) => {
            // Arrange
            var result;

            try {
                // Act
                await expect(resolves_type_error()).toThrowAnExceptionAsync(null);
            } catch (err) {
                result = err;

            }
            //Assert
            await expect(result.message).toEqualAsync("Test assertion threw unexpected exception: Expected method is null or undefined");
            done();
        });

        it("Throws exception if expected is undefined", async (done) => {
            // Arrange
            var result;
            try {
                // Act
                await expect(resolves_type_error()).toThrowAnExceptionAsync(undefined);
            } catch (err) {
                result = err;
            }
            //Assert
            await expect(result.message).toEqualAsync("Test assertion threw unexpected exception: Expected method is null or undefined");
            done();
        });

        it("Throws exception if expected object does not contain a name", async (done) => {
            //Arrange
            let expectedObj = {
                __proto__: {},
                constructor: {
                    name: ""
                }
            };
            var result;
            // Act
            try {
                await expect(resolves_type_error()).toThrowAnExceptionAsync(expectedObj);
            } catch (err) {
                result = err;
            }
            //Assert
            await expect(result.message).toEqualAsync("Test assertion threw unexpected exception: Passed in object does not contain a name");
            done();
        });
    });
    describe("toEqualAsync", () => {
        beforeEach(() => {
            jasmine.AsyncTestMatcher.install();
        });
        afterEach(() => {
            jasmine.AsyncTestMatcher.uninstall();
        });
        it("Correctly evaluates test if actual and expected are equal", async (done) => {
            //Arrange
            const expectedValue = 2;
            //Assert
            await expect(2).toEqualAsync(expectedValue);
            done();
        });
        it("Correctly evaluates test if actual and expected are not equal", async (done) => {
            //Arrange
            const expectedValue = 2;
            //Assert
            await expect(1).not.toEqualAsync(expectedValue);
            done();
        });
    });
});

/*** Test target ***/
async function resolves_type_error() {
    try {
        await somePromiseThatReject();
    } catch (err) {
        throw TypeError();
    } 
};

function somePromiseThatReject() {
    return new Promise((resolve, reject) => {
        reject();
    });
}