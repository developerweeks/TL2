/*
 * A mashup of other ideas.
 */

// set some global data
var framesize = {
  width: window.innerWidth || document.body.clientWidth,
  height: window.innerHeight || document.body.clientHeight  
}
// Get a feel for approfiate tile size.
var scale = (framesize.height + framesize.width)/40;
// Screen sizing.
var ratio = framesize.width / framesize.height; 
// Max tiles for a row, within reason.
var limit = Math.round(Math.sqrt($('.box').length) / ratio);

// Snap targets
var anchors = [];
 
var $snap = $("#snap"),
  $homefield = $("#map"),
	gridWidth = 210,
	gridHeight = 220,
	i, j, x, y;
 
// Track the mouse always.
var currentMousePos = { x: -1, y: -1 };
$(document).mousemove(function(event) {
    currentMousePos.x = event.pageX;
    currentMousePos.y = event.pageY;
});

/*
 * Javascript doesnt run a game loop, it just reacts to everything.
 * Set up our world.  We will need the drupal render to assign initial data-x and data-y.
 */


// Initialize village and menus, attach our listeners.
fixate();
conformity();

// https://www.youtube.com/watch?v=KQ9st3LRjwo ajax and php raw, for interaction with drupal.
// https://stackoverflow.com/questions/23362138/jquery-find-coordinates-closest-to-my-current-location-from-array-retrieve-el


/*
 * Utilities for action.
 */
function scan(){
   // In case some things have changed, reset the globals
   framesize = {
    width: window.innerWidth || document.body.clientWidth,
    height: window.innerHeight || document.body.clientHeight  
  }
  scale = (framesize.height + framesize.width)/40;
  ratio = framesize.width / framesize.height; 
  limit = Math.round(Math.sqrt($('.box').length) / ratio); 
}

function fixate() {
	// Wipe our list.
	anchors = [];
	// Build the anchor points for the screen
  for (i = 0; i < framesize.width / gridWidth; i++) {
  	for (j = 0; j < framesize.height / gridHeight; j++) {
			var point = {};
			point.y = j * gridHeight;

			if (j % 2 == 1) {
				// An odd row.
				point.x = i * gridWidth;
			} else {
				// An even row, offset.
				point.x = i * gridWidth + (gridWidth/2);
			}
			anchors.push(point);
		}
  }
  console.log(anchors);
}

// convert data-x to pixel offsets and place everything
function repaint(){
  $('.box').each(function( index ) {
  	$(this).height(gridHeight / 2);
  	$(this).width(gridWidth - 10);
  	x = $(this).attr('data-x');
    y = $(this).attr('data-y');
    $(this).offset({top:y,left:x});
    $(this).text(x +' - ' + y);
  });
};


function snappy( event, ui ) {
   var rawX = $(this).offset().left;
   var rawY = $(this).offset().top;
   // This is the point where it stopped.
   // Now find the closest anchor and put it there.
   var newX = 0;
   var newY = Math.round(rawY / gridHeight) * gridHeight;
   if (Math.round(rawY / gridHeight) % 2 == 1) {
   	// An odd row, keep X straight.
   	newX = Math.round(rawX / gridWidth) * gridWidth;
   } else {
   	// An even row, rounding would lose the .5 we want to keep.
   	var step = rawX / gridWidth - 0.5;
   	newX = (Math.round(step) + 0.5) * gridWidth;
   }

   console.log(rawX +', '+ rawY +' is changed to '+ newX +','+ newY);
   // collision test
   if( $(".box[data-x='"+ newX+"'][data-y='"+ newY+"']").length == 0) {
      // nothing in the way, set these coordinates
     $(this).attr('data-x', newX);
     $(this).attr('data-y', newY);
   } else {
      // show me the collision
      console.log("Collision!");
      console.log($(".box[data-x='"+ newX+"'][data-y='"+ newY+"']"));
   }
   // Merely a straightening is needed
   repaint();
};

function census(){
  $('#legend a').each(function( index ) {
    type = $(this).attr('class');
    count = $('.box .'+type).length;
    $(this).find('span').text(count);
  });
};

// Straighten, count, and make them all movable
function conformity(){
  scan(); 
  repaint();
  census();
  $('.box').draggable({ addClasses: false });
  $('.box').on( "dragstop", snappy);
  // is this compounding the listeners?
  // how to only attach the listener to the new hex?
};


/*
		$(".box").each(function(index, element) {
			TweenLite.to(element, 0.5, {
				x:Math.round(element._gsTransform.x / gridWidth) * gridWidth,
				y:Math.round(element._gsTransform.y / gridHeight) * gridHeight,
				delay:0.1,
				ease:Power2.easeInOut
			});
		});
	}
*/