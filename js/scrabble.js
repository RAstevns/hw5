
// row : { column : value}
// values 
// center -1
// triple word 4
// triple letter 3
// double word 2
// double letter 1
// normal 0 
var wordDirection = '';

var valuetable = [
    [4,0,0,1,0,0,0,4,0,0,0,1,0,0,4],
    [0,2,0,0,0,3,0,0,0,3,0,0,0,2,0],
    [0,0,2,0,0,0,1,0,1,0,0,0,2,0,0],
    [1,0,0,2,0,0,0,1,0,0,0,2,0,0,1],
    [0,0,0,0,2,0,0,0,0,0,2,0,0,0,0],
    [0,3,0,0,0,3,0,0,0,3,0,0,0,3,0],
    [0,0,1,0,0,0,1,0,1,0,0,0,1,0,0],
    [4,0,0,1,0,0,0,-1,0,0,0,1,0,0,4],
    [0,0,1,0,0,0,1,0,1,0,0,0,1,0,0],
    [0,3,0,0,0,3,0,0,0,3,0,0,0,3,0],
    [0,0,0,0,2,0,0,0,0,0,2,0,0,0,0],
    [1,0,0,2,0,0,0,1,0,0,0,2,0,0,1],
    [0,0,2,0,0,0,1,0,1,0,0,0,2,0,0],
    [0,2,0,0,0,3,0,0,0,3,0,0,0,2,0],
    [4,0,0,1,0,0,0,4,0,0,0,1,0,0,4]
];
// Init
$( document ).ready(function() {
    ScrabbleTiles.length = 28;
    
    generateTiles(ScrabbleTiles, 7);

    $('.tile').draggable({
        revert : true
    });

    $('#submit-word').on( "click", function(){
        
    });



    // add a table to the scrabble board to mark tile locations
    if($('h1').html() == ' One-line scrabble '){
        $('#one-line-div').append('<table id="tile-positions"></table>');
        // setting offset for table
        $("#tile-positions").css({
            top: '-85px',
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
        drop : function(event, ui) {
            var object = ui.draggable;

            if(wordDirection == 'y'){
                $("[y|='"+(y - 1)+"']:empty").droppable('enable');
                $("[y|='"+(y + 1)+"']:empty").droppable('enable');
            }
            if(wordDirection == 'x'){
                $("[x|='"+(x - 1)+"']:empty").droppable('enable');
                $("[x|='"+(x + 1)+"']:empty").droppable('enable');
            }
                
            $('td').droppable('disable');   
            object.draggable('disable');

            var x = parseInt($(this).attr('x'));
            var y = parseInt($(this).attr('y'));
            
            console.log(y+': '+x);
            
            

            $(this).droppable('disable');
            $(this).append(object);
        }
    });
    
});

    // helper function for readability
function tableGen(width, height) {
    for (let x = 0; x < width; x++) {
        var tr = $.parseHTML('<tr></tr>');
            for (let y = 0; y < height; y++) {
                var td = $.parseHTML('<td></td>');
                switch(valuetable[y][x]){
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
                        $(td).attr("id","center");
                    default:
                }
                $(td).attr("x",x);
                $(td).attr("y",y);
                $(tr).append(td);
            }
        $('#tile-positions').append(tr);
    }
}

function generateTiles(array, num = 7) {
    for(var i = 0; i < Number(num); i++){
        var keys = Object.keys(array);
        var random = Math.floor(Math.random() * (array.length-1));
        var tile = keys[random];
        if(tile == '_') {
             $( "#holder-img" ).after( "<div class='tile'><img  src='images/Scrabble_Tiles/Scrabble_Tile_Blank.jpg'  alt='Failed to load tile'></div>" );
        } else {
            $( "#holder-img" ).after( "<div class='tile'><img  src='images/Scrabble_Tiles/Scrabble_Tile_"+tile+".jpg'  alt='Failed to load tile'></div>" );
        }

        if(array[tile]["number-remaining"]-- <= 0){
            array.length--;
            delete(array[tile]);
        }
        
    }
}