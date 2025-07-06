// menu.js - Standalone Menu System with Reset
document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const mainMenu = document.getElementById('mainMenu');
    const startButton = document.getElementById('startButton');
    const soundToggle = document.getElementById('soundToggle');
    const resetButton = document.getElementById('resetButton');
    const gameUI = document.getElementById('gameUI');
    
    // State
    let soundOn = true;
    let gameActive = false;

    // Initialize menu
    function initMenu() {
        // Set up event listeners
        startButton.addEventListener('click', startGame);
        soundToggle.addEventListener('click', toggleSound);
        resetButton.addEventListener('click', resetGame);
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'r' && gameActive) {
                resetGame();
            }
        });
    }

    function startGame() {
        mainMenu.classList.add('hidden');
        gameUI.classList.remove('hidden');
        resetButton.classList.remove('hidden');
        gameActive = true;
        
        // Dispatch event to start game
        document.dispatchEvent(new CustomEvent('gameStart'));
    }

    function resetGame() {
        if (!gameActive) return;
        
        // Dispatch event to reset game
        document.dispatchEvent(new CustomEvent('gameReset'));
        
        // Visual feedback
        resetButton.classList.add('pulse');
        setTimeout(() => resetButton.classList.remove('pulse'), 300);
    }

    function toggleSound() {
        soundOn = !soundOn;
        soundToggle.textContent = `SOUND: ${soundOn ? 'ON' : 'OFF'}`;
        document.dispatchEvent(new CustomEvent('soundToggle', { detail: soundOn }));
    }

    initMenu();
});