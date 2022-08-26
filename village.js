// set some global data
var size = {
  width: window.innerWidth || document.body.clientWidth,
  height: window.innerHeight || document.body.clientHeight  
}
var scale = (size.height + size.width)/40;
var ratio = size.width / size.height; 
var limit = Math.round(Math.sqrt($('.hex').length) * ratio);

var gridWidth = 210,
	gridHeight = 220;

// track the mouse always
var currentMousePos = { x: -1, y: -1 };
    $(document).mousemove(function(event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
    });


// https://jtauber.github.io/articles/css-hexagon.html
// https://d3js.org/
// and image shapes from https://bennettfeely.com/clippy/

console.log('scale ' + scale);
console.log('ratio ' + ratio);
console.log(limit + ' to a row');
// Initialize village and menus
conformity();


/*
 * Utility functions
 */
function scan(){
   // in case some things have changed, reset the globals
   size = {
    width: window.innerWidth || document.body.clientWidth,
    height: window.innerHeight || document.body.clientHeight  
  }
  scale = (size.height + size.width)/40;
  ratio = size.width / size.height; 
  limit = Math.round(Math.sqrt($('.hex').length) * ratio); 
}


function synergize(one, two, three) {
   // body...
}

// convert data-x to pixel offsets and place everything
function repaint(){
  $('.hex').each(function( index ) {
  	var dx = $(this).attr('data-x');
   var dy = $(this).attr('data-y');
   var oddRow = (dy % 2 == 1) ? 0 : 0.5;
   // It looks silly, but the 1* at the start forces this to be a number.
   $(this).offset({top:1 * dy * gridHeight * 0.77, left:1 * gridWidth * dx + 1 * gridWidth * oddRow});
   $(this).text(dx +' - ' + dy);
   $(this).height(gridHeight / 2);
   $(this).width(gridWidth - 10);
  });
};

function census(){
  $('#legend a').each(function( index ) {
    type = $(this).attr('class');
    count = $('.hex.'+type).length;
    $(this).find('span').text(count);
  });
};

function snappy( event, ui ) {
   // Find where we are.
   var nY = Math.round( $(this).offset().top / (0.77 * gridHeight) );
   var oddRow = (nY % 2 == 1) ? 0 : 0.5;
   var nX = Math.round( 1 * $(this).offset().left / gridWidth - oddRow);

   console.log('mouse ' + currentMousePos.x + ' - ' + currentMousePos.y);
   console.log(nX + ' - ' + nY);
   // collision test
   if( $(".hex[data-x='"+ nX+"'][data-y='"+ nY+"']").length == 0) {
      // nothing in the way, set these coordinates
     $(this).attr('data-x', nX);
     $(this).attr('data-y', nY);
     console.log('Landed.');
   } else {
      if( $(this).is($(".hex[data-x='"+ nX+"'][data-y='"+ nY+"']")) ) {
         // Colliding with self, move it.
        $(this).attr('data-x', nX);
        $(this).attr('data-y', nY);
        console.log('Tripped on self.');
      } else {
         // show me the collision
         console.log("Collision!");
         console.log($(".hex[data-x='"+ nX+"'][data-y='"+ nY+"']"));
      }
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


// when a pasture is selected, check the adjacent resources
function pastureasource() {
   // unit encounter?
   $('#selected a').remove();
   var tile = $(this).parent();
   var x = tile.attr('data-x');
   var y = tile.attr('data-y');
   var adjacent = {pasture:1,wood:0,iron:0,stone:0,tar:0,hemp:0,undefined:0};
   // go around the clock
   y = y - 1.5;
   x = x - 1;  // a + is interpretted as concat
   // starting with - sets this as num instead of string
   adjacent[ spotcheck( x, y) ]++;
   x = x + 2;
   adjacent[ spotcheck( x, y) ]++;
   y = y +1.5;
   x = x + 1;
   adjacent[ spotcheck( x, y) ]++;
   y = y +1.5;
   x = x - 1;
   adjacent[ spotcheck( x, y) ]++;
   x = x - 2;
   adjacent[ spotcheck( x, y) ]++;
   y = y - 1.5;
   x = x - 1;
   adjacent[ spotcheck( x, y) ]++;
      
   for (var key in adjacent) {
      if(adjacent[key] > 0) {
       $('#selected').append("<a class='"+ key +"'>&#x2B22;<span class='count'>" + adjacent[key] +"</span></a>");
      } 
   }
   unitlist(adjacent);
};

function annex(type, x, y) {
  // Append a DOM element object
  var newFill = document.createElement( 'div' );
  $(newFill).addClass(type);
  var newHex = document.createElement( 'a' );
  $(newHex).addClass('hex').attr('data-x', x).attr('data-y', y);
  $(newHex).append( newFill );
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
  $('.pasture').on('click', pastureasource);
   // is this compounding the listeners?
   // how to only attach the listener to the new hex?
};

function unitlist(supply) {
   $('#encounter .unit').remove();
   if( supply['pasture'] > 0) {
      $('#encounter').append( '<div class="unit">forager</div>' );
   }
   if( supply['wood'] > 0) {
      $('#encounter').append( '<div class="unit">spearman</div>' );
   }
   if( supply['tar'] > 0) {
      $('#encounter').append( '<div class="unit">torch</div>' );
   }
   if( supply['pasture'] > 2 && supply['stone'] > 2) {
      $('#encounter').append( '<div class="unit">Troll</div>' );
   }
}

var container = document.getElementById("map");
var speedModifier = 0.1;
var wanderlust = 1;
var turn = 0; // whos turn is it to move
var population = 0; // unit total

function makeNewPosition(oldPos) {
  var range = wanderlust * scale,
    newX = oldPos[0]+ Math.round(Math.random() *2*range - range),
    newY = oldPos[1]+ Math.round(Math.random() *2*range - range);
    return [newX, newY];
}

function velocity(prev, next) { 
	var x = Math.abs(prev[1] - next[1]),
    y = Math.abs(prev[0] - next[0]),
    larger = x > y ? x : y,
    speed = Math.ceil(larger / speedModifier);
    return speed;	
}

function animateUnits() {
  population = $('img.target').length;
  var unit = $('img.target')[turn];
  var oldPos = [$(unit).offset().top, $(unit).offset().left];
  var newPos = makeNewPosition(oldPos);
  // increment before moving on
  turn = (turn +1) % population;
  
    // (selector).animate({styles},speed,easing,callback)
	$(unit).animate(
    { top: newPos[0]+"px", 
      left: newPos[1]+"px" }, 
    {duration: velocity(oldPos, newPos),
     fill: 'forwards'},
    "swing",
    setTimeout(animateUnits, 750)
  );
};

// .onfinish = function() {
//		setTimeout(animateUnits, Math.floor(2000))

function addUnit(type = 1, home = 0) {
  target = document.createElement("img");
  target.id = generateUUID();
  console.log(target.id);
  target.className += 'target ';
  target.className += 'unit-type-'+ type;
  target.src = "http://files.softicons.com/download/tv-movie-icons/homestar-runner-icons-by-rich-d/png/128/Pom-Pom.png";
  container.appendChild(target);
}

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
}

