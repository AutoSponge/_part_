[
    "concat", "every", "filter", "forEach", "join",
    "lastIndexOf", "map", "push", "pop", "reduce",
    "reduceRight", "reverse", "shift", "slice",
    "some", "sort", "splice", "unshift"

].forEach( _part_._borrow( this, Array.prototype ) );


_forEach(["apply", "bind", "call"] )( _part_._borrow( this, Function.prototype ) );



_part_._borrow( this )( Array.prototype, "map" );
_part_._borrow( this )( Array.prototype, "reduce" );
_part_._borrow( this )( Date.prototype, "toISOString" );
_part_._borrow( this )( String.prototype, "split" );
_part_.augment( this )( "pluck", function (prop) { return this[prop]; } );
var compose = reduce_( function (a, f) { return f(a); } );
var dates = [new Date(), new Date(999e9), new Date(888e8)];
var all_dates = _map( dates );
all_dates( compose );

var splitT = split_("T");
var split_all = map_(splitT);
var pluck0 = pluck_(0);
split_all(all_dates( toISOString_() ));

var createDates = map_((n) => new Date(n));
createDates([999e9, 888e8, 777e7]);


_part_._borrow( this, Array.prototype )( "map" );
_part_._borrow( this, Array.prototype )( "reduce" );
_part_._borrow( this, document )( "createElement" );
_part_._borrow( this, document )( "createTextNode" );
_part_._borrow( this, document )( "appendChild" );
//functional DOM methods
var ol = _createElement( document, "ol" );
var li = _createElement( document, "li" );
var text = _createElement( document );

var createList = map_(function (t) {
    return appendChild_( li() )( text( t ) );
});

console.log(ol().children = createList(["first", "second", "third"]) );

var fluent = function (fn) {
    return function () {
        fn.apply(this, arguments);
        return this;
    }
};