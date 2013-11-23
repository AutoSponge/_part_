function Person(name) {
    this.name = name;
    this.state = null;
}

Person.prototype = {
    changeState: function ( state ) {
        this.state = state;
    },
    is: function ( state ) {
        return this.state === state;
    }
};

var Paul = new Person("Paul");

var Robin = new Person("Robin");

_part_._augment( this )( "is", Person.prototype.is );
_part_._augment( this )( "change", Person.prototype.changeState );
_part_._augment( this )( "all", Array.prototype.forEach );
_part_._augment( this )( "every", Array.prototype.every );
_part_._augment( this )( "some", Array.prototype.some );
_part_._augment( this )( "who", Array.prototype.filter );

var us = [Paul, Robin];

//shows intent for some future action
var we_all = _all( us );

//an action or verb-phrase
var go_to_sleep = change_( "asleep" );

we_all( go_to_sleep );

var everyone = _every( us );

var is_asleep = is_( "asleep" );

everyone( is_asleep ); //true

var wake_up = change_( "awake" );

wake_up( Paul );

everyone( is_asleep ); //false

var someone = _some( us );

someone( is_asleep ); //true

var whoever = _who( us );

//a spread action waiting for a subject
var _wake_up = all_( wake_up );

//_wake_up( whoever( is_asleep ) );

someone( is_asleep ); //false

_part_._augment( this )( "pluck", function (prop) {
    return this[prop];
});
_part_._augment( this )( "map", Array.prototype.map );

//_map( us )( pluck_("name") );

map_( pluck_("name") )( whoever( is_asleep ) );