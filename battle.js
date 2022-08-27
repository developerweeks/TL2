// Set globals for this

var invads = $('#invaders .unit'),
    defens = $('#defenders .unit'),
    speed = 20;



// Utility functions
function conscript() {
	return;
	// This is a stub, because village.js expects it.
}

function inflict(who, what) {
	var details = $(who).attr('stats');
	// stats should fit regex `h[1-3]f[1-3]m[1-3]l[0-9][0]`
	var valid = new RegExp('^h[1-3]f[1-3]m[1-3]l[0-9][0]$');
	if(valid.test(details)) {
		console.log('valid unit');
	} else {
		console.log('cheater detected');
	}
	details = details.split('l');
	if( details[1] < what) {
		// It dead.
		$(who).remove();
	} else {
		$(who).attr('stats', details[0] + 'l'+ (details[1] - what));
	}
    // Damage done.
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
	    // Oh! Units are a combination of their resources, so when calculating damage that is something like h2f1m0 vs h0f2m1
	    // Stone/Iron = hard
		// Wood/Pasture = fast
		// Tar/Hemp = magic
		// So, a golem (3stone) vs a wizard (h1m2f0) would do 2 damage (1 + 2/2) and receive 5 damage (1+2*2)
		// But a golem against a ranger (3wood) would do 6 damange (3*2) and receive 1.5 damage (3/2)

	    $(defens).each(function( index ) {
	    	// Find the closest invader.
	    	var target = {a:0,d:-1}
	    	$(invads).each(function (doot) {
	    		if(target.d == -1) {
	    			target.a = doot;
	    			target.d = distish(defens[index], invads[doot]);
	    		}
	    		if(distish(defens[index], invads[doot]) < target.d) {
	    			target.a = doot;
					target.d = distish(defens[index], invads[doot]);
	    		}
	    	})
	    	console.log(target);
	    	// Calculate damage against them.
	    	// Will have ro-shim-bo claculation soon.
	    	var dmg = 3;  
	    	// Determin if defeated them.  Undate DOM.
	    	inflict(invads[target.a], dmg);
	    });
	    $('#invaders img').each(function( index ) {
	    	// Find the closest invader.
	    	// Calculate damage against them.
	    	// Determin if defeated them.
	    	// Undate DOM.
	    });

    }, 200);
}

function distish(thing1, thing2) {
	var detx = Math.abs($(thing1).offset().left - $(thing2).offset().left);
	var dety = Math.abs($(thing1).offset().top - $(thing2).offset().top);
	// A^2 + B^2 = C^2
	return Math.sqrt((detx*detx)+(dety*dety));
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
