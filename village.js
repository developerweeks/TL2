// set some global data
var size = {
   width: window.innerWidth || document.body.clientWidth,
   height: window.innerHeight || document.body.clientHeight  
}
var scale = (size.height + size.width)/40;
var ratio = size.width / size.height; 
var limit = Math.round(Math.sqrt($('.hex').length) / ratio);

var gridWidth = 210,
gridHeight = 220,
scope = 1;

// track the mouse always
var currentMousePos = { x: -1, y: -1 };
$(document).mousemove(function(event) {
   currentMousePos.x = event.pageX;
   currentMousePos.y = event.pageY;
});

// Cant do two dimensions?  Hah!
var anchors = [
[{x:0, y:0, h:0},{x:1, y:0, h:0},{x:2, y:0, h:0},{x:3, y:0, h:0},{x:4, y:0, h:0},{x:5, y:0, h:0}],
[{x:0, y:1, h:0},{x:1, y:1, h:0},{x:2, y:1, h:0},{x:3, y:1, h:0},{x:4, y:1, h:0},{x:5, y:1, h:0}],
[{x:0, y:2, h:0},{x:1, y:2, h:0},{x:2, y:2, h:0},{x:3, y:2, h:0},{x:4, y:2, h:0},{x:5, y:2, h:0}],
[{x:0, y:3, h:0},{x:1, y:3, h:0},{x:2, y:3, h:0},{x:3, y:3, h:0},{x:4, y:3, h:0},{x:5, y:3, h:0}],
[{x:0, y:4, h:0},{x:1, y:4, h:0},{x:2, y:4, h:0},{x:3, y:4, h:0},{x:4, y:4, h:0},{x:5, y:4, h:0}],
];
// Though this makes it anchors[y][x]


// https://jtauber.github.io/articles/css-hexagon.html
// https://d3js.org/
// and image shapes from https://bennettfeely.com/clippy/

console.log('scale ' + scale);
console.log('ratio ' + ratio);
// Initialize village and menus
$('.hex').each(function( index ) {
    console.log($(this).attr('data-x') + ' - ' + $(this).attr('data-y'));
});
conformity();
$('.hex').each(function( index ) {
    console.log($(this).attr('data-x') + ' - ' + $(this).attr('data-y'));
});

function scan(){
   // in case some things have changed, reset the globals
   size = {
       width: window.innerWidth || document.body.clientWidth,
       height: window.innerHeight || document.body.clientHeight  
   }
   scale = (size.height + size.width)/40;
   ratio = size.width / size.height; 
   limit = Math.round(Math.sqrt($('.hex').length) / ratio); 
}

// convert data-x to pixel offsets and place everything
function repaint(){
   $('.hex').each(function( index ) {
     var oddRow = ($(this).attr('data-y') % 2 == 1) ? 0 : 0.5;
     var dx = ($(this).attr('data-x') + oddRow) ;
     var dy = ($(this).attr('data-y')) * gridHeight * 0.77;
     $(this).offset({top:dy,left:dx});
     $(this).height(gridHeight / 2);
     $(this).width(gridWidth - 10);
     console.log(dx + '.' + dy);
 });
};

function census(){
   $('#legend a').each(function( index ) {
      type = $(this).attr('class');
      count = $('.hex .'+type).length;
      $(this).find('span').text(count);
  });
};

// the button functions
$('#reset').on('click', function() {
    console.log('Reset!');
    scan();
  // reset the village layout
  $('.hex').each(function( index ) {
    step = index % limit;
    x = Math.floor( index / limit ) * gridWidth;
    y = step * gridHeight * 0.77;
    $(this).attr('data-x', x);
    $(this).attr('data-y', y);
});
  repaint();
});

$('#sort').on('click', function() {
    console.log("sort!");
  // reorder village layout
  // one row per hex type 
  $('.hex.pasture').each(function( index ) {
    $(this).attr('data-x', index*gridWidth).attr('data-y', 0);
});
  $('.hex.wood').each(function( index ) {
    $(this).attr('data-x', (index + 0.5) * gridWidth).attr('data-y', gridHeight);
});
  $('.hex.iron').each(function( index ) {
    $(this).attr('data-x', index*gridWidth).attr('data-y', 2*gridHeight);
});
  $('.hex.stone').each(function( index ) {
    $(this).attr('data-x', (index + 0.5) * gridWidth).attr('data-y', 3*gridHeight);
});
  $('.hex.tar').each(function( index ) {
    $(this).attr('data-x', index*gridWidth).attr('data-y', 4*gridHeight);
});
  $('.hex.hemp').each(function( index ) {
    $(this).attr('data-x', (index + 0.5) * gridWidth).attr('data-y', 5*gridHeight);
});
  repaint();
});
$('#save').on('click', function() {
 console.log('repaint the village');
 repaint();
});


function snappy( event, ui ) {
    // Find where we are.
    var nY = Math.round( $(this).offset().top / gridHeight);
    var oddRow = (nY % 2 == 1) ? 0 : 0.5;
    var nX = Math.round( $(this).offset().left / gridWidth - oddRow);
    // Check if row offset is needed.
    console.log(oddRow)
    // Now find the closest anchor and put it there.
    if ($.isNumeric(anchors[nY][nX].h)) {
        // Clear old anchor point.
        anchors[$(this).attr('data-y')][$(this).attr('data-x')].h = 0;
        console.log('Drop anchor.');
        // Set here as new home.
        anchors[nY][nX].h = $(this);
        $(this).text(nX + '.' + nY);

        // Nothing in the way, set these coordinates
        $(this).attr('data-x', nX);
        $(this).attr('data-y', nY);
    } else {
        // show me the collision
        console.log("Collision!");
    }
    // Merely a straightening is needed
    repaint();
};

function spotcheck( x, y) {
 var hit = $(".hex[data-x='"+ x+"'][data-y='"+ y+"']");
 var found = hit.find('div').attr('class');
 console.log('spotcheck '+ x+','+y+' is '+ found);
 return found;
};

function annex(type, x, y) {
  // Append a DOM element object
  var newHex = document.createElement( 'div' );
  $(newHex).addClass(type);
  $(newHex).addClass('hex').attr('data-x', x).attr('data-y', y);
  $('#map').append( newHex );

  conformity();
};

// straighten, count, and make them all movable
function conformity(){
    scan(); 
    repaint();
    census();
    $('.hex').draggable({ addClasses: false });
    $('.hex').on( "dragstop", snappy);
    // is this compounding the listeners?
    // how to only attach the listener to the new hex?
};


function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'unit-xxyxxyxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};

