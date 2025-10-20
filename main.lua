-- iSylvesHub Bootstrapper
-- Auto-load all required modules from /src folder
-- by iSylvester 🌀

local base = "https://raw.githubusercontent.com/iSylvesterr/iSylvesHub/master/src/"

local modules = {
    "Creator",
    "Acrylic",
    "Assets",
    "Theme",
    "TitleBar",
    "Tab",
    "Dialog",
    "Window"
}

local cache = {}

local function fetch(name)
    if cache[name] then return cache[name] end
    local url = base .. name .. ".lua"
    local ok, src = pcall(function()
        return game:HttpGet(url)
    end)
    if not ok then
        error("❌ Gagal fetch: " .. name .. " (" .. tostring(src) .. ")")
    end
    local f, err = loadstring(src)
    if not f then
        error("⚠️ loadstring error di " .. name .. ": " .. tostring(err))
    end
    local result = f()
    cache[name] = result
    return result
end

-- Load semua modul yang diperlukan
for _, name in ipairs(modules) do
    fetch(name)
end

-- Return modul utama (Window)
return fetch("Window")
