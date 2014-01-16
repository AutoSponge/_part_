\_part\_
========

This micro library encourages functional programming by making native methods available as partially
applied functions.

```javascript
//typical receiver-method-arguments pattern
[1,2,3].map( function (n) { return n + 1; } ); // [2,3,4]
```

The "left-part" functions prepend the method name with an underscore and expect the receiver as
the first argument in the first invocation.

```javascript
_map( [1,2,3] )( function (n) { return n + 1; } ); // [2,3,4]
```

The "right-part" functions suffix the method name with an underscore and expect the receiver as
the first argument in the function returned by the first invocation.

```javascript
map_( function (n) { return n + 1; } )( [1,2,3] ); // [2,3,4]
```

See the [docs](https://rawgithub.com/AutoSponge/_part_/master/build/docs/part.html).

Try the [live demo](https://rawgithub.com/AutoSponge/_part_/master/demo/repl.html).

## Getting Started

See the following examples of how to include \_part\_.

### Custom namespace;

```javascript
// NodeJS example
var _part_ = require( "part" );
var util = {};
_part_._borrow( util )( Array.prototype, "reduce" );
function add( a, b ) { return +a + +b; }
util.sum = util.reduce_( add );
module.exports = util;
```

```html
<!-- Browser example -->
<script src="build/src/part.min.js">
<script>
(function (global, util) {
  function add( a, b ) { return +a + +b; }
  _part_._borrow( util )( Array.prototype, "reduce" );
  util.sum = util.reduce_( add );
  global.util = util;
}(this, {}));
</script>

```

### Extending the \_part\_ namespace;

```javascript
// NodeJS example
var _part_ = require( "part" );
_part_._borrow( util )( Array.prototype, "reduce" );
function add( a, b ) { return +a + +b; }
var sum = util.reduce_( add );
```

```html
<!-- Browser example -->
<script src="build/src/part.min.js">
<script>
function add( a, b ) { return +a + +b; }
_part_.borrow( Array.prototype, "reduce" );
var sum = _part_.reduce_( add );
</script>

```

### Non-namespaced utilities

```javascript
// NodeJS example
var _part_ = require("part");
var reduce_ = _part_.create_(Array.prototype.reduce);
function add( a, b ) { return +a + +b; }
var sum = reduce_( add );
```

```html
<!-- Browser example -->
<script src="build/src/part.min.js">
<script>
function add( a, b ) { return +a + +b; }
_part_._borrow( this )( Array.prototype, "reduce" );
var sum = reduce_( add );
</script>

```

## Updates

- 2013-12-11 - Added `papply` to the `_part_` namespace.