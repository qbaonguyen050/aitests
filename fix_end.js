const fs = require('fs');
let code = fs.readFileSync('Gui.js', 'utf8');

// There's a trailing fragment added at the bottom somehow.
// `) || k.startsWith('__reactInternalInstance`

// Let's truncate everything after `})();`
const endStr = '})();';
const endIndex = code.indexOf(endStr);
if (endIndex !== -1) {
    code = code.substring(0, endIndex + endStr.length) + '\n';
}

fs.writeFileSync('Gui.js', code);
