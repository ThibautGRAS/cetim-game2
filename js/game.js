class Game {
    constructor() {
        console.log('Game constructor called');
        
        // Initialiser le canvas
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) {
            throw new Error('Canvas element not found!');
        }
        this.ctx = this.canvas.getContext('2d');
        
        // Ajuster le canvas au démarrage
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas()); // Redimensionner sur changement de taille

        // Initialiser le joueur avec une vitesse de base
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            size: 20,
            baseSpeed: 5
        };
        
        // Initialiser les variables du jeu
        this.character = null;
        this.projectHours = 0;
        this.overhead = 0;
        this.currentLevel = null;
        this.levelIndex = 0;
        this.isFirstPlay = true;
        this.isRestartingLevel = false; // Indique si le niveau est redémarré
        
        // Configurer les écouteurs d'événements
        this.setupEventListeners();
        
        console.log('Game initialized successfully');
    }

    resizeCanvas() {
        const aspectRatio = 16 / 9;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (windowWidth / windowHeight > aspectRatio) {
            // Trop large, ajuster la largeur
            this.canvas.height = windowHeight;
            this.canvas.width = windowHeight * aspectRatio;
        } else {
            // Trop haut, ajuster la hauteur
            this.canvas.width = windowWidth;
            this.canvas.height = windowWidth / aspectRatio;
        }

        console.log(`Canvas resized to: ${this.canvas.width}x${this.canvas.height}`);
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        // Écouteurs pour les cartes de personnages
        const cards = document.querySelectorAll('.character-card');
        if (!cards.length) {
            console.error('No character cards found!');
            return;
        }
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const characterType = card.id;
                console.log('Character card clicked:', characterType);
                this.selectCharacter(characterType);
            });
        });

        // Écouteur pour le bouton de redémarrage
        const restartButton = document.getElementById('restart-button');
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                console.log('Restart button clicked');
                this.restartGame();
            });
        }
    }

    restartGame() {
        console.log('Restarting game...');
        this.isRestartingLevel = false; // Réinitialiser l'état de redémarrage
        // Réinitialiser les variables du jeu
        this.projectHours = 0;
        this.overhead = 0;
        this.isFirstPlay = false;
        
        // Arrêter et détruire le niveau actuel
        if (this.currentLevel) {  // Changé de this.level à this.currentLevel
            this.currentLevel.stop();
            this.currentLevel = null;
        }
        
        // Réinitialiser la position du joueur
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            size: 20,
            baseSpeed: 5,
            speed: this.character ? 5 * this.character.vitesse : 5 // Recalculer la vitesse
        };
        
        // Supprimer le HUD s'il existe
        const hud = document.getElementById('hud');
        if (hud) {
            document.body.removeChild(hud);
        }
        
        // Afficher l'écran de sélection des personnages
        this.showScreen('character-selection');
    }

    restartLevel(levelNumber) {
        console.log('Restarting level', levelNumber);
        this.isRestartingLevel = true;  // Marquer comme redémarrage
        this.startLevel(levelNumber);
    }

    selectCharacter(characterType) {
        console.log('Selecting character:', characterType);
        this.character = window.selectCharacter(characterType);
        if (!this.character) {
            console.error('Failed to select character:', characterType);
            return;
        }
        console.log('Character selected successfully:', this.character);
        
        // Afficher l'écran de jeu
        // Masquer tous les écrans
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
            screen.classList.remove('active');
        });
        // Afficher l'écran de jeu
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) {
            gameScreen.style.display = '';
            gameScreen.classList.add('active');
        }
        
        // Démarrer le niveau 1
        this.startLevel(1);
        
        // Démarrer la boucle de jeu
        this.gameLoop();
    }

    startLevel(levelNumber) {
        console.log('Starting level', levelNumber);
        
        // Arrêter le niveau actuel s'il existe
        if (this.currentLevel) {
            this.currentLevel.stop();
        }
        
        // Mettre à jour la vitesse du joueur en fonction du redémarrage
        let speedMultiplier = this.isRestartingLevel ? 10 : 1;
        this.player.speed = this.character.vitesse * this.player.baseSpeed * speedMultiplier;
        
        // Créer et démarrer le nouveau niveau
        switch(levelNumber) {
            case 1:
                this.currentLevel = new Level1(this);
                break;
            case 2:
                this.currentLevel = new Level2(this);
                break;
            case 3:
                this.currentLevel = new Level3(this);
                break;
        }
        
        if (this.currentLevel) {
            this.currentLevel.start();
            console.log(`Level ${levelNumber} started successfully with character:`, this.character);
            // Réinitialiser isRestartingLevel après le démarrage
            this.isRestartingLevel = false;
            // Relancer la boucle de jeu à chaque changement de niveau
            this.gameLoop();
        }
    }

    gameLoop() {
        if (this.currentLevel && this.currentLevel.isRunning) {  // Changé de this.level à this.currentLevel
            this.currentLevel.update();
            this.currentLevel.draw();
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    showScreen(screenId) {
        console.log('Showing screen:', screenId);
        // Cacher tous les écrans
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Afficher l'écran demandé
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
        } else {
            console.error('Screen not found:', screenId);
        }
    }
}

// Suppression de l'initialisation automatique
console.log('Game script loaded');