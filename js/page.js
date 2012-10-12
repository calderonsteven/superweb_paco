/**
* Provides requestAnimationFrame in a cross browser way.
* http://paulirish.com/2011/requestanimationframe-for-smart-animating/
*/

if ( !window.requestAnimationFrame ) {
    window.requestAnimationFrame = ( function() {
        return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
            window.setTimeout( callback, 1000 / 60 );
        };
    } )();
}

/*getTwitters('tweetDiv', {
    id: 'pacopistolas',
    count: 1,
    enableLinks: true,
    ignoreReplies: true,
    clearContents: true,
    template: '%text% <a class="TextConsolaSmall" href="http://twitter.com/%user_screen_name%/statuses/%id%/"><br>%time%</a>'
});*/

$(document).konami(function () {
    $("body").append('<canvas id="BallsCanvas" class="CanvasBalls"> </canvas>"');
    InitCanvasBalls();
});

$(document).ready(function () {
    window.harmony(true);

    $("#harmony").click(function () {
        //reset harmony
        $("#harmony canvas")[0].getContext("2d").clearRect(0, 0, $("#harmony canvas")[0].width, $("#harmony canvas")[0].height);
    });

    //var f1 = new FizzyText("¡ Hola !");
    var f2 = new FizzyText('"Me llamo" paco');
    
    $("#circulos li").hover(function(){
        var data = $(this).data("copy");
        //f1.explode();
        f2.explode();
        
        //f1.message = data.split("|")[0];
        f2.message = data.split("|")[1];
        //tamaño = data.split("|")[2];
        //$("#helvetica-demo").css("right", tamaño);
    });
});