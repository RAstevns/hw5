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

// get the words file from system
var words;
var totalscore = 0;
var currentpointvalue = 0;
var multiplier = 1;
var state = 'unset';
 
$.get('words.txt', function (string) {
    words = string;
}, 'text');
// Init 
$(document).ready(function () {
    ScrabbleTiles.length = 28;

    generateTiles(ScrabbleTiles, 7);

    
    $('#restart').on("click", function () {
        $('.error').remove();
        $('td').empty();
        $('td').droppable('enable');

        state = 'unset';

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
        totalscore = 0;
        
        generateTiles(ScrabbleTiles);
    });
    $('#submit-word').on("click", function () {

        $('.error').remove();

        let word = $('#current-word').html();
        let value = (currentpointvalue * multiplier);

        // make a regular expression to check if the word is in 'words' (converts blank to wildcard)
        let regex = new RegExp(String.raw`\n`+word.replace('_', String.raw`\w`)+String.raw`\n`, 'ig');
        
        //regardless of the words validity the board still needs to be cleared

        $('td').droppable('enable');
        state = 'unset';
        $('td').removeAttr('letter');

        $('#current-word').empty();
        $('#point-value').empty();

        

        if (regex.test(words) && word.length > 1) {

            // word is valid
            $('td').empty();
            // 7 (the number of tiles per hand)
            // number of children in the div - the image =  number of cards in hand
            generateTiles(ScrabbleTiles, 7 - ($("#holder-div").children().length - 1));

            $('#word-history').append('<li> ' + word + ': ' + value + ' </li>')
            
            totalscore += (currentpointvalue * multiplier);
            $('#score-holder').html(totalscore);

        } else {

            // word is invalid

            $('.tile').each(function (index, element) {
                $('#holder-div').append(element);
                $(element).draggable('enable');
            });

            $('#restart').before('<p class="error" style="color:red;">Invalid word</p>');
        }

        currentpointvalue = 0;
        multiplier = 1;
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

    
    $('td').droppable({
        drop: function (event, ui) {
            let object = ui.draggable;

            let x = $(this).attr('x');
            let y = $(this).attr('y');

            var letter = object.attr('letter');
            // define scope for up/down/left/r
            {
                let up = $("[x|='" + x + "'][y|='" + (y - 1) + "']");
                let down = $("[x|='" + x + "'][y|='" + (parseInt(y) + 1) + "']");
                let left = $("[y|='" + y + "'][x|='" + (x - 1) + "']");
                let right = $("[y|='" + y + "'][x|='" + (parseInt(x) + 1) + "']");

                if (state == 'unset') {

                    $('#current-word').append(letter);
                    state = 'unknown';
                    $('td').droppable('disable');

                    up.droppable('enable');
                    down.droppable('enable');
                    left.droppable('enable');
                    right.droppable('enable');

                } else if (state == 'unknown') {

                    $('td').droppable('disable');
                    
                    // if its not vertical then its horizontal
                    state = (up.children().length || down.children().length ? 'vertical' : 'horizontal');

                    // enable the one next to the initial tile
                    if (up.children().length) {
                        $("[x|='" + x + "'][y|='" + (y - 2) + "']").droppable('enable');
                    } else{
                        $("[x|='" + x + "'][y|='" + (parseInt(y) + 2) + "']").droppable('enable');
                    }
                    if (left.children().length) {
                        $("[y|='" + y + "'][x|='" + (x - 2) + "']").droppable('enable');
                    } else {
                        $("[y|='" + y + "'][x|='" + (parseInt(x) + 2) + "']").droppable('enable');
                    }

                    

                }
            }
            if (state == 'vertical') {
                let up = $("[x|='" + x + "'][y|='" + (y - 1) + "']:empty");
                let down = $("[x|='" + x + "'][y|='" + (parseInt(y) + 1) + "']:empty");
                if (up.length) {
                    $('#current-word').prepend(letter);
                    up.droppable('enable');
                } else {
                    $('#current-word').append(letter);
                    down.droppable('enable');
                }
            }
            if (state == 'horizontal') {
                let left = $("[y|='" + y + "'][x|='" + (x - 1) + "']:empty");
                let right = $("[y|='" + y + "'][x|='" + (parseInt(x) + 1) + "']:empty");
                if (left.length) {
                    $('#current-word').prepend(letter);
                    left.droppable('enable');
                } else {
                    $('#current-word').append(letter);
                    right.droppable('enable');
                }
            }

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
        var random = Math.floor(Math.random() * (keys.length));
        var tile = keys[random];
        if (tile == '_') {

            $("#holder-img").after("<div class='tile' letter='_'><img  src='images/Scrabble_Tiles/Scrabble_Tile_Blank.jpg'  alt='Failed to load tile'></div>");
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