async-jasmine
======

Jasmine-async, wraps jasmine wrapCompare with asynchronous
functionality, **currently supporting browser**.

Setting up jasmine-async 
=========================

You will need to include the script in the SpecRunner.html
```html
<script src="src/jasmine-async.js"></script>
```
To start testing asynchronously simply call:
```javascript
jasmine.AsyncTestMatcher.install();
```
And stop testing asynchronous call:
```javascript
jasmine.AsyncTestMatcher.uninstall();
```
It is important to call uninstall since calling install will replace
underlying prototype behaviour with asynchronous behaviour.

We *can* use the standard matchers with the async wrap install, however
you might find unexpected behaviour since the default synchronous
behaviour has been tested by Jasmine (Pivotal Labs).

Adding new matchers
===================

To add new matchers simply extend the existing AsyncMatchers object with
new matchers following the jasmine standard for matchers:
```javascript
toEqualAsync: (util) => {
    return {
        compare: *(1)* async function (actual, expected) *(2)* {
            var result = {
                pass: false
            };

            result.pass = util.equals(actual, expected); *(3)*

            return result;
        }
    }
}
```
The current standard for adding new matchers is the append “Async” to
the name of the matcher we need to do this since the wrap won’t await
the expected function if the name doesn’t contain Async this is also
case sensitive
```javascript
if (name.indexOf('Async') !== -1) {
    result = await matcherCompare.apply(null, args);
} else {
    result = matcherCompare.apply(null, args);
}
```
1.  It you don’t have to add async if you are not awaiting a result.

2.  You’re compare function will take an actual and an
    expected argument.

3.  You can call util.equals or evaluate the result yourself.

Known issues
============

This currently doesn’t work with node js but it has been written in a
way that could be extended to work with the require js (AMD)

Calling **.not** on non-asynchronous assertions while the asynchronous wrap
is installed will cause a false result

Example:
```javascript
it("jam", (); {
    //Assert
    expect("jam").toEqual("jam");
}); //PASS

it("jam", () => {
    //Assert
    expect("jam").not.toEqual("jams");
}); //FAIL
```
There is currently a work around for the toEqual operator
```javascript
it("jam", async (done) => {
    //Assert
    await expect("jam").not.toEqualAsync("jams");
    done();
}); //PASS
```
### Support

- [x] Browser
- [ ] Node
