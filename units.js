/*
 * Set some globals
 */
var guyImgs = {
	1: './img/KnifeGuy.gif', // 2 pasture 1 iron
	2: './img/KnightAttackBig.gif', // 2 iron 1 stone
	3: './img/SkellyA.gif', // 2 stone 1 hemp
  4: './img/SkellyB.gif', // 2 stone 1 pasture
  5: './img/wizard.gif', // 1 tar 1 stone 1 hemp
};

// https://opengameart.org/content/mr-knife-guy-animated
// https://codepen.io/punkydrewster713/pen/YooJJj
// https://codepen.io/camkida/details/LjvjwR

var spawns = $('#spawns');
var army = {};

// utility functions

function synergize(one, two, three) {
	// find the three types
  var unitType = concoct([one.attr('data-type'), two.attr('data-type'), three.attr('data-type')]);

	// find the three x, and pick the middle, and adjust.
  var xs  = $([one.offset().left, two.offset().left, three.offset().left]).sort();
  var siteX = (xs[2] - xs[1]) / 2 + xs[1];
	// find the three y, and pick the biggest because it is top corner of underneath.
  var ys = $([one.offset().top, two.offset().top, three.offset().top]).sort();
  // I need to standardize size of unit, and adjust offset by half of its height.
  var siteY = (ys[2] - ys[1]) / 2 + ys[1] - 30;
  // New offsets need half of image's height and width removed from them.
  // Check if this location is already populated.  (Else we get 3 units per triplet).
  var key = Math.round(10 * siteX / gridWidth) +'-'+ Math.round(10 * siteY / gridHeight);
  if( army.hasOwnProperty(key) ) {
    // There is already a unit here.  Bail.
    return;
  }
  army[key] = unitType;
  // Add the unit.
  addUnit(unitType, {'x':siteX,'y':siteY});
}


function placeUnit(ox, oy) {
  // Unit will get decimal for their location?  Convert to offset.
  var oddRow = (oy % 2 == 1) ? 0 : 0.5;
  var ny = 1 * oy * gridHeight * 0.77;
  var nx = 1 * gridWidth * ox + 1 * gridWidth * oddRow;
  return {x:nx,y:ny};
}

function addUnit(type = 1, home = {'x':0.5, 'y':0.5}) {
  target = document.createElement("img");
  target.id = generateUUID();
  console.log(target.id);
  target.className += 'unit ';
  target.className += 'unit-type-'+ type;
  target.src = guyImgs[ type ];
  spawns.append(target);
  $('#'+ target.id).offset({top: home.y, left: home.x});
  // Really make sure we stick to this pattern.
  $('#'+ target.id).attr('unit-type', type % 3);
  // unit-type 1 is Fast, best against magic
  // unit-type 2 is Magic, best against hard
  // unit-type 0 is Hard, best against fast
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

// Look at our tile triplet, and see what it makes.
function concoct(mix) {
  //$(mix).sort();
  // This sort does nothing?  I see both of these.
  // ["iron","stone","iron"]
  // ["stone","iron","iron"]
  var counts = {};

  $.each(mix, function(key,value) {
    if (!counts.hasOwnProperty(value)) {
      counts[value] = 1;
    } else {
      counts[value]++;
    }
  });
  if( counts['iron'] == 2 && counts['stone'] == 1){
    return 2;
  }
  if( counts['stone'] == 2 && counts['hemp'] == 1){
    return 3;
  }
  if( counts['stone'] == 2 && counts['pasture'] == 1){
    return 4;
  }
  if( counts['tar'] == 1 && counts['stone'] == 1 && counts['hemp'] == 1){
    return 5;
  }

  // Go one by one, traversing our type tree, to find which kind of unit is made from this combination.
  // A total of 56 possible combinations
  // Returned type number controls the image used, etc.
  return 1;
}

// Call up the whole army.
function conscript() {
  console.log('~~~~ Conscriptint! ~~~~~')
  // The empty() method removes all child nodes and content from the selected elements.
  $('#spawns').empty();
  // Clear our dupe filter too.
  army = {};
  // It would be more efficient 
  console.log('make the units');
  $('.hex').each(function( index ) {
    var options = findTriplets($(this));
    $(options).each(function(index) {
      synergize($(this)[0],$(this)[1],$(this)[2],);
    });
  });
}

function findTriplets(center) {
  var trips = [];
  var dx = parseInt(center.attr('data-x'));
  var dy = parseInt(center.attr('data-y'));
  // We can look at this by data-coordinates.
  // Assuming we are looking at 1-2, neighbors are 1-1, 2-1, 0-2, 2-2, 1-3, 2-3
  // Assuming we are looking at 1-3, odd row, neighbors are 0-2, 1-2, 0-3, 2-3, 0-4, 1-4
  var oddRow = parseInt(dy % 2 );
  var points = {'UL':0, 'UR':0, 'R':0, 'LR':0, 'LL':0, 'L':0}
  // We want triplets only, go around the clock.
  if( spotcheck( 0 + dx - oddRow, dy - 1)) {
    // Upper Left
    points.UL = $(".hex[data-x='"+ (0 + dx - oddRow) +"'][data-y='"+ ( 0 + dy - 1)+"']");
  }
  if( spotcheck( 1 + dx - oddRow, dy - 1)) {
    // Upper Right
    points.UR = $(".hex[data-x='"+ (1 + dx - oddRow) +"'][data-y='"+ ( 0 + dy - 1)+"']");
  }
  if(points.UL.length && points.UR.length) {
    trips.push([center, points.UL, points.UR].sort());
  }

  if( spotcheck(1 + dx, dy)) {
    // Right.
    points.R = $(".hex[data-x='"+ (1 + dx) +"'][data-y='"+ dy +"']");
  }
  if(points.UR.length && points.R.length) {
    trips.push([center, points.UR, points.R].sort());
  }

  if( spotcheck( 1 + dx - oddRow, 1 + dy)) {
    // Lower Right
    points.LR = $(".hex[data-x='"+ (1 + dx - oddRow) +"'][data-y='"+ (1+dy) +"']");
  }
  if(points.R.length && points.LR.length) {
    trips.push([center, points.R, points.LR].sort());
  }

  if( spotcheck( 0 + dx - oddRow, 1 + dy)) {
    // Lower Left
    points.LL = $(".hex[data-x='"+ (0 + dx - oddRow) +"'][data-y='"+ (1+dy) +"']");
  }
  if(points.LR.length && points.LL.length) {
    trips.push([center, points.LR, points.LL].sort());
  }

  if( spotcheck(0 + dx - 1, dy)) {
    // Left.
    points.L = $(".hex[data-x='"+ (0 + dx - 1) +"'][data-y='"+ dy +"']");
  }
  if(points.LL.length && points.L.length) {
    trips.push([center, points.LL, points.L].sort());
  }
  if(points.L.length && points.UL.length) {
    trips.push([center, points.L, points.UL].sort());
  }

  return trips;
};

// listeners

// ToDo: make a unit that is controllable by the user 
// this special unit is the one that steals the hexagon
// while the rest of the units are fighting.