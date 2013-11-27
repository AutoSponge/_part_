\_part\_
========

This micro library encourages functional programming by making native methods available as partially
applied functions.

```
//typical receiver-method-arguments pattern
[1,2,3].map( function (n) { return n + 1; } ); // [2,3,4]
```

The "left-part" functions prepend the method name with an underscore and expect the receiver as
the first argument in the first invocation.

```
_map( [1,2,3] )( function (n) { return n + 1; } ); // [2,3,4]
```

The "right-part" functions suffix the method name with an underscore and expect the receiver as
the first argument in the function returned by the first invocation.

```
map_( function (n) { return n + 1; } )( [1,2,3] ); // [2,3,4]
```

See the [docs](https://rawgithub.com/AutoSponge/_part_/master/build/docs/_part_.html).

Try the [repl](https://rawgithub.com/AutoSponge/_part_/master/demo/repl.html).

## Todo

1. Create some node examples
