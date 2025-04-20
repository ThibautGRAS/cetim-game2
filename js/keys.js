// Gestion des touches du clavier
window.keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Écouteurs d'événements pour les touches
window.addEventListener('keydown', (event) => {
    if (window.keys.hasOwnProperty(event.key)) {
        window.keys[event.key] = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (window.keys.hasOwnProperty(event.key)) {
        window.keys[event.key] = false;
    }
});