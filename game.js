class Game {
    constructor() {
        this.maxLives = 4;
        this.playerLives = this.maxLives;
        this.dealerLives = this.maxLives;
        this.playerItems = [];
        this.dealerItems = [];
        this.shells = []; // Array of 'live' or 'blank'
        this.currentShell = null;
        this.turn = 'player'; // 'player' or 'dealer'
        this.isHandcuffed = { player: false, dealer: false };
        this.isSawed = false;
        this.knownShell = null; // Used by Magnifying Glass
        this.initialLiveCount = 0;
        this.initialBlankCount = 0;
        this.liveLeft = 0;
        this.blankLeft = 0;

        this.itemTypes = ['magnifier', 'cigarette', 'beer', 'handcuffs', 'saw'];

        this.onLog = (msg, type) => console.log(`[${type}] ${msg}`);
        this.onUpdate = () => {};
        this.onGameOver = (winner) => {};
    }

    startRound() {
        this.onLog("New round starting...", "system");
        this.playerLives = Math.min(this.playerLives, 4);
        this.dealerLives = Math.min(this.dealerLives, 4);

        const shellCount = Math.floor(Math.random() * 7) + 2; // 2 to 8 shells
        let livesCount = Math.floor(shellCount / 2) + (Math.random() > 0.5 ? 1 : 0);
        if (livesCount === 0) livesCount = 1;
        if (livesCount === shellCount) livesCount = shellCount - 1;

        const blanksCount = shellCount - livesCount;

        this.shells = [];
        for (let i = 0; i < livesCount; i++) this.shells.push('live');
        for (let i = 0; i < blanksCount; i++) this.shells.push('blank');

        this.shuffle(this.shells);
        this.initialLiveCount = livesCount;
        this.initialBlankCount = blanksCount;
        this.liveLeft = livesCount;
        this.blankLeft = blanksCount;

        this.onLog(`Loaded ${livesCount} live, ${blanksCount} blank shells.`, "system");

        // Give items
        const itemGrantCount = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < itemGrantCount; i++) {
            if (this.playerItems.length < 8) this.playerItems.push(this.randomItem());
            if (this.dealerItems.length < 8) this.dealerItems.push(this.randomItem());
        }

        this.onUpdate();
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    randomItem() {
        return this.itemTypes[Math.floor(Math.random() * this.itemTypes.length)];
    }

    useItem(user, itemIndex) {
        const items = user === 'player' ? this.playerItems : this.dealerItems;
        const item = items[itemIndex];

        this.onLog(`${user.toUpperCase()} used ${item}.`, user);

        switch (item) {
            case 'magnifier':
                const result = this.shells[0];
                if (user === 'player') {
                    this.onLog(`The current shell is ${result}.`, "system");
                } else {
                    this.knownShell = result;
                }
                break;
            case 'cigarette':
                if (user === 'player') this.playerLives = Math.min(this.playerLives + 1, 6);
                else this.dealerLives = Math.min(this.dealerLives + 1, 6);
                break;
            case 'beer':
                const ejected = this.shells.shift();
                if (ejected === 'live') this.liveLeft--;
                else this.blankLeft--;
                this.knownShell = null;
                this.onLog(`Ejected a ${ejected} shell.`, "system");
                break;
            case 'handcuffs':
                if (user === 'player') this.isHandcuffed.dealer = true;
                else this.isHandcuffed.player = true;
                break;
            case 'saw':
                this.isSawed = true;
                break;
        }

        items.splice(itemIndex, 1);
        this.onUpdate();

        if (this.shells.length === 0) {
            this.startRound();
        }
    }

    shoot(target) {
        const shell = this.shells.shift();
        if (shell === 'live') this.liveLeft--;
        else this.blankLeft--;

        const damage = this.isSawed ? 2 : 1;
        this.isSawed = false;

        this.onLog(`${this.turn.toUpperCase()} shot ${target.toUpperCase()}...`, this.turn);

        if (shell === 'live') {
            this.onLog("BANG! It was live.", "system");
            if (target === 'player') this.playerLives -= damage;
            else this.dealerLives -= damage;

            this.knownShell = null;
            this.checkGameOver();
            this.nextTurn(true);
        } else {
            this.onLog("CLICK. It was blank.", "system");
            this.knownShell = null;
            if (this.turn === 'player' && target === 'player') {
                // Shoot self with blank = extra turn
                this.onLog("Extra turn for Player.", "system");
                this.onUpdate();
            } else if (this.turn === 'dealer' && target === 'dealer') {
                this.onLog("Extra turn for Dealer.", "system");
                this.onUpdate();
            } else {
                this.nextTurn(false);
            }
        }

        if (this.shells.length === 0 && this.playerLives > 0 && this.dealerLives > 0) {
            this.startRound();
        }
    }

    nextTurn(hit) {
        if (this.turn === 'player') {
            if (this.isHandcuffed.dealer) {
                this.isHandcuffed.dealer = false;
                this.onLog("Dealer is handcuffed, player goes again.", "system");
            } else {
                this.turn = 'dealer';
            }
        } else {
            if (this.isHandcuffed.player) {
                this.isHandcuffed.player = false;
                this.onLog("Player is handcuffed, dealer goes again.", "system");
            } else {
                this.turn = 'player';
            }
        }
        this.onUpdate();
    }

    checkGameOver() {
        if (this.playerLives <= 0) {
            this.onGameOver('dealer');
        } else if (this.dealerLives <= 0) {
            this.onGameOver('player');
        }
    }
}
