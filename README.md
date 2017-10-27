# async-jasmime

## Example

```javascript
    describe("SomeTest", () => {
        var jamSut;
        const anyRegex = /.*/;
        beforeEach(() => {
            jasmine.Ajax.install();
            jamSut = new jam();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });
        describe("Some test", () => {

            afterEach(() => {
                jasmine.AsyncTestMatcher.uninstall();
            });

            it("Some rest call throws error on 400 response", async (done) => {
                //Arrange
                jasmine.Ajax.stubRequest(anyRegex).andReturn({
                    "responseText": "",
                    "status": 404
                });

                jasmine.AsyncTestMatcher.install(jamSut);

                await expect(jamSut.someAsyncFunction({})).toThrowAnExceptionAsync(TypeError);
                done();
            });

            it("True to be true jam", () => {
                //Act
                expect(true).toEqual(true);
            });
        });
    });
```

### Support

- [x] Browser
- [ ] Node
