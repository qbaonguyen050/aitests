const fs = require('fs');

// The error shows "Cannot read properties of undefined (reading 'liveGameController')"
// This means a().stateNode is undefined, or the React owner returned by window.getBlooketReactOwner() is undefined/null.

// Blooket uses React 18 / Fiber. Sometimes the fiber.stateNode is what we want, sometimes we want fiber.memoizedProps directly, or it might be on another fiber child.
// Furthermore, the game is now running on a specific subdomain (e.g., dinos.blooket.com, play.blooket.com, dashboard.blooket.com)
// The user's logs indicate: "origin":"https://dinos.blooket.com", pathname: "/69f355bb4d06764ec59fa19e/play/..."
// On dinos.blooket.com (the play screen), the react root structure might be different or the root class could be different.

// Let's improve the getBlooketReactOwner function.
let code = fs.readFileSync('Gui.js', 'utf8');

const newReactHelper = `
window.getBlooketReactOwner = function() {
    try {
        // Try all divs, find the one with the react fiber attached.
        const allDivs = document.querySelectorAll('div');
        for (let i = 0; i < allDivs.length; i++) {
            const node = allDivs[i];
            const reactKey = Object.keys(node).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
            if (reactKey && node[reactKey]) {
                let fiber = node[reactKey];

                // We want to find a fiber that has the client props or liveGameController props.
                // Usually this is on a host component or a wrapper.
                // Let's traverse UP to find it.
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

        // Fallback to the old logic if specific props aren't found.
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
`;

code = code.replace(/window\.getBlooketReactOwner = function\(\) \{[\s\S]*?    return Object\.values\(document\.querySelector\('#app>div>div'\) \|\| \{\}\)\[1\]\?\.children\?\.\[0\]\?\._owner;\n\};\n/g, newReactHelper);

fs.writeFileSync('Gui.js', code);
