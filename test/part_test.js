var _part_ = require( "../build/src/part" );

exports["_part_ has the correct interface"] = function ( test ) {

    test.expect( 9 );

    [
        "papply",
        "create_",
        "_create",
        "augment",
        "augment_",
        "_augment",
        "borrow",
        "borrow_",
        "_borrow"

    ].forEach(function methodTest( name ) {

            test.ok( typeof _part_[name] === "function", name + " should be a function" );

        });

    test.done();

};

exports["papply method binds receiver and partially applies arguments"] = function ( test ) {

    var add = function ( a, b ) {

        return +a + +b;

    };

    var addN = _part_.papply( add );

    var add1 = addN( 1 );

    test.expect( 2 );

    test.ok( add1( 2 ) === 3 );

    var equasion = {
        dividend: 15,
        divisor: 3
    };

    var operation = function ( operator, operandA, operandB ) {

        return (Function("return " + this[operandA] + operator + this[operandB] + ";"))();

    };

    var doMaths = _part_.papply(operation, equasion);

    var divide = doMaths( "/" );

    test.ok( divide( "dividend", "divisor" ) === 5 );

    test.done();

};

exports["_create method binds receiver and partially applies arguments"] = function ( test ) {

    var a = "a", b = "b", c = "c", obj = {};

    function boltOn( prop, val ) {

        this[prop] = val;

        return this;

    }

    test.expect( 7 );

    test.ok( _part_._create( boltOn )( obj )() === obj );

    test.ok( _part_._create( boltOn )( obj )( a, 1 ) === obj );

    test.ok( _part_._create( boltOn )( obj, b )( 2 ) === obj );

    test.ok( _part_._create( boltOn )( obj, c, 3 )() === obj );

    test.ok( obj.a === 1 );

    test.ok( obj.b === 2 );

    test.ok( obj.c === 3 );

    test.done();

};

exports["create_ method partially applies arguments and binds receiver and additional arguments"] = function ( test ) {

    var arr = [];

    function insertSum( pos, a, b ) {

        this[pos] = a + b;

        return this;

    }

    test.expect( 7 );

    test.ok( _part_.create_( insertSum )()( arr ) === arr );

    test.ok( _part_.create_( insertSum )( 0 )( arr, 1, 2 ) === arr );

    test.ok( _part_.create_( insertSum )( 1, 3 )( arr, 4 ) === arr );

    test.ok( _part_.create_( insertSum )( 2, 5, 6 )( arr ) === arr );

    test.ok( arr[0] === 3 );

    test.ok( arr[1] === 7 );

    test.ok( arr[2] === 11 );

    test.done();

};

exports["augment creates left-part and right-part methods"] = function ( test ) {

    var obj = {},
        arr = [1,2,3];

    function sum( a, b ) {

        return a + b;

    }

    _part_.augment.call( obj, "reduce", Array.prototype.reduce );

    test.ok( obj._reduce( arr )( sum ) === 6 );

    test.ok( obj._reduce( arr, sum )( 1 ) === 7 );

    test.ok( obj._reduce( arr )( sum, 1 ) === 7 );

    test.ok( obj.reduce_( sum )( arr ) === 6 );

    test.ok( obj.reduce_( sum, 1 )( arr ) === 7 );

    test.ok( obj.reduce_( sum )( arr, 1 ) === 7 );

    test.done();

};

exports["borrow creates left-part and right-part methods"] = function ( test ) {

    var obj = {},
        arr = [1,2,3];

    function sum( a, b ) {

        return a + b;

    }

    _part_.borrow.call( obj, Array.prototype, "reduce" );

    test.ok( obj._reduce( arr )( sum ) === 6 );

    test.ok( obj._reduce( arr, sum )( 1 ) === 7 );

    test.ok( obj._reduce( arr )( sum, 1 ) === 7 );

    test.ok( obj.reduce_( sum )( arr ) === 6 );

    test.ok( obj.reduce_( sum, 1 )( arr ) === 7 );

    test.ok( obj.reduce_( sum )( arr, 1 ) === 7 );

    test.done();

};