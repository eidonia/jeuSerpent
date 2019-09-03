window.onload = function ()
{

    var canvasWidth = 900;
    var canvasHeight = 600;
    var blocksize = 30;
    var ctx; //contexte
    var delay = 100;
    var xCoord = 0;
    var yCoord = 0;
    var snakee;
    var applee;
    var widthInBlock = canvasWidth/blocksize;
    var heightInBlock = canvasHeight/blocksize;
    var score;
    var timeout;
    
    
    init();


    function init(){

        //création du canvas dans le html
        var canvas = document.createElement('canvas')
        canvas.width=canvasWidth;
        canvas.height=canvasHeight;
        canvas.style.border='30px solid gray';
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], "right");
        applee = new Apple([10, 10]);
        score = 0;
        refreshCanvas();


    }

    function refreshCanvas(){ //fonction qui réalise le mvt du serpent  

                snakee.advance();

        if(snakee.checkCollisions()){

                gameOver();
            
        }else{
            
            if(snakee.isEatingApple(applee)){
                
                score++;
                snakee.ateApple = true;
                do{
                
                applee.setNewPosition();
                }while(applee.isOnSnake(snakee));
                
            }
            
            ctx.clearRect(0,0,canvasWidth,canvasHeight); //efface le contenu du canvas avant de mettre la nouvelle position du serpent
            drawScore();
            snakee.draw();
            applee.draw();
            
            timeout = setTimeout(refreshCanvas, delay);

        }

    }
    
    function gameOver(){
        
        ctx.save();
        ctx.font = "bold 30px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign  = "center";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth/2;
        var centreY = canvasHeight/2;
        ctx.strokeText("Game Over", centreX,  centreY - 100);
        ctx.fillText("Game Over", centreX,  centreY - 100);
        ctx.strokeText("Appuyer sur Espace pour rejouer", centreX, centreY+ 90);
        ctx.fillText("Appuyer sur Espace pour rejouer", centreX, centreY+ 90);
        ctx.restore();
        
        
        
    }
    
    function restart(){
        
        snakee = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], "right");
        applee = new Apple([10, 10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
        
    }
    
    function drawScore(){
        
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign  = "center"; 
        var centreX = canvasWidth/2;
        var centreY = canvasHeight/2;
        ctx.textBaseline = "middle";
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
        
    }

    function drawBlock(ctx, position){

        var x = position[0] * blocksize;
        var y = position[1] * blocksize;
        ctx.fillRect(x, y, blocksize, blocksize);
    }

    function Snake(body, direction){

        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function(){

            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(var i = 0; i<this.body.length; i++){

                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function(){

            var nextPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextPosition[0] -= 1;
                    break;

                case "right":
                    nextPosition[0] += 1;
                    break;

                case "down":
                    nextPosition[1] += 1;
                    break;

                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("invalid direction")

            }

            this.body.unshift(nextPosition); // unshift permet de rajouter nextPosition à la 1ere place du tableau
            if(!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false;

        };

        this.setDirection = function(newDirection){
            var allowedDirections;

            switch(this.direction){
                case "left":
                case "right":
                    allowedDirections = ["up", "down"]
                    break;

                case "down":
                case "up":
                    allowedDirections = ["left", "right"]
                    break;

                default:
                    throw("invalid direction");
            }

            if(allowedDirections.indexOf(newDirection) > -1){

                this.direction = newDirection;
            }

        }

        this.checkCollisions = function(){

            var wallcollision = false;
            var bodyCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlock -1 ;
            var maxY = heightInBlock - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVericalWalls = snakeY < minY || snakeY > maxY;

            if(isNotBetweenHorizontalWalls || isNotBetweenVericalWalls){

                wallcollision = true;

            }

            for(var i = 0; i<rest.length; i++){

                if(snakeX == rest[i][0] && snakeY == rest[i][1]){

                    bodyCollision = true;

                }
            }

            return wallcollision || bodyCollision;

        }
        
        this.isEatingApple = function(appleToEat){
            
            var head = this.body[0];
            
            if (head[0] == appleToEat.position[0] && head[1] == appleToEat.position[1]){
                
                return true;
            }else{
                
                return false;
            }
            
        }

    }

    function Apple(position){
        this.position = position;

        this.draw = function(){

            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blocksize/2;
            var x = this.position[0]*blocksize+radius;
            var y = this.position[1]*blocksize+radius; //pour un cercle, on veut le centre du block
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        }
        
        this.setNewPosition = function(){
            
            var newX = Math.round(Math.random() * (widthInBlock -1));
            var newY = Math.round(Math.random() * (heightInBlock -1));
            
            this.position = [newX, newY];
        }
        
        this.isOnSnake = function(snakeToCheck){
            
            var isOnSnake = false;
            
            
            for( i = 0 ; i<snakeToCheck.body.length ; i++){
                
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[0] === snakeToCheck.body[i][1]){
                    
                    isOnSnake = true;
                    
                }
                
                return isOnSnake;
            }
            
            
            
            
        }
        
        


    }

    document.onkeydown = function handleKeyDown(e){

        var key = e.keyCode;
        var newDirection;
        switch(key){
            case 37: //fleche gauche
                    newDirection = "left";
                    break;

            case 38:
                newDirection = "up";
                break;

            case 39:
                newDirection = "right";
                break;

            case 40:
                newDirection = "down";
                break;
                
            case 32:
                restart();
                return;

            default:
                return;
        }
        snakee.setDirection(newDirection);




    }


} 