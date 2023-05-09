const playBoard = document.querySelector(".playground");
const sequence = document.querySelector(".color_seq");
const scoreElement= document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score")
const timerElement = document.querySelector(".timer")
const livesElement = document.querySelector(".lives")

let gameOver = false;
let foodX, foodY;
let snakeBody = [];
let food = [];
let powerup_exist =0;
let power_x, power_y;
let snakeX = 10, snakeY = 10;
let velocityX = 0, velocityY =0;
let setIntervalID;
let score = 0;
let food_eaten =0;
let index;
let currentTime = 15;
let gameStart = 0;
let timerId;
let htmlMarkup = "";
let lives =3;
let speed = 125;
let word_array = [
    ['D', 'E', 'L', 'T','A'],
    ['T','A', 'S', 'K'],
    ['W', 'E', 'B', 'D','E','V'],
    ['S', 'Y','S','A','D'],
    ['A','P','P','D','E','V']
];
let game_pause = 0;
let color_sequence = [];
let audio_eatfood = new Audio("Audio/eat-food_DcmYIN6Y.mp3");
let grow = 0;
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score = ${highScore}`;

timerElement.innerText = `TIMER = ${currentTime}`;

livesElement.innerText = `LIVES : ${lives}`;


const handleGameOver = () => {
    lives--;
    if(lives){
        clearInterval(setIntervalID);
        clearInterval(timerId);
        let x1 =1;
        let x2= 2;
        let y1 =0;
        let y2 =0;
        velocityX =1;
        velocityY = 0;
        powerup_exist =0;
        htmlMarkup ="";
        playBoard.innerHTML = htmlMarkup;
        snakeBody.length =0;
        food.length =0;
        snakeX = 10;
        snakeY = 10;
        currentTime = 15;
        snakeBody[0] = [snakeX,snakeY];
        snakeBody.push([snakeX-x1, snakeY-y1]);
        snakeBody.push([snakeX-x2, snakeY -y2]);    //Loads the food coordinates into the array  
        word_array.length = 0;
        word_array =  [
            ['D', 'E', 'L', 'T','A'],
            ['T','A', 'S', 'K'],
            ['W', 'E', 'B', 'D','E','V'],
            ['S', 'Y','S','A','D'],
            ['A','P','P','D','E','V']
        ];
        spawn_colors();
        spawnFood();
        gameOver = false; 
        livesElement.innerText = `LIVES : ${lives}`;
        timerId = setInterval(countDown,1000)
        setIntervalID = setInterval(initGame,speed);
    }else{
        clearInterval(setIntervalID);
        clearInterval(timerId);
        alert("GAME OVERR!!!");
        location.reload();
    }
    

}

function countDown(){
    currentTime --;
    timerElement.innerText = `TIMER = ${currentTime}`; 
    if(currentTime === 0){
        clearInterval(timerId);
        clearInterval(setIntervalID);
        handleGameOver();
    }
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const spawn_colors = () =>{
    color_sequence.length =0;
    let i = getRandomInt(4);
    for(let j =0; j < word_array[i].length; j++){
        color_sequence.push(word_array[i][j]);
    }
}


const spawnFood= () => {
    let cond = 0;
    for(let i =0; i < color_sequence.length; i++){
        cond =1;
        foodX = Math.floor(Math.random() * 20)+1;
        foodY = Math.floor(Math.random() * 20)+1;
        //Checking if the new food spawn doesnt collide with snake body or other foods
        for(let j=0; j < snakeBody.length; j++){
            if (snakeBody[j][0] !== foodX && snakeBody[j][1] !== foodY ){
                continue;
            }else{
                cond = 0;
            }
        }
        for(let j =0; j < food.length; j++){
            if(foodX !== food[j][0] && foodY !== food[j][1]){
                continue;
            }else{
                cond = 0;
            }
        }
        if(cond){
            food.push([foodX,foodY]);
        }else{
            i--;
        }
        
    } 
          
}

const pausegame = () => {
    clearInterval(timerId);
    clearInterval(setIntervalID);
    game_pause =1;
}
const unpausegame = () => {
    timerId = setInterval(countDown,1000)
    setIntervalID = setInterval(initGame,speed);
    game_pause =0;
}

const changeDirection = (e) =>{
    let x1 =1;
    let x2= 2;
    let y1 =0;
    let y2 =0;

    if(e.key === 'p'){
        if(game_pause === 0){
            pausegame();
        }else{
            unpausegame();
        }
        
    }
    if (e.key === "ArrowUp" && velocityY!= 1){
        velocityX =0;
        velocityY = -1;
        if(gameStart===0){
            gameStart++;
        }
    }
    else if (e.key === "ArrowDown" && velocityY!= -1){
        velocityX =0;
        velocityY = 1;
        if(gameStart===0){
            gameStart++;
        }
    }
    else if (e.key === "ArrowRight" && velocityX!= -1){
        velocityX =1;
        velocityY = 0;
        if(gameStart===0){
            gameStart++;
        }
    }
    else if (e.key === "ArrowLeft" && velocityX!= 1){
        velocityX =-1;
        velocityY = 0;
        x1 =0;
        x2=0;
        y1 =1;
        y2 =2;
        if(gameStart===0){
            gameStart++;
        }
    }
    
    if(gameStart===1){   //Game starts here
        gameStart++;
        snakeBody[0] = [snakeX,snakeY];
        snakeBody.push([snakeX-x1, snakeY-y1]);
        snakeBody.push([snakeX-x2, snakeY -y2]);    //Loads the food coordinates into the array   
        spawn_colors();
        spawnFood();     
        timerId = setInterval(countDown,1000)
        setIntervalID = setInterval(initGame,speed);
    
    }
}

const button_changeDirection = (a) =>{
    let x1 =1;
    let x2= 2;
    let y1 =0;
    let y2 =0;
    if(gameStart===0){
        gameStart++;
    }

    if (a=== "UP" && velocityY!= 1){
        velocityX =0;
        velocityY = -1;
    }
    else if (a === "DOWN" && velocityY!= -1){
        velocityX =0;
        velocityY = 1;
    }
    else if (a === "RIGHT" && velocityX!= -1){
        velocityX =1;
        velocityY = 0;
    }
    else if (a === "LEFT" && velocityX!= 1){
        velocityX =-1;
        velocityY = 0;
        x1 =0;
        x2=0;
        y1 =1;
        y2 =2;
    }
    if(gameStart===1){
        gameStart++;
        snakeBody[0] = [snakeX,snakeY];
        snakeBody.push([snakeX-x1, snakeY-y1]);
        snakeBody.push([snakeX-x2, snakeY-y2]);
        spawn_colors();
        spawnFood();   
        timerId = setInterval(countDown,1000)
        setIntervalID = setInterval(initGame,speed);
    }   
}

const powerup = () => {
    let d = getRandomInt(20);
    if(d > 5 && d < 12){
        let cond =1;
        while(cond){
            cond =0;
            power_x =getRandomInt(20)
            power_y = getRandomInt(20)
            for(let i =0; i < food.length; i++){
                if(JSON.stringify(power_x) === JSON.stringify(food[i][0]) && JSON.stringify(power_y) === JSON.stringify(food[i][1])){
                    cond =1;
                    break;
                }
            }
            for(let i =0; i < snakeBody.length; i++){
                if(JSON.stringify(power_x) === JSON.stringify(snakeBody[i][0]) && JSON.stringify(power_y) === JSON.stringify(snakeBody[i][1])){
                    cond =1;
                    break;
                }
            }
        }
        htmlMarkup += `<div class ="buff_shrink" style ="grid-area: ${power_y}/${power_x}">P1</div> `
        playBoard.innerHTML = htmlMarkup;

        powerup_exist=1;
    }
    
} 

const initGame = () => {

    if (gameOver) return handleGameOver();
    
    if(grow){  //If snake has completed a sequence, snake will grow in size by 3 cells
        snakeBody.push([snakeX, snakeY]);
        grow--;
    }

    htmlMarkup = "";
    if(powerup_exist){
        htmlMarkup += `<div class ="buff_shrink" style ="grid-area: ${power_y}/${power_x}">P1</div> `
        playBoard.innerHTML = htmlMarkup;
    }
    //Spawning food every iteration
    for(let i =0; i < food.length; i++){
        if(i ===0){
            htmlMarkup+=`<div style="grid-area: ${food[i][1]}/ ${food[i][0]}; text-align:center;font-size: 100%;font-weight:bold"> ${color_sequence[i]} </div>`;
        }else{
            htmlMarkup+=`<div style="grid-area: ${food[i][1]}/ ${food[i][0]}; text-align:center;font-size: 80%;"> ${color_sequence[i]} </div>`;
        }
        
    } 
    playBoard.innerHTML = htmlMarkup;
    
    //Showing the color sequence
    let color_markup = "";
    for(let i =0 ; i < color_sequence.length; i++){
        color_markup += `<div style ="color_blocks; color: #00F0FF; text-align:center" >${color_sequence[i]}</div>`;
    }
    sequence.innerHTML = color_markup;
    
    //Checking if any food is eaten
    for(let i =0 ; i < food.length; i++){
        if (food[i][0]===snakeX && food[i][1]===snakeY){
            food_eaten =1;
            index = i;
        }
    }

    //Checking if snake ate a powerup
    if(snakeX===power_x && snakeY === power_y){
        powerup_exist =0;
        currentTime +=2;
        let count =3;
        while(count && snakeBody.length>3){
            snakeBody.pop();
            count--;
        }
    }

    //If eaten, then it will remove it from food array and grow the snake 
    if(food_eaten){ 
        if(index!==0){
            gameOver = true;
            handleGameOver();
        }
        
        audio_eatfood.play();
        

        food.splice(index,1)
        color_sequence.splice(index,1);   //Remove food from array
        snakeBody.push([snakeX, snakeY]);  //Snake body grows at the position of the food
        score++;
        //Adding time after player eats the food
        currentTime += 2;
        timerElement.innerText = `TIMER = ${currentTime}`;
        highScore = score >highScore? score:highScore;
        localStorage.setItem("high-score" , highScore);        //High score gets updated
        scoreElement.innerText = `Score = ${score}`;
        highScoreElement.innerText = `High Score = ${highScore}`;
        food_eaten=0;

        //Checking if powerup is spawned or not
        if(powerup_exist === 0){
            powerup();
        }
    
    }

    if(food.length===0){
        currentTime += 5;
        grow = 3;
        spawn_colors();
        spawnFood();
        for(let i =0; i < food.length; i++){
            htmlMarkup+=`<div style="grid-area: ${food[i][1]}/ ${food[i][0]}; background-color: #${color_sequence[i]} "> </div>`;
        }
      
    }
    
    
    
    
    for(let i = snakeBody.length -1; i> 0; i-- ){
        snakeBody[i] = snakeBody[i-1];      //Snake body is travelling by shifting each cell to the next position
    }
    
    snakeX += velocityX;
    snakeY += velocityY; 
    snakeBody[0] = [snakeX,snakeY];
    
    //If snake crashes into a wall
    if(snakeX < 0 || snakeX >20 || snakeY < 0 || snakeY > 20){
        gameOver = true;
        handleGameOver();
    }

    htmlMarkup += `<div class ="head" style="grid-area: ${snakeBody[0][1]}/ ${snakeBody[0][0]}"> </div>`;

    //Updating the snake array on the grid
    for(let i =1; i < snakeBody.length; i++){
         
        htmlMarkup += `<div class ="snake_body" style="grid-area: ${snakeBody[i][1]}/ ${snakeBody[i][0]}"> </div>`;

        if(i!== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            
            gameOver = true;
        }
    } 
    playBoard.innerHTML = htmlMarkup;

}


// htmlMarkup+=`<div style="grid-area: 4/5; background-color: #FF0000;" > </div>`;
// playBoard.innerHTML = htmlMarkup;


document.addEventListener("keydown", changeDirection);


