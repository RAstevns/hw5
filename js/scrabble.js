
$( document ).ready(function() {
    ScrabbleTiles.length = 28;
    
    generateTiles(ScrabbleTiles, 7);
    $('.tile').draggable({
        revert : true
    });

    // add a table to the scrabble board to mark tile locations
    if($('h1').html() == ' One-line scrabble '){

        $('#one-line-img').droppable({
            drop : function(event, ui) {
                var object = ui.draggable;
                $(this).parent().append(object);
            }
        });

        var position;
        $('#one-line-div').append('<table id="tile-positions"></table>');
        $('#tile-positions').append('<thead><tr></tr></thead>');
        
        for (let y = 0; y < 15; y++){
            var object = $.parseHTML('<td></td>');
            $('tr').append(object);
            position = $(object).position();
            $(object).html(position.left+','+position.top);
        }
        $('#one-line-img').append();

    } else {

        $('#full-board-div').append('<table id="tile-positions"></table>');

        console.log($('tr').html());
        for (let x = 0; x < 15; x++) {

        var tr = $.parseHTML('<tr></tr>');
            for (let y = 0; y < 15; y++) {
                var td = $.parseHTML('<td></td>');
                $(tr).append(td);
            }
        $('#tile-positions').append(tr);
        }

        $('td').droppable({
            drop : function(event, ui) {
                var object = ui.draggable;
                $(this).append(object);
            }
        });


    }
    
    
});

function generateTiles(array, num = 7) {
    for(var i = 0; i < Number(num); i++){
        var keys = Object.keys(array);
        var random = Math.floor(Math.random() * (array.length-1));
        var tile = keys[random];

        if(tile == '_') {
             $( "#holder-div" ).append( "<div class='tile'><img src='images/Scrabble_Tiles/Scrabble_Tile_Blank.jpg'  alt='Failed to load tile'></div>" );
        } else {
            $( "#holder-div" ).append( "<div class='tile'><img src='images/Scrabble_Tiles/Scrabble_Tile_"+tile+".jpg'  alt='Failed to load tile'></div>" );
        }

        if(array[tile]["number-remaining"]-- <= 0){
            array.length--;
            delete(array[tile]);
        }
        
    }
}