/*
 * Set some globals
 */
var guyImgs = {
	1: './img/KnifeGuy.gif',
	2: './img/Clubber.gif',
	3: './img/Pom-Pom.png'
};

var spawns = $('#spawns');

// utility functions

function synergize(one,two, three) {
	// find the three types

	// find the three x, and pick the middle

	// find the three y, and pick the middle

	// Add the unit.
}

function addUnit(type = 1, home = {x:0.5, y:0.5}) {
  target = document.createElement("img");
  target.id = generateUUID();
  console.log(target.id);
  target.className += 'target unit ';
  target.className += 'unit-type-'+ type;
  target.src = guyImgs[ type ];
  spawns.append(target);
  $('#'+ target.id).offset({top:0.77 * gridHeight * home.y, left:1 * gridWidth * home.x});
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



// listeners

// ToDo: make a unit that is controllable by the user 
// this special unit is the one that steals the hexagon
// while the rest of the units are fighting.