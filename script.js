(function($){ // the $ here is an alias for the browser 'document' object, which contains all the elements in a page

    // wait until the page has loaded before we start doing stuff
    $.addEventListener('DOMContentLoaded', function(){

        // the page has loaded and been rendered now. so we can check the sizes of elements.

        // get container dimensions.
        var anicont = $.getElementById('anim_container');

        var paused = false;

        var randomize = true; // you can see what happens if you set this to false...

        var sprites = []; // our array to store all our sprites
       
        var numsprites = 5; // you can try changing this number. what does it do?

        var spritepath = "images/mario_s.png"; // you could try downloading other images and putting in the images dir, then changing this path to change the sprite

        var speed = 6; // go on, you know you want to..
        var dir = [1, 0]; // direction vector (which we might randomize a bit) - what would happen if you flipped the sign of 1, or moved it accross?

        // load some sprites
        for(var i = 0; i < numsprites; i++){
            var s = new Sprite(spritepath, anicont, dir, speed);
            s.putSprite(); // add it to the page
            sprites.push(s); // put this sprite in the array so we can access and update them later
        }
        // debug
        document.sprites = sprites;

        var framecount = 0;
        
        // the function that gets called to generate each frame of the animation
        function frame(){
        
            if(!paused){
               for(var i = 0; i < sprites.length; i++){
                    var sprite = sprites[i];
                    sprite.frameUpdate();
                    sprite.checkInnerCollision();
                }
            }
            // keep track of the number of frames drawn, which the fps counter will use
            framecount = framecount + 1;

            // as soon as this frame is generated, request the next one, 
            // which will call the frame function again, when the browser is ready to draw another frame
            requestAnimationFrame(frame); 
        }


       // get the first frame
       requestAnimationFrame(frame); //for better performance than:  setInterval(frame, 16); // 1000/16 = roughly 60fps

       // every 1 sec, call the fps function
        setInterval(fps, 1000);



        // events
        $.addEventListener('keydown', (e) => {
            if(e.key === ' '){ // try changing this to another key and see what happens?
                paused = !paused; // toggle paused state
            }
        });



        // util functions

        // draws the fps counter
        function fps(){
            fpse = $.getElementById("fps_display");
            fpse.innerHTML = framecount; // show the fps
            framecount = 0; // reset the counter, ready for the next second's count to start
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

        //////////////////
        // this is where the dir, pos and speed are randomized to create a bit of variation in the sprites
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


})(document); // a little JS trick to define a function and call it straight away. useful for making plugins and keeping everything to do with the plugin contained in itself

