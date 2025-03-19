const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const retryButton = document.getElementById("retryButton");
const mapSelection = document.getElementById("mapSelection");

let birds = {
    red: { src: "https://i.postimg.cc/tRK9FjpK/254-2543622-super-red-sideways-copy-angry-birds-red-sideways-Photoroom.png", speed: 3.5 },
    chuck: { src: "https://i.postimg.cc/15NSCp9v/image-Photoroom-2.png", speed: 4.5 },
    bubbles: { src: "https://i.postimg.cc/Hnn6Z4X3/image-Photoroom-3.png", speed: 2.5 }
};

let scoreColors = { red: "red", chuck: "yellow", bubbles: "orange" };

let backgrounds = {
    forest: "https://i.postimg.cc/dQ6FgHFt/forest-bg.png",
    ocean: "https://i.postimg.cc/25Dkxd0v/beach-bg.png",
    cave: "https://i.postimg.cc/YCLw5vpD/bg-caves.png",
    grassland: "https://i.postimg.cc/8zLkjTcC/underground-bg.png",
    pond: "https://i.postimg.cc/Zn2LC8RX/pond-bg.png",
    snow: "https://i.postimg.cc/wT2kXHgQ/bg-snow.png"
};

let bgImg = new Image();
let birdImg = new Image();
let birdType = 'red';
let bird, pipes, score, gameOver;

function setMap(map) {
    bgImg.src = backgrounds[map];
}

function setBird(type) {
    birdType = type;
    birdImg.src = birds[type].src;
    mapSelection.style.display = "none";
    initGame();
}

function showMapSelection() {
    mapSelection.style.display = "block";
    retryButton.style.display = "none";
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initGame() {
    resizeCanvas();
    bird = { 
        x: 50, 
        y: 80, 
        width: birdType === 'bubbles' ? 80 : 60, 
        height: birdType === 'bubbles' ? 56 : 42, 
        velocity: 0, 
        gravity: 0.1, 
        lift: -birds[birdType].speed 
    };
    pipes = [];
    score = 0;
    gameOver = false;
    retryButton.style.display = "none";
    requestAnimationFrame(gameLoop);
}

function isColliding(bird, pipe) {
    return (
        bird.x + bird.width > pipe.x && 
        bird.x < pipe.x + pipe.width && 
        (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    );
}

function updateGame() {
    if (gameOver) return;
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        gameOver = true;
        retryButton.style.display = "block";
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].x < 500) {
        let pipeHeight = Math.random() * (canvas.height / 2) + 50;
        pipes.push({ x: canvas.width, width: 50, top: pipeHeight, bottom: pipeHeight + 140 });
    }

    pipes.forEach(pipe => {
        pipe.x -= 6;
        if (pipe.x + pipe.width < 0) {
            pipes.shift();
            score++;
        }
        if (isColliding(bird, pipe)) {
            gameOver = true;
            retryButton.style.display = "block";
        }
    });
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    
    pipes.forEach(pipe => {
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
    });

    // Display Score
    ctx.fillStyle = scoreColors[birdType];
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, canvas.width / 2 - 50, 50);
}

function gameLoop() {
    updateGame();
    drawGame();
    if (!gameOver) requestAnimationFrame(gameLoop);
}

window.addEventListener("resize", resizeCanvas);
document.addEventListener("keydown", () => bird.velocity = bird.lift);
mapSelection.style.display = "block";
