let game, ai, scene, camera, renderer, shotgun, table;
let itemsInScene = [];

function init() {
    game = new Game();
    ai = new DealerAI(game);

    // Setup Three.js
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 5);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // Lighting
    const spotLight = new THREE.SpotLight(0xffffff, 5);
    spotLight.position.set(0, 10, 0);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.3;
    spotLight.castShadow = true;
    scene.add(spotLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 1.0);
    scene.add(ambientLight);

    // Table
    const tableGeometry = new THREE.BoxGeometry(10, 0.5, 6);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.receiveShadow = true;
    scene.add(table);

    // Dealer Representation (Simple)
    const dealerHead = new THREE.Mesh(new THREE.BoxGeometry(1, 1.2, 0.8), new THREE.MeshStandardMaterial({ color: 0x0a0a0a }));
    dealerHead.position.set(0, 3, -4);
    scene.add(dealerHead);

    // Shotgun
    const shotgunGroup = new THREE.Group();
    const barrel1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3, 16), new THREE.MeshStandardMaterial({ color: 0x222222 }));
    barrel1.position.x = -0.12;
    const barrel2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3, 16), new THREE.MeshStandardMaterial({ color: 0x222222 }));
    barrel2.position.x = 0.12;
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 1.5), new THREE.MeshStandardMaterial({ color: 0x3d2b1f }));
    stock.position.z = 2.2;

    shotgunGroup.add(barrel1, barrel2, stock);
    shotgunGroup.rotation.x = Math.PI / 2;
    shotgunGroup.position.set(0, 1, 0);
    shotgun = shotgunGroup;
    scene.add(shotgun);

    // Items visualization
    updateItemMeshes();

    // Hook up game events
    game.onLog = (msg, type) => {
        const output = document.getElementById('output');
        const entry = document.createElement('div');
        entry.className = `log-entry log-${type}`;
        entry.innerText = msg;
        output.appendChild(entry);
        output.scrollTop = output.scrollHeight;

        // Audio triggers
        if (msg.includes("BANG")) playSound("bang");
        if (msg.includes("CLICK")) playSound("click");
        if (msg.includes("Loaded")) playSound("load");
        if (msg.includes("used")) playSound("item");
    };

    game.onUpdate = updateUI;
    game.onGameOver = (winner) => {
        alert(`GAME OVER! Winner: ${winner.toUpperCase()}`);
        location.reload();
    };

    // UI Controls
    document.getElementById('shoot-self').onclick = () => {
        if (game.turn === 'player') {
            animateShoot('player', () => game.shoot('player'));
        }
    };
    document.getElementById('shoot-opponent').onclick = () => {
        if (game.turn === 'player') {
            animateShoot('dealer', () => game.shoot('dealer'));
        }
    };

    window.addEventListener('resize', onWindowResize, false);

    game.startRound();
    animate();
}

function updateItemMeshes() {
    // Remove old items
    itemsInScene.forEach(item => scene.remove(item));
    itemsInScene = [];

    // Visualize player items
    game.playerItems.forEach((type, i) => {
        const mesh = createItemMesh(type);
        mesh.position.set(-4 + i * 0.8, 0.5, 2);
        scene.add(mesh);
        itemsInScene.push(mesh);
    });

    // Visualize dealer items
    game.dealerItems.forEach((type, i) => {
        const mesh = createItemMesh(type);
        mesh.position.set(4 - i * 0.8, 0.5, -2);
        scene.add(mesh);
        itemsInScene.push(mesh);
    });
}

function createItemMesh(type) {
    const colors = { magnifier: 0x0000ff, cigarette: 0xffffff, beer: 0xffff00, handcuffs: 0x888888, saw: 0xff0000 };
    const geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const mat = new THREE.MeshStandardMaterial({ color: colors[type] || 0xcccccc });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    return mesh;
}

function updateUI() {
    updateItemMeshes();
    document.getElementById('player-lives').innerText = game.playerLives;
    document.getElementById('dealer-lives').innerText = game.dealerLives;
    document.getElementById('live-count').innerText = game.liveLeft;
    document.getElementById('blank-count').innerText = game.blankLeft;

    // Items
    const playerItemsDiv = document.getElementById('player-items');
    playerItemsDiv.innerText = JSON.stringify(game.playerItems);

    const dealerItemsDiv = document.getElementById('dealer-items');
    dealerItemsDiv.innerText = JSON.stringify(game.dealerItems);

    const itemBtns = document.getElementById('item-buttons');
    itemBtns.innerHTML = '';
    game.playerItems.forEach((item, index) => {
        const btn = document.createElement('button');
        btn.className = 'game-btn item-btn';
        btn.innerText = item.toUpperCase();
        btn.onclick = () => game.useItem('player', index);
        itemBtns.appendChild(btn);
    });

    const isPlayerTurn = game.turn === 'player';
    document.getElementById('shoot-self').disabled = !isPlayerTurn;
    document.getElementById('shoot-opponent').disabled = !isPlayerTurn;
    Array.from(itemBtns.children).forEach(b => b.disabled = !isPlayerTurn);

    if (game.turn === 'dealer') {
        setTimeout(dealerTurn, 1500);
    }
}

function dealerTurn() {
    if (game.turn !== 'dealer') return;
    const decision = ai.makeDecision();
    if (decision.action === 'useItem') {
        game.useItem('dealer', decision.index);
    } else if (decision.action === 'shoot') {
        animateShoot(decision.target, () => game.shoot(decision.target));
    }
}

function animateShoot(target, callback) {
    const targetRotation = target === 'player' ? Math.PI : 0;
    const duration = 500;
    const startRotation = shotgun.rotation.y;
    const startTime = performance.now();

    function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        shotgun.rotation.y = startRotation + (targetRotation - startRotation) * progress;
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            setTimeout(callback, 200);
        }
    }
    requestAnimationFrame(step);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Audio Synthesis
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    switch (type) {
        case 'bang':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);
            break;
        case 'click':
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
            break;
        case 'load':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
            break;
        case 'item':
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.2);
            break;
    }
}

window.onload = init;
