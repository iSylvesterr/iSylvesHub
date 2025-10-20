// build_obf.js
// usage: node build_obf.js <input.lua> <output.min.lua> <output.obf.lua>
import fs from "fs";

const [,, inputPath = "dist/main.lua", outMin = "dist/main.min.lua", outObf = "dist/main.obf.lua"] = process.argv;

if (!fs.existsSync(inputPath)) {
  console.error("Input file not found:", inputPath);
  process.exit(1);
}

const code = fs.readFileSync(inputPath, "utf8");

// Optionally do a tiny extra trim (remove leading/trailing whitespace)
const trimmed = code.trim();

// Write min (just copy trimmed; darklua already minified)
fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync(outMin, trimmed, "utf8");
console.log("Written:", outMin);

// Create base64 payload (utf8 -> base64)
const b64 = Buffer.from(trimmed, "utf8").toString("base64");

// Create loader stub: decodes base64 and runs loadstring
const loader = `-- Obfuscated by iSylHub builder (base64 wrapper)\nlocal b64='${b64}'\nlocal function dec(s)\n  local b='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'\n  s = s:gsub('[^'..b..'=]', '')\n  return (s:gsub('.', function(x)\n    if x == '=' then return '' end\n    local r,f='', (b:find(x)-1)\n    for i=6,1,-1 do r = r .. (f%2^i - f%2^(i-1) > 0 and '1' or '0') end\n    return r\n  end):gsub('%d%d%d%d%d%d%d%d', function(x)\n    local c=0 for i=1,8 do c = c*2 + (x:sub(i,i)=='1' and 1 or 0) end\n    return string.char(c)\n  end))\nend\nlocal ok, err = pcall(function()\n  local src = dec(b64)\n  local f = load(src)\n  if type(f) == 'function' then f() end\nend)\nif not ok then\n  warn('Obfuscated loader error:', err)\nend\n`;

// save obf file
fs.writeFileSync(outObf, loader, "utf8");
console.log("Written obfuscated file:", outObf);
