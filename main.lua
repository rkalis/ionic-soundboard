-- Author: Rosco Kalis
--
-- Soundboard/main.lua
--
-- - This file contains the main game loop
-- - It calls to the lua state files depending on which state the game is in

local hf = require("help_functions")
local yui = require('lib/yaoui')

-- The love.load function is called at the start of the game
-- It seeds and initializes random.
-- It sets the game state.
function love.load()
    yui.UI.registerEvents()
    yui.debug_draw = true

    math.randomseed(os.time())
    math.random(); math.random(); math.random(); math.random()

    love.graphics.setBackgroundColor(100, 100, 100)

    sounds = {}

    local stack = {margin_left = 10, margin_top = 10, margin_bottom = 10, margin_right = 10, spacing = 5}
    local files = love.filesystem.getDirectoryItems("sounds")
    for _, file in ipairs(files) do
        sounds[file] = love.audio.newSource("sounds/" .. file, "static")
        local text = file:gsub("_", " "):sub(1, -5)
        for i = 1, 10 do
            table.insert(stack, yui.Button({size = 107, name = file, text = text, onClick = function(self) sounds[self.name]:play() end}))
        end
    end
    view = yui.View(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, {yui.Stack(stack)})

end

-- The love.update function is used for game logic
function love.update(dt)
    yui.update({})
    view:update(dt)
end

-- The love.draw function is used for displaying all objects to the screen
function love.draw()
    view:draw()
end

-- The love.keypressed function is called whenever a key is pressed
function love.keypressed(key)
end

-- The love.keyreleased function is called whenever a key is released
function love.keyreleased(key)
end

-- The love.mousereleased function is called whenever a mouse button is
-- released
function love.mousereleased(x, y, button, istouch)
end
