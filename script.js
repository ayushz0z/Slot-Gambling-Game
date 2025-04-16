// Game state
const gameState = {
    balance: 1000,
    currentUser: null
};

function $(id) {
    return document.getElementById(id);
}

// DOM Elements - Auth
const authContainer = $('auth-container');
const loginTab = $('login-tab');
const registerTab = $('register-tab');
const loginForm = $('login-form');
const registerForm = $('register-form');
const loginButton = $('login-button');
const registerButton = $('register-button');
const loginError = $('login-error');
const registerError = $('register-error');
const logoutButton = $('logout-button');

// DOM Elements - Game
const gameContainer = $('game-container');

// =====================
// AUTH FUNCTIONALITY
// =====================

// Switch between login and register tabs
loginTab.addEventListener('click', () => {
    loginTab.classList.add('text-gray-800', 'bg-gray-100');
    loginTab.classList.remove('text-gray-500');
    registerTab.classList.add('text-gray-500');
    registerTab.classList.remove('text-gray-800', 'bg-gray-100');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginError.classList.add('hidden');
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('text-gray-800', 'bg-gray-100');
    registerTab.classList.remove('text-gray-500');
    loginTab.classList.add('text-gray-500');
    loginTab.classList.remove('text-gray-800', 'bg-gray-100');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    registerError.classList.add('hidden');
});

// Login functionality
loginButton.addEventListener('click', () => {
    const username = $('login-username').value;
    const password = $('login-password').value;
    
    if (!username || !password) {
        showError(loginError, 'Please enter both username and password');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('casinoUsers') || '{}');
    
    if (!users[username] || users[username].password !== password) {
        showError(loginError, 'Invalid username or password');
        return;
    }
    
    // Login successful
    gameState.currentUser = username;
    updateGameStateFromStorage();
    localStorage.setItem('casinoCurrentUser', username);
    showGameInterface();
});

// Register functionality
registerButton.addEventListener('click', () => {
    const username = $('register-username').value;
    const password = $('register-password').value;
    const confirm = $('register-confirm').value;
    
    if (!username || !password || !confirm) {
        showError(registerError, 'Please fill in all fields');
        return;
    }
    
    if (password !== confirm) {
        showError(registerError, 'Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        showError(registerError, 'Password must be at least 6 characters');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('casinoUsers') || '{}');
    
    if (users[username]) {
        showError(registerError, 'Username already exists');
        return;
    }
    
    // Registration successful
    users[username] = {
        username,
        password,
        balance: 1000,
    };
    
    localStorage.setItem('casinoUsers', JSON.stringify(users));
    
    // Auto login
    gameState.currentUser = username;
    localStorage.setItem('casinoCurrentUser', username);
    showGameInterface();
});

// Logout functionality
logoutButton.addEventListener('click', () => {
    saveGameState();
    gameState.currentUser = null;
    localStorage.removeItem('casinoCurrentUser');
    showAuthInterface();
});

// Show error message
function showError(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
}

// =====================
// GAME FUNCTIONALITY
// =====================

// Initialize the game
function initGame() {
    const currentUser = localStorage.getItem('casinoCurrentUser');
    
    if (currentUser) {
        gameState.currentUser = currentUser;
        updateGameStateFromStorage();
        showGameInterface();
    } else {
        showAuthInterface();
    }
}

// Update gameState from localStorage
function updateGameStateFromStorage() {
    const users = JSON.parse(localStorage.getItem('casinoUsers') || '{}');
    const user = users[gameState.currentUser];
    
    if (user) {
        gameState.balance = user.balance;
    }
}

// Save gameState to localStorage
function saveGameState() {
    const users = JSON.parse(localStorage.getItem('casinoUsers') || '{}');
    
    users[gameState.currentUser] = {
        ...users[gameState.currentUser],
        balance: gameState.balance,
    };
    
    localStorage.setItem('casinoUsers', JSON.stringify(users));
}

// Show game interface
function showGameInterface() {
    authContainer.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    gameContainer.classList.add('flex');
}

// Show auth interface
function showAuthInterface() {
    gameContainer.classList.add('hidden');
    gameContainer.classList.remove('flex');
    authContainer.classList.remove('hidden');
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);