const fs = require('fs');
let code = fs.readFileSync('Gui.js', 'utf8');

// The replacement was probably missing a '$' causing string literal failure or something.

// Let's completely wipe the first ~80 lines until the `(async () => {` block and inject our helper cleanly.
const match = code.match(/\(async \(\) => \{/);
if (match) {
    code = code.substring(match.index);
}

const safeReactHelper = `
window.getBlooketReactOwner = function() {
    try {
        const allDivs = document.querySelectorAll('div');
        for (let i = 0; i < allDivs.length; i++) {
            const node = allDivs[i];
            const reactKey = Object.keys(node).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
            if (reactKey && node[reactKey]) {
                let fiber = node[reactKey];

                while(fiber) {
                    if (fiber.memoizedProps && fiber.memoizedProps.client) {
                        return { stateNode: { props: fiber.memoizedProps }, props: fiber.memoizedProps };
                    }
                    if (fiber.memoizedProps && fiber.memoizedProps.liveGameController) {
                         return { stateNode: { props: fiber.memoizedProps }, props: fiber.memoizedProps };
                    }

                    if (fiber.stateNode && fiber.stateNode.props) {
                        if (fiber.stateNode.props.client || fiber.stateNode.props.liveGameController) {
                             return fiber.stateNode._reactInternals || fiber;
                        }
                    }
                    fiber = fiber.return;
                }
            }
        }

        const nodes = [
            document.querySelector('#app>div>div'),
            document.querySelector('body div[id] > div > div'),
            document.querySelector('body div[class*="_body"]')
        ];

        for (let node of nodes) {
            if (!node) continue;

            const vals = Object.values(node);
            if (vals[1] && vals[1].children) {
                if (vals[1].children[0] && vals[1].children[0]._owner) return vals[1].children[0]._owner;
                if (vals[1].children[1] && vals[1].children[1]._owner) return vals[1].children[1]._owner;
            }

            const reactKey = Object.keys(node).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
            if (reactKey && node[reactKey]) {
                let fiber = node[reactKey];
                while(fiber && !fiber.stateNode) {
                    fiber = fiber.return;
                }
                if (fiber && fiber.stateNode) {
                    return fiber.stateNode._reactInternals || fiber;
                }
            }
        }
    } catch(e) {}

    return Object.values(document.querySelector('#app>div>div') || {})[1]?.children?.[0]?._owner;
};

window._capturedLogs = window._capturedLogs || [];
window._originalConsoleLog = window._originalConsoleLog || console.log;

function safeStringify(obj) {
    let cache = [];
    try {
        return JSON.stringify(obj, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (cache.includes(value)) return '[Circular]';
                cache.push(value);
            }
            return value;
        });
    } catch (e) {
        return '[Object]';
    } finally {
        cache = null;
    }
}

console.log = function(...args) {
    const msg = args.map(a => typeof a === 'object' ? safeStringify(a) : String(a)).join(' ');

    window._capturedLogs.push('[' + new Date().toLocaleTimeString() + '] ' + msg);
    if(window._capturedLogs.length > 200) window._capturedLogs.shift();

    const debugUI = document.getElementById('blooket-gui-debugger');
    if (debugUI) {
        debugUI.value = window._capturedLogs.join('\\n');
        debugUI.scrollTop = debugUI.scrollHeight;
    }
};

`;

code = safeReactHelper + code;
fs.writeFileSync('Gui.js', code);
