// Définition des personnages
window.characters = {
    Junior: {
        vitesse: 0.05,
        frais: 0.2,
        efficacite: 0.5,
        maladresse: 0.6
    },
    Specialiste: {
        vitesse: 0.7,
        frais: 0.3,
        efficacite: 0.6,
        maladresse: 0.4
    },
    Referent: {
        vitesse: 0.6,
        frais: 0.4,
        efficacite: 0.7,
        maladresse: 0.5
    },
    Expert: {
        vitesse: 0.55,
        frais: 0.5,
        efficacite: 0.95,
        maladresse: 0.1
    }
};

let selectedCharacter = null;

// Classe Character
class Character {
    constructor(name, vitesse) {
        this.name = name;
        this.vitesse = vitesse;
    }
}

// Fonction pour sélectionner un personnage
window.selectCharacter = function(characterName) {
    console.log('Selecting character:', characterName);
    console.log('Available characters:', Object.keys(window.characters));
    
    if (window.characters[characterName]) {
        const data = window.characters[characterName];
        selectedCharacter = new Character(characterName, data.vitesse);
        selectedCharacter.frais = data.frais;
        selectedCharacter.efficacite = data.efficacite;
        selectedCharacter.maladresse = data.maladresse;
        console.log('Character selected:', selectedCharacter);
        return selectedCharacter;
    } else {
        console.error('Character not found:', characterName);
        return null;
    }
};

// Fonction pour obtenir le personnage sélectionné
window.getSelectedCharacter = function() {
    return selectedCharacter;
};

// Fonction pour réinitialiser les statistiques du personnage sélectionné
window.resetCharacterStats = function() {
    if (selectedCharacter) {
        const characterName = selectedCharacter.name;
        if (window.characters[characterName]) {
            selectedCharacter = {
                name: characterName,
                ...window.characters[characterName]
            };
            console.log('Character stats reset:', selectedCharacter);
        }
    }
};
