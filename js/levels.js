class Level {
    constructor(canvas, character) {
        if (!canvas) throw new Error('Canvas is required for Level');
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.character = character;
        this.projectHours = 0;
        this.overhead = 0;
        this.isRunning = false;
        this.isComplete = false;
        this.timeLeft = 5;
        this.hasStarted = false;
        this.rulesPanel = null;
        this.hud = null;
        this.lastUpdateTime = 0;
    }

    start() {
        this.isRunning = true;
        this.isComplete = false;
        this.projectHours = 0;
        this.overhead = 0;
        this.timeLeft = 5;
        this.hasStarted = false;
        this.lastUpdateTime = Date.now();
        this.removeHUD();
        this.showRules();
    }

    stop() {
        // Arrêter le niveau proprement
        this.isRunning = false;
        this.isComplete = false;
        this.hideRules();
        this.removeHUD();
        // Ajoutez ici d'autres nettoyages si besoin
    }

    showRules() {
        this.rulesPanel = document.createElement('div');
        this.rulesPanel.className = 'rules-panel';
        this.rulesPanel.innerHTML = `
            <h2>Règles du niveau</h2>
            <div class="rules-content">
                ${this.getRulesContent()}
            </div>
            <p class="start-hint">Appuyez sur une touche de direction pour commencer</p>
        `;
        // Ajoute le style si besoin
        if (!document.getElementById('rules-panel-style')) {
            const style = document.createElement('style');
            style.id = 'rules-panel-style';
            style.textContent = `
                .rules-panel {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    z-index: 100;
                }
                .rules-content {
                    margin: 20px 0;
                }
                .start-hint {
                    color: #ffcc00;
                    font-style: italic;
                }
            `;
            document.head.appendChild(style);
        }
        document.body.appendChild(this.rulesPanel);
    }

    hideRules() {
        if (this.rulesPanel) {
            document.body.removeChild(this.rulesPanel);
            this.rulesPanel = null;
        }
    }

    getRulesContent() {
        return "Ramassez les boules dorées pour accumuler des heures projet. Attention aux frais généraux !";
    }

    showHUD() {
        if (this.hud) this.removeHUD();
        this.hud = document.createElement('div');
        this.hud.id = 'hud';
        this.hud.innerHTML = `
            <div class="hud-item">
                <span class="hud-label">Temps restant:</span>
                <span class="hud-value" id="time-left">${this.timeLeft.toFixed(1)}</span>
            </div>
            <div class="hud-item">
                <span class="hud-label">Heures projet:</span>
                <span class="hud-value" id="project-hours">${this.projectHours.toFixed(1)}</span>
            </div>
            <div class="hud-item">
                <span class="hud-label">Frais généraux:</span>
                <span class="hud-value" id="overhead">${this.overhead.toFixed(1)}</span>
            </div>
        `;
        document.body.appendChild(this.hud);
    }

    removeHUD() {
        if (this.hud && this.hud.parentNode) {
            this.hud.parentNode.removeChild(this.hud);
            this.hud = null;
        }
    }

    updateHUD() {
        if (!this.hud) return;
        const projectHoursElement = document.getElementById('project-hours');
        const overheadElement = document.getElementById('overhead');
        if (projectHoursElement) projectHoursElement.textContent = this.projectHours.toFixed(1);
        if (overheadElement) overheadElement.textContent = this.overhead.toFixed(1);
        const timeLeftElement = document.getElementById('time-left');
        if (timeLeftElement) timeLeftElement.textContent = this.timeLeft.toFixed(1);
    }

    update() {
        // ... (reprends ici tout le code de update de ta version précédente)
    }

    draw() {
        // ... (reprends ici tout le code de draw de ta version précédente)
    }

    getSphereColor() {
        // ... (reprends ici tout le code de getSphereColor de ta version précédente)
    }

    getPlayerImage() {
        // ... (reprends ici tout le code de getPlayerImage de ta version précédente)
    }
}

class Level1 extends Level {
    constructor(game) {
        if (!game || !game.canvas || !game.character) {
            throw new Error('Game, canvas, and character are required for Level1');
        }
        super(game.canvas, game.character);
        this.game = game;
        this.goldenBalls = [];
        this.hasStarted = false;
        this.baseSpeed = 5; // Vitesse de base pour le niveau 1
        this.playerFrame = 0; // 0 ou 1 pour l'animation
        this.playerFrameTimer = 0;
        this.playerFrameDuration = 120; // ms entre frames
        this.playerAnimChecked = false; // Vérification unique des images
        this.playerHasAnim = false; // Indique si les images existent
        this.playerAnimFolder = this.getPlayerAnimFolder();
        this.bgAudio = null; // Ajout du fond sonore
        console.log('Level1 initialized with speed:', this.baseSpeed, 'for character:', this.character.name, 'vitesse:', this.character.vitesse, 'baseSpeed:', this.baseSpeed);
    }

    getPlayerAnimFolder() {
        // Ex: Junior -> 'junior'
        const name = this.character.name.toLowerCase();
        if (name === 'spécialiste' || name === 'specialiste') return 'specialiste';
        if (name === 'référent' || name === 'referent') return 'referent';
        if (name === 'expert') return 'expert';
        return name;
    }

    checkPlayerAnimImages() {
        // Vérifie une seule fois si les deux images existent, sans bloquer le jeu
        if (this.playerAnimChecked) return;
        this.playerAnimChecked = true;
        const folder = this.playerAnimFolder;
        let loaded = 0, ok = true;
        const onDone = () => {
            loaded++;
            if (loaded === 2) this.playerHasAnim = ok;
        };
        const img1 = new window.Image();
        img1.onload = onDone;
        img1.onerror = () => { ok = false; onDone(); };
        img1.src = `images/${folder}/f1.png`;
        const img2 = new window.Image();
        img2.onload = onDone;
        img2.onerror = () => { ok = false; onDone(); };
        img2.src = `images/${folder}/f2.png`;
    }

    start() {
        if (!this.canvas) {
            throw new Error('Canvas not initialized in Level1');
        }
        super.start();
        this.goldenBalls = [];
        this.projectHours = 0;
        this.overhead = 0;
        this.timeLeft = 5;
        this.hasStarted = false;
        this.isRunning = true;
        this.isComplete = false;
        this.lastUpdateTime = Date.now();
        
        // Toujours recalculer la vitesse à partir des stats du personnage
        this.playerSpeed = this.baseSpeed * this.character.vitesse;
        console.log('Level1 started with speed:', this.playerSpeed, 'for character:', this.character.name, 'vitesse:', this.character.vitesse, 'baseSpeed:', this.baseSpeed);
        
        // Réinitialiser la position du joueur
        this.game.player.x = this.canvas.width / 2;
        this.game.player.y = this.canvas.height / 2;
        
        this.spawnGoldenBalls();

        // --- Ajout du fond sonore ---
        if (!this.bgAudio) {
            this.bgAudio = new Audio('images/L1/sound2.mp4');
            this.bgAudio.loop = true;
            this.bgAudio.volume = 0.5;
        }
        this.bgAudio.currentTime = 0;
        this.bgAudio.play().catch(() => {});
    }

    stop() {
        super.stop();
        // --- Arrêt du fond sonore ---
        if (this.bgAudio) {
            this.bgAudio.pause();
            this.bgAudio.currentTime = 0;
        }
    }

    spawnGoldenBalls() {
        // Créer 20 boules au début, bien éparpillées
        const gridSize = 4; // 4x4 grid
        const cellWidth = this.canvas.width / gridSize;
        const cellHeight = this.canvas.height / gridSize;
        
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                // Ajouter 1-2 boules par cellule
                const ballsInCell = Math.floor(Math.random() * 2) + 1;
                for (let k = 0; k < ballsInCell; k++) {
                    this.goldenBalls.push({
                        x: (i * cellWidth) + (Math.random() * cellWidth * 0.8) + (cellWidth * 0.1),
                        y: (j * cellHeight) + (Math.random() * cellHeight * 0.8) + (cellHeight * 0.1),
                        size: 15
                    });
                }
            }
        }
    }

    checkCollision(player, ball) {
        if (this.character.name === 'Junior') {
            // Collision ellipse pour l'image redimensionnée
            const rx = player.size * 3 / 2;
            const ry = player.size * 4.5 / 2;
            const dx = player.x - ball.x;
            const dy = player.y - ball.y;
            // Test d'inclusion dans l'ellipse + rayon de la boule
            return ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry)) <= Math.pow(1 + ball.size / Math.max(rx, ry), 2);
        } else {
            // Collision classique cercle
            const playerRadius = player.size / 2;
            const distance = Math.sqrt(
                Math.pow(player.x - ball.x, 2) + 
                Math.pow(player.y - ball.y, 2)
            );
            return distance < (playerRadius + ball.size / 2);
        }
    }

    update() {
        if (!this.isRunning) return;

        // Vérifier si le joueur a commencé à bouger
        if (!this.hasStarted && (window.keys.ArrowUp || window.keys.ArrowDown || window.keys.ArrowLeft || window.keys.ArrowRight)) {
            console.log('Level1: Player started moving with speed:', this.playerSpeed, 'position:', this.game.player.x, this.game.player.y);
            this.hasStarted = true;
            this.hideRules();
            this.showHUD();
            this.lastUpdateTime = Date.now(); // Réinitialiser le temps lors du premier mouvement
        }

        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // Convertir en secondes
        this.lastUpdateTime = currentTime;

        // Mise à jour de la position du joueur avec la vitesse calculée
        let moved = false;
        if (this.hasStarted) {
            let dx = 0;
            let dy = 0;

            if (window.keys.ArrowUp) { dy -= this.playerSpeed; moved = true; }
            if (window.keys.ArrowDown) { dy += this.playerSpeed; moved = true; }
            if (window.keys.ArrowLeft) { dx -= this.playerSpeed; moved = true; }
            if (window.keys.ArrowRight) { dx += this.playerSpeed; moved = true; }

            // Normaliser la vitesse en diagonale
            if (dx !== 0 && dy !== 0) {
                const factor = this.playerSpeed / Math.sqrt(dx * dx + dy * dy);
                dx *= factor;
                dy *= factor;
            }

            // Appliquer le déplacement
            this.game.player.x = Math.max(0, Math.min(this.canvas.width - 20, this.game.player.x + dx));
            this.game.player.y = Math.max(0, Math.min(this.canvas.height - 20, this.game.player.y + dy));
        }

        // Animation générique si images présentes
        this.checkPlayerAnimImages();
        if (this.playerHasAnim && moved) {
            this.playerFrameTimer += deltaTime * 1000;
            if (this.playerFrameTimer > this.playerFrameDuration) {
                this.playerFrame = 1 - this.playerFrame;
                this.playerFrameTimer = 0;
            }
        } else {
            this.playerFrame = 0;
            this.playerFrameTimer = 0;
        }

        // Vérification des collisions avec les balles dorées (toujours, même sans mouvement)
        this.goldenBalls = this.goldenBalls.filter(ball => {
            if (this.checkCollision(this.game.player, ball)) {
                this.projectHours += 1;
                return false;
            }
            return true;
        });

        // Mise à jour des frais généraux en fonction du temps
        if (this.hasStarted) {
            this.overhead += this.character.frais * 0.05 * deltaTime * 60;

            // Gestion de la maladresse
            if (Math.random() < this.character.maladresse * 0.1 * deltaTime * 60) {
                this.overhead += 0.025;
            }

            // Mise à jour du temps restant
            if (this.timeLeft > 0) {
                this.timeLeft -= deltaTime;
            } else {
                this.isComplete = true;
                this.isRunning = false;
                this.handleLevelComplete();
            }
        }

        this.updateHUD();
    }

    handleLevelComplete() {
        console.log('Level 1 completed!');
        console.log('Project Hours:', this.projectHours);
        console.log('Overhead:', this.overhead);
        
        // Calculer le pourcentage de frais généraux
        const totalHours = this.projectHours + this.overhead;
        const overheadPercentage = totalHours > 0 ? (this.overhead / totalHours) * 100 : 0;
        
        // Créer le tableau de score
        const scoreScreen = document.createElement('div');
        scoreScreen.className = 'score-screen';
        scoreScreen.innerHTML = `
            <h2>Niveau 1 Terminé</h2>
            <div class="score-details">
                <p>Heures Projet: ${this.projectHours.toFixed(1)}h</p>
                <p>Frais Généraux: ${this.overhead.toFixed(1)}h</p>
                <p>Pourcentage Frais Généraux: ${overheadPercentage.toFixed(1)}%</p>
            </div>
            <div class="score-buttons">
                <button id="next-level">Niveau Suivant</button>
                <button id="main-menu">Retour au menu</button>
            </div>
        `;
        
        // Ajouter les styles si nécessaire
        if (!document.getElementById('score-screen-styles')) {
            const style = document.createElement('style');
            style.id = 'score-screen-styles';
            style.textContent = `
                .score-screen {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 32, 96, 0.9);
                    padding: 30px;
                    border-radius: 10px;
                    border: 2px solid #c8102e;
                    text-align: center;
                    z-index: 100;
                    color: white;
                    box-shadow: 0 0 20px rgba(200, 16, 46, 0.3);
                }
                .score-screen h2 {
                    color: white;
                    font-size: 2em;
                    margin-bottom: 20px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                .score-details {
                    margin: 20px 0;
                    font-size: 1.2em;
                }
                .score-details p {
                    margin: 10px 0;
                }
                .score-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 30px;
                }
                .score-buttons button {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 5px;
                    background: #c8102e;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                }
                .score-buttons button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 15px rgba(200, 16, 46, 0.5);
                }
            `;
            document.head.appendChild(style);
        }
        
        // Supprimer l'ancien écran de score s'il existe
        const oldScoreScreen = document.querySelector('.score-screen');
        if (oldScoreScreen) {
            document.body.removeChild(oldScoreScreen);
        }
        
        // Ajouter le nouvel écran de score
        document.body.appendChild(scoreScreen);
        console.log('Score screen added to document');

        // Gestion des boutons
        document.getElementById('next-level').addEventListener('click', () => {
            // Limite : frais généraux < 100%
            const overheadPercentage = (this.overhead / (this.projectHours + this.overhead)) * 100;
            if (overheadPercentage < 100) {
                document.body.removeChild(scoreScreen);
                this.game.startLevel(2);
            } else {
                alert('Les frais généraux doivent être inférieurs à 100% pour passer au niveau suivant.');
            }
        });

        document.getElementById('main-menu').addEventListener('click', () => {
            document.body.removeChild(scoreScreen);
            this.game.restartGame();
        });
    }

    draw() {
        // Paramètres de zoom et centrage
        const zoom = 1.5;
        const bg = new Image();
        bg.src = 'images/L1/decor.PNG';

        const player = this.game.player;
        const canvasW = this.canvas.width;
        const canvasH = this.canvas.height;

        const drawScene = () => {
            try {
                const imgW = bg.width;
                const imgH = bg.height;

                // Centre de la caméra (centré sur le joueur)
                let camX = player.x;
                let camY = player.y;

                // Taille de la vue (canvas en coordonnées décor)
                const viewW = canvasW / zoom;
                const viewH = canvasH / zoom;

                // Limiter la caméra pour ne pas sortir du décor
                camX = Math.max(viewW / 2, Math.min(imgW - viewW / 2, camX));
                camY = Math.max(viewH / 2, Math.min(imgH - viewH / 2, camY));

                // Rectangle source dans l'image décor
                const srcX = camX - viewW / 2;
                const srcY = camY - viewH / 2;

                // Dessiner le décor zoomé et centré sur le joueur
                this.ctx.clearRect(0, 0, canvasW, canvasH);
                this.ctx.drawImage(bg, srcX, srcY, viewW, viewH, 0, 0, canvasW, canvasH);

                // Décalage à appliquer pour dessiner les éléments du jeu
                const offsetX = srcX;
                const offsetY = srcY;

                // Boules dorées
                this.ctx.fillStyle = '#ffcc00';
                this.goldenBalls.forEach(ball => {
                    this.ctx.beginPath();
                    this.ctx.arc((ball.x - offsetX) * zoom, (ball.y - offsetY) * zoom, ball.size / 2 * zoom, 0, Math.PI * 2);
                    this.ctx.fill();
                });

                // Vérifie la présence des images d'animation une seule fois (non bloquant)
                this.checkPlayerAnimImages();

                // Dessiner le joueur animé si images présentes, sinon sphère
                if (this.playerHasAnim) {
                    const folder = this.playerAnimFolder;
                    const frame = this.playerFrame || 0;
                    const img = new window.Image();
                    img.src = `images/${folder}/f${frame + 1}.png`;
                    const width = this.game.player.size * 3 * zoom;
                    const height = this.game.player.size * 4.5 * zoom;
                    const x = (this.game.player.x - offsetX) * zoom - width / 2;
                    const y = (this.game.player.y - offsetY) * zoom - height / 2;
                    img.onload = () => {
                        try { this.ctx.drawImage(img, x, y, width, height); } catch (e) {}
                    };
                    if (img.complete && img.naturalWidth) {
                        try { this.ctx.drawImage(img, x, y, width, height); } catch (e) {}
                    }
                } else {
                    this.ctx.fillStyle = this.getSphereColor();
                    this.ctx.beginPath();
                    this.ctx.arc((player.x - offsetX) * zoom, (player.y - offsetY) * zoom, player.size / 2 * zoom, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            } catch (e) {
                // Ne jamais bloquer la boucle de jeu sur une erreur de dessin
            }
        };

        if (bg.complete && bg.naturalWidth) {
            drawScene();
        } else {
            bg.onload = drawScene;
        }
    }
}

class Level2 extends Level {
    constructor(game) {
        super(game.canvas, game.character);
        this.game = game;
        this.greenBalls = [];
        this.hasStarted = false;
        this.baseSpeed = 5;
        this.playerFrame = 0;
        this.playerFrameTimer = 0;
        this.playerFrameDuration = 120;
        this.playerAnimChecked = false;
        this.playerHasAnim = false;
        this.playerAnimFolder = this.getPlayerAnimFolder();
        this.reviewsCollected = 0;
        this.projectHours = 0;
        this.overhead = 0; // frais généraux
        this.bgAudio = null; // fond sonore
    }
    getPlayerAnimFolder() {
        const name = this.character.name.toLowerCase();
        if (name === 'spécialiste' || name === 'specialiste') return 'specialiste';
        if (name === 'référent' || name === 'referent') return 'referent';
        if (name === 'expert') return 'expert';
        return name;
    }
    checkPlayerAnimImages() {
        if (this.playerAnimChecked) return;
        this.playerAnimChecked = true;
        const folder = this.playerAnimFolder;
        let loaded = 0, ok = true;
        const onDone = () => {
            loaded++;
            if (loaded === 2) this.playerHasAnim = ok;
        };
        const img1 = new window.Image();
        img1.onload = onDone;
        img1.onerror = () => { ok = false; onDone(); };
        img1.src = `images/${folder}/f1.png`;
        const img2 = new window.Image();
        img2.onload = onDone;
        img2.onerror = () => { ok = false; onDone(); };
        img2.src = `images/${folder}/f2.png`;
    }
    start() {
        super.start();
        this.greenBalls = [];
        this.reviewsCollected = 0;
        this.projectHours = 0;
        this.overhead = 0;
        this.timeLeft = 5;
        this.hasStarted = false;
        this.isRunning = true;
        this.isComplete = false;
        this.lastUpdateTime = Date.now();
        this.playerSpeed = this.baseSpeed * this.character.vitesse;
        this.game.player.x = this.canvas.width / 2;
        this.game.player.y = this.canvas.height / 2;
        this.spawnGreenBalls();
        this.playerAnimChecked = false;
        this.playerHasAnim = false;
        this.checkPlayerAnimImages();
        // --- Ajout du fond sonore ---
        if (!this.bgAudio) {
            this.bgAudio = new Audio('images/L2/sound.wav');
            this.bgAudio.loop = true;
            this.bgAudio.volume = 0.5;
        }
        this.bgAudio.currentTime = 0;
        this.bgAudio.play().catch(() => {});
        console.log('Level2 started');
    }
    stop() {
        super.stop();
        // --- Arrêt du fond sonore ---
        if (this.bgAudio) {
            this.bgAudio.pause();
            this.bgAudio.currentTime = 0;
        }
    }
    spawnGreenBalls() {
        // Créer 15 boules vertes réparties sur la carte
        const gridSize = 4;
        const cellWidth = this.canvas.width / gridSize;
        const cellHeight = this.canvas.height / gridSize;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const ballsInCell = Math.floor(Math.random() * 2) + 1;
                for (let k = 0; k < ballsInCell; k++) {
                    this.greenBalls.push({
                        x: (i * cellWidth) + (Math.random() * cellWidth * 0.8) + (cellWidth * 0.1),
                        y: (j * cellHeight) + (Math.random() * cellHeight * 0.8) + (cellHeight * 0.1),
                        size: 15
                    });
                }
            }
        }
    }
    checkCollision(player, ball) {
        // Même logique que Level1 : ellipse pour Junior, cercle agrandi sinon
        if (this.character.name === 'Junior') {
            const rx = player.size * 3 / 2;
            const ry = player.size * 4.5 / 2;
            const dx = player.x - ball.x;
            const dy = player.y - ball.y;
            return ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry)) <= Math.pow(1 + ball.size / Math.max(rx, ry), 2);
        } else {
            // Cercle agrandi (comme Level1)
            const playerRadius = player.size * 1.5;
            const distance = Math.sqrt(
                Math.pow(player.x - ball.x, 2) +
                Math.pow(player.y - ball.y, 2)
            );
            return distance < (playerRadius + ball.size / 2);
        }
    }
    update() {
        if (!this.isRunning && !this.hasStarted) return;
        if (!this.hasStarted && (window.keys.ArrowUp || window.keys.ArrowDown || window.keys.ArrowLeft || window.keys.ArrowRight)) {
            this.hasStarted = true;
            this.hideRules();
            this.showHUD();
            this.lastUpdateTime = Date.now();
        }
        if (!this.hasStarted) {
            this.showHUD();
            return;
        }
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = currentTime;

        // Déplacement joueur
        let moved = false;
        if (this.hasStarted) {
            let dx = 0, dy = 0;
            if (window.keys.ArrowUp) { dy -= this.playerSpeed; moved = true; }
            if (window.keys.ArrowDown) { dy += this.playerSpeed; moved = true; }
            if (window.keys.ArrowLeft) { dx -= this.playerSpeed; moved = true; }
            if (window.keys.ArrowRight) { dx += this.playerSpeed; moved = true; }
            if (dx !== 0 && dy !== 0) {
                const factor = this.playerSpeed / Math.sqrt(dx * dx + dy * dy);
                dx *= factor;
                dy *= factor;
            }
            this.game.player.x = Math.max(0, Math.min(this.canvas.width - 20, this.game.player.x + dx));
            this.game.player.y = Math.max(0, Math.min(this.canvas.height - 20, this.game.player.y + dy));
        }

        // Animation joueur
        this.checkPlayerAnimImages();
        if (this.playerHasAnim && moved) {
            this.playerFrameTimer += deltaTime * 1000;
            if (this.playerFrameTimer > this.playerFrameDuration) {
                this.playerFrame = 1 - this.playerFrame;
                this.playerFrameTimer = 0;
            }
        } else {
            this.playerFrame = 0;
            this.playerFrameTimer = 0;
        }

        // Collision avec les boules vertes
        this.greenBalls = this.greenBalls.filter(ball => {
            if (this.checkCollision(this.game.player, ball)) {
                this.reviewsCollected += 1;
                return false;
            }
            return true;
        });

        // Frais généraux (comme Level1)
        if (this.hasStarted) {
            this.overhead += this.character.frais * 0.05 * deltaTime * 60;
            if (Math.random() < this.character.maladresse * 0.1 * deltaTime * 60) {
                this.overhead += 0.025;
            }
            if (this.overhead >= 7.5) {
                this.overhead = 7.5;
                this.isComplete = true;
                this.isRunning = false;
                this.projectHours = this.reviewsCollected;
                this.handleLevelComplete();
                return;
            }
        }
        this.updateHUD();
    }
    updateHUD() {
        if (!this.hud) return;
        const projectHoursElement = document.getElementById('project-hours');
        if (projectHoursElement) projectHoursElement.textContent = this.projectHours.toString();
        const overheadElement = document.getElementById('overhead');
        if (overheadElement) overheadElement.textContent = this.overhead.toFixed(1);
    }
    showHUD() {
        if (this.hud) this.removeHUD();
        this.hud = document.createElement('div');
        this.hud.id = 'hud';
        this.hud.innerHTML = `
            <div class="hud-item">
                <span class="hud-label">Revues de projets:</span>
                <span class="hud-value" id="project-hours">${this.projectHours}</span>
        if (projectHoursElement) projectHoursElement.textContent = this.projectHours.toString();
        const overheadElement = document.getElementById('overhead');
        if (overheadElement) overheadElement.textContent = this.overhead.toFixed(1);
    }
    showHUD() {
        if (this.hud) this.removeHUD();
        this.hud = document.createElement('div');
        this.hud.id = 'hud';
        this.hud.innerHTML = `
            <div class="hud-item">
                <span class="hud-label">Temps restant:</span>
                <span class="hud-value" id="time-left">${this.timeLeft.toFixed(1)}</span>
            </div>
            <div class="hud-item">
                <span class="hud-label">Revues de projets:</span>
                <span class="hud-value" id="project-hours">${this.projectHours}</span>
            </div>
            <div class="hud-item">
                <span class="hud-label">Frais généraux:</span>
                <span class="hud-value" id="overhead">${this.overhead.toFixed(1)}</span>
            </div>
        `;
        document.body.appendChild(this.hud);
    }
    getRulesContent() {
        return "Ramassez les boules vertes pour collecter des revues de projet ! Chaque revue compte pour 1 heure projet. Attention aux frais généraux : le niveau s'arrête à 7.5h !";
    }
    handleLevelComplete() {
        // Affiche un écran de score pour le niveau 2
        const totalHours = this.projectHours + this.overhead;
        const overheadPercentage = totalHours > 0 ? (this.overhead / totalHours) * 100 : 0;
        const scoreScreen = document.createElement('div');
        scoreScreen.className = 'score-screen';
        scoreScreen.innerHTML = `
            <h2>Niveau 2 Terminé</h2>
            <div class="score-details">
                <p>Heures projet cumulées : ${this.projectHours}</p>
                <p>Frais généraux : ${this.overhead.toFixed(1)}h</p>
                <p>Pourcentage Frais Généraux : ${overheadPercentage.toFixed(1)}%</p>
            </div>
            <div class="score-buttons">
                <button id="next-level">Niveau Suivant</button>
                <button id="main-menu">Retour au menu</button>
            </div>
        `;
        if (!document.getElementById('score-screen-styles')) {
            const style = document.createElement('style');
            style.id = 'score-screen-styles';
            style.textContent = `
                .score-screen {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 32, 96, 0.9);
                    padding: 30px;
                    border-radius: 10px;
                    border: 2px solid #c8102e;
                    text-align: center;
                    z-index: 100;
                    color: white;
                    box-shadow: 0 0 20px rgba(200, 16, 46, 0.3);
                }
                .score-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 30px;
                }
                .score-buttons button {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 5px;
                    background: #c8102e;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                }
                .score-buttons button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 15px rgba(200, 16, 46, 0.5);
                }
            `;
            document.head.appendChild(style);
        }
        const oldScoreScreen = document.querySelector('.score-screen');
        if (oldScoreScreen) {
            document.body.removeChild(oldScoreScreen);
        }
        document.body.appendChild(scoreScreen);
        document.getElementById('next-level').addEventListener('click', () => {
            document.body.removeChild(scoreScreen);
            this.game.startLevel(3);
        });
        document.getElementById('main-menu').addEventListener('click', () => {
            document.body.removeChild(scoreScreen);
            this.game.restartGame();
        });
    }
    draw() {
        // Décor de fond L2
        const zoom = 1.5;
        const bg = new Image();
        bg.src = 'images/L2/decor.png';
        const player = this.game.player;
        const canvasW = this.canvas.width;
        const canvasH = this.canvas.height;
        const drawScene = () => {
            try {
                const imgW = bg.width;
                const imgH = bg.height;
                // Centre de la caméra (centré sur le joueur)
                let camX = player.x;
                let camY = player.y;
                const viewW = canvasW / zoom;
                const viewH = canvasH / zoom;
                camX = Math.max(viewW / 2, Math.min(imgW - viewW / 2, camX));
                camY = Math.max(viewH / 2, Math.min(imgH - viewH / 2, camY));
                const srcX = camX - viewW / 2;
                const srcY = camY - viewH / 2;
                this.ctx.clearRect(0, 0, canvasW, canvasH);
                this.ctx.drawImage(bg, srcX, srcY, viewW, viewH, 0, 0, canvasW, canvasH);
                const offsetX = srcX;
                const offsetY = srcY;
                // Boules vertes
                this.ctx.fillStyle = "#00cc44";
                this.greenBalls.forEach(ball => {
                    this.ctx.beginPath();
                    this.ctx.arc((ball.x - offsetX) * zoom, (ball.y - offsetY) * zoom, ball.size / 2 * zoom, 0, Math.PI * 2);
                    this.ctx.fill();
                });
                // Joueur (skin animé ou sphère)
                this.checkPlayerAnimImages();
                if (this.playerHasAnim) {
                    const folder = this.playerAnimFolder;
                    const frame = this.playerFrame || 0;
                    const img = new window.Image();
                    img.src = `images/${folder}/f${frame + 1}.png`;
                    const width = player.size * 3 * zoom;
                    const height = player.size * 4.5 * zoom;
                    const x = (player.x - offsetX) * zoom - width / 2;
                    const y = (player.y - offsetY) * zoom - height / 2;
                    img.onload = () => {
                        try { this.ctx.drawImage(img, x, y, width, height); } catch (e) {}
                    };
                    if (img.complete && img.naturalWidth) {
                        try { this.ctx.drawImage(img, x, y, width, height); } catch (e) {}
                    }
                } else {
                    this.ctx.fillStyle = "#fff";
                    this.ctx.beginPath();
                    this.ctx.arc((player.x - offsetX) * zoom, (player.y - offsetY) * zoom, player.size / 2 * zoom, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            } catch (e) {}
        };
        if (bg.complete && bg.naturalWidth) {
            drawScene();
        } else {
            bg.onload = drawScene;
        }
        // Affiche les règles si pas commencé
        if (!this.hasStarted && this.rulesPanel) {
            // Optionnel : tu peux dessiner un overlay ou laisser le panel HTML
        }
    }
}

class Level3 extends Level {
    constructor(game) {
        super(game.canvas, game.character);
        this.game = game;
    }
    start() {
        super.start();
        // Ajoutez ici la logique du niveau 3
        console.log('Level3 started');
    }
    stop() {
        super.stop();
        console.log('Level3 stopped');
    }
}