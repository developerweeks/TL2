// Set globals for this

var invads = $('#invaders .unit'),
    defens = $('#defenders .unit'),
    speed = 20;



// Utility functions
function conscript() {
	return;
	// This is a stub, because village.js expects it.
}

function FIGHT() {
	var opponent = $('#invaders .unit')[Math.floor(Math.random()*invads.length)];
	console.log(opponent);
	    	
    setInterval(function() {
	    // This code is executed every 200 milliseconds:
	    $('#defenders img').each(function( index ) {
	    	
	    	var opponent = $('#invaders .unit')[Math.floor(Math.random()*invads.length)];
	    	var next = steppit($(opponent).offset().left, $(opponent).offset().top, $(this).offset().left, $(this).offset().top);
            $(this).offset({top: next.y, left: next.x});
            // In order to do lookups
            // $(".hex[data-x='"+ (0 + dx - 1) +"'][data-y='"+ dy +"']");;
            // I need these units to have data attributes that I can query
	    });
	    $('#invaders img').each(function( index ) {
	    	var opponent = $('#defenders .unit')[Math.floor(Math.random()*defens.length)];
	    	var next = steppit($(opponent).offset().left, $(opponent).offset().top, $(this).offset().left, $(this).offset().top);
            $(this).offset({top: next.y, left: next.x});
            // In order to do lookups
            // $(".hex[data-x='"+ (0 + dx - 1) +"'][data-y='"+ dy +"']");;
            // I need these units to have data attributes that I can query
	    });
	    // So now, we do damage.
	    // Three generic types: fast -> magic -> hard -> fast

    }, 200);
}

function steppit(w,x,y,z) {
	var nx = y;
	var ny = z;
	if (Math.abs(y - w) < 5 *speed) {
		// they are close enough.
		nx = y;
	} else {
    	if (w < y) {
    		nx = (y - speed) ;
    	} else {
    		nx = (y + speed) ;
    	}
	}
	if (Math.abs(z - x) < 3 * speed) {
		// they are close enough.
		ny = z;
	} else {
    	if (x < z) {
    		ny = (z - speed);
    	} else {
    		ny = (z + speed);
    	}
	}
	return {x:nx,y:ny}
}

// Listeners
$( document ).ready(function() {
	// Time to attack stuff.
	FIGHT();
});
