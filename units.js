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

// Three generic types: fast -> magic -> hard -> fast
// Oh! Units are a combination of their resources, so when calculating damage that is something like h2f1m0 vs h0f2m1
// Stone/Iron = hard
// Wood/Pasture = fast
// Tar/Hemp = magic
// So, a golem (3stone) vs a wizard (h1m2f0) would do 2 damage (1 + 2/2) and receive 5 damage (1+2*2)
// But a golem against a ranger (3wood) would do 6 damange (3*2) and receive 1.5 damage (3/2)

function addUnit(skin = 1, home = {'x':0.5, 'y':0.5}, stats = 'h1f1m1l10') {
  target = document.createElement("img");
  target.id = generateUUID();
  console.log(target.id);
  target.className += 'unit ';
  target.className += 'unit-type-'+ skin;
  target.src = guyImgs[ skin ];
  spawns.append(target);
  $('#'+ target.id).offset({top: home.y, left: home.x});
  // Really make sure we stick to this pattern.
  $('#'+ target.id).attr('unit-type', skin);
  $('#'+ target.id).attr('stats', stats);
  // To make hacking harder, need to have the skin=>type-mix relation hid.
  // If I just put a h1f1m1 on units, some one can change that to h9f9m9 and beat everything.
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
  // Right then, let's count dupes.
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


// The damage table.  If the combination is not found in here, some one is cheating.
function calcDmg(unit1, unit2) {
  // Calculated in google sheets
  // advantage  =min(I4,M4)*3 + min(J4,N4)*3 + min(K4,L4)*3
  // defense  =min(N4*I4,1)+min(L4*J4,1)+min(M4*K4,1)
  // damage = max(advantage - defense, 0) ... +1 on pure elementals against self or perfect advantage
  var table = {
    'h3f0m0': {'h3f0m0':1, 'h0f3m0':10, 'h0f0m3':0, 'h2f1m0':3, 'h2f0m1':1, 'h1f2m0':6, 'h0f2m1':5, 'h1f0m2':1, 'h0f1m2':2, 'h1f1m1':2}, // sum 34
    'h0f3m0': {'h3f0m0':0, 'h0f3m0':1, 'h0f0m3':10, 'h2f1m0':1, 'h2f0m1':2, 'h1f2m0':1, 'h0f2m1':3, 'h1f0m2':5, 'h0f1m2':6, 'h1f1m1':2}, // sum 34
    'h0f0m3': {'h3f0m0':10, 'h0f3m0':0, 'h0f0m3':1, 'h2f1m0':5, 'h2f0m1':6, 'h1f2m0':2, 'h0f2m1':1, 'h1f0m2':3, 'h0f1m2':1, 'h1f1m1':2}, // sum 34
    'h2f1m0': {'h3f0m0':0, 'h0f3m0':6, 'h0f0m3':2, 'h2f1m0':2, 'h2f0m1':1, 'h1f2m0':5, 'h0f2m1':8, 'h1f0m2':1, 'h0f1m2':5, 'h1f1m1':4}, // sum 34
    'h2f0m1': {'h3f0m0':3, 'h0f3m0':5, 'h0f0m3':0, 'h2f1m0':5, 'h2f0m1':2, 'h1f2m0':8, 'h0f2m1':4, 'h1f0m2':2, 'h0f1m2':1, 'h1f1m1':4}, // sum 30
    'h1f2m0': {'h3f0m0':0, 'h0f3m0':3, 'h0f0m3':5, 'h2f1m0':2, 'h2f0m1':1, 'h1f2m0':2, 'h0f2m1':5, 'h1f0m2':4, 'h0f1m2':8, 'h1f1m1':4}, // sum 30
    'h0f2m1': {'h3f0m0':2, 'h0f3m0':0, 'h0f0m3':6, 'h2f1m0':1, 'h2f0m1':5, 'h1f2m0':1, 'h0f2m1':2, 'h1f0m2':8, 'h0f1m2':5, 'h1f1m1':4}, // sum 34
    'h1f0m2': {'h3f0m0':6, 'h0f3m0':2, 'h0f0m3':0, 'h2f1m0':8, 'h2f0m1':5, 'h1f2m0':5, 'h0f2m1':1, 'h1f0m2':2, 'h0f1m2':1, 'h1f1m1':4}, // sum 34
    'h0f1m2': {'h3f0m0':5, 'h0f3m0':0, 'h0f0m3':3, 'h2f1m0':4, 'h2f0m1':8, 'h1f2m0':1, 'h0f2m1':2, 'h1f0m2':5, 'h0f1m2':2, 'h1f1m1':4}, // sum 30
    'h1f1m1': {'h3f0m0':2, 'h0f3m0':2, 'h0f0m3':2, 'h2f1m0':4, 'h2f0m1':4, 'h1f2m0':4, 'h0f2m1':4, 'h1f0m2':4, 'h0f1m2':4, 'h1f1m1':6}, // sum 36
  };
  // magic -> hard -> fast -> magic... and 2magic-1hard gives more damage potential than 2hard-1magic
  // strong > weak gives you 34, weak > strong gives you 30
  if( $(table).hasOwnProperty(unit1) && $(table[unit1]).hasOwnProperty(unit2) ) {
    return table[unit1][unit2];
  }
  // So table[unit1][unit2] is undefined?  Something hinky going on.
  return 0;
  // You cheat?  You do no damage.  The battle will never end and you will stop the cheating.
}

// listeners

// ToDo: make a unit that is controllable by the user 
// this special unit is the one that steals the hexagon
// while the rest of the units are fighting.