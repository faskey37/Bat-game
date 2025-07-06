// menu.js - Standalone Menu System
document.addEventListener('DOMContentLoaded', () => {
    // Get menu elements
    const mainMenu = document.getElementById('mainMenu');
    const startButton = document.getElementById('startButton');
    const soundToggle = document.getElementById('soundToggle');
    const gameUI = document.getElementById('gameUI');
    
    // Menu state
    let soundOn = true;
    
    // Initialize menu
    function initMenu() {
        // Show main menu, hide game UI
        mainMenu.classList.remove('hidden');
        gameUI.classList.add('hidden');
        
        // Set up event listeners
        startButton.addEventListener('click', startGame);
        soundToggle.addEventListener('click', toggleSound);
    }
    
    // Start game function
    function startGame() {
        // Hide menu, show game UI
        mainMenu.classList.add('hidden');
        gameUI.classList.remove('hidden');
        
        // Dispatch custom event to notify game to start
        const gameStartEvent = new CustomEvent('gameStart');
        document.dispatchEvent(gameStartEvent);
    }
    
    // Sound toggle function
    function toggleSound() {
        soundOn = !soundOn;
        soundToggle.textContent = `SOUND: ${soundOn ? 'ON' : 'OFF'}`;
        
        // Dispatch custom event for sound change
        const soundEvent = new CustomEvent('soundToggle', { detail: soundOn });
        document.dispatchEvent(soundEvent);
    }
    
    // Initialize the menu
    initMenu();
});