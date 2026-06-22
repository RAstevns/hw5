

$( document ).ready(function() {
    ScrabbleTiles.length = 28;
    
    generateTiles(ScrabbleTiles, 7);
    $('.tile').draggable();
});

function generateTiles(array, num = 7) {
    for(var i = 0; i < Number(num); i++){
        var keys = Object.keys(array);
        var random = Math.floor(Math.random() * (array.length-1));
        var tile = keys[random];

        if(tile == '_') {
             $( "#div-holder" ).append( "<div class='tile'><img src='images/Scrabble_Tiles/Scrabble_Tile_Blank.jpg'  alt='Failed to load tile'></div>" );
        } else {
            $( "#div-holder" ).append( "<div class='tile'><img src='images/Scrabble_Tiles/Scrabble_Tile_"+tile+".jpg'  alt='Failed to load tile'></div>" );
        }

        if(array[tile]["number-remaining"]-- <= 0){
            array.length--;
            delete(array[tile]);
            console.log(array);
        }
        
    }
}