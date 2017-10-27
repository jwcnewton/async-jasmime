# async-jasmime

To add matchers
```javascriptjasmine.AsyncTestMatcher.install(this);``` and pass in scope. <br/>
To remove
```javascriptjasmine.AsyncTestMatcher.uninstall();```

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
        it("Some rest call throws error on 400 response", async (done) => {
            //Arrange
            jasmine.Ajax.stubRequest(anyRegex).andReturn({
                "responseText": "",
                "status": 404
            });

            jasmine.AsyncTestMatcher.install(this);

            await expect(jamSut.someAsyncFunction({})).toThrowAnExceptionAsync(TypeError);
            done();
        });

        it("True to be true", () => {
            //Act
            expect(true).toEqual(true);
        });
    });
});
```

### Support

- [x] Browser
- [ ] Node
