// a class to represent a sprite
class Sprite {
    static snum = 0;
   
    flipped = false;
    facing = 1;
    imgobj;
    parent;
    matrix;
    dir = [1, 0];
    speed = 1;
    collisionState = {in_collision:0, rotate_tog:0, side:0};
    boundingbox;
    put = false;

    constructor(image, parent, dir, speed, matrix, facing){
        this.imagesrc = image;

        if(parent instanceof Element){
            this.parent = parent;
        }

        if(matrix instanceof DOMMatrix){
            this.matrix = Object.assign({}, matrix);
        }
        if(dir !== "undefined"){
            this.dir = dir;
        } 
        if(typeof speed !== "undefined"){
            this.speed = speed;
        }

        if(facing !== "undefined"){
            this.setFacing(facing)
        }

        this.imgobj = document.createElement('img');  
        var s = this.imgobj;
        s.src = this.imagesrc;
        s.id = "sprite" + Sprite.snum;
        s.alt = "sprite";
        s.className = "sprite";
        Sprite.snum += 1;
    }

    // apply direction and speed to change position of this sprite for the next frame
    frameUpdate(){
        
        this.matrix.e += this.speed * this.dir[0]; // this.matrix.translateSelf(this.speed * this.dir[0], this.speed * this.dir[1]);
        this.matrix.f += this.speed * this.dir[1];
        this.imgobj.style.transform = this.matrix;
    }

    // READ THIS carefully:
    // main collision detection function for checking if sprite has hit the sides of the box
    // if it has, then the direction of the sprite is changed, so that it bounces around in the box
    // - your challenge is to complete and fix this function so that it fully works!

    // to help you fix this function here are some things it's useful to know:
    // a sprite ('this') has a position and direction
    // a sprite has a bound box - the smallest rectangle that it fits inside - this is used for collision detection
    // in this function the large box that contains all the sprites is called ob
    // the bounding box for each sprite is called bb
    // every box has top, bottom, left, right properties
    // top and bottom are the y values of the top and bottom of the box
    // left and right are the x values of the left and right of the box
    // using these values for 2 boxes it's possible to figure out if they overlap, i.e. if there's a collision
    // ideally you will already have made a flowchart to help you decide how to do this..

    // the direction of the sprite is stored in a vector called this.dir,
    // the x direction is accessed by this.dir[0] and the y direction is accessed by this.dir[1]
    // Do you remember what flipping the sign of the x or y direction does?

    checkInnerCollision(box){
        var ob;
        if(typeof box !== "undefined"){
            ob = box; // ob (outer box) is the box that contains all the sprites
        }else{
            ob = this.parent.getBoundingClientRect();
        }

        // bb is the bounding box for this sprite - the smallest rectangle that the sprite image fits into. 
        this.boundingbox = this.imgobj.getBoundingClientRect(); 
        var bb = this.boundingbox;

        // now we basically need to check if 2 rectangles overlap
     
        // check top and bottom collision - remember that in web pages, y starts at 0 at the top of the page and increases as you go down the page
        this.collisionState.in_collision = 0; // no collisions, so far. but we'll check in a sec..
        

        if(this.dir[1] !== 0){ // there is some y component is the sprite direction

            // some basic inequality maths! ("when will be ever use maths in the real world?" - here's an example)
            if(bb.top <= ob.top){ // sprite top is touching or has gone beyond the top of the containing element
            
                // so we need to reflect the sprite off the top of the outer box

                this.collisionState.side = 0; // we're calling the top, side 0
                
                if(this.dir[1] < 0){ // sprite was previous going 'up' the page, so we need to make it go down now
                    
                    //////////////////////////
                    // the bit that does the actual reflection
                    /////////////////////////
                    this.dir[1] = -this.dir[1]; // y direction gets flipped to 'reflect' in the line of top of ob  
                    /////////////////////////

                    this.flipIfFacing(0); // if the sprite was facing this side, then we flip it so it's facing down
                } 
                
                this.collisionState.in_collision = 1; // we have a collision, so set the collision state for this sprite

            }else if(bb.bottom >= ob.bottom){ // the sprite has touched or gone go below the bottom of the outer box
                
                this.collisionState.side = 2; // we're calling the bottom, side 2

                if(this.dir[1] > 0){ // the sprite was going down before, so we need to make it go up now
                    //////////////////////////
                    // the bit that does the actual reflection
                    /////////////////////////
                    this.dir[1] = -this.dir[1]; // y direction gets flipped to 'reflect' in the line of the parent top
                    /////////////////////////

                    this.flipIfFacing(2);
                }

                this.collisionState.in_collision = 1;
            }
            
        }

        // check left and right
        if(this.dir[0] !== 0){ // the sprite had some x direction, not straight up and down

            if(bb.right >= ob.right){ // sprite right boundary is touching or has gone beyond the right of the containing element
                
                this.collisionState.side = 1; // we're calling the right side, 1
                
                if(this.dir[0] > 0){ // sprite was going to the right

                    ////////////////////////
                    // the part that does the actual reflection
                    // you need to write this bit ...   ...    ... // x direction gets flipped.

                    this.flipIfFacing(1);
                    
                }
                this.collisionState.in_collision = 1;

            }else if(bb.left /* ... you need to write this bit */){

                this.collisionState.side = 3; // we're calling the left side, 3
        
                if(/* you need to write this bit (and remove the 1 -> ) */1){ // sprite was going to the left
                    
                    ////////////////////////
                    // the part that does the actual reflection                    
                    // you need to write this bit ...   ...    ... // x direction gets flipped.

                    this.flipIfFacing(3);
                    
                }
                this.collisionState.in_collision = 1;
            }
        }
 
        return this.collisionState.in_collision;
        
    }

    // extra challenge! (give this a go if you're already reasonably confident in programming)
    // this function is called checkOuterCollision 
    // because it checks for collisions with box's it's usually outside of,
    // i.e. other sprites...
    // here 'box' should be the bb of another sprite
    // so you'd also need to update frame function in script.js
    // so checkOuterCollision is called for each sprite for each other sprite...
    // this will really slow things down if you have a lot of sprites, so watch the sprite number
    checkOuterCollision(box){
        // can you complete this function for checking and reaction to collisions with other sprites?
    }

    // you don't need to change anything below here!

    // add the sprite to the page, inside the parent element and return the sprite element
    putSprite(parent, matrix){
        if(parent instanceof Element){
            this.parent = parent;
        }

        if(this.parent instanceof Element){
            this.parent.appendChild(this.imgobj);
            this.boundingbox = this.imgobj.getBoundingClientRect();
            if(matrix instanceof DOMMatrix){
                this.matrix = Object.assign({}, matrix);
                this.imgobj.style.transform = this.matrix;
            }else if(this.matrix instanceof DOMMatrix){
                this.imgobj.style.transform = this.matrix;
            }else{
                var matrix = window.getComputedStyle(this.imgobj).transform;
                if (matrix == "none"){
                    matrix = new DOMMatrix();
                }
                this.matrix = matrix;
            }
            this.put = true; // sprite is now in the DOM
            return this.imgobj;
        }
        return null;
    }

    setFacing(facing){
        switch (facing){
            case "top" : this.facing = 0;
            case "right" : this.facing = 1;
            case "bottom" : this.facing = 2;
            case "left" : this.facing = 3;
        }
    }

    getObj(){
        return this.imgobj;
    }

    getDir(){
        return [this.dir[0], this.dir[1]];
    }
    setDir(dir){
        this.dir = [dir[0], dir[1]];
    }

    setSpeed(speed){
        this.speed = speed;
    }
    getSpeed(){
        return this.speed;
    }

    shiftPos(pos){
        this.matrix.translateSelf(pos[0], pos[1]);
    }

    setPos(pos){
        this.matrix.m41 = pos[0];
        this.matrix.m42 = pos[1];
    }

    setParent(parent){
        if(parent instanceof Element){
            this.parent = parent;
        }
    }

    getLastCollisionSide(){
        return this.collisionState.side;
    }

    isFlipped(){
        return (this.flipped)
    }

    // reflect/flip sprite on the y axis and toggle flipped state
    flip(){
        this.matrix.a = -this.matrix.a;
        this.flipped = !this.flipped;
    }

    // flip sprite if it's facing left or right.
    flipIfFacing(side){
        if((this.facing == side && !this.flipped) || ((this.facing + 2)%4 == side && this.flipped)){
            this.flip();
        }
    }


}
