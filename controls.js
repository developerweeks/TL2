

/*
 * Interactive controls.
 */
$('#reset').on('click', function(e) {
   e.preventDefault();
   scan();
   console.log('Reset!');
   console.log(limit + ' to a row');
  // reset the village layout
  $('.hex').each(function( index ) {
     var step = index % limit;
     var row = Math.floor( index / limit );
     $(this).attr('data-x', step);
     $(this).attr('data-y', row);
  });
  repaint();
});


$('#sort').on('click', function(e) {
   e.preventDefault();
	console.log("sort!");
  // reorder village layout
  // one row per hex type 
  $('.hex.pasture').each(function( index ) {
     $(this).attr('data-x', index).attr('data-y', 0);
  });
  $('.hex.wood').each(function( index ) {
     $(this).attr('data-x', index ).attr('data-y', 1);
  });
  $('.hex.iron').each(function( index ) {
     $(this).attr('data-x', index).attr('data-y', 2);
  });
  $('.hex.stone').each(function( index ) {
     $(this).attr('data-x', index ).attr('data-y', 3);
  });
  $('.hex.tar').each(function( index ) {
     $(this).attr('data-x', index).attr('data-y', 4);
  });
  $('.hex.hemp').each(function( index ) {
     $(this).attr('data-x', index ).attr('data-y', 5);
  });
  repaint();
});


$('#save').on('click', function(e) {
   e.preventDefault();
   console.log('repaint the village');
   repaint();
});

$('#spawn').on('click', function(e){
   e.preventDefault();
   // Call up the whole army.
   conscript();
});
