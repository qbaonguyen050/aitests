/**
 * Zip's Blooket Hacks & Cheats GUI (Refactored & Improved)
 * Optimized for performance, modularity, and aesthetics.
 */

(function() {
    'use strict';

    // --- Configuration & Constants ---
    const VERSION = '3.0.0';
    const GUI_ID = 'zips-blooket-gui';
    const THEME_COLOR = '#0bc2cf';
    const ACCENT_COLOR = '#9a49aa';
    const BG_COLOR = 'rgba(20, 20, 25, 0.95)';

    // --- Utility Functions ---
    const utils = {
        create(tag, props = {}, children = []) {
            const el = document.createElement(tag);
            const { style, ...otherProps } = props;

            Object.assign(el, otherProps);
            if (style && typeof style === 'object') {
                Object.assign(el.style, style);
            }

            children.forEach(child => {
                if (typeof child === 'string') {
                    el.appendChild(document.createTextNode(child));
                } else if (child) {
                    el.appendChild(child);
                }
            });
            return el;
        },

        /**
         * Robustly finds the React stateNode for a given element or the main app.
         */
        getStateNode(target = document.querySelector('#app > div > div')) {
            try {
                if (!target) return null;
                const key = Object.keys(target).find(k => k.startsWith('__reactInternalInstance') || k.startsWith('__reactFiber'));
                if (!key) return null;

                let fiber = target[key];
                while (fiber && !fiber.stateNode) {
                    fiber = fiber.return;
                }
                return fiber ? fiber.stateNode : null;
            } catch (e) {
                return null;
            }
        },

        /**
         * Traditional Blooket React handler traversal.
         */
        getReactHandler() {
            return this.getStateNode(); // Use the more robust version
        },

        blockAntiCheat() {
            if (window.fetch.isBlocked) return;
            const originalFetch = window.fetch;
            window.fetch = async (...args) => {
                const url = typeof args[0] === 'string' ? args[0] : (args[0] instanceof Request ? args[0].url : '');
                if (url.includes('s.blooket.com/rc')) {
                    console.log('%c [Anti-Cheat] %c Blocked report to Blooket ', 'background: #f44336; color: white;', '');
                    return new Response(JSON.stringify({ success: true }), { status: 200 });
                }
                return originalFetch(...args);
            };
            window.fetch.isBlocked = true;
        }
    };

    // --- GUI Class ---
    class BlooketGui {
        constructor() {
            this.container = null;
            this.content = null;
            this.sidebar = null;
            this.cheats = {};
            this.activeCategory = null;
            this.isMinimized = false;
            this.searchQuery = '';
        }

        init() {
            if (document.getElementById(GUI_ID)) {
                document.getElementById(GUI_ID).remove();
            }
            utils.blockAntiCheat();
            this.injectStyles();
            this.createUI();
            this.setupDraggable();
            this.setupKeybinds();
            console.log(`%c Zip's Blooket GUI v${VERSION} Initialized `, `background: ${THEME_COLOR}; color: white; font-weight: bold; padding: 2px 4px; border-radius: 4px;`);
        }

        injectStyles() {
            const STYLE_ID = `${GUI_ID}-styles`;
            if (document.getElementById(STYLE_ID)) return;

            const css = `
                #${GUI_ID} {
                    position: fixed;
                    top: 50px;
                    left: 50px;
                    width: 700px;
                    height: 450px;
                    background: ${BG_COLOR};
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                    color: white;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    z-index: 999999;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    backdrop-filter: blur(10px);
                    transition: height 0.3s ease, width 0.3s ease, opacity 0.2s;
                }

                #${GUI_ID}.minimized {
                    height: 40px;
                    width: 200px;
                }

                .gui-header {
                    padding: 10px 15px;
                    background: rgba(255, 255, 255, 0.05);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: move;
                    user-select: none;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .gui-title {
                    font-weight: bold;
                    color: ${THEME_COLOR};
                    font-size: 16px;
                }

                .gui-controls button {
                    background: none;
                    border: none;
                    color: #ccc;
                    cursor: pointer;
                    margin-left: 10px;
                    font-size: 14px;
                    transition: color 0.2s;
                }

                .gui-controls button:hover {
                    color: white;
                }

                .gui-body {
                    flex: 1;
                    display: flex;
                    overflow: hidden;
                }

                .gui-sidebar {
                    width: 180px;
                    background: rgba(0, 0, 0, 0.2);
                    border-right: 1px solid rgba(255, 255, 255, 0.05);
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }

                .category-btn {
                    padding: 12px 15px;
                    text-align: left;
                    background: none;
                    border: none;
                    color: #aaa;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 14px;
                    border-left: 3px solid transparent;
                }

                .category-btn:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                }

                .category-btn.active {
                    background: rgba(11, 194, 207, 0.1);
                    color: ${THEME_COLOR};
                    border-left-color: ${THEME_COLOR};
                }

                .gui-main {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }

                .search-container {
                    margin-bottom: 15px;
                }

                #gui-search {
                    width: 100%;
                    padding: 8px 12px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    color: white;
                    box-sizing: border-box;
                    outline: none;
                }

                .cheat-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 15px;
                }

                .cheat-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    padding: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    transition: transform 0.2s, background 0.2s;
                }

                .cheat-card:hover {
                    background: rgba(255, 255, 255, 0.06);
                    transform: translateY(-2px);
                }

                .cheat-name {
                    font-weight: 600;
                    font-size: 14px;
                    color: #eee;
                }

                .cheat-desc {
                    font-size: 12px;
                    color: #999;
                    line-height: 1.4;
                }

                .cheat-action {
                    margin-top: auto;
                }

                .btn-primary {
                    width: 100%;
                    padding: 6px;
                    background: ${THEME_COLOR};
                    border: none;
                    border-radius: 4px;
                    color: black;
                    font-weight: bold;
                    cursor: pointer;
                    transition: filter 0.2s;
                }

                .btn-primary:hover {
                    filter: brightness(1.2);
                }

                .toggle-btn {
                    width: 100%;
                    padding: 6px;
                    background: #444;
                    border: none;
                    border-radius: 4px;
                    color: white;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .toggle-btn.enabled {
                    background: #47A547;
                }

                .toggle-btn.disabled {
                    background: #A02626;
                }

                .cheat-input {
                    width: 100%;
                    padding: 4px 8px;
                    background: rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 4px;
                    color: white;
                    font-size: 12px;
                    margin-top: 5px;
                }

                /* Scrollbar Styles */
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 3px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
            `;
            const styleEl = utils.create('style', { id: STYLE_ID, innerHTML: css });
            document.head.appendChild(styleEl);
        }

        createUI() {
            this.container = utils.create('div', { id: GUI_ID });

            const header = utils.create('div', { className: 'gui-header' }, [
                utils.create('div', { className: 'gui-title', innerText: "Zip's Blooket GUI" }),
                utils.create('div', { className: 'gui-controls' }, [
                    utils.create('button', { innerText: '_', onclick: () => this.toggleMinimize() }),
                    utils.create('button', { innerText: 'X', onclick: () => this.close() })
                ])
            ]);

            const body = utils.create('div', { className: 'gui-body' });
            this.sidebar = utils.create('div', { className: 'gui-sidebar' });

            const main = utils.create('div', { className: 'gui-main' });
            const searchContainer = utils.create('div', { className: 'search-container' });
            const searchInput = utils.create('input', {
                id: 'gui-search',
                type: 'text',
                placeholder: 'Search cheats...',
                oninput: (e) => this.handleSearch(e.target.value)
            });
            searchContainer.appendChild(searchInput);

            this.content = utils.create('div', { className: 'cheat-grid' });

            main.appendChild(searchContainer);
            main.appendChild(this.content);
            body.appendChild(this.sidebar);
            body.appendChild(main);

            this.container.appendChild(header);
            this.container.appendChild(body);
            document.body.appendChild(this.container);
        }

        toggleMinimize() {
            this.isMinimized = !this.isMinimized;
            this.container.classList.toggle('minimized', this.isMinimized);
        }

        close() {
            this.container.style.opacity = '0';
            setTimeout(() => this.container.remove(), 200);
        }

        handleSearch(query) {
            this.searchQuery = query.toLowerCase();
            this.renderCheats();
        }

        setupDraggable() {
            const header = this.container.querySelector('.gui-header');
            let x = 0, y = 0, mouseX = 0, mouseY = 0;

            header.onmousedown = (e) => {
                e.preventDefault();
                mouseX = e.clientX;
                mouseY = e.clientY;
                document.onmouseup = () => {
                    document.onmouseup = null;
                    document.onmousemove = null;
                };
                document.onmousemove = (e) => {
                    e.preventDefault();
                    x = mouseX - e.clientX;
                    y = mouseY - e.clientY;
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                    this.container.style.top = (this.container.offsetTop - y) + "px";
                    this.container.style.left = (this.container.offsetLeft - x) + "px";
                };
            };
        }

        setupKeybinds() {
            window.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'e') {
                    e.preventDefault();
                    this.container.style.display = this.container.style.display === 'none' ? 'flex' : 'none';
                }
            });
        }

        addCategory(name, icon) {
            if (!this.cheats[name]) {
                this.cheats[name] = [];
                const btn = utils.create('button', {
                    className: 'category-btn',
                    innerText: name,
                    onclick: () => this.switchCategory(name)
                });
                this.sidebar.appendChild(btn);
                if (!this.activeCategory) this.switchCategory(name);
            }
        }

        switchCategory(name) {
            this.activeCategory = name;
            Array.from(this.sidebar.children).forEach(btn => {
                btn.classList.toggle('active', btn.innerText === name);
            });
            this.renderCheats();
        }

        registerCheat(category, cheat) {
            if (!this.cheats[category]) {
                this.addCategory(category);
            }
            this.cheats[category].push(cheat);
            if (this.activeCategory === category) this.renderCheats();
        }

        renderCheats() {
            this.content.innerHTML = '';
            let itemsToRender = [];

            if (this.searchQuery) {
                Object.keys(this.cheats).forEach(cat => {
                    this.cheats[cat].forEach(cheat => {
                        if (cheat.name.toLowerCase().includes(this.searchQuery) ||
                            cheat.description.toLowerCase().includes(this.searchQuery)) {
                            itemsToRender.push(cheat);
                        }
                    });
                });
            } else if (this.activeCategory) {
                itemsToRender = this.cheats[this.activeCategory];
            }

            itemsToRender.forEach(cheat => {
                const card = utils.create('div', { className: 'cheat-card' }, [
                    utils.create('div', { className: 'cheat-name', innerText: cheat.name }),
                    utils.create('div', { className: 'cheat-desc', innerText: cheat.description })
                ]);

                const actionArea = utils.create('div', { className: 'cheat-action' });

                if (cheat.type === 'toggle') {
                    const btn = utils.create('button', {
                        className: `toggle-btn ${cheat.enabled ? 'enabled' : 'disabled'}`,
                        innerText: cheat.enabled ? 'Enabled' : 'Disabled',
                        onclick: () => {
                            cheat.enabled = !cheat.enabled;
                            btn.className = `toggle-btn ${cheat.enabled ? 'enabled' : 'disabled'}`;
                            btn.innerText = cheat.enabled ? 'Enabled' : 'Disabled';
                            cheat.run(cheat.enabled);
                        }
                    });
                    actionArea.appendChild(btn);
                } else {
                    const btn = utils.create('button', {
                        className: 'btn-primary',
                        innerText: 'Run',
                        onclick: () => {
                            const inputs = Array.from(card.querySelectorAll('.cheat-input')).map(i => i.value);
                            cheat.run(...inputs);
                        }
                    });
                    if (cheat.inputs) {
                        cheat.inputs.forEach(inputDef => {
                            const input = utils.create('input', {
                                className: 'cheat-input',
                                type: inputDef.type || 'text',
                                placeholder: inputDef.name,
                                value: inputDef.defaultValue || ''
                            });
                            actionArea.appendChild(input);
                        });
                    }
                    actionArea.appendChild(btn);
                }

                card.appendChild(actionArea);
                this.content.appendChild(card);
            });
        }
    }

    // --- Instantiate ---
    const gui = new BlooketGui();
    window.zipsBlooketGui = gui; // Export to window for debugging
    gui.init();

    // --- Initial Cheats Setup ---

    // Global Cheats
    gui.registerCheat('Global', {
        name: 'Auto Answer',
        description: 'Automatically answers questions correctly.',
        type: 'toggle',
        enabled: false,
        run: function(enabled) {
            if (!enabled) {
                clearInterval(this.interval);
                return;
            }
            this.interval = setInterval(() => {
                const stateNode = utils.getReactHandler();
                if (!stateNode) return;
                try {
                    const question = stateNode.state.question || stateNode.props.client.question;
                    if (!question) return;

                    if (stateNode.state.stage === 'feedback' || stateNode.state.feedback) {
                        const feedback = document.querySelector('[class*="feedback"]');
                        if (feedback) feedback.firstChild.click();
                    } else {
                        const answers = document.querySelectorAll('[class*="answerContainer"]');
                        if (answers.length > 0) {
                            const correctIndex = question.answers.findIndex(a => question.correctAnswers.includes(a));
                            if (correctIndex !== -1) answers[correctIndex].click();
                        } else if (stateNode.sendAnswer) {
                            stateNode.sendAnswer(question.correctAnswers[0]);
                        }
                    }
                } catch (e) {}
            }, 200);
        }
    });

    gui.registerCheat('Global', {
        name: 'Highlight Answers',
        description: 'Highlights the correct answer in green and others in red.',
        type: 'toggle',
        enabled: false,
        run: function(enabled) {
            if (!enabled) {
                clearInterval(this.interval);
                document.querySelectorAll('[class*="answerContainer"]').forEach(a => a.style.backgroundColor = '');
                return;
            }
            this.interval = setInterval(() => {
                const stateNode = utils.getReactHandler();
                if (!stateNode) return;
                const question = stateNode.state.question || stateNode.props.client.question;
                if (!question) return;

                document.querySelectorAll('[class*="answerContainer"]').forEach((el, i) => {
                    const isCorrect = question.correctAnswers.includes(question.answers[i]);
                    el.style.backgroundColor = isCorrect ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';
                });
            }, 200);
        }
    });

    // Gold Quest Cheats
    gui.registerCheat('Gold Quest', {
        name: 'Always Triple Gold',
        description: 'Always gives you Triple Gold from chests.',
        type: 'toggle',
        enabled: false,
        run: function(enabled) {
            if (!enabled) {
                clearInterval(this.interval);
                document.querySelectorAll('.esp-text').forEach(e => e.remove());
                return;
            }
            this.interval = setInterval(() => {
                const stateNode = utils.getReactHandler();
                if (stateNode && stateNode.state.stage === 'prize') {
                    stateNode.state.choices.forEach(choice => {
                        choice.type = 'multiply';
                        choice.val = 3;
                        choice.text = 'Triple Gold!';
                    });
                }
            }, 100);
        }
    });

    gui.registerCheat('Gold Quest', {
        name: 'Chest ESP',
        description: 'Shows what is inside each chest.',
        type: 'toggle',
        enabled: false,
        run: function(enabled) {
            if (!enabled) {
                clearInterval(this.interval);
                return;
            }
            this.interval = setInterval(() => {
                const stateNode = utils.getReactHandler();
                if (stateNode && stateNode.state.stage === 'prize') {
                    stateNode.state.choices.forEach((choice, i) => {
                        const chest = document.querySelector(`[class*="choice${i + 1}"]`);
                        if (chest && !chest.querySelector('.esp-text')) {
                            const text = utils.create('div', {
                                className: 'esp-text',
                                innerText: choice.text,
                                style: {
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '20px',
                                    color: 'white',
                                    textShadow: '0 0 4px black',
                                    pointerEvents: 'none',
                                    zIndex: '9999'
                                }
                            });
                            chest.appendChild(text);
                        }
                    });
                } else {
                    document.querySelectorAll('.esp-text').forEach(e => e.remove());
                }
            }, 200);
        }
    });

    // Crypto Hack Cheats
    gui.registerCheat('Crypto Hack', {
        name: 'Password ESP',
        description: 'Highlights the correct password when hacking.',
        type: 'toggle',
        enabled: false,
        run: function(enabled) {
            if (!enabled) {
                clearInterval(this.interval);
                document.querySelectorAll('[class*="button"]').forEach(btn => {
                    btn.style.outline = '';
                    btn.style.opacity = '';
                });
                return;
            }
            this.interval = setInterval(() => {
                const stateNode = utils.getReactHandler();
                if (stateNode && stateNode.state.stage === 'hack') {
                    const correct = stateNode.state.correctPassword;
                    document.querySelectorAll('[class*="button"]').forEach(btn => {
                        if (btn.innerText === correct) {
                            btn.style.outline = '4px solid #00ff00';
                        } else {
                            btn.style.opacity = '0.5';
                        }
                    });
                }
            }, 200);
        }
    });

    // Cafe Cheats
    gui.registerCheat('Cafe', {
        name: 'Set Cash',
        description: 'Sets your current Cafe cash.',
        inputs: [{ name: 'Amount', type: 'number', defaultValue: '1000000' }],
        run: function(amount) {
            const stateNode = utils.getReactHandler();
            if (stateNode) {
                stateNode.setState({ cafeCash: parseInt(amount) });
            }
        }
    });

    gui.registerCheat('Cafe', {
        name: 'Stock All Food',
        description: 'Sets all food stock to 99.',
        run: function() {
            const stateNode = utils.getReactHandler();
            if (stateNode && stateNode.state.foods) {
                stateNode.setState({
                    foods: stateNode.state.foods.map(f => ({ ...f, stock: 99 }))
                });
            }
        }
    });

    // Factory Cheats
    gui.registerCheat('Factory', {
        name: 'Free Upgrades',
        description: 'Makes all upgrades free.',
        type: 'toggle',
        enabled: false,
        run: function(enabled) {
            if (!enabled) {
                clearInterval(this.interval);
                return;
            }
            this.interval = setInterval(() => {
                const stateNode = utils.getReactHandler();
                if (stateNode && stateNode.state.blooks) {
                    stateNode.setState({
                        blooks: stateNode.state.blooks.map(b => ({ ...b, price: [0, 0, 0, 0] }))
                    });
                }
            }, 500);
        }
    });

})();
