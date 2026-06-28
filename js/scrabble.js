/*
File: index.html
HW4 - Scrabble
Riley Stevens, UMass Lowell Computer Science, riley_stevens@student.uml.edu
Copyright (c) 2026 by Riley. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
created by RS on Jun 27, 2026 at 11:08 PM
*/


// row : { column : value}
// values 
// center -1
// triple word 4
// triple letter 3
// double word 2
// double letter 1
// normal 0 
var valuetable = [
    [4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4],
    [0, 2, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 2, 0],
    [0, 0, 2, 0, 0, 0, 1, 0, 1, 0, 0, 0, 2, 0, 0],
    [1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1],
    [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
    [0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
    [4, 0, 0, 1, 0, 0, 0, -1, 0, 0, 0, 1, 0, 0, 4],
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0],
    [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
    [1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1],
    [0, 0, 2, 0, 0, 0, 1, 0, 1, 0, 0, 0, 2, 0, 0],
    [0, 2, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 2, 0],
    [4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4]
];
// Init
$(document).ready(function () {
    ScrabbleTiles.length = 28;

    generateTiles(ScrabbleTiles, 7);
    
    var totalscore = 0;
    $('#restart').on("click", function () {
        $('td').empty();
        $('td').droppable('enable');

        $('#current-word').empty();
        $('#holder-div div').remove();
        $('#point-value').empty();
        $('#word-history').empty();
        $('#score-holder').empty();

        for (entry in ScrabbleTiles) {
            ScrabbleTiles[entry]["number-remaining"] = ScrabbleTiles[entry]["original-distribution"];
        }

        currentpointvalue = 0;
        multiplier = 1;

        generateTiles(ScrabbleTiles);
    });
    $('#submit-word').on("click", function () {

        var word = $('#current-word').html();
        var value = (currentpointvalue * multiplier);

        $('td').empty();
        $('td').droppable('enable');
        $('td').removeAttr('state');
        $('td').removeAttr('letter');

        $('#current-word').empty();
        $('#point-value').empty();

        // 7 (the number of tiles per hand)
        // number of children in the div - the image =  number of cards in hand
        generateTiles(ScrabbleTiles, 7 - ($("#holder-div").children().length - 1));

        $('#word-history').append('<li> ' + word + ': ' + value + ' </li>')
        totalscore += (currentpointvalue * multiplier);
        currentpointvalue = 0;
        multiplier = 1;
        $('#score-holder').html(totalscore);

    });

    // add a table to the scrabble board to mark tile locations
    if ($('h1').html() == ' One-line scrabble ') {
        $('#one-line-div').append('<table id="tile-positions"></table>');
        // setting offset for table
        $("#tile-positions").css({
            top: '-86px',
            left: '5px'
        });

        tableGen(1, 15);

    } else {

        $('#full-board-div').append('<table id="tile-positions"></table>');
        $("#tile-positions").css({
            top: '-1340px',
            left: '200px'
        });
        tableGen(15, 15);
        $('#holder-div').css({
            top: '1600px',
            left: '400px'
        });
    }

    var currentpointvalue = 0;
    var multiplier = 1;
    $('td').droppable({
        drop: function (event, ui) {
            var object = ui.draggable;

            var x = $(this).attr('x');
            var y = $(this).attr('y');

            $(object).addClass('unsubmitted');
            var letter = object.attr('letter');

            
            var up = $("[x|='" + x + "'][y|='" + (y - 1) + "']");
            var down = $("[x|='" + x + "'][y|='" + (parseInt(y) + 1) + "']");

            var left = $("[y|='" + y + "'][x|='" + (x - 1) + "']");
            var right = $("[y|='" + y + "'][x|='" + (parseInt(x) + 1) + "']");
            
            
            if (left.attr('state') == 'unknown' || $(this).attr('state') == 'horizontal') {
                if (left.has('.unsubmitted').length) {
                    left.attr('state', 'horizontal');
                    $(this).attr('state', 'horizontal');
                    right.attr('state', 'horizontal');
                    right.droppable('enable');
                    left.droppable('disable');
                    $('#current-word').append(letter);
                }
                if (right.has('.unsubmitted').length) {
                    right.attr('state', 'horizontal');
                    $(this).attr('state', 'horizontal');
                    left.attr('state', 'horizontal');
                    right.droppable('disable');
                    left.droppable('enable');
                    $('#current-word').prepend(letter);
                }
            }
            if ($(this).attr('state') == 'unknown' || $(this).attr('state') == 'vertical') {
                if ($('h1').html() == ' Scrabble ') {
                    if (down.has('.unsubmitted')) {
                        down.attr('state', 'vertical');
                        $(this).attr('state', 'vertical');
                        up.attr('state', 'vertical');

                        up.droppable('enable');
                        $('#current-word').append(letter);
                    }
                    if (up.has('.unsubmitted')) {
                        down.attr('state', 'vertical');
                        $(this).attr('state', 'vertical');
                        up.attr('state', 'vertical');

                        down.droppable('enable');
                        $('#current-word').prepend(letter);
                    }
                }
            }
            if (
                !right.is('[state]') &&
                !left.is('[state]') &&
                !up.is('[state]') &&
                !down.is('[state]')
            ) {

                $('#current-word').append(letter);
                $(this).attr('state', 'unknown');
                $('td').droppable('disable');

                up.droppable('enable');
                down.droppable('enable');
                left.droppable('enable');
                right.droppable('enable');
            }
            console.log($(this).attr('state') == 'unknown');

            object.draggable('disable');

            $(this).droppable('disable');
            $(this).append(object);

            // point calculation
            if ($(this).hasClass('double-letter')) {

                currentpointvalue += ScrabbleTiles[letter].value * 2;

            } else if ($(this).hasClass('double-word')) {

                currentpointvalue += ScrabbleTiles[letter].value;
                multiplier++;

            } else if ($(this).hasClass('triple-letter')) {

                currentpointvalue += (ScrabbleTiles[letter].value * 3);

            } else if ($(this).hasClass('triple-word')) {

                currentpointvalue += ScrabbleTiles[letter].value;
                multiplier += 2;

            } else {

                currentpointvalue += ScrabbleTiles[letter].value;

            }

            var totalscore = currentpointvalue * multiplier;
            $('#point-value').html(totalscore);
        }
    });
});

// helper function for readability
function tableGen(width, height) {
    for (let x = 0; x < width; x++) {
        if (width == 1) x = 3;
        var tr = $.parseHTML('<tr></tr>');
        for (let y = 0; y < height; y++) {
            var td = $.parseHTML('<td></td>');
            switch (valuetable[y][x]) {
                case 1:
                    $(td).addClass('double-letter');
                    break;
                case 2:
                    $(td).addClass('double-word');
                    break;
                case 3:
                    $(td).addClass('triple-letter');
                    break;
                case 4:
                    $(td).addClass('triple-word');
                    break;
                case -1:
                    $(td).attr("id", "center");
                default:
            }
            $(td).attr("y", x);
            $(td).attr("x", y);
            $(tr).append(td);
        }
        $('#tile-positions').append(tr);
    }
}
function generateTiles(array, num = 7) {
    for (var i = 0; i < Number(num); i++) {
        var keys = [];
        for (entry in array) {
            if (array[entry]["number-remaining"] != 0)
                keys.push(entry);
        }

        if (keys.length == 0) {
            alert('game over');
            return;
        }

        var random = Math.floor(Math.random() * (keys.length - 1));
        var tile = keys[random];
        if (tile == '_') {
            $("#holder-img").after("<div class='tile' letter='Blank'><img  src='images/Scrabble_Tiles/Scrabble_Tile_Blank.jpg'  alt='Failed to load tile'></div>");
        } else {
            $("#holder-img").after("<div class='tile' letter=" + tile + "><img  src='images/Scrabble_Tiles/Scrabble_Tile_" + tile + ".jpg'  alt='Failed to load tile'></div>");
        }

        array[tile]["number-remaining"]--;

    }
    $('.tile').draggable({
        revert: true,
        revertDuration: 0,
        scroll: true
    });
}