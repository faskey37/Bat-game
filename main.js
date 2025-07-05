class Game {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.ctx = context;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.baseHeight = 720;
    this.ratio = this.height / this.baseHeight;
    this.background = new Background(this);
    this.player = new Player(this);
    this.sound = new AudioControl();
    this.obstacle = [];
    this.numberOfObstacles = 20;
    this.gravity;
    this.speed;
    this.minSpeed;
    this.maxSpeed;
    this.score;
    this.gameOver;
    this.bottomMargin;
    this.timer;
    this.message1;
    this.message2;
    this.smallFont;
    this.largeFont;
    this.eventTimer = 0;
    this.eventInterval = 150;
    this.eventUpdate = false;
    this.touchStartX;
    this.swipeDistance = 50;
    this.debug = false;
    this.restartButton = document.getElementById("restartButton");
    this.fullScreenButton = document.getElementById("fullScreenButton");

    this.resize(window.innerWidth, window.innerHeight);

    window.addEventListener("resize", (e) => {
      this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
    });
    // mouse controls
    this.canvas.addEventListener("mousedown", (e) => {
      this.player.flap();
    });
    this.canvas.addEventListener("mousedup", (e) => {
      this.player.flap();
      setTimeout(() => {
        this.player.wingsUp;
      }, 50);
    });
    //keyboard controls
    window.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") this.player.flap();
      if (e.key === "Shift" || e.key.toLocaleLowerCase() === "c")
        this.player.startCharge();
    });
    this.canvas.addEventListener("keyup", (e) => {
      this.player.wingsUp;
    });
   // In your Game class constructor:
constructor(canvas) {
    // ... existing code ...
    
    // Touch control variables
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.swipeThreshold = 50; // Minimum swipe distance in pixels
    this.tapThreshold = 10; // Max movement to consider as tap
    this.lastTapTime = 0;
    this.doubleTapDelay = 300; // ms
    
    // Touch event listeners
    this.setupTouchControls();
}

setupTouchControls() {
    // Prevent default touch behaviors
    this.canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });

    // Touch start
    this.canvas.addEventListener('touchstart', (e) => {
        const touch = e.changedTouches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        
        // Handle double tap
        const currentTime = new Date().getTime();
        if (currentTime - this.lastTapTime < this.doubleTapDelay) {
            this.player.flap();
            this.player.flap(); // Double flap for double tap
        }
        this.lastTapTime = currentTime;
    });

    // Touch end
    this.canvas.addEventListener('touchend', (e) => {
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // If it's a tap (small movement)
        if (distance < this.tapThreshold) {
            this.player.flap();
        }
        // If it's a swipe up
        else if (deltaY < -this.swipeThreshold && Math.abs(deltaX) < this.swipeThreshold) {
            this.player.flap();
        }
        // If it's a swipe down
        else if (deltaY > this.swipeThreshold && Math.abs(deltaX) < this.swipeThreshold) {
            this.player.dive(); // Add dive method to Player class if needed
        }
    });
}
  }
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    //this.ctx.fillStyle = 'blue';
    this.ctx.textAlign = "right";
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "white";
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ratio = this.height / this.baseHeight;

    this.bottomMargin = Math.floor(50 * this.ratio);
    this.largeFont = Math.ceil(45 * this.ratio);
    this.smallFont = Math.ceil(20 * this.ratio);
    this.ctx.font = this.smallFont + "px Bungee Inline";
    this.gravity = 0.15 * this.ratio;
    this.speed = 2 * this.ratio;
    this.minSpeed = this.speed;
    this.maxSpeed = this.speed * 5;
    this.background.resize();
    this.player.resize();
    this.createObstacles();
    this.obstacle.forEach((obstacle) => {
      obstacle.resize();
    });
    this.score = 0;
    this.gameOver = false;
    this.timer = 0;
  }
  render(deltaTime) {
    if (!this.gameOver) this.timer += deltaTime;
    this.handlePeriodicEvents(deltaTime);
    this.background.update();
    this.background.draw();
    this.drwaStatusText();
    this.player.update();
    this.player.draw();
    this.obstacle.forEach((obstacle) => {
      obstacle.update();
      obstacle.draw();
    });
  }
  createObstacles() {
    this.obstacle = [];
    const firstX = this.baseHeight * this.ratio;
    const obstacleSpacing = 600 * this.ratio;
    for (let i = 0; i < this.numberOfObstacles; i++) {
      this.obstacle.push(new Obstacle(this, firstX + i * obstacleSpacing));
    }
  }
  checkCollision(a, b) {
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;
    const distance = Math.hypot(dx, dy);
    const sumOfRadii = a.collisionRadius + b.collisionRadius;
    return distance <= sumOfRadii;
  }
  formatTimer() {
    return (this.timer * 0.001).toFixed(1);
  }
  handlePeriodicEvents(deltaTime) {
    if (this.eventTimer < this.eventInterval) {
      this.eventTimer += deltaTime;
      this.eventUpdate = false;
    } else {
      this.eventTimer = this.eventTimer % this.eventInterval;
      this.eventUpdate = true;
    }
  }
  triggerGameOver() {
    if (!this.gameOver) {
      this.gameOver = true;
      if (this.obstacle.length <= 0) {
        this.sound.play(this.sound.win);
        this.message1 = "You Are Brave";
        this.message2 =
          "Can you do it faster than" + this.formatTimer() + "seconds?";
      } else {
        this.sound.play(this.sound.lose);
        this.message1 = "Getting Scared?";
        this.message2 = "Collision timme" + this.formatTimer() + "seconds!";
        console.log("Game Over Score ", this.score);
        document.getElementById('finalScore').val=this.score

      }
    }
  }
  drwaStatusText() {
    this.ctx.save();
    this.ctx.fillText(
      "Score: " + this.score,
      this.width - this.smallFont,
      this.largeFont
    );
    this.ctx.textAlign = "left";
    this.ctx.fillText(
      "Timer: " + this.formatTimer(),
      this.smallFont,
      this.largeFont
    );
    if (this.gameOver) {
      this.ctx.textAlign = "center";
      this.ctx.font = this.largeFont + " px Bungee Inline";
      this.ctx.fillText(
        this.message1,
        this.width * 0.5,
        this.height * 0.5 - this.largeFont,
        this.width
      );
      this.ctx.font = this.smallFont + "px Bungee Inline";
      this.ctx.fillText(
        this.message2,
        this.width * 0.5,
        this.height * 0.5 - this.smallFont,
        this.width
      );
      this.ctx.fillText(
        "Press 'R' to try again!",
        this.width * 0.5,
        this.height * 0.5,
        this.width
      );
    }
    if (this.player.energy <= this.player.minEnergy) this.ctx.fillStyle = "Red";
    else if (this.player.energy >= this.player.maxEnergy)
      this.ctx.fillStyle = "orange";
    for (let i = 0; i < this.player.energy; i++) {
      this.ctx.fillRect(
        10,
        this.height - 10 - this.player.barSize * i,
        this.player.barSize * 5,
        this.player.barSize
      );
    }
    this.ctx.restore();
  }
}

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 720;
  canvas.height = 720;
  const game = new Game(canvas, ctx);
    
  let lasTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lasTime;
    lasTime = timeStamp;
    const finalScore=document.getElementById('finalScore').val
    if(finalScore){
        game.score=finalScore;
    }
    console.log('Animate ', game.score)
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(deltaTime);
    requestAnimationFrame(animate);
     
  }
  requestAnimationFrame(animate);
});
