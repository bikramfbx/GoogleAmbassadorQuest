const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const GAME_WIDTH = 800;
const GAME_HEIGHT = 450;
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
ctx.imageSmoothingEnabled = false;

function resizeCanvas() {
  const titleHeight = 60;
  const aspect = GAME_WIDTH / GAME_HEIGHT;
  const availableWidth = window.innerWidth;
  const availableHeight = window.innerHeight - titleHeight;
  let newWidth = availableWidth;
  let newHeight = availableWidth / aspect;
  if (newHeight > availableHeight) {
    newHeight = availableHeight;
    newWidth = newHeight * aspect;
  }
  canvas.style.width = `${newWidth}px`;
  canvas.style.height = `${newHeight}px`;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();


const spriteImage = new Image();
spriteImage.src = "assets/sprite.png";
const orbImage = new Image();
orbImage.src = "assets/orb.png";
const bgImage = new Image();
bgImage.src = "assets/bg.png";


const infoBox = document.getElementById("infoBox");
const infoContent = document.getElementById("infoContent");
const closeInfo = document.getElementById("closeInfo");

closeInfo.addEventListener("click", () => {
  infoBox.classList.add("hidden");
  keys[" "] = false;
});


function gcd(a, b) {
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}


const WORLD_WIDTH = 800; 
const GROUND_HEIGHT = 48;
let cameraX = 0;


let bgTileWidth = 0;
let bgTileHeight = GAME_HEIGHT;


let frameWidth = 32;
let frameHeight = 32;
let columns = 4;
let rows = 2;
let totalFrames = columns * rows;
let frameIndex = 0;
let tick = 0;
const ANIM_SPEED = 10; 
const SCALE = 0.2; 

const player = {
  x: 100,
  speed: 2.2,
  moving: false,
  facing: 1 
};


const keys = {};
document.addEventListener("keydown", e => {
  keys[e.key] = true;
  if (["ArrowLeft", "ArrowRight", " ", "a", "A", "d", "D"].includes(e.key)) {
    e.preventDefault();
  }
});
document.addEventListener("keyup", e => {
  keys[e.key] = false;
});


const checkpoints = [
  { x: 200, image: "assets/aboutme.png", title: "About Me" },
  { x: 400, image: "assets/skills.png", title: "Skills" },
  { x: 600, image: "assets/whygoogle.png", title: "Why Google" }
];

let lastSpacePressTime = 0;
const SPACE_COOLDOWN = 200;

function getDialogText(title) {
  if (title === "About Me") {
    return "Hello Google, Bikram here! I'm a fresher who is extremely passionate about technology, Leadership, managerial roles and community building. studying BTECH CSE as a first year student, i wish to be a google ambassador to help my peers delve into the world of AI and its usage!.";
  } else if (title === "Skills") {
    return "I am an equivocal person with strong leadership and public speaking skills. Interacting with people and imparting knowledge about topics I am interested in has always been a passion of mine, which is why I feel that the Google Ambassador program will be the best option! Being an enthusiastic learner, I have just started learning WEBDEV, DSA, AI Prompt Engineering and am already familliar with SQL, Graphic Designing and 3D modelling. The mini game you see in front of you is a project created using the help of Google's very own Gemini AI! I hope this was a fun little experience for all who view this simple presentation.";
  } else if (title === "Why Google") {
    return "Google represents innovation and impact at scale. I have been using Google ever since I was a little child curious about how a simple search can give a plethora of curated answers, which is one of the reasons I got into computer engineering. Being able to work affiliated with the very platform which is still guiding me to evolve my skills is a dream of mine. Google has always focused on community and user service, which aligns with my will to be a leader and focus as a team!";
  }
  return "";
}

function update() {
  player.moving = false;

  if (keys["ArrowLeft"] || keys["a"] || keys["A"]) {
    player.x -= player.speed;
    player.facing = -1;
    player.moving = true;
  }
  if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
    player.x += player.speed;
    player.facing = 1;
    player.moving = true;
  }

  
  const maxX = WORLD_WIDTH - frameWidth * SCALE;
  if (player.x < 0) player.x = 0;
  if (player.x > maxX) player.x = maxX;

  
  if (player.moving) {
    tick++;
    if (tick % ANIM_SPEED === 0) {
      frameIndex = (frameIndex + 1) % totalFrames;
    }
  } else {
    frameIndex = 0; 
    tick = 0;
  }

  
  cameraX = 0;

  
  if (keys[" "] && Date.now() - lastSpacePressTime > SPACE_COOLDOWN) {
    
    if (!infoBox.classList.contains("hidden")) {
      infoBox.classList.add("hidden");
      lastSpacePressTime = Date.now();
      return;
    }

    const playerCenter = player.x + (frameWidth * SCALE) / 2;
    for (let i = 0; i < checkpoints.length; i++) {
      const cp = checkpoints[i];
      if (Math.abs(playerCenter - cp.x) < 50) {
        infoContent.innerHTML = `<h3>${cp.title}</h3><p>${getDialogText(cp.title)}</p>`;
        infoBox.classList.remove("hidden");
        lastSpacePressTime = Date.now();
        break;
      }
    }
  }
}

function drawBackground() {
  if (!bgTileWidth) return; 
  
  ctx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height, 0, 0, bgTileWidth, bgTileHeight);
}

function drawGround() {
  ctx.fillStyle = "#1a1d29";
  ctx.fillRect(0, GAME_HEIGHT - GROUND_HEIGHT, GAME_WIDTH, GROUND_HEIGHT);
  ctx.fillStyle = "#0f1220";
  for (let i = 0; i < GAME_WIDTH; i += 16) {
    ctx.fillRect(i, GAME_HEIGHT - GROUND_HEIGHT, 8, 4);
  }
}

function drawOrb(cp) {
  const orbSize = 32; 
  const screenX = Math.floor(cp.x - cameraX - orbSize/2);
  // Raise the orb higher by increasing the offset from the ground
  const baseY = GAME_HEIGHT - GROUND_HEIGHT - orbSize - 32; // was - orbSize, now - orbSize - 32

  const bob = Math.sin((Date.now() / 300 + cp.x) % (Math.PI * 2)) * 3;
  ctx.drawImage(orbImage, 0, 0, orbImage.width, orbImage.height, screenX, Math.floor(baseY + bob), orbSize, orbSize);

  const playerCenter = player.x + (frameWidth * SCALE) / 2;
  if (Math.abs(playerCenter - cp.x) < 60) {
    const previewImg = new Image();
    previewImg.src = cp.image;
    if (previewImg.complete && previewImg.naturalWidth > 0) {
      const imgWidth = 120;
      const imgHeight = 90;
      const imgX = screenX + orbSize/2 - imgWidth/2;
      // Raise the preview image and SPACE text higher as well
      const imgY = baseY - imgHeight - 40; // was -20, now -40
      ctx.drawImage(previewImg, imgX, imgY, imgWidth, imgHeight);
      ctx.font = "10px 'Press Start 2P'";
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffff00";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.strokeText("SPACE", imgX + imgWidth/2, imgY + imgHeight + 15);
      ctx.fillText("SPACE", imgX + imgWidth/2, imgY + imgHeight + 15);
    }
  }
}

function drawPlayer() {
  const screenX = Math.floor(player.x - cameraX);
  const charY = GAME_HEIGHT - GROUND_HEIGHT - Math.floor(frameHeight * SCALE) + 4; 
  const col = frameIndex % columns;
  // Use row 0 for right, row 1 for left
  const row = player.facing === 1 ? 0 : 1;
  const sx = col * frameWidth;
  const sy = row * frameHeight;
  const dw = Math.floor(frameWidth * SCALE);
  const dh = Math.floor(frameHeight * SCALE);

  ctx.drawImage(
    spriteImage,
    sx, sy, frameWidth, frameHeight,
    screenX, charY, dw, dh
  );
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawGround();

  
  for (let i = 0; i < checkpoints.length; i++) drawOrb(checkpoints[i]);

  
  drawPlayer();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}


let assetsLoaded = 0;
function onAssetLoaded() {
  assetsLoaded++;
  if (assetsLoaded === 3) {
    
    columns = 4;
    rows = 2;
    totalFrames = columns * rows;
    frameWidth = Math.floor(spriteImage.width / columns);
    frameHeight = Math.floor(spriteImage.height / rows);

    
    bgTileWidth = Math.floor(bgImage.width * (GAME_HEIGHT / bgImage.height));
    bgTileHeight = GAME_HEIGHT;

    gameLoop();
  }
}

spriteImage.onload = onAssetLoaded;
orbImage.onload = onAssetLoaded;
bgImage.onload = onAssetLoaded;
