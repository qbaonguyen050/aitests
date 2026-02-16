class DealerAI {
    constructor(game) {
        this.game = game;
    }

    // The ONLY way the AI gets data is through this method
    getFilteredState() {
        return {
            myHP: this.game.dealerHP,
            opponentHP: this.game.playerHP,
            myItems: [...this.game.dealerItems],
            opponentItems: [...this.game.playerItems],
            livesInGun: this.game.livesInGun,
            blanksInGun: this.game.blanksInGun,
            knownShell: this.game.knownShell,
            isSawed: this.game.isSawed,
            opponentHandcuffed: this.game.isHandcuffed.player
        };
    }

    makeDecision() {
        const state = this.getFilteredState();
        return this.analyze(state);
    }

    analyze(state) {
        const { myHP, opponentHP, myItems, livesInGun, blanksInGun, knownShell, isSawed } = state;
        const total = livesInGun + blanksInGun;
        const probLive = livesInGun / total;

        // 1. Mandatory Heals
        if (myHP <= 2 && myItems.includes('cigarette')) {
            return { action: 'item', index: myItems.indexOf('cigarette') };
        }

        // 2. Information Gathering
        if (knownShell === null && myItems.includes('magnifier')) {
            return { action: 'item', index: myItems.indexOf('magnifier') };
        }

        // 3. Known Shell Logic
        if (knownShell === 'live') {
            if (!isSawed && myItems.includes('saw')) {
                return { action: 'item', index: myItems.indexOf('saw') };
            }
            if (!state.opponentHandcuffed && myItems.includes('handcuffs')) {
                return { action: 'item', index: myItems.indexOf('handcuffs') };
            }
            return { action: 'shoot', target: 'player' };
        }

        if (knownShell === 'blank') {
            return { action: 'shoot', target: 'dealer' }; // Shoot self for extra turn
        }

        // 4. Probability Logic (No known shell)

        // If high chance of blank, shoot self
        if (probLive < 0.3 && total > 1) {
             return { action: 'shoot', target: 'dealer' };
        }

        // If high chance of live, use saw/handcuffs then shoot player
        if (probLive > 0.5) {
            if (!isSawed && myItems.includes('saw') && probLive > 0.7) {
                return { action: 'item', index: myItems.indexOf('saw') };
            }
            if (!state.opponentHandcuffed && myItems.includes('handcuffs') && total > 1) {
                return { action: 'item', index: myItems.indexOf('handcuffs') };
            }
            return { action: 'shoot', target: 'player' };
        }

        // 5. Item usage to tilt odds
        if (probLive === 0.5 && myItems.includes('beer')) {
            return { action: 'item', index: myItems.indexOf('beer') };
        }

        // Default: Shoot player if odds are 50/50 or unknown
        return { action: 'shoot', target: 'player' };
    }
}
