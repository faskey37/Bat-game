// menu.js - Enhanced Menu System
document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const gameMenu = document.getElementById('gameMenu');
    const mainMenu = document.getElementById('mainMenu');
    const pauseMenu = document.getElementById('pauseMenu');
    const gameOverMenu = document.getElementById('gameOverMenu');
    
    const startButton = document.getElementById('startButton');
    const resumeButton = document.getElementById('resumeButton');
    const restartButtons = document.querySelectorAll('[id^="restartButton"]');
    const menuButtons = document.querySelectorAll('[id^="menuButton"]');
    const soundToggle = document.getElementById('soundToggle');
    const fullscreenButton = document.getElementById('fullscreenButton');
    
    const finalScoreText = document.getElementById('finalScoreText');
    const finalTimeText = document.getElementById('finalTimeText');

    // State
    let soundOn = true;
    let gameActive = false;
    let gamePaused = false;

    // Initialize menu
    function initMenu() {
        // Set up event listeners
        startButton.addEventListener('click', startGame);
        resumeButton.addEventListener('click', resumeGame);
        restartButtons.forEach(btn => btn.addEventListener('click', restartGame));
        menuButtons.forEach(btn => btn.addEventListener('click', returnToMenu));
        soundToggle.addEventListener('click', toggleSound);
        fullscreenButton.addEventListener('click', toggleFullscreen);
        
        // Keyboard controls
        document.addEventListener('keydown', handleKeyEvents);
    }

    function startGame() {
        hideAllMenus();
        gameActive = true;
        gamePaused = false;
        document.dispatchEvent(new CustomEvent('gameStart'));
    }

    function pauseGame() {
        if (!gameActive) return;
        gamePaused = true;
        showPauseMenu();
        document.dispatchEvent(new CustomEvent('gamePause'));
    }

    function resumeGame() {
        gamePaused = false;
        hideAllMenus();
        document.dispatchEvent(new CustomEvent('gameResume'));
    }

    function restartGame() {
        hideAllMenus();
        document.dispatchEvent(new CustomEvent('gameReset'));
        startGame();
    }

    function returnToMenu() {
        hideAllMenus();
        mainMenu.classList.remove('hidden');
        gameActive = false;
        document.dispatchEvent(new CustomEvent('gameMenu'));
    }

    function showGameOver(score, time) {
        finalScoreText.textContent = `Score: ${score}`;
        finalTimeText.textContent = `Time: ${time}s`;
        hideAllMenus();
        gameOverMenu.classList.remove('hidden');
    }

    function toggleSound() {
        soundOn = !soundOn;
        soundToggle.textContent = `SOUND: ${soundOn ? 'ON' : 'OFF'}`;
        document.dispatchEvent(new CustomEvent('soundToggle', { detail: soundOn }));
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            fullscreenButton.textContent = 'EXIT FULLSCREEN';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                fullscreenButton.textContent = 'FULLSCREEN';
            }
        }
    }

    function handleKeyEvents(e) {
        if (e.key.toLowerCase() === 'escape') {
            if (gameActive && !gamePaused) {
                pauseGame();
            } else if (gamePaused) {
                resumeGame();
            }
        }
        
        if (e.key.toLowerCase() === 'r' && gameActive && !gamePaused) {
            restartGame();
        }
    }

    function hideAllMenus() {
        document.querySelectorAll('.menu-section').forEach(menu => {
            menu.classList.add('hidden');
        });
    }

    function showPauseMenu() {
        hideAllMenus();
        pauseMenu.classList.remove('hidden');
    }

    // Public API
    window.menuSystem = {
        showGameOver,
        toggleSound
    };

    initMenu();
});