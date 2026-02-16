class Game {
    constructor() {
        this.maxHP = 4;
        this.playerHP = 0;
        this.dealerHP = 0;
        this.playerItems = [];
        this.dealerItems = [];
        this.shells = []; // 'live' or 'blank'
        this.currentRound = 0;

        this.turn = 'player';
        this.isHandcuffed = { player: false, dealer: false };
        this.isSawed = false;

        this.livesInGun = 0;
        this.blanksInGun = 0;
        this.knownShell = null; // Revealed by magnifier for AI

        this.history = [];
        this.onUpdate = () => {};
        this.onLog = () => {};
        this.onAction = () => {}; // For graphics triggers

        this.itemPool = ['magnifier', 'cigarette', 'beer', 'handcuffs', 'saw'];
    }

    log(msg, type = 'system') {
        this.history.push({ msg, type });
        this.onLog(msg, type);
    }

    initRound() {
        this.currentRound++;
        this.playerHP = Math.floor(Math.random() * 3) + 2; // 2-4 HP
        this.dealerHP = this.playerHP;
        this.playerItems = [];
        this.dealerItems = [];
        this.isHandcuffed = { player: false, dealer: false };
        this.isSawed = false;
        this.turn = 'player';

        this.log(`--- ROUND ${this.currentRound} ---`);
        this.loadShells();
    }

    loadShells() {
        const count = Math.floor(Math.random() * 7) + 2; // 2 to 8 shells
        let lives = Math.ceil(count / 2);
        if (Math.random() > 0.5 && lives < count && lives > 1) lives--;
        if (lives === 0) lives = 1;

        const blanks = count - lives;
        this.shells = [];
        for (let i = 0; i < lives; i++) this.shells.push('live');
        for (let i = 0; i < blanks; i++) this.shells.push('blank');

        // Shuffle
        for (let i = this.shells.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.shells[i], this.shells[j]] = [this.shells[j], this.shells[i]];
        }

        this.log(`The dealer inserts ${lives} live and ${blanks} blank shells.`, 'system');
        this.livesInGun = lives;
        this.blanksInGun = blanks;
        this.knownShell = null;

        // Grant items
        const itemAmount = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < itemAmount; i++) {
            if (this.playerItems.length < 8) this.playerItems.push(this.randomItem());
            if (this.dealerItems.length < 8) this.dealerItems.push(this.randomItem());
        }

        this.onUpdate();
        this.onAction('load', { lives, blanks });
    }

    randomItem() {
        return this.itemPool[Math.floor(Math.random() * this.itemPool.length)];
    }

    shoot(target) {
        if (this.shells.length === 0) return;

        const shell = this.shells.shift();
        const isLive = shell === 'live';
        if (isLive) this.livesInGun--; else this.blanksInGun--;
        this.knownShell = null;

        const damage = this.isSawed ? 2 : 1;
        this.isSawed = false;

        this.log(`${this.turn.toUpperCase()} aims at ${target.toUpperCase()}.`, this.turn);
        this.onAction('shoot', { shooter: this.turn, target, isLive, damage });

        if (isLive) {
            this.log("BOOM!", 'system');
            if (target === 'player') this.playerHP -= damage;
            else this.dealerHP -= damage;

            if (this.checkGameOver()) return;
            this.endTurn(true);
        } else {
            this.log("Click.", 'system');
            if (this.turn === target) {
                this.log(`${this.turn.toUpperCase()} gets another turn.`, 'system');
                this.onUpdate();
                if (this.shells.length === 0) this.loadShells();
            } else {
                this.endTurn(false);
            }
        }
    }

    useItem(user, index) {
        const item = user === 'player' ? this.playerItems[index] : this.dealerItems[index];
        if (!item) return;

        this.log(`${user.toUpperCase()} uses ${item.toUpperCase()}.`, user);

        let reveal = null;
        switch (item) {
            case 'magnifier':
                reveal = this.shells[0];
                if (user === 'player') this.log(`Current shell is ${reveal}.`, 'system');
                else this.knownShell = reveal;
                break;
            case 'cigarette':
                if (user === 'player') this.playerHP = Math.min(this.playerHP + 1, 6);
                else this.dealerHP = Math.min(this.dealerHP + 1, 6);
                break;
            case 'beer':
                const ejected = this.shells.shift();
                if (ejected === 'live') this.livesInGun--; else this.blanksInGun--;
                this.knownShell = null;
                this.log(`Ejected a ${ejected} shell.`, 'system');
                break;
            case 'handcuffs':
                if (user === 'player') this.isHandcuffed.dealer = true;
                else this.isHandcuffed.player = true;
                break;
            case 'saw':
                this.isSawed = true;
                break;
        }

        if (user === 'player') this.playerItems.splice(index, 1);
        else this.dealerItems.splice(index, 1);

        this.onAction('item', { user, item, reveal });
        this.onUpdate();

        if (this.shells.length === 0) this.loadShells();
    }

    endTurn(wasHit) {
        const next = this.turn === 'player' ? 'dealer' : 'player';

        if (this.isHandcuffed[next]) {
            this.isHandcuffed[next] = false;
            this.log(`${next.toUpperCase()} is handcuffed. Turn skipped.`, 'system');
        } else {
            this.turn = next;
        }

        this.onUpdate();
        if (this.shells.length === 0) this.loadShells();
    }

    checkGameOver() {
        if (this.playerHP <= 0) {
            this.log("PLAYER DIED.", 'dealer');
            this.onAction('gameOver', 'dealer');
            return true;
        }
        if (this.dealerHP <= 0) {
            this.log("DEALER DIED.", 'player');
            this.onAction('gameOver', 'player');
            return true;
        }
        return false;
    }
}
