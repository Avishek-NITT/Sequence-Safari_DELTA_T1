const playBoard = document.querySelector(".playground");
const scoreElement= document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score")
const timerElement = document.querySelector(".timer")

let gameOver = false;
let foodX, foodY;
let snakeBody = [];
let food = [];
let snakeX = 10, snakeY = 10;
let velocityX = 0, velocityY =0;
let setIntervalID;
let score = 0;
let food_eaten =0;
let index;
let currentTime = 30;
let gameStart = 0;
let timerId;
let htmlMarkup = "";
let colorArray = [
    ['FF0000', '000CFF', '7C00FF' , 'FF8B00'],
    ['00FFE8', 'FFEC00', '32FF00', 'FF0000'],
    ['FF8B00', '7C00FF', '32FF00'],
    ['000CFF', 'FF00F0', 'FF8B00', '32FF00', 'FF0000'],
    ['32FF00', '7C00FF', 'FFEC00']
];

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score = ${highScore}`;

timerElement.innerText = `TIMER = ${currentTime}`;




const handleGameOver = () => {
    clearInterval(setIntervalID);
    clearInterval(timerId);
    alert("GAME OVERR!!!");
    location.reload();

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



const spawnFood= () => {
    for(let i =0; i < 5; i++){
        foodX = Math.floor(Math.random() * 20)+1;
        foodY = Math.floor(Math.random() * 20)+1;
        food.push([foodX,foodY]);
    }       
}


const changeDirection = (e) =>{
    let x1 =1;
    let x2= 2;
    let y1 =0;
    let y2 =0;
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
        spawnFood();    //Loads the food coordinates into the array
        snakeBody[0] = [snakeX,snakeY];
        snakeBody.push([snakeX-x1, snakeY-y1]);
        snakeBody.push([snakeX-x2, snakeY -y2]);
        timerId = setInterval(countDown,1000)
        setIntervalID = setInterval(initGame,125);
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
        spawnFood();
        snakeBody[0] = [snakeX,snakeY];
        snakeBody.push([snakeX-x1, snakeY-y1]);
        snakeBody.push([snakeX-x2, snakeY-y2]);
        timerId = setInterval(countDown,1000)
        setIntervalID = setInterval(initGame,125);
    }   
}



const initGame = () => {

    if (gameOver) return handleGameOver();
    htmlMarkup = ""
    
    //Spawning food every iteration
    for(let i =0; i < food.length; i++){
        htmlMarkup+=`<div class ="food" style="grid-area: ${food[i][1]}/ ${food[i][0]}"> </div>`;
    } 
    playBoard.innerHTML = htmlMarkup;
    
    //Checking if any food is eaten
    for(let i =0 ; i < food.length; i++){
        if (food[i][0]===snakeX && food[i][1]===snakeY){
            food_eaten =1;
            index = i;
        }
    }
    //If eaten, then it will remove it from food array and grow the snake 
    if(food_eaten){ 
        food.splice(index,1);   //Remove food from array
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

        
    }    
    if(food.length===0){
        spawnFood();
        for(let i =0; i < food.length; i++){
            htmlMarkup+=`<div class ="food" style="grid-area: ${food[i][1]}/ ${food[i][0]}"> </div>`;
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


document.addEventListener("keydown", changeDirection);


