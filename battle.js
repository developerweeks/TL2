// Set globals for this

var invads = $('#invaders .unit'),
    defens = $('#defenders .unit'),
    speed = 20;
// The vars invads and defens become invalid after some units are killed.


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

function inflict(who, what) {
    var details = $(who).attr('stats');
    // stats should fit regex `h[1-3]f[1-3]m[1-3]l[0-9][0]`
    var valid = new RegExp('^h[1-3]f[1-3]m[1-3]l[0-9]0?$');
    if(valid.test(details)) {
        console.log('valid unit');
    } else {
        console.log('cheater detected!! '+ details);
        console.log(who);
    }
    // separate strength from life.
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
    // Loop, giving each unit a turn to fight.          
    setInterval(function() {
        // This code is executed every 200 milliseconds:
        $('#defenders img').each(function( index ) {
            var opponent = {};
            console.log($('#invaders .unit').length);
            if($('#invaders .unit').length > 1){
                opponent = $('#invaders .unit')[Math.floor(Math.random() * $('#invaders .unit').length)];
            } else {
                opponent = $('#invaders .unit')[0];
            }
            console.log($(opponent));
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
            // In order to do lookups
            // $(".hex[data-x='"+ (0 + dx - 1) +"'][data-y='"+ dy +"']");;
            // I need these units to have data attributes that I can query
        });
        // So now, we do damage.  Three generic types: fast -> magic -> hard -> fast
        // Oh! Units are a combination of their resources, so when calculating damage that is something like h2f1m0 vs h0f2m1
        // Stone/Iron = hard
        // Wood/Pasture = fast
        // Tar/Hemp = magic
        // So, a golem (3stone) vs a wizard (h1m2f0) would do 2 damage (1 + 2/2) and receive 5 damage (1+2*2)
        // But a golem against a ranger (3wood) would do 6 damange (3*2) and receive 1.5 damage (3/2)
        // ... What happens when a unit has h1f1m1?  Going against h1f1m1 is that 1x2+1x2+1x2=6?  Is that 1+1x2+1/2=3.5?
        //  If I always seek advantage, that would mean I always compare this fast to that magic, and an everything unit would be best.

        var invads = $('#invaders .unit');
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
            // Calculate damage against them.
            var dmg = calcDmg( $(this).attr('stats').split('l')[0] , $(invads[target.a]).attr('stats').split('l')[0] );  
            // Determin if defeated them.  Undate DOM.
            inflict(invads[target.a], dmg);
            
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
            // Calculate damage against them.
            var dmg = 3;  
            // Determin if defeated them.  Undate DOM.
            if( inflict(invads[target.a], dmg) == 3){
                // Value is not right?  Looks like cheating, stop the fight.
                clearInterval(interval); // stop the interval
            }
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
