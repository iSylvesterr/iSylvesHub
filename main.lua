--[[ 
    Auto-loader version for Fluent
    by iSylvester (modified from Dawid's original)
]]

local Library = {}

-- Folder src tempat semua module disimpan
local baseUrl = "https://raw.githubusercontent.com/iSylvesterr/iSylvesHub/master/src/"

-- Semua file module yang perlu diload otomatis
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

-- Fetch semua module dari GitHub kamu
for _, moduleName in ipairs(modules) do
    local success, result = pcall(function()
        local src = game:HttpGet(baseUrl .. moduleName .. ".lua")
        local func = loadstring(src)
        local module = func()
        Library[moduleName] = module
    end)

    if not success then
        warn("[iSylHub] Failed to load module:", moduleName, result)
    end
end

-- Return Library agar bisa dipake di luar
return Library
