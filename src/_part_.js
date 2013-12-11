// `_part_`, a meta utility, creates utility methods for
// functional programming from traditional object-methods.
// `_part_` provides a simple interface for creating
// lazy (partial application) functions.

// Functions created by `_part_`'s `_create` and `create_` use an
// underscore (`_`) to denote which argument(s) it expects next.  If the
// underscore precedes the function name, as in `_map`, the function
// expects a receiver/context object first. It may help to think of
// what normally appears to the left of the `map` function:

// `arr.map(fn)` == `_map(arr)(fn)`

// If the underscore comes after the function name, as in `map_`,
// then the function expects predicate arguments first and the
// receiver in the invocation of the returned function.

// `arr.map(fn)` == `map_(fn)(arr)`

// Because both versions partially apply arguments, any argument
// that is not the method receiver can vary position.

// `arr.map(fn)` == `map_(fn)(arr)` == `map_()(arr, fn)`

(function ( GLOBAL, $ ) {

    // papply
    // ------

    // `papply` takes a function and an optional receiver and returns a
    // function that will partially apply arguments.

    // `papply(f, a) -> part__(b) -> part_(c, d) = f.apply(a, [b,c,d])`
    $.papply = function ( fn, receiver ) {

        return function part__( ...args1 ) {

            return function part_( ...args2 ) {

                return fn.apply( receiver, [...args1, ...args2] );

            };

        };

    };

    // \_create
    // --------

    // `_create` takes a function and returns a function that
    // will partially apply arguments. The resulting function expects
    // a receiver as its first argument.

    // `_create(f) -> _part(a, b) -> part_(c, d) = f.apply(a, [b,c,d])`
    $._create = function ( fn ) {

        return function _part( receiver, ...args1 ) {

            return function part_( ...args2 ) {

                return fn.apply( receiver, [...args1, ...args2] );

            };

        };

    };

    // create\_
    // --------

    // `create_` takes a function and returns a function that
    // will partially apply arguments. The resulting function expects
    // takes arguments and returns a function which expects a receiver
    // as its first argument.

    // `create_(f) -> part_(a, b) -> _part(c, d) = f.apply(c, [a,b,d])`
    $.create_ = function ( fn ) {

        return function part_( ...args1 ) {

            return function _part( receiver, ...args2 ) {

                return fn.apply( receiver, [...args1, ...args2] );

            };

        };

    };

    // augment
    // -------

    // `augment` takes a string name and a function argument and creates two
    // partial application, object-method versions of the given function
    // for the receiver object.

    // Example:

    // ```
    // var namespace = {};
    // _part_.augment.call(namespace, "map", Array.prototype.map);
    // typeof namespace._map === "function"; //true
    // typeof namespace.map_ === "function"; //true
    // ```
    $.augment = function ( name, fn ) {

        this["_" + name] = $._create( fn );

        this[name + "_"] = $.create_( fn );

    };

    // borrow
    // ------

    // `borrow` takes a source object and a string name
    // and `augment`s the receiver object.  This pattern works well for
    // copying multiple methods to a namespace.

    // Example:

    // ```
    // var namespace = {};
    // _part_
    //   .borrow
    //   .call(namespace, Array.prototype, "reduce");
    // typeof namespace._reduce === "function"; //true
    // typeof namespace.reduce_ === "function"; //true
    //
    // ```
    $.borrow = function ( source, name ) {

        $.augment.call( this, name, source[name] );

    };

    // \_augment and augment\_
    // -----------------------

    // Example:

    // ```
    // //make a _each and each_ methods from forEach
    // _augment(namespace)("each", Array.prototype.forEach);
    //
    // //make a _each and each_ methods from forEach
    // _part_.augment_("each", Array.prototype.forEach)(namespace);
    //
    // //or
    // _part_.augment_("each")(namespace, Array.prototype.forEach);
    // ```
    $.augment( "augment", $.augment );

    // \_borrow and borrow\_
    // ---------------------

    // Example:

    // ```
    // //make six methods from Array methods
    // ["map",
    //  "reduce",
    //  "slice"
    // ].map(_borrow(namespace)(Array.prototype));
    //
    // //make a _each and each_ methods from forEach
    // _part_.borrow_(Array.prototype, "forEach", "each")(namespace);
    //
    // //or
    // _part_.borrow_(Array.prototype, "forEach")(namespace, "each");
    // ```
    $.augment( "borrow", $.borrow );

    if ( typeof module === "undefined") {

        GLOBAL._part_ = $;

    } else {

        module.exports = $;

    }

}( this, {} ));