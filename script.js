(function($){

    $.addEventListener('DOMContentLoaded', function(){
        // the page has loaded and been rendered now. so we can check the sizes of elements.

        // get container dimensions.
        var anicont = $.getElementById('anim_container');

        var paused = false;
        var randomize = true;

        var sprites = [];
       
        var numsprites = 3;

        var spritepath = "images/mario_s.png";

   
        var speed = 7;
        var dir = [0.707, 0.707]; // direction vector

        // load some sprites
        for(var i = 0; i < numsprites; i++){
            var s = new Sprite(spritepath, anicont, dir, speed);
            s.putSprite(); // add it to the page
            sprites.push(s);
        }

        var framecount = 0;
        
        function frame(){
        
            if(!paused){
               for(var i = 0; i < sprites.length; i++){
                    var sprite = sprites[i];
                    sprite.frameUpdate();
                    sprite.checkInnerCollision();
                }
            }

            framecount = framecount + 1;

        }

        
        
       setInterval(frame, 16); // 1000/16 = roughly 60fps

       // TODO: use  // requestAnimationFrame() for better performance

        setInterval(fps, 1000);



        // events
        $.addEventListener('keydown', (e) => {
            if(e.code === 'Space'){
                paused = !paused; // toggle paused state
            }
        });




        // util functions
        function fps(){
            fpse = $.getElementById("fps_display");
            fpse.innerHTML = framecount;
            framecount = 0;
        }

        function randDir(a, sprite){
            var angle = a*2*Math.PI*Math.random();
            var cdir = sprite.getDir();
            var cangle = Math.atan2(cdir[0], cdir[1]);
            cangle += angle;
            // now convert back to a unit vector
            cdir = [Math.cos(cangle), Math.sin(cangle)];
            
            sprite.setDir(cdir);
            
            return cdir;
        }

        function randPos(a, sprite){
            var rx = a*Math.random();
            var ry = a*Math.random();

            sprite.shiftPos([rx,ry]);
        }

        function randSpeed(a, sprite){
            var rs = sprite.getSpeed() + a*(Math.random()-0.5);
            sprite.setSpeed(rs);
        }

        if(randomize){
            for(var i = 0; i < numsprites; i++){
                var sprite = sprites[i];

                randDir(0.3, sprite);
                randPos(100,  sprite);
                randSpeed(5, sprite);
            }
        }


        // get the current x,y transform values of the sprite 
        function getTranslateXY(element) {
            const style = window.getComputedStyle(element)
            const matrix = new DOMMatrixReadOnly(style.transform)
            return [matrix.m41, matrix.m42];
        }

        function getTransformMatrix(element) {
            const style = window.getComputedStyle(element)
            return new DOMMatrix(style.transform);
        }


    }, false);


})(document);

