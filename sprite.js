class Sprite {
    static snum = 0;
    imgobj;
    parent;
    matrix;
    dir = [1, 0];
    speed = 1;
    collisionState = {in_collision:0, rotate_tog:0, side:0};
    boundingbox;
    put = false;

    constructor(image, parent, dir, speed, matrix){
        this.imagesrc = image;

        if(parent instanceof Element){
            this.parent = parent;
        }

        if(matrix instanceof DOMMatrix){
            this.matrix = Object.assign({}, matrix);
        }
        if(dir){
            this.dir = dir;
        } 
        if(typeof speed !== "undefined"){
            this.speed = speed;
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
        
        this.matrix.translateSelf(this.speed * this.dir[0], this.speed * this.dir[1]);
        this.imgobj.style.transform = this.matrix;
    }

    checkInnerCollision(box){
        var ob;
        if(typeof box !== "undefined"){
            ob = box;
        }else{
            ob = this.parent.getBoundingClientRect();
        }

        this.boundingbox = this.imgobj.getBoundingClientRect();
        var bb = this.boundingbox;

        // now we need to check if 2 rectangles overlap
     
        // check top
        this.collisionState.in_collision = 1;
        if(bb.top <= ob.top){ // sprite top is touching or has gone beyond the top of the containing element

            // so we need to reflect the sprite off the top of the parent containing element
            this.collisionState.side = 0;

            if(this.dir[1] < 0){ // this sprite is going up so we need to start going down. Can you figure out why this check if necessary? Is it necessary? :)
        //        this.dir[1] = -this.dir[1]; // y direction gets flipped to 'reflect' in the line of the parent top    
            }
            
        }else if(bb.right >= ob.right){ // sprite right boundary is touching or has gone beyond the right of the containing element
            this.collisionState.side = 1;
       
        }else if(false){
            this.collisionState.side = 2;
         

        }else if(false){
            this.collisionState.side = 3;

        }else {
            this.collisionState.in_collision = 0; // no collisions
        }
         
        return this.collisionState.in_collision;
        
    }

    checkOuterCollision(box){
        // can you complete this function for checking and reaction to collisions with other sprites?
    }

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

    flip(){
        this.matrix.scale(-1, 1);
    }


}
