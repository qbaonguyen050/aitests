class DealerAI {
    constructor(game) {
        this.game = game;
    }

    makeDecision() {
        // Prepare a restricted state
        const state = {
            myLives: this.game.dealerLives,
            opponentLives: this.game.playerLives,
            myItems: [...this.game.dealerItems],
            opponentItems: [...this.game.playerItems],
            liveLeft: this.game.liveLeft,
            blankLeft: this.game.blankLeft,
            knownShell: this.game.knownShell, // This is only set if AI used magnifier
            isHandcuffed: this.game.isHandcuffed.player,
            isSawed: this.game.isSawed
        };

        return this.analyze(state);
    }

    analyze(state) {
        const total = state.liveLeft + state.blankLeft;
        const probLive = state.liveLeft / total;

        // 1. Use Items

        // Use Magnifier if we don't know the shell
        if (state.knownShell === null && state.myItems.includes('magnifier')) {
            return { action: 'useItem', item: 'magnifier', index: state.myItems.indexOf('magnifier') };
        }

        // Use Cigarette if we need health
        if (state.myLives < 4 && state.myItems.includes('cigarette')) {
            return { action: 'useItem', item: 'cigarette', index: state.myItems.indexOf('cigarette') };
        }

        // If we know the shell
        if (state.knownShell === 'live') {
            if (!state.isSawed && state.myItems.includes('saw')) {
                return { action: 'useItem', item: 'saw', index: state.myItems.indexOf('saw') };
            }
            if (!state.isHandcuffed && state.myItems.includes('handcuffs')) {
                 return { action: 'useItem', item: 'handcuffs', index: state.myItems.indexOf('handcuffs') };
            }
            return { action: 'shoot', target: 'player' };
        }

        if (state.knownShell === 'blank') {
            return { action: 'shoot', target: 'dealer' };
        }

        // Probability based
        if (probLive > 0.5) {
            if (!state.isHandcuffed && state.myItems.includes('handcuffs')) {
                return { action: 'useItem', item: 'handcuffs', index: state.myItems.indexOf('handcuffs') };
            }
            if (probLive > 0.7 && !state.isSawed && state.myItems.includes('saw')) {
                return { action: 'useItem', item: 'saw', index: state.myItems.indexOf('saw') };
            }
            return { action: 'shoot', target: 'player' };
        } else {
            // High chance of blank, shoot self to get another turn
            if (state.blankLeft > state.liveLeft) {
                return { action: 'shoot', target: 'dealer' };
            } else {
                // equal or slightly less, maybe use beer?
                if (state.myItems.includes('beer')) {
                    return { action: 'useItem', item: 'beer', index: state.myItems.indexOf('beer') };
                }
                return { action: 'shoot', target: 'player' };
            }
        }
    }
}
