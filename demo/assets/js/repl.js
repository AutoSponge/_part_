// modified by @AutoSponge 2013.
//
// Copyright 2011 Traceur Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
(function(global) {
    'use strict';

    // Do not show source maps by default.
    traceur.options.sourceMaps = false;

    var SourceMapConsumer = traceur.outputgeneration.SourceMapConsumer;
    var SourceMapGenerator = traceur.outputgeneration.SourceMapGenerator;
    var ProjectWriter = traceur.outputgeneration.ProjectWriter;
    var ErrorReporter = traceur.util.ErrorReporter;

    var hasError = false;
    var debouncedCompile = debounced(compile, 200, 2000);
    var input = CodeMirror.fromTextArea(document.querySelector('.input'), {
        onChange: debouncedCompile,
        onCursorActivity: debouncedCompile.delay,
        lineNumbers: true,
        theme: "ambiance"
    });

    var evalElement = document.querySelector('pre.eval');
    var errorElement = document.querySelector('pre.error');
    var sourceMapElement = document.querySelector('pre.source-map');

    if (location.hash)
        input.setValue(decodeURIComponent(location.hash.slice(1)));

    /**
     * debounce time = min(tmin + [func's execution time], tmax).
     *
     * @param {Function} func
     * @param {number} tmin Minimum debounce time
     * @param {number} tmax Maximum debounce time
     * @return {Function} A debounced version of func with an attached "delay"
     *     function. "delay" will delay any pending debounced function by the
     *     current debounce time. If there are none pending, it is a no-op.
     */
    function debounced(func, tmin, tmax) {
        var id = 0;
        var t = tmin;
        function wrappedFunc() {
            var start = Date.now();
            id = 0;
            func();
            t = tmin + Date.now() - start; // tmin + [func's execution time]
            t = t < tmax ? t : tmax;
        }
        function debouncedFunc() {
            clearTimeout(id);
            id = setTimeout(wrappedFunc, t);
        }
        // id is nonzero only when a debounced function is pending.
        debouncedFunc.delay = function() { id && debouncedFunc(); }
        return debouncedFunc;
    }

    function setOptionsFromSource(source) {
        var re = /^\/\/ Options:\s*(.+)$/mg;
        var optionLines = source.match(re);
        if (optionLines) {
            optionLines.forEach(function(line) {
                re.lastIndex = 0;
                var m = re.exec(line);
                try {
                    traceur.options.fromString(m[1]);
                } catch (ex) {
                    // Ignore unknown options.
                }
            });
            createOptions();
        }
    }

    function compile() {
        hasError = false;
        errorElement.textContent = sourceMapElement.textContent = '';

        var reporter = new ErrorReporter();
        reporter.reportMessageInternal = function(location, format, args) {
            errorElement.textContent +=
                ErrorReporter.format(location, format, args) + '\n';
        };

        var url = location.href;
        var project = new traceur.semantics.symbols.Project(url);
        var name = 'repl';
        var contents = input.getValue();
        if (history.replaceState)
            history.replaceState(null, document.title,
                '#' + encodeURIComponent(contents));
        setOptionsFromSource(contents);
        var sourceFile = new traceur.syntax.SourceFile(name, contents);
        project.addFile(sourceFile);
        var res = traceur.codegeneration.Compiler.compile(reporter, project, false);
        if (reporter.hadError()) {
            hasError = true;
        } else {
            var options;
            if (traceur.options.sourceMaps) {
                var config = {file: 'traceured.js'};
                var sourceMapGenerator = new SourceMapGenerator(config);
                options = {sourceMapGenerator: sourceMapGenerator};
            }

            var source = ProjectWriter.write(res, options);

            try {
                evalElement.textContent = ('global', eval)(source);
            } catch(ex) {
                hasError = true;
                errorElement.textContent = ex;
            }

            if (traceur.options.sourceMaps) {
                var renderedMap = renderSourceMap(source, options.sourceMap);
                sourceMapElement.textContent = renderedMap;
            }
        }

        errorElement.hidden = !hasError;
    }

    function createOptionRow(name) {
        var li = document.createElement('li');
        var label = document.createElement('label');
        label.textContent = name;
        var cb = label.insertBefore(document.createElement('input'),
            label.firstChild);
        cb.type = 'checkbox';
        var checked = traceur.options[name];
        cb.checked = checked;
        cb.indeterminate = checked === null;
        cb.onclick = function() {
            traceur.options[name] = cb.checked;
            createOptions();
            compile();
        };
        li.appendChild(label);
        return li;
    }

    var options = [
        'experimental',
        'debug',
        'sourceMaps',
        'freeVariableChecker',
        'validate'
    ];

    var showAllOpts = true;
    var allOptsLength = Object.keys(traceur.options).length;
    var showMax = allOptsLength;

    function createOptions() {
        var optionsDiv = document.querySelector('.traceur-options');
        optionsDiv.textContent = '';
        if (showAllOpts) {
            var i = 0;
            Object.keys(traceur.options).forEach(function(name) {
                if (i++ >= showMax || options.lastIndexOf(name) >= 0)
                    return;
                optionsDiv.appendChild(createOptionRow(name));
            });
            optionsDiv.appendChild(document.createElement('hr'));
        }
        options.forEach(function(name) {
            optionsDiv.appendChild(createOptionRow(name));
        });
    }

    createOptions();

    function renderSourceMap(source, sourceMap) {
        var consumer = new SourceMapConsumer(sourceMap);
        var lines = source.split('\n');
        var lineNumberTable = lines.map(function(line, lineNo) {
            var generatedPosition = {
                line: lineNo + 1,
                column: 0
            };
            var position = consumer.originalPositionFor(generatedPosition);
            var lineDotColumn = position.line + '.' + position.column;
            return (lineNo + 1) + ': ' + line + ' -> ' + lineDotColumn;
        });
        return 'SourceMap:\n' + lineNumberTable.join('\n');
    }

    global.cm = input;

}(this));

(function () {
    //even though it would be cool, resist the tempation to use _part_ here
    //so it doesn't leak into the repl

    var examples = document.getElementById("examples");
    var lists = ["arrayMethods", "functionMethods", "stringMethods", "genericMethods"];
    var elms = {};
    var cache = {};
    var config = {
        arrayMethods: [
            {
                title: "Create map_ (function-first style)",
                body: function () {
                    /*
var map_ = _part_.create_( Array.prototype.map );
                     */
                }
            },
            {
                title: "Create _map (receiver-first style)",
                body: function () {
                    /*
var _map = _part_._create( Array.prototype.map );
                     */
                }
            },
            {
                title: "Create forEach_ and _forEach globals",
                body: function () {
                    /*
_part_._borrow( this )( Array.prototype, "forEach" );
                     */
                }
            },
            {
                title: "Create each_ and _each globals",
                body: function () {
                    /*
_part_._augment( this )( "each", Array.prototype.forEach );
                     */
                }
            },
            {
                title: "Create forEach in util",
                body: function () {
                    /*
var util = {
    addPartMethods: _part_.augment
};
util.addPartMethods( "each", Array.prototype.forEach );
                     */
                }
            },
            {
                title: "Create all Array methods as globals",
                body: function () {
                    /*
[
    "concat", "every", "filter", "forEach", "join",
    "lastIndexOf", "map", "push", "pop", "reduce",
    "reduceRight", "reverse", "shift", "slice",
    "some", "sort", "splice", "unshift"
].forEach( _part_._borrow( this, Array.prototype ) );
                     */
                }
            },
            {
                title: "example: pipeline (ES6)",
                body: function () {
                    /*
var reduce_ = _part_.create_( Array.prototype.reduce );
var pipeline = reduce_(function (a, b) {
    return b && function (x) {
        return b(a(x));
    } || a;
});
var myProcess = pipeline([
    (n) => n + 1,
    (n) => n * 2,
    (n) => n * n
]);
myProcess(2);
                     */
                }
            },
            {
                title: "example: map/reduce (ES6)",
                body: function () {
                    /*
var map_ = _part_.create_( Array.prototype.map );
var reduce_ = _part_.create_( Array.prototype.reduce );
var add = (a=0, b=0) => +a + +b;
var applyTax = (amount) => ( (amount * 1065) / 1000).toFixed( 2 );
var sum = reduce_( add );
var applyTaxes = map_( applyTax );
sum( applyTaxes( [5, 11.12, 42.03] ) );
                     */
                }
            },
            {
                title: "example: map (ES6)",
                body: function () {
                    /*
var map_ = _part_.create_( Array.prototype.map );
var double = map_( (n) => n * 2 );
var myNumbers = [1,2,3];
double( myNumbers );
                     */
                }
            }
        ],
        functionMethods: [
            {
                title: "Create function globals",
                body: function () {
                    /*
[
    "call", "apply", "bind"
].forEach( _part_._borrow( this, Function.prototype ) );
                    */
                }
            },
            {
                title: "example: logger",
                body: function () {
                    /*
var _call = _part_._create( Function.prototype.call );
var log = _call( console.log, console );
log("testing", 1, 2, 3); //check the console!
                     */
                }
            },
            {
                title: "example: curry",
                body: function () {
                    /*
var curry = _part_._create( Function.prototype.bind );
var add = function ( a, b ) { return +a + +b; }
var addN = curry( add, null ); // we must pass null as the receiver
var add1 = addN( 1 );
add1( 2 );

                     */
                }
            }
        ],
        stringMethods: [
            {
                title: "Create all String methods as globals",
                body: function () {
                    /*
[
    "quote", "substring", "toLowerCase", "toUpperCase", "charAt",
    "charCodeAt", "indexOf", "lastIndexOf", "startsWith", "endsWith",
    "trim", "trimLeft", "trimRight", "toLocaleLowerCase",
    "toLocaleUpperCase", "localeCompare", "match", "search",
    "replace", "split", "substr", "concat", "slice"
].forEach( _part_._borrow( this, String.prototype ) );
                     */
                }
            },
            {
                title: "example: concat pipeline",
                body: function () {
                    /*
_part_._borrow( this )( String.prototype, "concat" );
["reduce", "map", "join"].forEach( _part_._borrow( this, Array.prototype ) );
var pipeline = reduce_( function ( a, b ) {
    return b && function ( x ) {
        return b( a( x ) );
    } || a;
} );
var makeOrderedList = pipeline( [
    map_( pipeline( [
        _concat( "\t<li>" ),
        concat_( "</li>\n" )
    ] ) ),
    join_( "" ),
    _concat( "<ol>\n" ),
    concat_( "</ol>" )
] );
makeOrderedList( ["one", "two", "three"] );
                    */
                }
            }
        ],
        genericMethods: [
            {
                title: "'curry' add",
                body: function () {
                    /*
var addN = _part_.papply( function add( a, b ) {
    return +a + +b;
} );
var add1 = addN( 1 );
add1( 2 );
                    */
                }
            },
            {
                title: "'curry' DOM methods",
                body: function () {
                    /*
var setBody = _part_.papply( Element.prototype.setAttribute, document.body );
var setBodyClass = setBody( "class" );
setBodyClass( "dark" ); // who turned out the lights?!
//setBodyClass( "" ); // uncomment to fix it
                     */
                }
            }
        ]
    };

    //build lists
    lists.forEach(function (name) {
        elms[name] = document.getElementById( name );
    });

    lists.forEach( function (namespace) {
        config[namespace].forEach(function (e, i) {
            var str = e.body
                .toString()
                .replace(/[^\*]+\*/m, "")
                .split("*/")[0]
                .split("\n")
                .filter(function (s) {
                    return !!s && !s.match(/^\s+$/);
                })
                .join("\n");

            cache[e.title] = str;
            $('<li><a href="#">' + e.title + '</a></li>' ).appendTo(elms[namespace]);
        });
    } );

    //add handlers
    $("button[type=reset]" ).on("click", function () {
        window.location.href = window.location.href.split("#")[0];
    });

    $(examples).on("click", function (e) {
        cm.setValue( cache[e.target.textContent] );
        e.preventDefault();
    });

}());