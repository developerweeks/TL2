// Set globals for this

var invads = $('#invaders .unit'),
    defens = $('#defenders .unit'),
    speed = 20;
// The vars invads and defens become invalid after some units are killed.

// To look intoL
// https://www.freecodecamp.org/news/learning-javascript-by-making-a-game-4aca51ad9030/
// https://www.reddit.com/r/gamedev/
//
// Utility functions
function conscript() {
    return;
    // This is a stub, because village.js expects it.
}


// The damage table.  If the combination is not found in here, some one is cheating.
function calcDmg(unit1, unit2) {
  // Calculated in google sheets
  // advantage  =min(I4,M4)*3 + min(J4,N4)*3 + min(K4,L4)*3
  // defense  =min(N4*I4,1)+min(L4*J4,1)+min(M4*K4,1)
  // damage = max(advantage - defense, 0) ... +1 on pure elementals against self or perfect advantage
  var dmgtble = {
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
  if( typeof dmgtble[unit1] == 'object' && typeof dmgtble[unit1][unit2] == 'number' ) {
    return dmgtble[unit1][unit2];
  }
  // So table[unit1][unit2] is undefined?  Something hinky going on.
  return 0;
  // You cheat?  You do no damage.  The battle will never end and you will stop the cheating.
}

function inflict(who, what) {
    var details = $(who).attr('stats');
    // stats should fit regex `h[1-3]f[1-3]m[1-3]l[0-9][0]`
    var valid = new RegExp('^h[1-3]f[1-3]m[1-3]l[0-9]0?$');
    if(valid.test(details)) {
        console.log('valid unit, '+ what);
    } else {
        console.log('cheater detected!! '+ details);
        console.log(who);
    }
    // separate strength from life.
    console.log(details);
    details = details.split('l');
    var health = parseInt( details[1]);
    if( health < what) {
        // It dead.
        $(who).remove();
    } else {
        $(who).attr('stats', details[0] + 'l'+ (health - what));
    }
    console.log($(who).attr('stats'));
    // Damage done.
}

function FIGHT() {
    // Loop, giving each unit a turn to fight.        
        // This code is executed every 200 milliseconds:        
        $('#defenders img').each(function( index ) {
            var opponent = {};
            if($('#invaders .unit').length > 1){
                opponent = $('#invaders .unit')[Math.floor(Math.random() * $('#invaders .unit').length)];
            } else {
                opponent = $('#invaders .unit')[0];
            }
		// Should I have code that checks (this.offset + this.width) - that.offset to see who is close enough?
		// 
            var next = steppit($(opponent).offset().left, $(opponent).offset().top, $(this).offset().left, $(this).offset().top);
            $(this).offset({top: next.y, left: next.x});
            // In order to do lookups
            // $(".hex[data-x='"+ (0 + dx - 1) +"'][data-y='"+ dy +"']");;
            // I need these units to have data attributes that I can query
        });
        $('#invaders img').each(function( index ) {
            var opponent = {};
            if($('#defenders .unit').length > 1){
                opponent = $('#defenders .unit')[Math.floor(Math.random()*$('#defenders .unit').length)];
            } else {
                opponent = $('#defenders .unit')[0];
            }
            var next = steppit($(opponent).offset().left, $(opponent).offset().top, $(this).offset().left, $(this).offset().top);
            $(this).offset({top: next.y, left: next.x});
        });
        // So now, we do damage.  Three generic types: fast -> magic -> hard -> fast
        // Oh! Units are a combination of their resources, so when calculating damage that is something like h2f1m0 vs h0f2m1
        // Stone/Iron = hard      Wood/Pasture = fast         Tar/Hemp = magic
        // Methods considered included the Risk strategy (highest v highest, what to do with h1f1m1?)
	// Decided it was going to be the trio of advantage (f->m) minus the trio of defense (h<-m)

        var invads = $('#invaders .unit'); // Get a fresh copy
        var defens = $('#defenders .unit');
        $('#defenders .unit').each(function( index ) {
            // Find the closest invader.
            var target = {a:0,d:-1}
            $('#invaders .unit').each(function (doot) {
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
            if(target.d < 5*speed) {
                // We are closer than one step to the guy, attack.
                var dmg = calcDmg( $(this).attr('stats').split('l')[0] , $(invads[target.a]).attr('stats').split('l')[0] );
                console.log($(this).attr('stats').split('l')[0] +' v '+ $(invads[target.a]).attr('stats').split('l')[0] +' -> '+ dmg);
                // Determin if defeated them.  Undate DOM.
                inflict(invads[target.a], dmg);
            }
            // Calculate damage against them.
            
        });
        $('#invaders .unit').each(function( index ) {
            // Find the closest invader.
            var target = {a:0,d:-1}
            $('#defenders .unit').each(function (doot) {
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
            if(target.d < 5*speed) {
                // Calculate damage against them.
                var dmg = calcDmg( $(this).attr('stats').split('l')[0] , $(defens[target.a]).attr('stats').split('l')[0] );
                console.log($(this).attr('stats').split('l')[0] +' v '+ $(invads[target.a]).attr('stats').split('l')[0] +' -> '+ dmg);
                // Determin if defeated them.  Undate DOM.
                inflict(invads[target.a], dmg);
            }
        });
}

function distish(thing1, thing2) {
    if( typeof thing1 == 'object' && typeof thing2 == 'object' ) {
    var detx = Math.abs($(thing1).offset().left - $(thing2).offset().left);
    var dety = Math.abs($(thing1).offset().top - $(thing2).offset().top);
    // A^2 + B^2 = C^2
    return Math.sqrt((detx*detx)+(dety*dety));
    }
    return window.innerWidth; // Something is not an object?  Dont pick this one.
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
$('#spawn').on('click', function() {
    console.log('step forward');
    FIGHT();
});

$( document ).ready(function() {
    // Time to attack stuff.
    // Loop, giving each unit a turn to fight.        
    setInterval(function() {
        if ($('#defenders img').length && $('#invaders img').length) {
            console.log($('#defenders img').length +'  '+ $('#invaders img').length)
            // Both armies still exist;
            //FIGHT();
        }
    }, 200);
});
