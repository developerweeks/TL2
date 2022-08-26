/*
 * Set some globals
 */
var guyImgs = {
	1: './img/KnifeGuy.gif',
	2: './img/Clubber.gif'
};

// utility functions

function synergize(one,two, three) {
	// find the three types

	// find the three x, and pick the middle

	// find the three y, and pick the middle

	// Add the unit.
}

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



// listeners

