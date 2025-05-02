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
            <h2>MISSIONS REPORTING</h2>
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
        return " NIVEAU 1 : Ramassez les boules dorées pour accumuler des heures projet. Attention aux frais généraux !";
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
        // Décor sans zoom pour L1
        const bg = new Image();
        bg.src = 'images/L1/decor.PNG';

        const player = this.game.player;
        const canvasW = this.canvas.width;
        const canvasH = this.canvas.height;

        // Pour L1, PAS de zoom (zoom = 1)
        const zoom = 1;

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

                camX = Math.max(viewW / 2, Math.min(imgW - viewW / 2, camX));
                camY = Math.max(viewH / 2, Math.min(imgH - viewH / 2, camY));

                const srcX = camX - viewW / 2;
                const srcY = camY - viewH / 2;

                this.ctx.clearRect(0, 0, canvasW, canvasH);
                this.ctx.drawImage(bg, srcX, srcY, viewW, viewH, 0, 0, canvasW, canvasH);

                const offsetX = srcX;
                const offsetY = srcY;

                // ...existing code for drawing balls and player...
            } catch (e) {}
        };

        if (bg.complete && bg.naturalWidth) {
            drawScene();
        } else {
            bg.onload = drawScene;
        }
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
        this.maskImg = null;
        this.maskCanvas = null;
        this.maskCtx = null;
        this.maskReady = false;
        this.decorW = null;
        this.decorH = null;
        this.maskLoaded = false;
        this.safeZones = []; // Pour stocker les zones autorisées
        this.loadMask(); // Charger le masque dès le début
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

    loadMask() {
        console.log('Loading mask...');
        this.maskImg = new window.Image();
        this.maskImg.src = 'images/L1/decor_masque.png';

        this.maskImg.onload = () => {
            console.log('Mask image loaded');
            this.maskCanvas = document.createElement('canvas');
            this.maskCanvas.width = this.maskImg.width;
            this.maskCanvas.height = this.maskImg.height;
            this.maskCtx = this.maskCanvas.getContext('2d');  // Créer le contexte avant de l'utiliser

            // Correction : vérifier que maskCtx n'est pas null avant d'utiliser drawImage
            if (!this.maskCtx) {
                console.error('Erreur : maskCtx est null lors du chargement du masque');
                return;
            }
            this.maskCtx.drawImage(this.maskImg, 0, 0);

            // Analyser le masque pour trouver les zones blanches
            this.analyzeMask();
            console.log(`Found ${this.safeZones.length} safe zones`);

            this.maskLoaded = true;
            if (this.isRunning && this.goldenBalls.length === 0) {
                this.spawnGoldenBalls();
            }
        };
    }

    analyzeMask() {
        const gridSize = 20; // Taille de la grille d'analyse
        const data = this.maskCtx.getImageData(0, 0, this.maskCanvas.width, this.maskCanvas.height);
        const margin = 18;

        // Parcourir le masque par zones
        for (let x = margin; x < this.maskCanvas.width - margin; x += gridSize) {
            for (let y = margin; y < this.maskCanvas.height - margin; y += gridSize) {
                let whitePixelsCount = 0;

                // Vérifier chaque pixel de la zone
                for (let dx = 0; dx < gridSize; dx++) {
                    for (let dy = 0; dy < gridSize; dy++) {
                        if (x + dx < data.width && y + dy < data.height) {
                            const idx = ((y + dy) * data.width + (x + dx)) * 4;
                            // Vérifier si le pixel est blanc
                            if (data.data[idx] > 200 && data.data[idx + 1] > 200 && data.data[idx + 2] > 200) {
                                whitePixelsCount++;
                            }
                        }
                    }
                }

                // Si la zone est majoritairement blanche, l'ajouter aux zones sûres
                if (whitePixelsCount > (gridSize * gridSize * 0.8)) {
                    this.safeZones.push({
                        x: x + gridSize / 2,
                        y: y + gridSize / 2
                    });
                }
            }
        }
    }

    canMoveTo(x, y) {
        // Empêche le déplacement dans les zones noires du masque
        if (!this.maskReady || !this.maskCtx || !this.decorW || !this.decorH) return true;
        const maskW = this.maskImg.naturalWidth;
        const maskH = this.maskImg.naturalHeight;
        const mx = Math.round(x * maskW / this.decorW);
        const my = Math.round(y * maskH / this.decorH);
        if (mx < 0 || my < 0 || mx >= maskW || my >= maskH) return false;
        const pixel = this.maskCtx.getImageData(mx, my, 1, 1).data;
        return pixel[0] > 200 && pixel[1] > 200 && pixel[2] > 200;
    }

    start() {
        if (!this.canvas) {
            throw new Error('Canvas not initialized in Level1');
        }
        super.start();
        this.goldenBalls = [];
        this.projectHours = 0;
        this.overhead = 0;
        // Ajoute un log pour vérifier la présence de window.levelLimits
        console.log("window.levelLimits =", window.levelLimits);
        console.log("window.levelLimits.level1 =", window.levelLimits?.level1);
        console.log("window.levelLimits.level1.time =", window.levelLimits?.level1?.time);
        this.timeLeft = (window.levelLimits && window.levelLimits.level1 && Number.isFinite(window.levelLimits.level1.time))
            ? window.levelLimits.level1.time
            : 20;
        console.log("Level1 timeLeft utilisé =", this.timeLeft);
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
        
        // Ne pas recharger le masque si déjà chargé
        if (!this.maskLoaded) {
            this.loadMask();
        } else {
            // Si le masque est déjà chargé, générer directement les boules
            this.spawnGoldenBalls();
        }

        // --- Ajout du fond sonore ---
        if (!this.bgAudio) {
            this.bgAudio = new Audio('images/L1/sound2.mp4');
            this.bgAudio.loop = true;
            this.bgAudio.volume = 0.5;
        }
        this.bgAudio.currentTime = 0;
        this.bgAudio.play().catch(() => {});

        this.showHUD(); // Affiche la barre dès le début

        // Prépare le masque pour les collisions
        this.maskImg = new window.Image();
        this.maskImg.src = 'images/L1/decor_masque.png';
        this.maskReady = false;

        // Charge le décor pour avoir la taille réelle
        this.decorImg = new window.Image();
        this.decorImg.src = 'images/L1/decor.png';
        this.decorW = null;
        this.decorH = null;

        // Initialise le masque quand l'image est chargée
        this.decorImg.onload = () => {
            this.decorW = this.decorImg.naturalWidth;
            this.decorH = this.decorImg.naturalHeight;
            if (this.maskReady) this.ensurePlayerInWhiteZone();
        };

        this.maskImg.onload = () => {
            // Crée un canvas temporaire pour lire les pixels du masque
            this.maskCanvas = document.createElement('canvas');
            this.maskCanvas.width = this.maskImg.naturalWidth;
            this.maskCanvas.height = this.maskImg.naturalHeight;
            this.maskCtx.drawImage(this.maskImg, 0, 0);
            this.maskReady = true;
            if (this.decorW && this.decorH) this.ensurePlayerInWhiteZone();
        };
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
        if (!this.maskLoaded || !this.safeZones.length) {
            console.log('Cannot spawn balls: mask not loaded or no safe zones found');
            return;
        }

        console.log('Spawning golden balls...');
        this.goldenBalls = [];
        const ballSize = 15;
        const ballsCount = Math.min(50, this.safeZones.length); // Augmente le nombre de boules

        // Mélanger les zones sûres
        const shuffledZones = [...this.safeZones]
            .sort(() => Math.random() - 0.5)
            .slice(0, ballsCount);

        shuffledZones.forEach(zone => {
            const offset = 10;
            const x = zone.x + (Math.random() * offset * 2 - offset);
            const y = zone.y + (Math.random() * offset * 2 - offset);
            this.goldenBalls.push({
                x,
                y,
                size: ballSize,
                phase: Math.random() * Math.PI * 2 // Pour décaler l'effet de chaque boule
            });
        });

        console.log(`Generated ${this.goldenBalls.length} golden balls`);
    }

    isWhiteOnMask(x, y) {
        if (!this.maskReady || !this.maskCtx || !this.decorW || !this.decorH) return true;
        // Conversion coordonnées décor -> masque
        const maskW = this.maskImg.naturalWidth;
        const maskH = this.maskImg.naturalHeight;
        const mx = Math.round(x * maskW / this.decorW);
        const my = Math.round(y * maskH / this.decorH);
        if (mx < 0 || my < 0 || mx >= maskW || my >= maskH) return false;
        const pixel = this.maskCtx.getImageData(mx, my, 1, 1).data;
        return pixel[0] > 200 && pixel[1] > 200 && pixel[2] > 200;
    }

    ensurePlayerInWhiteZone() {
        // Replace le joueur au centre si sa position n'est pas blanche
        if (!this.isWhiteOnMask(this.game.player.x, this.game.player.y)) {
            // Cherche un point blanc au centre
            const cx = this.decorW / 2;
            const cy = this.decorH / 2;
            if (this.isWhiteOnMask(cx, cy)) {
                this.game.player.x = cx;
                this.game.player.y = cy;
            } else {
                // Cherche un point blanc dans la zone centrale
                for (let r = 10; r < 200; r += 10) {
                    for (let a = 0; a < 2 * Math.PI; a += Math.PI / 8) {
                        const x = cx + Math.cos(a) * r;
                        const y = cy + Math.sin(a) * r;
                        if (this.isWhiteOnMask(x, y)) {
                            this.game.player.x = x;
                            this.game.player.y = y;
                            return;
                        }
                    }
                }
            }
        }
    }

    checkCollision(player, ball) {
        // Ajuster la taille de collision selon le personnage
        const collisionSizes = {
            'Junior': { width: 2.5, height: 4.0 },    // Junior est plus grand/fin
            'Specialiste': { width: 2.8, height: 3.5 }, 
            'Referent': { width: 3.0, height: 3.2 },
            'Expert': { width: 3.2, height: 3.0 }     // Expert est plus trapu
        };

        const size = collisionSizes[this.character.name] || { width: 3, height: 3 };
        
        // Rectangle de collision adapté à chaque personnage
        const rx = player.size * size.width / 2;  // Largeur de collision
        const ry = player.size * size.height / 2; // Hauteur de collision
        const dx = player.x - ball.x;
        const dy = player.y - ball.y;

        // Test d'inclusion elliptique + rayon de la boule
        return ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry)) <= Math.pow(1 + ball.size / Math.max(rx, ry), 2);
    }

    update() {
        if (!this.isRunning) return;

        if (!this.hasStarted) {
            this.showHUD();
        }

        if (!this.hasStarted && (window.keys.ArrowUp || window.keys.ArrowDown || window.keys.ArrowLeft || window.keys.ArrowRight)) {
            this.hasStarted = true;
            this.hideRules();
            this.showHUD();
            this.lastUpdateTime = Date.now();
        }

        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = currentTime;

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

            // Limites du décor (image)
            const decorImg = new window.Image();
            decorImg.src = 'images/L1/decor.PNG';
            const playerSize = this.game.player.size;

            let minX = playerSize / 2;
            let minY = playerSize / 2;
            let maxX = this.canvas.width - playerSize / 2;
            let maxY = this.canvas.height - playerSize / 2;
            if (decorImg.complete && decorImg.naturalWidth && decorImg.naturalHeight) {
                maxX = decorImg.naturalWidth - playerSize / 2;
                maxY = decorImg.naturalHeight - playerSize / 2;
            }

            // Nouvelle position candidate
            let newX = Math.max(minX, Math.min(this.game.player.x + dx, maxX));
            let newY = Math.max(minY, Math.min(this.game.player.y + dy, maxY));

            // Collision masque : n'autorise le déplacement que si la nouvelle position est blanche
            if (this.canMoveTo(newX, newY)) {
                this.game.player.x = newX;
                this.game.player.y = newY;
            }
            // Sinon, on bloque le déplacement (le joueur reste sur place)
        }

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

        this.goldenBalls = this.goldenBalls.filter(ball => {
            if (this.checkCollision(this.game.player, ball)) {
                this.projectHours += 3 * this.character.efficacite;
                // Son de boule dorée
                try {
                    const audio = new Audio('images/L1/ball.wav');
                    audio.volume = 0.7;
                    audio.play();
                } catch (e) {}
                return false;
            }
            return true;
        });

        if (this.hasStarted) {
            this.overhead += this.character.frais * 0.05 * deltaTime * 60;

            if (Math.random() < this.character.maladresse * 0.1 * deltaTime * 60) {
                this.overhead += 0.025;
            }

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
        const totalHours = this.projectHours + this.overhead;
        const overheadPercentage = totalHours > 0 ? (this.overhead / totalHours) * 100 : 0;
        let message = '';
        let canGoNext = false;
        let color = '#00ff99';

        if (overheadPercentage < 10) {
            message = `<div style="color:#00ff99;font-weight:bold;margin:1em 0;">🎉 Félicitations ! Votre chef est RAVI : frais généraux maîtrisés (<b>${overheadPercentage.toFixed(1)}%</b>) !<br>Vous passez au niveau suivant !</div>`;
            canGoNext = true;
            color = '#00ff99';
        } else if (overheadPercentage < 20) {
            message = `<div style="color:#ffcc00;font-weight:bold;margin:1em 0;">⚠️ Votre chef vous alerte : frais généraux un peu élevés (<b>${overheadPercentage.toFixed(1)}%</b>).<br>Vous pouvez passer au niveau suivant, mais attention à la suite !</div>`;
            canGoNext = true;
            color = '#ffcc00';
        } else {
            message = `<div style="color:#ff4444;font-weight:bold;margin:1em 0;">❌ Les frais généraux sont trop élevés (<b>${overheadPercentage.toFixed(1)}%</b>) !<br>Votre chef refuse la validation, impossible d'aller plus loin.</div>`;
            canGoNext = false;
            color = '#ff4444';
        }

        const scoreScreen = document.createElement('div');
        scoreScreen.className = 'score-screen';
        scoreScreen.innerHTML = `
            <h2>Reporting Niveau 1</h2>
            <div class="score-details">
                <p><b>Heures Projet réalisées :</b> ${this.projectHours.toFixed(1)}h</p>
                <p><b>Frais Généraux :</b> ${this.overhead.toFixed(1)}h</p>
                <p><b>Pourcentage Frais Généraux :</b> <span style="color:${color};font-weight:bold;">${overheadPercentage.toFixed(1)}%</span></p>
            </div>
            ${message}
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
                    background: rgba(0, 32, 96, 0.95);
                    padding: 30px;
                    border-radius: 10px;
                    border: 2px solid #c8102e;
                    text-align: center;
                    z-index: 100;
                    color: white;
                    box-shadow: 0 0 20px rgba(200, 16, 46, 0.3);
                    font-family: 'Arial', sans-serif;
                }
                .score-details {
                    margin: 20px 0;
                    font-size: 1.2em;
                    background: rgba(255,255,255,0.07);
                    border-radius: 8px;
                    padding: 1em;
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

        const oldScoreScreen = document.querySelector('.score-screen');
        if (oldScoreScreen) {
            document.body.removeChild(oldScoreScreen);
        }

        document.body.appendChild(scoreScreen);

        document.getElementById('next-level').addEventListener('click', () => {
            if (canGoNext) {
                document.body.removeChild(scoreScreen);
                this.game.startLevel(2);
            } else {
                alert('Les frais généraux doivent être inférieurs à 20% pour passer au niveau suivant.');
            }
        });

        document.getElementById('main-menu').addEventListener('click', () => {
            document.body.removeChild(scoreScreen);
            this.game.restartGame();
        });
    }

    draw() {
        // Décor sans zoom pour L1
        const bg = new Image();
        bg.src = 'images/L1/decor.PNG';

        const player = this.game.player;
        const canvasW = this.canvas.width;
        const canvasH = this.canvas.height;

        // Pour L1, PAS de zoom (zoom = 1)
        const zoom = 1;

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

                camX = Math.max(viewW / 2, Math.min(imgW - viewW / 2, camX));
                camY = Math.max(viewH / 2, Math.min(imgH - viewH / 2, camY));

                const srcX = camX - viewW / 2;
                const srcY = camY - viewH / 2;

                this.ctx.clearRect(0, 0, canvasW, canvasH);
                this.ctx.drawImage(bg, srcX, srcY, viewW, viewH, 0, 0, canvasW, canvasH);

                const offsetX = srcX;
                const offsetY = srcY;

                // Boules dorées avec effet stylé (halo animé + cœur lumineux)
                const now = performance.now() / 1000;
                this.goldenBalls.forEach(ball => {
                    // Animation de pulsation douce
                    const pulse = 1 + 0.18 * Math.sin(now * 2 + ball.phase);

                    // Halo animé
                    const gradient = this.ctx.createRadialGradient(
                        ball.x - offsetX, ball.y - offsetY, 0,
                        ball.x - offsetX, ball.y - offsetY, ball.size * pulse
                    );
                    gradient.addColorStop(0, '#fffbe0');
                    gradient.addColorStop(0.18, '#fffbe0');
                    gradient.addColorStop(0.28, '#ffe066');
                    gradient.addColorStop(0.5, '#ffcc00');
                    gradient.addColorStop(0.8, 'rgba(255, 204, 0, 0.15)');
                    gradient.addColorStop(1, 'rgba(255,255,255,0)');

                    this.ctx.beginPath();
                    this.ctx.arc(ball.x - offsetX, ball.y - offsetY, ball.size * pulse, 0, Math.PI * 2);
                    this.ctx.fillStyle = gradient;
                    this.ctx.globalAlpha = 0.85;
                    this.ctx.fill();
                    this.ctx.globalAlpha = 1;

                    // Boule principale
                    this.ctx.beginPath();
                    this.ctx.arc(ball.x - offsetX, ball.y - offsetY, ball.size / 2, 0, Math.PI * 2);
                    this.ctx.fillStyle = '#ffcc00';
                    this.ctx.shadowColor = '#fffbe0';
                    this.ctx.shadowBlur = 8;
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0;

                    // Petit cœur lumineux au centre
                    this.ctx.beginPath();
                    this.ctx.arc(ball.x - offsetX, ball.y - offsetY, ball.size / 6, 0, Math.PI * 2);
                    this.ctx.fillStyle = 'rgba(255,255,255,0.92)';
                    this.ctx.shadowColor = '#fffbe0';
                    this.ctx.shadowBlur = 12;
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0;
                });

                this.checkPlayerAnimImages();

                if (this.playerHasAnim) {
                    const folder = this.playerAnimFolder;
                    const frame = this.playerFrame || 0;
                    const img = new window.Image();
                    img.src = `images/${folder}/f${frame + 1}.png`;
                    const width = this.game.player.size * 3;
                    const height = this.game.player.size * 4.5;
                    const x = (this.game.player.x - offsetX) - width / 2;
                    const y = (this.game.player.y - offsetY) - height / 2;
                    img.onload = () => {
                        try { this.ctx.drawImage(img, x, y, width, height); } catch (e) {}
                    };
                    if (img.complete && img.naturalWidth) {
                        try { this.ctx.drawImage(img, x, y, width, height); } catch (e) {}
                    }
                } else {
                    this.ctx.fillStyle = this.getSphereColor();
                    this.ctx.beginPath();
                    this.ctx.arc(player.x - offsetX, player.y - offsetY, player.size / 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            } catch (e) {}
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
        this.greenBallsInterval = null; // Timer pour respawn des boules vertes
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
        this.hasStarted = false;
        this.isRunning = true;
        this.isComplete = false;
        this.lastUpdateTime = Date.now();
        // Toujours recalculer la vitesse à partir des stats du personnage
        this.playerSpeed = this.baseSpeed * this.character.vitesse;
        console.log('Level2 started with speed:', this.playerSpeed, 'for character:', this.character.name, 'vitesse:', this.character.vitesse, 'baseSpeed:', this.baseSpeed);
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
        // --- Timer pour respawn des boules vertes ---
        if (this.greenBallsInterval) clearInterval(this.greenBallsInterval);
        this.greenBallsInterval = setInterval(() => {
            if (this.isRunning) this.spawnGreenBalls();
        }, 3000);
        console.log('Level2 started');
    }
    stop() {
        super.stop();
        // --- Arrêt du fond sonore ---
        if (this.bgAudio) {
            this.bgAudio.pause();
            this.bgAudio.currentTime = 0;
        }
        // --- Arrêt du timer de respawn ---
        if (this.greenBallsInterval) {
            clearInterval(this.greenBallsInterval);
            this.greenBallsInterval = null;
        }
    }
    spawnGreenBalls() {
        // Place les boules uniquement dans la zone du décor (image)
        const decorImg = new window.Image();
        decorImg.src = 'images/L2/decor.png';
        let decorW = this.canvas.width;
        let decorH = this.canvas.height;
        if (decorImg.naturalWidth && decorImg.naturalHeight) {
            decorW = decorImg.naturalWidth;
            decorH = decorImg.naturalHeight;
        }
        this.greenBalls = [];
        const nbPaquets = 4;
        const minPerPack = 1, maxPerPack = 2; // 1 à 2 boules par paquet
        for (let p = 0; p < nbPaquets; p++) {
            const centerX = Math.random() * (decorW - 200) + 100;
            const centerY = Math.random() * (decorH - 200) + 100;
            const ballsInPack = Math.floor(Math.random() * (maxPerPack - minPerPack + 1)) + minPerPack;
            for (let i = 0; i < ballsInPack; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const radius = Math.random() * 90;
                const x = Math.max(20, Math.min(decorW - 20, centerX + Math.cos(angle) * radius));
                const y = Math.max(20, Math.min(decorH - 20, centerY + Math.sin(angle) * radius));
                this.greenBalls.push({
                    x,
                    y,
                    size: 15
                });
            }
        }
    }
    checkCollision(player, ball) {
        // Même logique que Level1 - zones de collision adaptées
        const collisionSizes = {
            'Junior': { width: 2.5, height: 4.0 },
            'Specialiste': { width: 2.8, height: 3.5 },
            'Referent': { width: 3.0, height: 3.2 },
            'Expert': { width: 3.2, height: 3.0 }
        };

        const size = collisionSizes[this.character.name] || { width: 3, height: 3 };
        
        const rx = player.size * size.width / 2;
        const ry = player.size * size.height / 2;
        const dx = player.x - ball.x;
        const dy = player.y - ball.y;

        return ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry)) <= Math.pow(1 + ball.size / Math.max(rx, ry), 2);
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
            // Limites du décor (image)
            const decorImg = new window.Image();
            decorImg.src = 'images/L2/decor.png';
            const playerSize = this.game.player.size;
            let minX = playerSize / 2;
            let minY = playerSize / 2;
            let maxX = this.canvas.width - playerSize / 2;
            let maxY = this.canvas.height - playerSize / 2;
            if (decorImg.naturalWidth && decorImg.naturalHeight) {
                maxX = decorImg.naturalWidth - playerSize / 2;
                maxY = decorImg.naturalHeight - playerSize / 2;
            }
            this.game.player.x = Math.max(minX, Math.min(this.game.player.x + dx, maxX));
            this.game.player.y = Math.max(minY, Math.min(this.game.player.y + dy, maxY));
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

        // Collision avec les boules vertes + son
        this.greenBalls = this.greenBalls.filter(ball => {
            if (this.checkCollision(this.game.player, ball)) {
                // 1 revue de projet, heures projet selon efficacité (NOUVEAU: 8*efficacité)
                this.reviewsCollected += 1;
                this.projectHours += 8 * this.character.efficacite;
                // Joue le son de boule verte
                try {
                    const audio = new Audio('images/L2/ball.wav');
                    audio.volume = 0.7;
                    audio.play();
                } catch (e) {}
                return false;
            }
            return true;
        });

        if (this.hasStarted) {
            this.overhead += this.character.frais * 0.05 * deltaTime * 60;
            if (Math.random() < this.character.maladresse * 0.1 * deltaTime * 60) {
                this.overhead += 0.025;
            }
            const overheadLimit = (window.levelLimits && window.levelLimits.level2 && typeof window.levelLimits.level2.overhead === 'number')
                ? window.levelLimits.level2.overhead
                : 20;
            if (this.overhead >= overheadLimit) {
                this.overhead = overheadLimit;
                this.isComplete = true;
                this.isRunning = false;
                this.handleLevelComplete();
                return;
            }
        }
        this.updateHUD();
    }
    updateHUD() {
        if (!this.hud) return;
        const reviewsElement = document.getElementById('project-reviews');
        if (reviewsElement) reviewsElement.textContent = this.reviewsCollected.toString();
        const overheadElement = document.getElementById('overhead');
        if (overheadElement) overheadElement.textContent = this.overhead.toFixed(1);
    }
    showHUD() {
        if (this.hud) this.removeHUD();
        this.hud = document.createElement('div');
        this.hud.id = 'hud';
        this.hud.innerHTML = `
            <div class="hud-item">
                <span class="hud-label">Revues de projet:</span>
                <span class="hud-value" id="project-reviews">${this.reviewsCollected}</span>
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
        const totalHours = this.projectHours + this.overhead;
        const overheadPercentage = totalHours > 0 ? (this.overhead / totalHours) * 100 : 0;
        let message = '';
        let canGoNext = false;
        let color = '#00ff99';

        if (overheadPercentage < 10) {
            message = `<div style="color:#00ff99;font-weight:bold;margin:1em 0;">🎉 Félicitations ! Votre chef est RAVI : frais généraux maîtrisés (<b>${overheadPercentage.toFixed(1)}%</b>) !<br>Vous passez au niveau suivant !</div>`;
            canGoNext = true;
            color = '#00ff99';
        } else if (overheadPercentage < 20) {
            message = `<div style="color:#ffcc00;font-weight:bold;margin:1em 0;">⚠️ Votre chef vous alerte : frais généraux un peu élevés (<b>${overheadPercentage.toFixed(1)}%</b>).<br>Vous pouvez passer au niveau suivant, mais attention à la suite !</div>`;
            canGoNext = true;
            color = '#ffcc00';
        } else {
            message = `<div style="color:#ff4444;font-weight:bold;margin:1em 0;">❌ Les frais généraux sont trop élevés (<b>${overheadPercentage.toFixed(1)}%</b>) !<br>Votre chef refuse la validation, impossible d'aller plus loin.</div>`;
            canGoNext = false;
            color = '#ff4444';
        }

        const scoreScreen = document.createElement('div');
        scoreScreen.className = 'score-screen';
        scoreScreen.innerHTML = `
            <h2>Reporting Niveau 2</h2>
            <div class="score-details">
                <p><b>Revues de projet :</b> ${this.reviewsCollected}</p>
                <p><b>Heures projet gagnées :</b> ${this.projectHours.toFixed(1)}</p>
                <p><b>Frais généraux :</b> ${this.overhead.toFixed(1)}h</p>
                <p><b>% Frais généraux / total :</b> <span style="color:${color};font-weight:bold;">${overheadPercentage.toFixed(1)}%</span></p>
            </div>
            ${message}
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
                    background: rgba(0, 32, 96, 0.95);
                    padding: 30px;
                    border-radius: 10px;
                    border: 2px solid #c8102e;
                    text-align: center;
                    z-index: 100;
                    color: white;
                    box-shadow: 0 0 20px rgba(200, 16, 46, 0.3);
                    font-family: 'Arial', sans-serif;
                }
                .score-details {
                    margin: 20px 0;
                    font-size: 1.2em;
                    background: rgba(255,255,255,0.07);
                    border-radius: 8px;
                    padding: 1em;
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

        const oldScoreScreen = document.querySelector('.score-screen');
        if (oldScoreScreen) {
            document.body.removeChild(oldScoreScreen);
        }
        document.body.appendChild(scoreScreen);

        document.getElementById('next-level').addEventListener('click', () => {
            if (canGoNext) {
                document.body.removeChild(scoreScreen);
                this.game.startLevel(3);
            } else {
                alert('Les frais généraux doivent être inférieurs à 20% pour passer au niveau suivant.');
            }
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

                // Boules vertes avec effet stylé (halo animé + cœur lumineux)
                const now = performance.now() / 1000;
                this.greenBalls.forEach((ball, i) => {
                    // Ajoute une phase pour chaque boule pour décaler l'effet
                    if (!ball.phase) ball.phase = Math.random() * Math.PI * 2;
                    const pulse = 1 + 0.18 * Math.sin(now * 2 + ball.phase);

                    // Halo animé vert
                    const cx = (ball.x - offsetX) * zoom;
                    const cy = (ball.y - offsetY) * zoom;
                    const r = ball.size * pulse * zoom;

                    const gradient = this.ctx.createRadialGradient(
                        cx, cy, 0,
                        cx, cy, r
                    );
                    gradient.addColorStop(0, '#eaffea');
                    gradient.addColorStop(0.18, '#eaffea');
                    gradient.addColorStop(0.28, '#aaffaa');
                    gradient.addColorStop(0.5, '#00cc44');
                    gradient.addColorStop(0.8, 'rgba(0, 204, 68, 0.13)');
                    gradient.addColorStop(1, 'rgba(255,255,255,0)');

                    this.ctx.beginPath();
                    this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
                    this.ctx.fillStyle = gradient;
                    this.ctx.globalAlpha = 0.85;
                    this.ctx.fill();
                    this.ctx.globalAlpha = 1;

                    // Boule principale
                    this.ctx.beginPath();
                    this.ctx.arc(cx, cy, ball.size / 2 * zoom, 0, Math.PI * 2);
                    this.ctx.fillStyle = '#00cc44';
                    this.ctx.shadowColor = '#eaffea';
                    this.ctx.shadowBlur = 8 * zoom;
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0;

                    // Petit cœur lumineux au centre
                    this.ctx.beginPath();
                    this.ctx.arc(cx, cy, ball.size / 6 * zoom, 0, Math.PI * 2);
                    this.ctx.fillStyle = 'rgba(255,255,255,0.92)';
                    this.ctx.shadowColor = '#eaffea';
                    this.ctx.shadowBlur = 12 * zoom;
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0;
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
    handleLevelComplete() {
        const totalHours = this.projectHours + this.overhead;
        const overheadPercentage = totalHours > 0 ? (this.overhead / totalHours) * 100 : 0;
        let message = '';
        let canGoNext = false;
        let color = '#00ff99';

        if (overheadPercentage < 10) {
            message = `<div style="color:#00ff99;font-weight:bold;margin:1em 0;">🎉 Félicitations ! Votre chef est RAVI : frais généraux maîtrisés (<b>${overheadPercentage.toFixed(1)}%</b>) !<br>Bravo, vous avez terminé le jeu !</div>`;
            canGoNext = true;
            color = '#00ff99';
        } else if (overheadPercentage < 20) {
            message = `<div style="color:#ffcc00;font-weight:bold;margin:1em 0;">⚠️ Votre chef vous alerte : frais généraux un peu élevés (<b>${overheadPercentage.toFixed(1)}%</b>).<br>Vous avez terminé le jeu, mais attention à la gestion !</div>`;
            canGoNext = true;
            color = '#ffcc00';
        } else {
            message = `<div style="color:#ff4444;font-weight:bold;margin:1em 0;">❌ Les frais généraux sont trop élevés (<b>${overheadPercentage.toFixed(1)}%</b>) !<br>Votre chef refuse la validation, impossible de valider la fin du jeu.</div>`;
            canGoNext = false;
            color = '#ff4444';
        }

        const scoreScreen = document.createElement('div');
        scoreScreen.className = 'score-screen';
        scoreScreen.innerHTML = `
            <h2>Reporting Niveau 3</h2>
            <div class="score-details">
                <p><b>Heures Projet réalisées :</b> ${this.projectHours?.toFixed(1) ?? 0}h</p>
                <p><b>Frais Généraux :</b> ${this.overhead?.toFixed(1) ?? 0}h</p>
                <p><b>Pourcentage Frais Généraux :</b> <span style="color:${color};font-weight:bold;">${overheadPercentage.toFixed(1)}%</span></p>
            </div>
            ${message}
            <div class="score-buttons">
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
                    background: rgba(0, 32, 96, 0.95);
                    padding: 30px;
                    border-radius: 10px;
                    border: 2px solid #c8102e;
                    text-align: center;
                    z-index: 100;
                    color: white;
                    box-shadow: 0 0 20px rgba(200, 16, 46, 0.3);
                    font-family: 'Arial', sans-serif;
                }
                .score-details {
                    margin: 20px 0;
                    font-size: 1.2em;
                    background: rgba(255,255,255,0.07);
                    border-radius: 8px;
                    padding: 1em;
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

        const oldScoreScreen = document.querySelector('.score-screen');
        if (oldScoreScreen) {
            document.body.removeChild(oldScoreScreen);
        }
        document.body.appendChild(scoreScreen);

        document.getElementById('main-menu').addEventListener('click', () => {
            document.body.removeChild(scoreScreen);
            this.game.restartGame();
        });
    }
}
