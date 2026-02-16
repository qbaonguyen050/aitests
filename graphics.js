let scene, camera, renderer, clock, raycaster, mouse;
let game, ai;
let shotgun, dealer, table, hpDevicePlayer, hpDeviceDealer;
let items3D = [];
let spotLight;
let selectedObject = null;
let isShotgunEquipped = false;

const ITEM_COLORS = {
    magnifier: 0x3498db,
    cigarette: 0xecf0f1,
    beer: 0xf1c40f,
    handcuffs: 0x95a5a6,
    saw: 0xc0392b
};

function init() {
    game = new Game();
    ai = new DealerAI(game);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020202);
    scene.fog = new THREE.Fog(0x020202, 5, 15);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.8, 4);
    camera.lookAt(0, 0.8, -1);

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), antialias: false });
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.imageRendering = 'pixelated';
    renderer.shadowMap.enabled = true;

    clock = new THREE.Clock();
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    createEnvironment();
    createTable();
    createShotgun();
    createDealer();
    createHPDevices();

    // Lighting
    const amb = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(amb);

    spotLight = new THREE.SpotLight(0xffffff, 1.5);
    spotLight.position.set(0, 5, 0);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    scene.add(spotLight);

    // Event hooks
    game.onUpdate = updateUI;
    game.onLog = (msg, type) => {
        const prompt = document.getElementById('interaction-prompt');
        prompt.innerText = msg.toUpperCase();
        prompt.className = `log-${type}`;
        setTimeout(() => { if(prompt.innerText === msg.toUpperCase()) prompt.innerText = ''; }, 3000);
    };
    game.onAction = handleGameAction;

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    game.initRound();
    animate();
}

function createEnvironment() {
    const roomGeo = new THREE.BoxGeometry(10, 8, 20);
    const roomMat = new THREE.MeshStandardMaterial({ color: 0x111111, side: THREE.BackSide });
    const room = new THREE.Mesh(roomGeo, roomMat);
    room.position.y = 3.5;
    room.receiveShadow = true;
    scene.add(room);
}

function createTable() {
    const tableGeo = new THREE.BoxGeometry(4, 0.1, 3);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x051a05 });
    table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = 0.8;
    table.receiveShadow = true;
    scene.add(table);

    const grid = new THREE.GridHelper(4, 10, 0x00ff00, 0x004400);
    grid.position.y = 0.86;
    scene.add(grid);
}

function createHPDevices() {
    const deviceGeo = new THREE.BoxGeometry(0.5, 0.3, 0.2);
    const deviceMat = new THREE.MeshStandardMaterial({ color: 0x222222 });

    hpDevicePlayer = new THREE.Group();
    const boxP = new THREE.Mesh(deviceGeo, deviceMat);
    hpDevicePlayer.add(boxP);
    hpDevicePlayer.position.set(-1.5, 1, 1);
    hpDevicePlayer.rotation.y = 0.5;
    scene.add(hpDevicePlayer);

    hpDeviceDealer = new THREE.Group();
    const boxD = new THREE.Mesh(deviceGeo, deviceMat);
    hpDeviceDealer.add(boxD);
    hpDeviceDealer.position.set(1.5, 1, -1);
    hpDeviceDealer.rotation.y = -0.5;
    scene.add(hpDeviceDealer);

    updateHPVisuals();
}

function updateHPVisuals() {
    [hpDevicePlayer, hpDeviceDealer].forEach(dev => {
        for(let i = dev.children.length - 1; i > 0; i--) dev.remove(dev.children[i]);
    });

    const createSeg = (val, max) => {
        const group = new THREE.Group();
        for(let i=0; i<max; i++) {
            const seg = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.15), new THREE.MeshBasicMaterial({ color: i < val ? 0x00ff00 : 0x003300 }));
            seg.position.set(-0.15 + i * 0.1, 0, 0.11);
            group.add(seg);
        }
        return group;
    };

    hpDevicePlayer.add(createSeg(game.playerHP, 4));
    hpDeviceDealer.add(createSeg(game.dealerHP, 4));
}

function createShotgun() {
    shotgun = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9 });
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 16), metalMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.z = -0.5;
    shotgun.add(barrel);

    const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.6), metalMat);
    receiver.position.z = 0.4;
    shotgun.add(receiver);

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x2e1a0b });
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.25, 0.6), woodMat);
    stock.position.set(0, -0.05, 0.9);
    shotgun.add(stock);

    shotgun.position.set(0, 0.95, 0);
    shotgun.userData = { interactable: true, type: 'shotgun' };
    scene.add(shotgun);
}

function createDealer() {
    dealer = new THREE.Group();
    const clothMat = new THREE.MeshStandardMaterial({ color: 0x050505 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.6, 1.5, 16), clothMat);
    body.position.y = 0.75;
    dealer.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), clothMat);
    head.position.y = 1.6;
    dealer.add(head);

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyeL = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.02), eyeMat);
    eyeL.position.set(-0.08, 1.65, 0.21);
    const eyeR = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.02), eyeMat);
    eyeR.position.set(0.08, 1.65, 0.21);
    dealer.add(eyeL, eyeR);

    dealer.position.set(0, 0.8, -1.8);
    dealer.userData = { interactable: true, type: 'dealer' };
    scene.add(dealer);
}

function updateItems3D() {
    items3D.forEach(i => scene.remove(i));
    items3D = [];

    game.playerItems.forEach((type, i) => {
        const mesh = createItemMesh(type);
        mesh.position.set(-1.5 + i * 0.4, 0.9, 0.5);
        mesh.userData = { interactable: true, type: 'item', index: i };
        scene.add(mesh);
        items3D.push(mesh);
    });

    game.dealerItems.forEach((type, i) => {
        const mesh = createItemMesh(type);
        mesh.position.set(1.5 - i * 0.4, 0.9, -0.5);
        mesh.rotation.y = Math.PI;
        scene.add(mesh);
        items3D.push(mesh);
    });
}

function createItemMesh(type) {
    const group = new THREE.Group();
    const color = ITEM_COLORS[type] || 0xffffff;
    const mat = new THREE.MeshStandardMaterial({ color });
    let geo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);
    return group;
}

function handleGameAction(action, data) {
    switch (action) {
        case 'shoot':
            isShotgunEquipped = false;
            animateShotgun(data);
            break;
        case 'load':
            playSfx('load');
            break;
        case 'item':
            playSfx('item');
            break;
        case 'gameOver':
            alert("GAME OVER. WINNER: " + data.toUpperCase());
            location.reload();
            break;
    }
}

function animateShotgun(data) {
    const { shooter, target, isLive } = data;
    const targetRot = target === 'player' ? Math.PI : 0;

    new TWEEN.Tween(shotgun.rotation).to({ y: targetRot, x: 0 }, 500).start().onComplete(() => {
        playSfx(isLive ? 'bang' : 'click');
        if (isLive) cameraShake();
        setTimeout(() => {
            new TWEEN.Tween(shotgun.position).to({ x: 0, y: 0.95, z: 0 }, 500).start();
            new TWEEN.Tween(shotgun.rotation).to({ x: 0, y: 0, z: 0 }, 500).start();
        }, 500);
    });
}

function cameraShake() {
    const originalPos = camera.position.clone();
    new TWEEN.Tween(camera.position).to({ x: (Math.random()-0.5)*0.2, y: 1.8 + (Math.random()-0.5)*0.2 }, 50).repeat(5).yoyo(true).onComplete(() => camera.position.copy(originalPos)).start();
}

function updateUI() {
    updateHPVisuals();
    updateItems3D();
    const isPlayer = game.turn === 'player';
    if (!isPlayer) {
        setTimeout(() => {
            const decision = ai.makeDecision();
            if (decision.action === 'item') game.useItem('dealer', decision.index);
            else if (decision.action === 'shoot') game.shoot(decision.target);
        }, 2000);
    }
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onClick() {
    if (game.turn !== 'player') return;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    let interactable = null;
    for(let hit of intersects) {
        let obj = hit.object;
        while(obj) {
            if(obj.userData && obj.userData.interactable) { interactable = obj; break; }
            obj = obj.parent;
        }
        if(interactable) break;
    }

    if(interactable) {
        const data = interactable.userData;
        if(data.type === 'shotgun' && !isShotgunEquipped) {
            isShotgunEquipped = true;
            new TWEEN.Tween(shotgun.position).to({ y: 1.4, z: 1.5 }, 500).start();
            game.log("CHOOSE TARGET", 'system');
        } else if(data.type === 'dealer' && isShotgunEquipped) {
            game.shoot('dealer');
        } else if(data.type === 'item' && !isShotgunEquipped) {
            game.useItem('player', data.index);
        }
    } else if(isShotgunEquipped) {
        // Clicked elsewhere (e.g. self area)
        if(mouse.y < -0.2) game.shoot('player');
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2, false);
}

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    const t = clock.getElapsedTime();
    if (dealer) dealer.position.y = 0.8 + Math.sin(t * 1.5) * 0.02;
    camera.position.y = 1.8 + Math.sin(t * 0.5) * 0.05;
    if (spotLight) spotLight.intensity = 1.4 + Math.random() * 0.2;
    const scanline = document.getElementById('crt-overlay');
    if (scanline) scanline.style.backgroundPositionY = (t * 50) + 'px';
    renderer.render(scene, camera);
}

const TWEEN = {
    _tweens: [],
    Tween: class {
        constructor(obj) { this.obj = obj; this._onComplete = () => {}; }
        to(props, dur) { this.props = props; this.dur = dur; return this; }
        onComplete(cb) { this._onComplete = cb; return this; }
        repeat(n) { this._repeat = n; return this; } yoyo(v) { this._yoyo = v; return this; }
        start() { this.startTime = performance.now(); this.startProps = {}; for(let k in this.props) this.startProps[k] = this.obj[k]; TWEEN._tweens.push(this); return this; }
        update(now) {
            let p = (now - this.startTime) / this.dur;
            if (p >= 1) { for(let k in this.props) this.obj[k] = this.props[k]; this._onComplete(); return false; }
            for(let k in this.props) this.obj[k] = this.startProps[k] + (this.props[k] - this.startProps[k]) * p;
            return true;
        }
    },
    update: function() { let now = performance.now(); this._tweens = this._tweens.filter(t => t.update(now)); }
};

window.onload = init;
