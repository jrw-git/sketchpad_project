// trying to eliminate magic numbers
max_width_in_pixels = 800;
initial_starting_color = "white";
initial_final_color = "black";
temporary_highlight = "gray";
initial_number_of_grids = 64;
enabled_painting = false;

// is changed to false in initial setup
enabled_erasing = true;

$(document).ready(function() {
  // keep the user from dragging the image instead of painting
  $('#mainbody').attr('draggable', false);
  // I use the clear/create/change color functions as setup
  // they also let the user make changes with them later
  size = initial_number_of_grids;
  starting_color = initial_starting_color;
  change_color(initial_final_color);
  create_grid(size);
  resize_field(max_width_in_pixels, size);
  toggle_erasing();

  $('#options').click(function() {
    size = prompt("Current Size: " + size);
    clear_grid(size);
    create_grid(size);
  });

  $('#field_size').click(function() {
    max_width_in_pixels = prompt("Current Field Size: " + max_width_in_pixels);
    resize_field(max_width_in_pixels, size);
  });

  // just use a boolean to detect if we are Erasing
  // it can piggyback on painting... if both painting and erasing, then erase.
  $('#toggle_erasing').click(function () {
    toggle_erasing();
  });

  $('#clear').click(function() {
    clear_grid(size);
    create_grid(size);
  });

  $('#color_change').click(function() {
    initial_final_color = prompt("Enter color code");
    change_color(initial_final_color);
  });

});

var toggle_erasing = function() {
  if (enabled_erasing) {
    final_color = initial_final_color;
    $('#toggle_erasing').html("Painting (toggle)");
  }
  else {
    final_color = initial_starting_color;
    $('#toggle_erasing').html("Erasing (toggle)");
  }
  enabled_erasing = !enabled_erasing;
}

var change_color = function(new_color) {
  $('#color_change').html("Active Color: " + new_color);
  final_color = new_color;
};

// resize the maximum size of field but keep the existing drawing
var resize_field = function(new_field_size, current_cell_size) {
  $('#field_size').html("Field Size ("+new_field_size+"px)");
  $('#mainbody').css("height", max_width_in_pixels)
  $('#mainbody').css("width", max_width_in_pixels)
  new_dimension = max_width_in_pixels / current_cell_size;
  $('.grid').css("height", new_dimension)
  $('.row').css("height", new_dimension)
  $('.grid').css("width", new_dimension)
};

// create a fresh square grid of 'size'
// also size the individual squares so they fit evenly in the max size
var create_grid = function (size) {
  $('#options').html("Number Of Cells: " + size + "");
  $blank_grid_square_div = "<div class='grid'></div>";
  $row_marker_div = "<div class='row'></div>";
  $completed_row_div = "";
  for(i = 0; i < size; i++){
    $completed_row_div += $blank_grid_square_div;
  }
  for(i = 0; i < size; i++){
    $('#mainbody').append($row_marker_div);
  }
  $('.row').append($completed_row_div);
  new_dimension = max_width_in_pixels / size;
  $('.grid').css("height", new_dimension)
  $('.row').css("height", new_dimension)
  $('.grid').css("width", new_dimension)
};

// this just deletes all the rows found so we can start fresh.
var clear_grid = function(size) {
  for(i = 0; i < size; i++) {
    $('.row').remove();
  };
};

// this handles highlighting of squares
// tricky part is avoiding overwriting painting with the highlighting
// to do that, we only highlight when not painting
// we also set classes when a square is highlighted or painted
$(document).on('mouseenter', '.grid', function() {
  if (enabled_painting){
    $(this).css("background-color", final_color);
    $(this).addClass("painted");
  }
  else {
    if (!$(this).hasClass("highlighted") && !$(this).hasClass("painted") ) {
      $(this).addClass("highlighted");
      $(this).css("background-color", temporary_highlight);
    }
  };

});

// when the mouse leaves, keep color enabled and unmark as highlighted
// if it was highlighted (but not painted), unhighlight it
$(document).on('mouseleave', '.grid', function() {
  if (enabled_painting) {
    $(this).css("background-color", final_color);
    $(this).removeClass("highlighted");
  }
  else {
    if ($(this).hasClass("highlighted") ) {
      $(this).css("background-color", starting_color);
      $(this).removeClass("highlighted");
    }

  };
});

// toggle painting on/off when clicked
// adding the painted class to the initial click because it wasn't getting painted
$(document).on('mousedown', '.grid', function() {
  enabled_painting = true;
  $(this).addClass("painted");
});

$(document).on('mouseup', '.grid', function() {
  enabled_painting = false;
});

// stop user from accidentally dragging stuff around instead of painting
$(document).on('dragstart', '.grid', function() {
  return false;
});
