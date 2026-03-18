const express = require('express');
const bodyParser = require('body-parser');
const obfuscator = require('./obfuscator');

const app = express();
const port = process.env.PORT || 3000; // Private port

// Middleware to parse raw text body
app.use(bodyParser.text({ type: '*/*' }));

// Route to obfuscate Lua code
app.post('/obfuscate', (req, res) => {
    const luaCode = req.body;

    if (!luaCode || typeof luaCode !== 'string') {
        return res.status(400).send('Bad Request: Please provide Lua script in the request body.');
    }

    try {
        const obfuscatedCode = obfuscator.obfuscate(luaCode);
        res.setHeader('Content-Type', 'text/plain');
        res.send(obfuscatedCode);
    } catch (error) {
        console.error('Obfuscation error:', error);
        res.status(500).send('Internal Server Error: Failed to obfuscate the script.');
    }
});

app.listen(port, () => {
    console.log(`[Obfuscator Service] Listening on private port ${port}`);
});
