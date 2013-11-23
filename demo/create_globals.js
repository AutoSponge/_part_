[
    "concat", "every", "filter", "forEach", "join",
    "lastIndexOf", "map", "push", "pop", "reduce",
    "reduceRight", "reverse", "shift", "slice",
    "some", "sort", "splice", "unshift"

].forEach( _part_._borrow( this, Array.prototype ) );


_forEach(["apply", "bind", "call"] )( _part_._borrow( this, Function.prototype ) );