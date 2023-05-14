const playBoard = document.querySelector(".playground");
const sequence = document.querySelector(".color_seq");
const scoreElement= document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score")
const timerElement = document.querySelector(".timer")
const livesElement = document.querySelector(".lives")
const start_modal = document.querySelector("#start_modal")
const gameover_modal = document.querySelector("#game_over")

let grid_x =20, grid_y = 20;
let gameOver = false;
let foodX, foodY;
let snakeBody1 = [];
let snakeBody2 = [];
let food = [];
let powerup_exist =0;
let power_x, power_y;
let snakeX1 = 3, snakeY1 = 3;
let snakeX2 = 17, snakeY2 = 17;
let velocityX1 = 0, velocityY1 =0;
let velocityX2 = 0, velocityY2 =0;
let setIntervalID;
let score1 = 0;
let score2 = 0;
let food_eaten1 =0;
let food_eaten2 =0;
let index;
let currentTime = 15;
let gameStart = 0;
let timerId;
let htmlMarkup = "";
let lives =3;
let speed = 180;
let word_array = [
    ['D', 'E', 'L', 'T','A'],
    ['T','A', 'S', 'K'],
    ['W', 'E', 'B', 'D','E','V'],
    ['S', 'Y','S','A','D'],
    ['A','P','P','D','E','V']
];
let game_pause = 0;
let color_sequence = [];
let buffs = ["buff_shrink", "buff_life", "buff_time"]
let power_index;
let audio_eatfood = new Audio("Audio/eat-food_DcmYIN6Y.mp3");
let audio_teleport = new Audio("Audio/Teleport_sound.mp3");
let game_over_audio = new Audio("Audio/game_over.mp3")
let live_lost_audio = new Audio("Audio/livelost.mp3")

let grow = 0;
let t1_x,t1_y;
let t2_x, t2_y;
let obstacle_exist =0;
let ob_x =1, ob_y;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score = ${highScore}`;

timerElement.innerText = `TIMER = ${currentTime}`;

livesElement.innerText = `LIVES : ${lives}`;


const handleGameOver = () => {
    lives--;
    if(lives){  //Checks how many lives user has
        // If user still has lives, everything except score is resetted and the game restarts
        clearInterval(setIntervalID);
        clearInterval(timerId);
        live_lost_audio.play();
        setTimeout(() => {
            let x1 =1;
            let x2= 2;
            let y1 =0;
            let y2 =0;
            velocityX1 =1;
            velocityY1 = 0;
            velocityX2 =-1;
            velocityY2 = 0;
            powerup_exist =0;
            htmlMarkup ="";
            playBoard.innerHTML = htmlMarkup;
            obstacle_exist =0;
            ob_x =1;
            snakeBody1.length =0;
            snakeBody2.length =0;
            food.length =0;
            snakeX1 = 3;
            snakeY1 = 3;
            snakeX2 = 17;
            snakeY2 = 17;
            currentTime = 15;
            snakeBody1[0] = [snakeX1,snakeY1];
            snakeBody1.push([snakeX1-x1, snakeY1-y1]);
            snakeBody1.push([snakeX1-x2, snakeY1 -y2]);    //Loads the food coordinates into the array

            snakeBody2[0] = [snakeX2,snakeY2];
            snakeBody2.push([snakeX2+x1, snakeY2-y1]);
            snakeBody2.push([snakeX2+x2, snakeY2 -y2]);  
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
            speed = 180;
            spawn_teleport();
            timerId = setInterval(countDown,1000)
            setIntervalID = setInterval(initGame,speed);
        },1300)
    }else{
        //If no lives remaining, game ends with an alert
        lives=0
        clearInterval(setIntervalID);
        clearInterval(timerId);
        game_over_audio.play();
        document.getElementById('game_over').style.display = "flex";
        game_over.showModal();
        
        setTimeout(() => {
            location.reload();
        },1500)        
    }
    

}

function countDown(){  // Implementing a countdown timer
    currentTime --;
    timerElement.innerText = `TIMER = ${currentTime}`; 
    if(currentTime === 0){
        clearInterval(timerId);
        clearInterval(setIntervalID);
        handleGameOver();
    }
}


function getRandomInt(max) { //Used to fetch myself any random number
    return Math.floor(Math.random() * max);
}

const spawn_colors = () =>{     //Picks a sequence from word_array and then adds the sequence in color_sequence
    color_sequence.length =0;
    let i = getRandomInt(word_array.length -1);
    for(let j =0; j < word_array[i].length; j++){
        color_sequence.push(word_array[i][j]);
    }
}


const spawnFood= () => {        //Once a sequence is selected, this function spawns it on the grid
    let cond = 0;
    for(let i =0; i < color_sequence.length; i++){
        cond =1;
        foodX = Math.floor(Math.random() * grid_x)+1;
        foodY = Math.floor(Math.random() * grid_y)+1;
        //Checking if the new food spawn doesnt collide with snake body or other foods
        for(let j=0; j < snakeBody1.length; j++){
            if (snakeBody1[j][0] !== foodX && snakeBody1[j][1] !== foodY ){
                continue;
            }else{
                cond = 0;
            }
        }
        for(let j=0; j < snakeBody2.length; j++){
            if (snakeBody2[j][0] !== foodX && snakeBody2[j][1] !== foodY ){
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

//Pause is implemented by pressing 'p' key
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

//Used to change the direction of the snake
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
    if (e.key === "ArrowUp" && velocityY1!= 1){
        velocityX1 =0;
        velocityY1 = -1;
        if(gameStart===0){
            velocityX2 =-1;
            velocityY2 = 0;
            gameStart++;
        }
    }
    else if (e.key === "ArrowDown" && velocityY1!= -1){
        velocityX1 =0;
        velocityY1 = 1;
        if(gameStart===0){
            velocityX2 =-1;
            velocityY2 = 0;
            gameStart++;
        }
    }
    else if (e.key === "ArrowRight" && velocityX1!= -1){
        velocityX1 =1;
        velocityY1 = 0;        
        if(gameStart===0){
            velocityX2 =-1;
            velocityY2 = 0;
            gameStart++;
        }
    }
    else if (e.key === "ArrowLeft" && velocityX1!= 1){
        velocityX1 =-1;
        velocityY1 = 0;
        x1 =0;
        x2=0;
        y1 =1;
        y2 =2;
        if(gameStart===0){
            velocityX2 =-1;
            velocityY2 = 0;
            gameStart++;
        }
    }
    else if (e.key === 'w' && velocityY2!= 1){
        velocityX2 =0;
        velocityY2 = -1;
        if(gameStart===0){
            velocityX1 =1;
            velocityY1 = 0;
            gameStart++;
        }
    }
    else if (e.key === 's' && velocityY2!= -1){
        velocityX2 =0;
        velocityY2 = 1;
        if(gameStart===0){
            gameStart++;
            velocityX1 =1;
            velocityY1 = 0;
        }
    }
    else if (e.key === 'd' && velocityX2!= -1){        
        if(gameStart===0){
            velocityX1 =1;
            velocityY1 = 0;
            velocityX2 =0;
            velocityY2 = -1;
            gameStart++;
        }else{
            velocityX2 =1;
            velocityY2 =0;
        }
        
    }
    else if (e.key === 'a' && velocityX2!= 1){
        velocityX2 =-1;
        velocityY2 = 0;
        x1 =0;
        x2=0;
        y1 =1;
        y2 =2;
        if(gameStart===0){
            velocityX1 =1;
            velocityY1 = 0;
            gameStart++;
        }
    }
    //This function allows user to start the game by pressing any arrow key
    if(gameStart===1){ 
        start_modal.close();
        grid_x = prompt("Enter width");
        grid_y = prompt("Enter height");
        playBoard.style.gridTemplateColumns = `repeat(${grid_x}, 1fr)`
        playBoard.style.gridTemplateRows = `repeat(${grid_y}, 1fr)`
        document.getElementById("start_modal").style.display = "none";   
        gameStart++;
        snakeBody1[0] = [snakeX1,snakeY1];
        snakeBody1.push([snakeX1-x1, snakeY1-y1]);
        snakeBody1.push([snakeX1-x2, snakeY1 -y2]);    //Loads the food coordinates into the array 
        snakeBody2[0] = [snakeX2,snakeY2];
        snakeBody2.push([snakeX2+x1, snakeY2-y1]);
        snakeBody2.push([snakeX2+x2, snakeY2 -y2]);  
        spawn_colors();
        spawnFood();
        spawn_teleport();     
        timerId = setInterval(countDown,1000)
        setIntervalID = setInterval(initGame,speed);
    
    }
}

//Changing directions using buttons
const button_changeDirection = (a) =>{
    let x1 =1;
    let x2= 2;
    let y1 =0;
    let y2 =0;
    if(gameStart===0){
        gameStart++;
    }

    if (a=== "UP" && velocityY1!= 1){
        velocityX1 =0;
        velocityY1 = -1;
    }
    else if (a === "DOWN" && velocityY1!= -1){
        velocityX1 =0;
        velocityY1 = 1;
    }
    else if (a === "RIGHT" && velocityX1!= -1){
        velocityX1 =1;
        velocityY1 = 0;
    }
    else if (a === "LEFT" && velocityX1!= 1){
        velocityX1 =-1;
        velocityY1 = 0;
        x1 =0;
        x2=0;
        y1 =1;
        y2 =2;
    }
    if(gameStart===1){
        gameStart++;
        snakeBody1[0] = [snakeX1,snakeY];
        snakeBody1.push([snakeX1-x1, snakeY-y1]);
        snakeBody1.push([snakeX1-x2, snakeY-y2]);
        spawn_colors();
        spawnFood();   
        timerId = setInterval(countDown,1000)
        setIntervalID = setInterval(initGame,speed);
    }   
}

//Implementing powerup
const powerup = () => {
    let d = getRandomInt(20); //This decides whether a powerup will be spawned or not
    d= 6;
    if(d > 5 && d < 12){
        let cond =1;
        while(cond){
            cond =0;
            power_x =getRandomInt(grid_x)
            power_y = getRandomInt(grid_y)
            for(let i =0; i < food.length; i++){
                if(JSON.stringify(power_x) === JSON.stringify(food[i][0]) && JSON.stringify(power_y) === JSON.stringify(food[i][1])){
                    cond =1;
                    break;
                }
            }
            for(let i =0; i < snakeBody1.length; i++){
                if(JSON.stringify(power_x) === JSON.stringify(snakeBody1[i][0]) && JSON.stringify(power_y) === JSON.stringify(snakeBody1[i][1])){
                    cond =1;
                    break;
                }
            }
            for(let i =0; i < snakeBody2.length; i++){
                if(JSON.stringify(power_x) === JSON.stringify(snakeBody2[i][0]) && JSON.stringify(power_y) === JSON.stringify(snakeBody2[i][1])){
                    cond =1;
                    break;
                }
            }
        }
        power_index =getRandomInt(3);
        
        htmlMarkup += `<div class =${buffs[power_index]} style ="grid-area: ${power_y}/${power_x}">P1</div> `
        playBoard.innerHTML = htmlMarkup;
        powerup_exist=1;
    }
    
} 

//Spawning teleport at the start of a game;

const spawn_teleport = () => {
    let cond =1;
    while (cond){
        cond = 1;
        while(cond){
            cond =0;
            t1_x = getRandomInt(grid_x);
            t1_y = getRandomInt(grid_y);
            t2_x = getRandomInt(grid_x);
            t2_y = getRandomInt(grid_y);
            for(let i =0; i < food.length; i++){
                if(JSON.stringify(t1_x) === JSON.stringify(food[i][0]) && JSON.stringify(t1_y) === JSON.stringify(food[i][1])){
                    cond =1;
                    break;
                }else if (JSON.stringify(t2_x) === JSON.stringify(food[i][0]) && JSON.stringify(t2_y) === JSON.stringify(food[i][1])){
                    cond =1;
                    break;
                }
            }
            for(let i =0; i < snakeBody1.length; i++){
                if(JSON.stringify(t1_x) === JSON.stringify(snakeBody1[i][0]) && JSON.stringify(t1_y) === JSON.stringify(snakeBody1[i][1])){
                    cond =1;
                    break;
                }else if(JSON.stringify(t2_x) === JSON.stringify(snakeBody1[i][0]) && JSON.stringify(t2_y) === JSON.stringify(snakeBody1[i][1])){
                    cond =1;
                    break;
                }
            }
            for(let i =0; i < snakeBody2.length; i++){
                if(JSON.stringify(t1_x) === JSON.stringify(snakeBody2[i][0]) && JSON.stringify(t1_y) === JSON.stringify(snakeBody2[i][1])){
                    cond =1;
                    break;
                }else if(JSON.stringify(t2_x) === JSON.stringify(snakeBody2[i][0]) && JSON.stringify(t2_y) === JSON.stringify(snakeBody2[i][1])){
                    cond =1;
                    break;
                }
            }
            if(t1_x === t2_x && t1_y === t2_y){
                cond =1;
            }
        }
    }
    
}



//Main game function starts here
const initGame = () => {

    if (gameOver) return handleGameOver();
    
    if(grow){  //If snake has completed a sequence, snake will grow in size by 3 cells
        snakeBody1.push([snakeX1, snakeY1]);
        grow--;
    }

    htmlMarkup = "";
    
    //Deciding whether to throw obstacle
    if(obstacle_exist ===0 ){
        let d = getRandomInt(20);
        if(d > 8 && d < 12){
            obstacle_exist =1;
            ob_y = getRandomInt(grid_y);
            if(ob_y ===0){
                ob_y =1;
            }
        }
    }
    //If it is decided to throw obstacle 
    if(obstacle_exist === 1){
        if(ob_x === grid_x + 1){
            obstacle_exist =0;
            ob_x =0;
        }else{
            htmlMarkup += `<div class ="obstacle_icon" style ="grid-area: ${ob_y}/${ob_x}">O1</div> `;
            playBoard.innerHTML = htmlMarkup;
            ob_x++; 
        }
    }


    //Adding teleport icons
    htmlMarkup += `<div class ="teleport_icon" style ="grid-area: ${t1_y}/${t1_x}">T1</div> `;
    htmlMarkup += `<div class ="teleport_icon" style ="grid-area: ${t2_y}/${t2_x}">T2</div> `;

    playBoard.innerHTML = htmlMarkup;

    if(powerup_exist){
        htmlMarkup += `<div class =${buffs[power_index]} style ="grid-area: ${power_y}/${power_x}">P1</div> `
        playBoard.innerHTML = htmlMarkup;
    }
    //Spawning food every iteration
    for(let i =0; i < food.length; i++){
        if(i ===0){
            htmlMarkup+=`<div style="grid-area: ${food[i][1]}/ ${food[i][0]};color: #00F0FF; text-align:center;font-size: 100%;font-weight:bold"> ${color_sequence[i]} </div>`;
        }else{
            htmlMarkup+=`<div style="grid-area: ${food[i][1]}/ ${food[i][0]};color: #00F0FF; text-align:center;font-size: 80%;"> ${color_sequence[i]} </div>`;
        }
        
    } 
    playBoard.innerHTML = htmlMarkup;
    
    //Checking if snakes collided
    for(let i = 0; i < snakeBody1.length ; i++){
        if(JSON.stringify(snakeX2) === JSON.stringify(snakeBody1[i][0]) && JSON.stringify(snakeY2) === JSON.stringify(snakeBody1[i][1])){
            gameOver = true;
            handleGameOver();
        }
    }
    for(let i = 0; i < snakeBody2.length ; i++){
        if(JSON.stringify(snakeX1) === JSON.stringify(snakeBody2[i][0]) && JSON.stringify(snakeY1) === JSON.stringify(snakeBody2[i][1])){
            gameOver = true;
            handleGameOver();
        }
    }

    //Checking if snake goes into a telport;
    if(snakeX1 === t1_x && snakeY1 === t1_y){
        snakeX1 = t2_x;
        snakeY1 = t2_y;
        audio_teleport.play();
    }else if(snakeX1 === t2_x && snakeY1 === t2_y){
        snakeX1 =t1_x;
        snakeY1 =t1_y;
        audio_teleport.play();
    }
    if(snakeX2 === t1_x && snakeY2 === t1_y){
        snakeX2 = t2_x;
        snakeY2 = t2_y;
        audio_teleport.play();
    }
    else if(snakeX2 === t2_x && snakeY2 === t2_y){
        snakeX2 =t1_x;
        snakeY2 =t1_y;
        audio_teleport.play();
    }

    //Showing the color sequence
    let color_markup = "";
    for(let i =0 ; i < color_sequence.length; i++){
        color_markup += `<div style ="color_blocks; color: #00F0FF; text-align:center" >${color_sequence[i]}</div>`;
    }
    sequence.innerHTML = color_markup;
    
    //Checking if any food is eaten
    for(let i =0 ; i < food.length; i++){
        if (food[i][0]===snakeX1 && food[i][1]===snakeY1){
            food_eaten1 =1;
            index = i;
        }
        if (food[i][0]===snakeX2 && food[i][1]===snakeY2){
            food_eaten2 =1;
            index = i;
        }
    }

    //Checking if snake ate a powerup
    if(powerup_exist && snakeX1===power_x && snakeY1 === power_y ){
        powerup_exist =0;
        currentTime +=2;
        audio_eatfood.play();

        if(power_index === 0){
            let count =3;
            while(count && snakeBody.length>3){
                snakeBody1.pop();
                count--;
            }
        }else if (power_index === 1){
            lives++;
            livesElement.innerText = `LIVES : ${lives}`;
        }else if(power_index === 2){
            currentTime += 5;
        }
        
    }

    if(powerup_exist && snakeX2===power_x && snakeY2 === power_y ){
        powerup_exist =0;
        currentTime +=2;
        audio_eatfood.play();

        if(power_index === 0){
            let count =3;
            while(count && snakeBody.length>3){
                snakeBody.pop();
                count--;
            }
        }else if (power_index === 1){
            lives++;
            livesElement.innerText = `LIVES : ${lives}`;
        }else if(power_index === 2){
            currentTime += 5;
        }
        
    }

    //If eaten, then it will remove it from food array and grow the snake 
    if(food_eaten1){ 
        if(index!==0){
            gameOver = true;
            handleGameOver();
        }
        
        audio_eatfood.play();
    
        
        if(speed > 150){
            speed -= 10;
            clearInterval(setIntervalID);
            setIntervalID = setInterval(initGame,speed);
        }
        else if(speed > 120){
            speed -= 7;
            clearInterval(setIntervalID);
            setIntervalID = setInterval(initGame,speed);
        }
        else if(speed >90){
            speed -=5;
            clearInterval(setIntervalID);
            setIntervalID = setInterval(initGame,speed);
        }
        food.splice(index,1)
        color_sequence.splice(index,1);   //Remove food from array
        snakeBody1.push([snakeX1, snakeY1]);  //Snake body grows at the position of the food
        score1++;
        //Adding time after player eats the food
        currentTime += 2;
        timerElement.innerText = `TIMER = ${currentTime}`;
        highScore = score1 >highScore? score1:highScore;
        localStorage.setItem("high-score" , highScore);        //High score gets updated
        scoreElement.innerText = `Score = ${score1}`;
        highScoreElement.innerText = `High Score = ${highScore}`;
        food_eaten1=0;

        //Checking if powerup is spawned or not
        if(powerup_exist === 0){
            powerup();
        }
    
    }

    if(food_eaten2){ 
        if(index!==0){
            gameOver = true;
            handleGameOver();
        }
        
        audio_eatfood.play();
        
        if(speed > 150){
            speed -= 10;
            clearInterval(setIntervalID);
            setIntervalID = setInterval(initGame,speed);
        }
        else if(speed > 120){
            speed -= 7;
            clearInterval(setIntervalID);
            setIntervalID = setInterval(initGame,speed);
        }
        else if(speed >90){
            speed -=5;
            clearInterval(setIntervalID);
            setIntervalID = setInterval(initGame,speed);
        }
        food.splice(index,1)
        color_sequence.splice(index,1);   //Remove food from array
        snakeBody2.push([snakeX2, snakeY2]);  //Snake body grows at the position of the food
        score2++;
        //Adding time after player eats the food
        currentTime += 2;
        timerElement.innerText = `TIMER = ${currentTime}`;
        highScore = score1 >highScore? score1:highScore;
        highScore = score2 >highScore? score2:highScore;
        localStorage.setItem("high-score" , highScore);        //High score gets updated
        scoreElement.innerText = `Score = ${score1}`;
        highScoreElement.innerText = `High Score = ${highScore}`;
        food_eaten2=0;

        //Checking if powerup is spawned or not
        if(powerup_exist === 0){
            powerup();
        }
    
    }

    if(food.length===0){ //If user completes a sequence of food
        currentTime += 5;
        grow = 3;
        powerup_exist = 0;
        spawn_colors();
        spawnFood();
        for(let i =0; i < food.length; i++){
            htmlMarkup+=`<div style="grid-area: ${food[i][1]}/ ${food[i][0]}; background-color: #${color_sequence[i]} "> </div>`;
        }
      
    }
    //Checking if obstacle hit any snake
    for(let i =0; i < snakeBody1.length ; i++){
        if(JSON.stringify(ob_x) === JSON.stringify(snakeBody1[i][0]) && JSON.stringify(ob_y) === JSON.stringify(snakeBody1[i][1])){
            gameOver = true;
            handleGameOver();
        }
    }
    for(let i =0; i < snakeBody2.length ; i++){
        if(JSON.stringify(ob_x) === JSON.stringify(snakeBody2[i][0]) && JSON.stringify(ob_y) === JSON.stringify(snakeBody2[i][1])){
            gameOver = true;
            handleGameOver();
        }
    }
    
    
    
    for(let i = snakeBody1.length -1; i> 0; i-- ){
        snakeBody1[i] = snakeBody1[i-1];      //Snake body is travelling by shifting each cell to the next position
    }
    for(let i = snakeBody2.length -1; i> 0; i-- ){
        snakeBody2[i] = snakeBody2[i-1];      //Snake body is travelling by shifting each cell to the next position
    }
    
    snakeX1 += velocityX1;
    snakeY1 += velocityY1; 
    snakeBody1[0] = [snakeX1,snakeY1];

    snakeX2 += velocityX2;
    snakeY2 += velocityY2; 
    snakeBody2[0] = [snakeX2,snakeY2];
    
    //If snake crashes into a wall
    if(snakeX1 < 0 || snakeX1 >grid_x || snakeY1 < 0 || snakeY1 > grid_y){
        gameOver = true;
        handleGameOver();
    }
    if(snakeX2 < 0 || snakeX2 >grid_x || snakeY2 < 0 || snakeY2 > grid_y){
        gameOver = true;
        handleGameOver();
    }

    htmlMarkup += `<div class ="head" style="grid-area: ${snakeBody1[0][1]}/ ${snakeBody1[0][0]}"> </div>`;
    htmlMarkup += `<div class ="head" style="grid-area: ${snakeBody2[0][1]}/ ${snakeBody2[0][0]}"> </div>`;

    //Updating the snake array on the grid
    for(let i =1; i < snakeBody1.length; i++){
         
        htmlMarkup += `<div class ="snake_body" style="grid-area: ${snakeBody1[i][1]}/ ${snakeBody1[i][0]}"> </div>`;

        if(i!== 0 && snakeBody1[0][1] === snakeBody1[i][1] && snakeBody1[0][0] === snakeBody1[i][0]){
            
            gameOver = true;
        }
    } 
    for(let i =1; i < snakeBody2.length; i++){
         
        htmlMarkup += `<div class ="snake_body" style="grid-area: ${snakeBody2[i][1]}/ ${snakeBody2[i][0]}"> </div>`;

        if(i!== 0 && snakeBody2[0][1] === snakeBody2[i][1] && snakeBody2[0][0] === snakeBody2[i][0]){
            
            gameOver = true;
        }
    } 
    playBoard.innerHTML = htmlMarkup;

}




start_modal.showModal()
document.addEventListener("keydown", changeDirection);


