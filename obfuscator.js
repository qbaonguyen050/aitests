// Lightweight Lua/LuaU Obfuscator
const crypto = require('crypto');

// Utility to generate a random string of confusing characters
function generateRandomName(length = 8) {
    const chars = 'O0Il';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Ensure it doesn't start with a number
    if (result[0] === '0') {
        result = 'O' + result.substring(1);
    }
    return result;
}

// Convert string to byte array
function stringToBytes(str) {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i));
    }
    return bytes;
}

// Obfuscate a string via basic shift cipher + byte conversion
function encryptString(str, shiftAmount) {
    const bytes = stringToBytes(str);
    return bytes.map(b => b + shiftAmount);
}

// This function processes the raw Lua code
function obfuscate(luaCode) {
    // 1. We will use `loadstring` or `load` dynamically.
    // We will base64 encode or simple shift the core code.
    // For LuaU (Roblox), loadstring is disabled by default, but scripts use `loadstring` module or executors use native loadstring.
    // To be universally compatible and lightweight, we'll embed the script logic in a byte array and decode it at runtime.

    const shiftKey = Math.floor(Math.random() * 50) + 1;
    const encryptedBytes = encryptString(luaCode, shiftKey);
    const bytesArrayStr = '{' + encryptedBytes.join(',') + '}';

    const decoderFuncName = generateRandomName(10);
    const loopVar = generateRandomName(6);
    const resultVar = generateRandomName(8);
    const shiftVar = generateRandomName(6);
    const byteListVar = generateRandomName(12);

    const check1Func = generateRandomName(10);
    const check2Func = generateRandomName(10);
    const check3Func = generateRandomName(10);

    const loadFunc = generateRandomName(8);

    // First part: Basic Integrity Check (check if core functions like string.char are tampered)
    const integrityCheck1 = `
local ${check1Func} = function()
    local sc = string.char
    local t = type(sc)
    if t ~= "function" then
        game:GetService("Players").LocalPlayer:Kick("TAMPERING DETECTED!")
    end
    -- In Roblox, C functions usually return 'C' or '[C]' for debug.info or similar, but executors vary.
    -- A safe check is to ensure it hasn't been hooked by a simple Lua function if debug is available.
    local s, r = pcall(function() return debug.info(sc, "s") end)
    if s and r ~= "[C]" then
        game:GetService("Players").LocalPlayer:Kick("TAMPERING DETECTED!")
    end
end
${check1Func}()
`;

    // Middle part: Check during decoding
    // We will encode this check so it runs implicitly.
    // However, as requested, we place it in the middle of our script.
    const integrityCheck2 = `
local ${check2Func} = function()
    if ${shiftVar} ~= ${shiftKey} then
        game:GetService("Players").LocalPlayer:Kick("TAMPERING DETECTED!")
    end
end
${check2Func}()
`;

    // Last part: Final Integrity Check (check resulting string length or load function)
    const expectedLength = luaCode.length;
    const integrityCheck3 = `
local ${check3Func} = function(res)
    if #res ~= ${expectedLength} then
        game:GetService("Players").LocalPlayer:Kick("TAMPERING DETECTED!")
    end
    if not game or not workspace then
        game:GetService("Players").LocalPlayer:Kick("TAMPERING DETECTED!")
    end
end
${check3Func}(${resultVar})
`;

    // Assembling the obfuscated script
    const obfuscatedScript = `
-- Obfuscated by Lightweight Lua/LuaU Obfuscator
local ${loadFunc} = loadstring or load
if not ${loadFunc} then
    game:GetService("Players").LocalPlayer:Kick("TAMPERING DETECTED!")
end

${integrityCheck1}

local ${byteListVar} = ${bytesArrayStr}
local ${shiftVar} = ${shiftKey}
local ${resultVar} = ""

for ${loopVar} = 1, #${byteListVar} do
    ${resultVar} = ${resultVar} .. string.char(${byteListVar}[${loopVar}] - ${shiftVar})
    if ${loopVar} == math.floor(#${byteListVar} / 2) then
        ${integrityCheck2}
    end
end

${integrityCheck3}

local success, err = pcall(function()
    ${loadFunc}(${resultVar})()
end)
if not success then
    -- error running or tampering
    game:GetService("Players").LocalPlayer:Kick("TAMPERING DETECTED!")
end
`;

    return obfuscatedScript.trim();
}

module.exports = {
    obfuscate
};
